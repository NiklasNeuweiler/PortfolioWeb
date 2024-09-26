const API_KEY = 'b9d0491a4dba49edaa46691944aacf5a';
const searchButton = document.getElementById('search-btn');
const recipeButton = document.getElementById('recipe-btn');
const resultsDiv = document.getElementById('results');
const recipeResultsDiv = document.getElementById('recipe-results');

// Lebensmittel suchen und Nährwertinformationen anzeigen
searchButton.addEventListener('click', () => {
    const food = document.getElementById('food-input').value;
    if (food) {
        fetch(`https://api.spoonacular.com/food/ingredients/search?query=${food}&apiKey=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                resultsDiv.innerHTML = data.results.map(item => `
                    <div class="result-item">
                        <h3>${item.name}</h3>
                        <p><strong>Kalorien:</strong> ${item.calories} kcal</p>
                        <p><strong>Proteine:</strong> ${item.protein} g</p>
                        <p><strong>Fette:</strong> ${item.fat} g</p>
                    </div>
                `).join('');
            })
            .catch(error => {
                console.error('Error:', error);
                resultsDiv.innerHTML = '<p>Es gab ein Problem bei der Suche nach diesem Lebensmittel.</p>';
            });
    } else {
        resultsDiv.innerHTML = '<p>Bitte gib ein Lebensmittel ein.</p>';
    }
});

// Rezepte suchen basierend auf Zutaten
recipeButton.addEventListener('click', () => {
    const ingredient = document.getElementById('recipe-input').value;
    if (ingredient) {
        fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredient}&apiKey=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                recipeResultsDiv.innerHTML = data.map(recipe => `
                    <div class="result-item">
                        <h3>${recipe.title}</h3>
                        <img src="${recipe.image}" alt="${recipe.title}" style="width:100%">
                        <p>Zutaten benötigt: ${recipe.usedIngredientCount}</p>
                        <p>Zutaten übrig: ${recipe.missedIngredientCount}</p>
                    </div>
                `).join('');
            })
            .catch(error => {
                console.error('Error:', error);
                recipeResultsDiv.innerHTML = '<p>Es gab ein Problem bei der Suche nach Rezepten.</p>';
            });
    } else {
        recipeResultsDiv.innerHTML = '<p>Bitte gib eine Zutat ein.</p>';
    }
});
