/**
 * EXCELDOOR — video-player.js
 * Charge l'iframe YouTube uniquement au clic sur la miniature.
 * Évite de charger la vidéo au chargement de la page (perf mobile, §31).
 *
 * Utilisation dans le HTML :
 * <div class="video-embed" data-video-id="VOTRE_ID_YOUTUBE">
 *   <img class="video-embed__thumb" src="..." alt="Aperçu de la vidéo">
 *   <div class="video-embed__play" aria-hidden="true"></div>
 * </div>
 *
 * Si data-video-id est vide, le clic ne fait rien (vidéo pas encore prête).
 */

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".video-embed[data-video-id]").forEach(function (embed) {
    var videoId = embed.getAttribute("data-video-id");
    if (!videoId) return; // pas d'ID renseigné pour l'instant — on laisse la miniature statique

    function loadVideo() {
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube-nocookie.com/embed/" + videoId + "?autoplay=1&rel=0";
      iframe.title = "Vidéo de démonstration";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      embed.innerHTML = "";
      embed.appendChild(iframe);
    }

    embed.addEventListener("click", loadVideo);
    embed.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        loadVideo();
      }
    });
  });
});
