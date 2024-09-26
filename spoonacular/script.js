const API_KEY = 'b9d0491a4dba49edaa46691944aacf5a';

// Funktion für die Suche nach Lebensmittelinformationen mit Spoonacular API
async function searchFoodByKeyword(query) {
    const url = `https://api.spoonacular.com/food/ingredients/search?query=${query}&apiKey=${API_KEY}`;
    try {
        const response = await fetch(url);
        const result = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Funktion für die Suche nach Rezepten basierend auf Zutaten
async function searchRecipesByIngredient(ingredient) {
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredient}&apiKey=${API_KEY}`;
    try {
        const response = await fetch(url);
        const result = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Event Listener für die Lebensmittel-Suche
document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('food-input').value;
    if (query) {
        searchFoodByKeyword(query).then(data => {
            if (data && data.results.length > 0) {
                document.getElementById('results').innerHTML = data.results.map(item => `
                    <div class="result-item">
                        <h3>${item.name}</h3>
                        <p>ID: ${item.id}</p>
                    </div>
                `).join('');
            } else {
                document.getElementById('results').innerHTML = '<p>Keine Ergebnisse gefunden.</p>';
            }
        });
    } else {
        document.getElementById('results').innerHTML = '<p>Bitte gib ein Lebensmittel ein.</p>';
    }
});

// Event Listener für die Rezept-Suche
document.getElementById('recipe-btn').addEventListener('click', () => {
    const ingredient = document.getElementById('recipe-input').value;
    if (ingredient) {
        searchRecipesByIngredient(ingredient).then(data => {
            if (data && data.length > 0) {
                document.getElementById('recipe-results').innerHTML = data.map(recipe => `
                    <div class="result-item">
                        <h3>${recipe.title}</h3>
                        <img src="${recipe.image}" alt="${recipe.title}" style="width:100%">
                    </div>
                `).join('');
            } else {
                document.getElementById('recipe-results').innerHTML = '<p>Keine Rezepte gefunden.</p>';
            }
        });
    } else {
        document.getElementById('recipe-results').innerHTML = '<p>Bitte gib eine Zutat ein.</p>';
    }
});
