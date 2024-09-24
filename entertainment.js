const url = 'https://odds.p.rapidapi.com/v4/sports?all=true';
const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': 'e71f71d07emsh4dec3cdfc232955p1f1b37jsn6484d10ae2bd', // Ersetzen Sie dies durch Ihren tatsächlichen API-Schlüssel
        'x-rapidapi-host': 'odds.p.rapidapi.com'
    }
};

async function fetchData() {
    console.log('fetchData wurde aufgerufen');
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Fehler: ${response.status} ${response.statusText}`);
        }
        const sports = await response.json();
        console.log('Empfangene Daten:', sports);
        displayData(sports);
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
    }
}

function displayData(sports) {
    console.log('displayData wurde aufgerufen');
    console.log('Verarbeitete Daten:', sports);

    const container = document.getElementById('odds-container');
    if (!container) {
        console.error('Container-Element nicht gefunden');
        return;
    }

    sports.forEach(sport => {
        console.log('Verarbeite Sportart:', sport);

        const sportItem = document.createElement('div');
        sportItem.classList.add('sport-item');
        sportItem.innerHTML = `
            <h3>${sport.title}</h3>
            <p><strong>ID:</strong> ${sport.key}</p>
            <p><strong>Gruppe:</strong> ${sport.group}</p>
            <p><strong>Aktiv:</strong> ${sport.active ? 'Ja' : 'Nein'}</p>
            <p><strong>Details:</strong> ${sport.details}</p>
        `;
        container.appendChild(sportItem);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});
