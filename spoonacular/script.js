const API_KEY = 'b9d0491a4dba49edaa46691944aacf5a';
let currentPage = 1;
const pageSize = 10;
let totalResults = 0;

// Funktion zur Suche von Lebensmitteln mit Paginierung
async function searchFoodByKeyword(query, page) {
    const offset = (page - 1) * pageSize;
    const url = `https://api.spoonacular.com/food/ingredients/search?query=${query}&number=${pageSize}&offset=${offset}&apiKey=${API_KEY}`;
    try {
        const response = await fetch(url);
        const result = await response.json();
        totalResults = result.totalResults;
        return result;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Funktion zur Anzeige von Produktdetails inkl. Nährwerte
async function getFoodDetailsById(id) {
    const url = `https://api.spoonacular.com/food/ingredients/${id}/information?amount=100&unit=grams&apiKey=${API_KEY}`;
    try {
        const response = await fetch(url);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Paginierung Buttons anzeigen/verstecken
function updatePagingButtons() {
    document.getElementById('prev-btn').style.display = currentPage > 1 ? 'block' : 'none';
    document.getElementById('next-btn').style.display = currentPage * pageSize < totalResults ? 'block' : 'none';
}

// Lebensmittel-Suche mit Paginierung
document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('food-input').value;
    if (query) {
        currentPage = 1; // Suche startet immer auf Seite 1
        searchFoodByKeyword(query, currentPage).then(data => {
            if (data && data.results.length > 0) {
                document.getElementById('results').innerHTML = data.results.map(item => `
                    <div class="result-item">
                        <h3>${item.name}</h3>
                        <p>ID: ${item.id}</p>
                        <button class="detail-btn" data-id="${item.id}">Details ansehen</button>
                    </div>
                `).join('');
                updatePagingButtons();
            } else {
                document.getElementById('results').innerHTML = '<p>Keine Ergebnisse gefunden.</p>';
            }
        });
    } else {
        document.getElementById('results').innerHTML = '<p>Bitte gib ein Lebensmittel ein.</p>';
    }
});

// Vorherige/Nächste Seite
document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        const query = document.getElementById('food-input').value;
        searchFoodByKeyword(query, currentPage).then(data => {
            document.getElementById('results').innerHTML = data.results.map(item => `
                <div class="result-item">
                    <h3>${item.name}</h3>
                    <p>ID: ${item.id}</p>
                    <button class="detail-btn" data-id="${item.id}">Details ansehen</button>
                </div>
            `).join('');
            updatePagingButtons();
        });
    }
});

document.getElementById('next-btn').addEventListener('click', () => {
    const query = document.getElementById('food-input').value;
    if (currentPage * pageSize < totalResults) {
        currentPage++;
        searchFoodByKeyword(query, currentPage).then(data => {
            document.getElementById('results').innerHTML = data.results.map(item => `
                <div class="result-item">
                    <h3>${item.name}</h3>
                    <p>ID: ${item.id}</p>
                    <button class="detail-btn" data-id="${item.id}">Details ansehen</button>
                </div>
            `).join('');
            updatePagingButtons();
        });
    }
});

// Dynamische Detailseite inkl. Nährwerte
document.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('detail-btn')) {
        const foodId = e.target.getAttribute('data-id');
        getFoodDetailsById(foodId).then(foodData => {
            if (foodData) {
                document.getElementById('detail-content').innerHTML = `
                    <h3>${foodData.name}</h3>
                    <p>ID: ${foodData.id}</p>
                    <p>Einheit: ${foodData.unit || 'undefined'}</p>
                    <p>Verfügbare Menge: ${foodData.amount || 'undefined'}</p>
                    <p>Kalorien pro 100g: ${foodData.nutrition.nutrients.find(n => n.name === 'Calories')?.amount || 'N/A'} kcal</p>
                    <p>Proteine pro 100g: ${foodData.nutrition.nutrients.find(n => n.name === 'Protein')?.amount || 'N/A'} g</p>
                    <p>Kohlenhydrate pro 100g: ${foodData.nutrition.nutrients.find(n => n.name === 'Carbohydrates')?.amount || 'N/A'} g</p>
                    <p>Fett pro 100g: ${foodData.nutrition.nutrients.find(n => n.name === 'Fat')?.amount || 'N/A'} g</p>
                    <p>Image: <img src="https://spoonacular.com/cdn/ingredients_100x100/${foodData.image}" alt="${foodData.name}"></p>
                `;
                document.getElementById('food-tracker').style.display = 'none';
                document.getElementById('detail-view').style.display = 'block';
            }
        });
    }
});

// Zurück zur Hauptsuche
document.getElementById('back-btn').addEventListener('click', () => {
    document.getElementById('detail-view').style.display = 'none';
    document.getElementById('food-tracker').style.display = 'block';
});
