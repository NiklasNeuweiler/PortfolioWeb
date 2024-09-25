document.addEventListener('DOMContentLoaded', () => {
    const fetchImageButton = document.getElementById('fetch-image');
    const apiDataDiv = document.getElementById('api-data');

    const fetchDogImage = () => {
        fetch('https://dog.ceo/api/breeds/image/random')
            .then(response => response.json())
            .then(data => {
                apiDataDiv.innerHTML = `<img src="${data.message}" alt="Zufälliges Hundebild">`;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                apiDataDiv.innerHTML = `<p style="color: red;">Fehler beim Abrufen der Daten: ${error.message}</p>`;
            });
    };

    fetchImageButton.addEventListener('click', fetchDogImage);

    // Fetch an initial image on page load
    fetchDogImage();
});
