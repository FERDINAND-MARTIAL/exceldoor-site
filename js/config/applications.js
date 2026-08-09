/**
 * EXCELDOOR — Configuration centralisée des applications
 * ---------------------------------------------------------------------------
 * Source unique de vérité (voir spec §42). Pour ajouter une nouvelle
 * application :
 *   1. Ajouter un objet dans le tableau ci-dessous.
 *   2. Créer le fichier /applications/[slug].html à partir du template.
 *   3. Ajouter la classe de badge/accent correspondante dans css/components.css
 *      et les 3 variables couleur dans css/tokens.css (voir les commentaires
 *      "catégorie d'application").
 * Aucune autre modification de l'architecture n'est nécessaire.
 */

const EXCELDOOR_APPLICATIONS = [
  {
    slug: "restaurant",
    name: "Gestion Restaurant",
    category: "Restauration",
    categoryKey: "restaurant", // doit correspondre au suffixe des classes .badge--xxx / .app-card__accent--xxx
    shortDescription: "Gérez vos commandes, tables, produits, ventes et activités depuis une seule interface.",
    heroDescription: "Une solution complète pour piloter votre restaurant au quotidien : commandes en salle et à emporter, gestion des tables, suivi des ventes et de votre carte.",
    image: "/assets/images/apps/restaurant-cover.jpg",
    videoId: "", // identifiant YouTube (non répertorié) — à renseigner
    videoThumbnail: "/assets/images/apps/restaurant-video-thumb.jpg",
    features: [
      "Prise de commande en salle et à emporter",
      "Gestion des tables et du plan de salle",
      "Suivi des ventes en temps réel",
      "Gestion des produits et de la carte"
    ],
    forWho: "Restaurateurs, snacks, fast-foods, food trucks.",
    active: true
  },
  {
    slug: "quincaillerie",
    name: "Gestion Quincaillerie",
    category: "Commerce / Quincaillerie",
    categoryKey: "quincaillerie",
    shortDescription: "Suivez vos stocks, vos ventes et vos clients dans votre quincaillerie sans effort.",
    heroDescription: "Gardez le contrôle sur votre stock de quincaillerie, vos ventes en boutique et vos clients réguliers, depuis une seule interface simple.",
    image: "/assets/images/apps/quincaillerie-cover.jpg",
    videoId: "",
    videoThumbnail: "/assets/images/apps/quincaillerie-video-thumb.jpg",
    features: [
      "Gestion des stocks et des références",
      "Ventes et encaissement",
      "Suivi des clients et fournisseurs",
      "Alertes de rupture de stock"
    ],
    forWho: "Quincailleries, magasins de matériaux, boutiques de bricolage.",
    active: true
  },
  {
    slug: "scolaire",
    name: "Gestion Scolaire",
    category: "Éducation",
    categoryKey: "scolaire",
    shortDescription: "Centralisez les inscriptions, les paiements et le suivi des élèves de votre établissement.",
    heroDescription: "Simplifiez la gestion administrative de votre école : inscriptions, suivi des paiements de scolarité, classes et communication avec les parents.",
    image: "/assets/images/apps/scolaire-cover.jpg",
    videoId: "",
    videoThumbnail: "/assets/images/apps/scolaire-video-thumb.jpg",
    features: [
      "Inscriptions et dossiers élèves",
      "Suivi des paiements de scolarité",
      "Gestion des classes et emplois du temps",
      "Communication avec les parents"
    ],
    forWho: "Écoles privées, centres de formation, instituts.",
    active: true
  },
  {
    slug: "btp",
    name: "Gestion BTP",
    category: "Bâtiment / BTP",
    categoryKey: "btp",
    shortDescription: "Suivez vos chantiers, vos équipes et vos dépenses de bout en bout.",
    heroDescription: "Pilotez vos chantiers du devis à la livraison : suivi des équipes, des matériaux, des dépenses et de l'avancement de chaque projet.",
    image: "/assets/images/apps/btp-cover.jpg",
    videoId: "",
    videoThumbnail: "/assets/images/apps/btp-video-thumb.jpg",
    features: [
      "Suivi des chantiers et de l'avancement",
      "Gestion des équipes et affectations",
      "Suivi des dépenses et matériaux",
      "Devis et facturation"
    ],
    forWho: "Entreprises de BTP, artisans, maîtres d'œuvre.",
    active: true
  },
  {
    slug: "pharmacie",
    name: "Gestion Pharmacie",
    category: "Santé / Pharmacie",
    categoryKey: "pharmacie",
    shortDescription: "Gérez vos stocks de médicaments, vos ventes et vos clients en toute simplicité.",
    heroDescription: "Une gestion fluide de votre pharmacie : stocks de médicaments, ventes au comptoir, dates de péremption et suivi de vos clients.",
    image: "/assets/images/apps/pharmacie-cover.jpg",
    videoId: "",
    videoThumbnail: "/assets/images/apps/pharmacie-video-thumb.jpg",
    features: [
      "Gestion des stocks de médicaments",
      "Alertes de péremption",
      "Ventes et encaissement",
      "Suivi des clients"
    ],
    forWho: "Pharmacies, parapharmacies, dépôts de médicaments.",
    active: true
  }
];

// Aide utilitaire : récupérer une application par son slug
function getApplicationBySlug(slug) {
  return EXCELDOOR_APPLICATIONS.find(function (app) {
    return app.slug === slug;
  });
}

// Aide utilitaire : ne retourner que les applications actives (visibles publiquement)
function getActiveApplications() {
  return EXCELDOOR_APPLICATIONS.filter(function (app) {
    return app.active;
  });
}
