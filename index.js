const url = 'https://api.worldnewsapi.com/search-news?api-key=a8798ff1987b4ad4936506e54267bfd4&text=latest&number=10';  // API-URL mit deinem Key und Parameter

// Funktion zum Abrufen der Nachrichten
async function fetchNews() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API returned status code: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        
        if (data.news && data.news.length > 0) {
            displayNews(data.news);
        } else {
            document.getElementById('news-container').innerHTML = '<p>No news found.</p>';
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        document.getElementById('news-container').innerHTML = '<p>Error loading news. Please try again later.</p>';
    }
}


// Funktion zum Anzeigen der Nachrichten (nur Bild und Überschrift)
function displayNews(articles) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = ''; // Den Container leeren

    articles.forEach(article => {
        // Verwende das Bild aus der API oder ein Platzhalterbild, wenn die URL nicht funktioniert
        const thumbnail = article.image ? article.image : 'https://via.placeholder.com/150';  // Bild-URL beziehen
        const newsItem = document.createElement('div');
        newsItem.classList.add('news-item');
        newsItem.innerHTML = `
            <a href="${article.url}" target="_blank">
                <img src="${thumbnail}" alt="${article.title}" width="100%">
                <h3>${article.title}</h3>
            </a>
        `;
        newsContainer.appendChild(newsItem);
    });
}

// Nachrichten abrufen, wenn die Seite geladen wird
document.addEventListener('DOMContentLoaded', () => {
    fetchNews();  // Standardmäßig die "Latest News" anzeigen
});
