/**
 * EXCELDOOR — main.js
 * Comportements globaux partagés par toutes les pages :
 * menu mobile, accordéon FAQ. Pas de dépendance externe.
 */

document.addEventListener("DOMContentLoaded", function () {

  /* --- Menu mobile ------------------------------------------------------ */
  var navToggle = document.querySelector("[data-nav-toggle]");
  var navClose = document.querySelector("[data-nav-close]");

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      document.body.classList.add("is-nav-open");
    });
  }
  if (navClose) {
    navClose.addEventListener("click", function () {
      document.body.classList.remove("is-nav-open");
    });
  }
  // Ferme le menu mobile si on clique un lien à l'intérieur
  document.querySelectorAll(".nav__mobile a").forEach(function (link) {
    link.addEventListener("click", function () {
      document.body.classList.remove("is-nav-open");
    });
  });

  /* --- FAQ accordéon ------------------------------------------------------ */
  document.querySelectorAll(".faq-item__q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var isOpen = item.getAttribute("data-open") === "true";
      item.setAttribute("data-open", isOpen ? "false" : "true");
    });
  });

});
