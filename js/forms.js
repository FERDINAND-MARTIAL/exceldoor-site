/**
 * EXCELDOOR — forms.js
 * Gère le formulaire de demande d'accès :
 *  - pré-sélection de l'application depuis ?app=slug dans l'URL
 *  - validation légère côté client (la validation de référence reste côté
 *    serveur, dans Apps Script — voir spec §35)
 *  - protections anti-spam basiques : honeypot + délai minimum de
 *    remplissage (§36)
 *  - affichage d'un état de confirmation inline
 *
 * L'envoi réel vers Google Apps Script est branché ci-dessous (Phase 7).
 */

/**
 * URL du Web App Apps Script déployé en Phase 6 (se termine par /exec).
 * Colle ici l'URL copiée après "Déployer" dans l'éditeur Apps Script.
 */
var BACKEND_URL = "https://script.google.com/macros/s/AKfycbwiSt2nk7cu75x-mTMz3RAVvdn0ToQKiRlxWMw-gOwJXDAmurODEKTh5WapzNz0VycN/exec";

document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("access-request-form");
  if (!form) return;

  var appSelect = document.getElementById("application");
  var formCard = document.getElementById("form-card");
  var successState = document.getElementById("form-success");
  var formLoadedAt = Date.now();

  /* --- Pré-remplissage depuis ?app=slug ---------------------------------- */
  var params = new URLSearchParams(window.location.search);
  var appParam = params.get("app");
  if (appParam && appSelect) {
    var option = appSelect.querySelector('option[value="' + appParam + '"]');
    if (option) option.selected = true;
  }

  /* --- Validation champ par champ ----------------------------------------- */
  function showError(field, message) {
    var errorEl = field.parentElement.querySelector(".field__error");
    if (!errorEl) {
      errorEl = document.createElement("p");
      errorEl.className = "field__error";
      field.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = message;
    field.setAttribute("aria-invalid", "true");
  }

  function clearError(field) {
    var errorEl = field.parentElement.querySelector(".field__error");
    if (errorEl) errorEl.remove();
    field.removeAttribute("aria-invalid");
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validateForm() {
    var isValid = true;
    var requiredFields = form.querySelectorAll("[data-required]");

    requiredFields.forEach(function (field) {
      clearError(field);
      if (!field.value.trim()) {
        showError(field, "Ce champ est obligatoire.");
        isValid = false;
      }
    });

    var emailField = document.getElementById("email");
    if (emailField.value.trim() && !isValidEmail(emailField.value.trim())) {
      showError(emailField, "Veuillez saisir un email valide.");
      isValid = false;
    }

    return isValid;
  }

  /* --- Anti-spam ------------------------------------------------------------ */
  function looksLikeSpam() {
    var honeypot = form.querySelector('[name="website"]');
    if (honeypot && honeypot.value.trim() !== "") return true;

    // Soumission trop rapide après le chargement de la page = probable bot
    var elapsed = Date.now() - formLoadedAt;
    if (elapsed < 2000) return true;

    return false;
  }

  /* --- Lecture du tracking affilié (voir tracking.js, Phase 8) -------------- */
  function getAffiliateId() {
    try {
      var raw = localStorage.getItem("exceldoor_affiliate");
      if (!raw) return "";
      var data = JSON.parse(raw);
      var THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
      if (Date.now() - data.timestamp > THIRTY_DAYS_MS) return "";
      return data.affiliateId || "";
    } catch (e) {
      return "";
    }
  }

  /* --- Soumission ------------------------------------------------------------
     On envoie en application/x-www-form-urlencoded (via URLSearchParams) :
     ce type de contenu ne déclenche pas de requête OPTIONS de préflight CORS,
     qu'Apps Script ne sait pas gérer nativement. Apps Script récupère alors
     les champs directement dans e.parameter côté serveur (voir Code.gs).

     Si le navigateur bloque quand même la LECTURE de la réponse (CORS), on
     retente en mode "no-cors" : la requête part et le Sheet est bien mis à
     jour, mais on ne peut plus lire le résultat — on considère alors que
     c'est un succès plutôt que de faire perdre le lead à l'utilisateur. */
  function submitLeadToBackend(payload) {
    var body = new URLSearchParams(payload);

    return fetch(BACKEND_URL, { method: "POST", body: body })
      .then(function (response) { return response.text(); })
      .then(function (text) {
        try {
          return JSON.parse(text);
        } catch (e) {
          return { success: true }; // réponse non lisible mais requête envoyée
        }
      })
      .catch(function () {
        // Repli no-cors : on ne saura pas si ça a réussi, mais on ne bloque
        // pas l'utilisateur pour un souci de lecture de réponse CORS.
        return fetch(BACKEND_URL, { method: "POST", mode: "no-cors", body: body })
          .then(function () { return { success: true }; })
          .catch(function () { return { success: false, error: "network" }; });
      });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (looksLikeSpam()) {
      // On ne donne aucun indice au bot : on affiche quand même le succès.
      formCard.style.display = "none";
      successState.style.display = "block";
      return;
    }

    if (!validateForm()) return;

    var submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Envoi en cours...";

    var payload = {
      action: "submitLead",
      prenom: form.prenom.value.trim(),
      nom: form.nom.value.trim(),
      entreprise: form.entreprise.value.trim(),
      email: form.email.value.trim(),
      telephone: form.telephone.value.trim(),
      application: form.application.value,
      activite: form.activite.value.trim(),
      message: form.message.value.trim(),
      affiliateId: getAffiliateId(),
      sourceUrl: window.location.href,
      date: new Date().toISOString()
    };

    submitLeadToBackend(payload).then(function (result) {
      if (result.success) {
        formCard.style.display = "none";
        successState.style.display = "block";
        successState.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        submitBtn.disabled = false;
        submitBtn.textContent = "Demander mon accès gratuit";
        alert("Une erreur est survenue. Merci de réessayer.");
      }
    });
  });
});
