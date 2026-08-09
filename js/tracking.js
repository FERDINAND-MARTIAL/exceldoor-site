/**
 * EXCELDOOR — tracking.js
 * Capture et persistance de l'identifiant affilié depuis l'URL (?ref=AFF001).
 * Doit être inclus sur TOUTES les pages du site (homepage, catalogue, pages
 * application, formulaire) pour fonctionner peu importe la page d'arrivée
 * du visiteur.
 *
 * RÈGLE D'ATTRIBUTION (spec §16) — "Last valid affiliate attribution" :
 * Si un visiteur arrive avec ?ref=AFF001, puis revient plus tard avec
 * ?ref=AFF002, c'est AFF002 qui est retenu pour la demande d'accès. Chaque
 * nouveau lien affilié valide écrase le précédent dans localStorage — voir
 * la fonction storeAffiliateId() ci-dessous, qui fait un simple
 * setItem() sans jamais comparer à la valeur existante.
 *
 * DURÉE DE CONSERVATION : 30 jours (voir AFFILIATE_WINDOW_MS). Passé ce
 * délai, la valeur stockée est ignorée à la lecture (voir js/forms.js,
 * fonction getAffiliateId()) — pas besoin de la supprimer activement ici.
 *
 * LIMITE CONNUE : le tracking repose sur localStorage, donc uniquement sur
 * le même navigateur / appareil. Si le prospect clique le lien sur son
 * téléphone puis remplit le formulaire depuis un ordinateur, l'attribution
 * est perdue. Acceptable pour le MVP (voir spec).
 */

var EXCELDOOR_STORAGE_KEY = "exceldoor_affiliate";
var AFFILIATE_WINDOW_MS = 30 * 24 * 60 * 60 * 1000; // 30 jours

document.addEventListener("DOMContentLoaded", function () {
  var params = new URLSearchParams(window.location.search);
  var ref = params.get("ref");

  if (ref) {
    var cleanRef = sanitizeAffiliateId(ref);
    if (cleanRef) {
      storeAffiliateId(cleanRef);
    }
  }
});

/**
 * Écrase toujours la valeur précédente — c'est ce qui implémente la règle
 * "last valid affiliate attribution" décrite ci-dessus.
 */
function storeAffiliateId(affiliateId) {
  try {
    localStorage.setItem(EXCELDOOR_STORAGE_KEY, JSON.stringify({
      affiliateId: affiliateId,
      timestamp: Date.now()
    }));
  } catch (e) {
    // localStorage indisponible (navigation privée stricte, etc.) —
    // on échoue silencieusement, le formulaire fonctionnera simplement
    // sans attribution affilié.
  }
}

/**
 * Validation basique du format d'ID affilié (ex. AFF001) pour éviter de
 * stocker n'importe quelle chaîne arbitraire depuis l'URL.
 */
function sanitizeAffiliateId(value) {
  var trimmed = String(value).trim();
  var isValidFormat = /^[A-Za-z0-9_-]{1,20}$/.test(trimmed);
  return isValidFormat ? trimmed : null;
}
