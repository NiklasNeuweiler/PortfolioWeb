// Funktion, um das Video zu kontrollieren und es an die Seite anzupassen
document.addEventListener("DOMContentLoaded", function () {
    let video = document.querySelector("video");
    video.addEventListener("loadeddata", function () {
        video.play();
    });
});

// Funktion für die Kachel-Anzeige mit Hover-Effekt
document.addEventListener("DOMContentLoaded", function () {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        tile.addEventListener('mouseenter', () => {
            tile.classList.add('hover');
        });
        tile.addEventListener('mouseleave', () => {
            tile.classList.remove('hover');
        });
    });
});
