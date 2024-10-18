const API_KEY = 'b9d0491a4dba49edaa46691944aacf5a';
const DEEPL_API_KEY = '30c13504-9c75-4e46-9dc1-baf0717dcb36:fx';

let currentMeal = { name: '', ingredients: [] };
let allMeals = JSON.parse(localStorage.getItem('meals')) || [];

// Mahlzeit erstellen
document.getElementById('create-meal-btn').addEventListener('click', () => {
    const mealName = document.getElementById('meal-name').value.trim();
    if (mealName) {
        currentMeal.name = mealName;
        renderMealOverview();
    } else {
        alert('Bitte geben Sie einen Namen für die Mahlzeit ein.');
    }
});

// Suche nach Zutaten mit DeepL-Übersetzung
document.getElementById('ingredient-search-btn').addEventListener('click', async () => {
    const searchTerm = document.getElementById('ingredient-search-input').value.trim();
    if (searchTerm) {
        const translatedTerm = await translateToEnglish(searchTerm);
        searchIngredients(translatedTerm);
    } else {
        alert('Bitte geben Sie einen Suchbegriff ein.');
    }
});

// DeepL Übersetzung
async function translateToEnglish(text) {
    const url = `https://api-free.deepl.com/v2/translate`;
    const params = new URLSearchParams({
        auth_key: DEEPL_API_KEY,
        text: text,
        source_lang: 'DE',
        target_lang: 'EN'
    });

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: params
        });
        const result = await response.json();
        return result.translations[0].text;
    } catch (error) {
        console.error('Fehler bei der Übersetzung:', error);
        return text; // Fallback: gibt den ursprünglichen Text zurück
    }
}

// Zutaten mit der Spoonacular API suchen
async function searchIngredients(query) {
    const url = `https://api.spoonacular.com/food/ingredients/search?query=${query}&apiKey=${API_KEY}&number=10`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            displayIngredients(data.results);
        } else {
            document.getElementById('ingredient-results').innerHTML = '<p>Keine Zutaten gefunden.</p>';
        }
    } catch (error) {
        console.error('Fehler bei der Zutatensuche:', error);
    }
}

// Zutaten in der Übersicht anzeigen
function displayIngredients(ingredients) {
    const ingredientResultsDiv = document.getElementById('ingredient-results');
    ingredientResultsDiv.innerHTML = ''; // Alte Ergebnisse löschen

    ingredients.forEach(ingredient => {
        const ingredientCard = document.createElement('div');
        ingredientCard.classList.add('ingredient-card');

        ingredientCard.innerHTML = `
            <img src="https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}" alt="${ingredient.name}">
            <p>${ingredient.name}</p>
            <input type="number" id="amount-${ingredient.id}" placeholder="Menge in Gramm" min="1">
            <button class="add-ingredient-btn" data-id="${ingredient.id}" data-name="${ingredient.name}">Hinzufügen</button>
        `;

        ingredientResultsDiv.appendChild(ingredientCard);
    });

    // Event Listener für das Hinzufügen von Zutaten
    document.querySelectorAll('.add-ingredient-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const ingredientId = e.target.getAttribute('data-id');
            const ingredientName = e.target.getAttribute('data-name');
            const amount = document.getElementById(`amount-${ingredientId}`).value;

            if (amount && amount > 0) {
                addIngredientToMeal(ingredientName, amount);
            } else {
                alert('Bitte geben Sie eine gültige Menge an.');
            }
        });
    });
}

// Zutat zur Mahlzeit hinzufügen
function addIngredientToMeal(ingredientName, amount) {
    currentMeal.ingredients.push({ name: ingredientName, amount: amount });
    renderMealOverview();
}

// Übersicht der Mahlzeit rendern
function renderMealOverview() {
    const mealOverviewDiv = document.getElementById('meal-overview');
    mealOverviewDiv.innerHTML = ''; // Alte Übersicht löschen

    if (currentMeal.name) {
        const mealTitle = document.createElement('h3');
        mealTitle.textContent = `Mahlzeit: ${currentMeal.name}`;
        mealOverviewDiv.appendChild(mealTitle);
    }

    currentMeal.ingredients.forEach((ingredient, index) => {
        const ingredientItem = document.createElement('div');
        ingredientItem.classList.add('meal-ingredient');

        ingredientItem.innerHTML = `
            <p>${ingredient.name}: ${ingredient.amount}g</p>
            <button class="remove-ingredient-btn" data-index="${index}">Entfernen</button>
        `;

        mealOverviewDiv.appendChild(ingredientItem);
    });

    // Event Listener für das Entfernen von Zutaten
    document.querySelectorAll('.remove-ingredient-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            removeIngredientFromMeal(index);
        });
    });
}

// Zutat aus der Mahlzeit entfernen
function removeIngredientFromMeal(index) {
    currentMeal.ingredients.splice(index, 1);
    renderMealOverview();
}

// Mahlzeit speichern
document.getElementById('save-meal-btn').addEventListener('click', () => {
    if (currentMeal.name && currentMeal.ingredients.length > 0) {
        allMeals.push(currentMeal);
        localStorage.setItem('meals', JSON.stringify(allMeals));
        currentMeal = { name: '', ingredients: [] };  // Setzt die aktuelle Mahlzeit zurück
        document.getElementById('meal-name').value = '';
        renderSavedMeals();
        renderMealOverview();
    } else {
        alert('Bitte geben Sie einen Namen für die Mahlzeit ein und fügen Sie Zutaten hinzu.');
    }
});

// Gespeicherte Mahlzeiten anzeigen
function renderSavedMeals() {
    const savedMealsDiv = document.getElementById('saved-meals');
    savedMealsDiv.innerHTML = '';

    allMeals.forEach((meal, index) => {
        const mealItem = document.createElement('div');
        mealItem.classList.add('saved-meal');

        mealItem.innerHTML = `
            <h4>${meal.name}</h4>
            <button class="show-meal-btn" data-index="${index}">Details anzeigen</button>
            <button class="edit-meal-btn" data-index="${index}">Bearbeiten</button>
            <button class="delete-meal-btn" data-index="${index}">Löschen</button>
        `;

        savedMealsDiv.appendChild(mealItem);
    });

    // Event Listener für das Bearbeiten und Löschen von Mahlzeiten nach dem Rendering hinzufügen
    document.querySelectorAll('.edit-meal-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            editMeal(index);
        });
    });

    document.querySelectorAll('.delete-meal-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            deleteMeal2(index); // sicherstellen, dass der Index korrekt ist
        });
    });

    // Event Listener für das Anzeigen der Details nach dem Rendering hinzufügen
    document.querySelectorAll('.show-meal-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            viewMealDetails(index);
        });
    });
}


    // Event Listener für das Anzeigen der Details
    document.querySelectorAll('.show-meal-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            viewMealDetails(index);
        });
    });

// Mahlzeit bearbeiten
function editMeal(index) {
    currentMeal = allMeals[index];
    document.getElementById('meal-name').value = currentMeal.name;
    renderMealOverview();
}

// Mahlzeit löschen
function deleteMeal2(index) {
    if (index !== undefined) {
        allMeals.splice(index, 1);
        localStorage.setItem('meals', JSON.stringify(allMeals));
        renderSavedMeals();
    } else {
        console.error("Der Index ist undefiniert");
    }
}


// Nährwertdaten für eine Mahlzeit berechnen
async function viewMealDetails(index) {
    const meal = allMeals[index];
    let totalNutrition = { calories: 0, protein: 0, carbs: 0, fat: 0 };

    // Nährwerte für jede Zutat abfragen und addieren
    for (const ingredient of meal.ingredients) {
        const nutrition = await getIngredientNutrition(ingredient.name, ingredient.amount);
        totalNutrition.calories += nutrition.calories;
        totalNutrition.protein += nutrition.protein;
        totalNutrition.carbs += nutrition.carbs;
        totalNutrition.fat += nutrition.fat;
    }

    // Nährwerte anzeigen
    displayMealNutrition(totalNutrition);
}

// API-Aufruf für Nährwertdaten einer Zutat
async function getIngredientNutrition(ingredientName, amount) {
    const url = `https://api.spoonacular.com/food/ingredients/search?query=${ingredientName}&apiKey=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results.length > 0) {
            const ingredientId = data.results[0].id;
            const nutritionData = await getIngredientNutritionById(ingredientId, amount);
            return nutritionData;
        }
    } catch (error) {
        console.error('Fehler beim Abrufen der Nährwertdaten:', error);
    }
}

// Nährwertdaten für eine spezifische Menge der Zutat
async function getIngredientNutritionById(id, amount) {
    const url = `https://api.spoonacular.com/food/ingredients/${id}/information?amount=${amount}&unit=grams&apiKey=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return {
            calories: data.nutrition.nutrients.find(n => n.name === 'Calories')?.amount || 0,
            protein: data.nutrition.nutrients.find(n => n.name === 'Protein')?.amount || 0,
            carbs: data.nutrition.nutrients.find(n => n.name === 'Carbohydrates')?.amount || 0,
            fat: data.nutrition.nutrients.find(n => n.name === 'Fat')?.amount || 0
        };
    } catch (error) {
        console.error('Fehler beim Abrufen der Nährwertdaten:', error);
    }
}

// Nährwerte der Mahlzeit anzeigen
function displayMealNutrition(nutrition) {
    const nutritionDiv = document.createElement('div');
    nutritionDiv.innerHTML = `
        <h4>Nährwerte der Mahlzeit:</h4>
        <p>Kalorien: ${nutrition.calories.toFixed(2)} kcal</p>
        <p>Proteine: ${nutrition.protein.toFixed(2)} g</p>
        <p>Kohlenhydrate: ${nutrition.carbs.toFixed(2)} g</p>
        <p>Fett: ${nutrition.fat.toFixed(2)} g</p>
    `;
    document.getElementById('meal-overview').appendChild(nutritionDiv);
}

// Initialisiere gespeicherte Mahlzeiten beim Laden der Seite
window.onload = () => {
    renderSavedMeals();
};

