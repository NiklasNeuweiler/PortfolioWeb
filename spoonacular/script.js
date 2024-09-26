const API_KEY = 'b9d0491a4dba49edaa46691944aacf5a';
let currentPage = 1;
const pageSize = 10;
let totalResults = 0;
let selectedFood = null;
let selectedNutrients = null;

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
        selectedFood = result;
        selectedNutrients = {
            calories: result.nutrition.nutrients.find(n => n.name === 'Calories')?.amount || 0,
            protein: result.nutrition.nutrients.find(n => n.name === 'Protein')?.amount || 0,
            carbs: result.nutrition.nutrients.find(n => n.name === 'Carbohydrates')?.amount || 0,
            fat: result.nutrition.nutrients.find(n => n.name === 'Fat')?.amount || 0
        };
        return result;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Funktion zur Anzeige von Produktlisten mit Paginierung
function renderProductList(products) {
    document.getElementById('results').innerHTML = products.map(item => `
        <div class="result-item">
            <h3>${item.name}</h3>
            <p>ID: ${item.id}</p>
            <button class="detail-btn" data-id="${item.id}">Details ansehen</button>
        </div>
    `).join('');
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
                renderProductList(data.results);
                updatePagingButtons();
            } else {
                document.getElementById('results').innerHTML = '<p>Keine Ergebnisse gefunden.</p>';
            }
        });
    } else {
        document.getElementById('results').innerHTML = '<p>Bitte gib ein Lebensmittel ein.</p>';
    }
});

// Vorherige Seite anzeigen
document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        const query = document.getElementById('food-input').value;
        searchFoodByKeyword(query, currentPage).then(data => {
            renderProductList(data.results);
            updatePagingButtons();
        });
    }
});

// Nächste Seite anzeigen
document.getElementById('next-btn').addEventListener('click', () => {
    const query = document.getElementById('food-input').value;
    if (currentPage * pageSize < totalResults) {
        currentPage++;
        searchFoodByKeyword(query, currentPage).then(data => {
            renderProductList(data.results);
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
                    <p>Kalorien pro 100g: ${selectedNutrients.calories} kcal</p>
                    <p>Proteine pro 100g: ${selectedNutrients.protein} g</p>
                    <p>Kohlenhydrate pro 100g: ${selectedNutrients.carbs} g</p>
                    <p>Fett pro 100g: ${selectedNutrients.fat} g</p>
                    <p>Image: <img src="https://spoonacular.com/cdn/ingredients_100x100/${foodData.image}" alt="${foodData.name}"></p>
                `;
                document.getElementById('food-tracker').style.display = 'none';
                document.getElementById('detail-view').style.display = 'block';
            }
        });
    }
});

// Hinzufügen zur Mahlzeit
document.getElementById('add-meal-btn').addEventListener('click', () => {
    const grams = parseInt(document.getElementById('quantity').value);
    if (selectedFood && grams > 0) {
        addToMeal(selectedFood, grams, selectedNutrients);
    }
});

// Zurück zur Hauptsuche
document.getElementById('back-btn').addEventListener('click', () => {
    document.getElementById('detail-view').style.display = 'none';
    document.getElementById('food-tracker').style.display = 'block';
});
