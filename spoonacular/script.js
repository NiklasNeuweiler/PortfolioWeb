const API_KEY = 'b9d0491a4dba49edaa46691944aacf5a';  // Spoonacular API-Schlüssel
const DEEPL_API_KEY = '30c13504-9c75-4e46-9dc1-baf0717dcb36:fx';  // DeepL API-Schlüssel

let currentDay = new Date().toISOString().split('T')[0];  // Aktueller Tag
let mealData = JSON.parse(localStorage.getItem('mealData')) || {};  // Daten für alle Tage
let meal = initializeMealsForDay(currentDay);
let totalNutrition = initializeNutritionForDay(currentDay);

// Initialisiere Mahlzeiten und Nährwerte für den gewählten Tag
function initializeMealsForDay(day) {
    if (!mealData[day]) {
        mealData[day] = {
            breakfast: [],
            lunch: [],
            dinner: [],
            snacks: []
        };
    }
    return mealData[day];
}

function initializeNutritionForDay(day) {
    return {
        breakfast: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        lunch: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        dinner: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        snacks: { calories: 0, protein: 0, carbs: 0, fat: 0 }
    };
}

// Funktion zum Tag-Wechsel
document.getElementById('load-day-btn').addEventListener('click', () => {
    const selectedDay = document.getElementById('selected-day').value;
    if (selectedDay) {
        currentDay = selectedDay;
        meal = initializeMealsForDay(currentDay);
        totalNutrition = initializeNutritionForDay(currentDay);
        renderMealsForDay();
    }
});

// Neuen Tag starten
document.getElementById('new-day-btn').addEventListener('click', () => {
    const newDay = new Date().toISOString().split('T')[0];
    currentDay = newDay;
    meal = initializeMealsForDay(currentDay);
    totalNutrition = initializeNutritionForDay(currentDay);
    renderMealsForDay();
});

// Tag löschen
document.getElementById('delete-day-btn').addEventListener('click', () => {
    delete mealData[currentDay];
    saveMeals();
    currentDay = new Date().toISOString().split('T')[0];
    meal = initializeMealsForDay(currentDay);
    totalNutrition = initializeNutritionForDay(currentDay);
    renderMealsForDay();
});

// Speichern der Mahlzeiten für den aktuellen Tag
function saveMeals() {
    localStorage.setItem('mealData', JSON.stringify(mealData));
}

// Automatische Übersetzung von Deutsch nach Englisch (DeepL API)
async function translateToEnglish(query) {
    const url = `https://api-free.deepl.com/v2/translate`;
    const params = new URLSearchParams({
        auth_key: DEEPL_API_KEY,
        text: query,
        source_lang: 'DE',
        target_lang: 'EN'
    });

    try {
        const response = await fetch(url, { method: 'POST', body: params });
        const result = await response.json();
        return result.translations[0].text;
    } catch (error) {
        console.error('Fehler bei der Übersetzung:', error);
    }
}

// Suche nach Lebensmitteln über die Spoonacular API
async function searchFoodByKeyword(query, page) {
    const offset = (page - 1) * 10;

    // Übersetze die Suchanfrage ins Englische
    if (query) {
        query = await translateToEnglish(query);
        console.log(`Übersetzte Suchanfrage: ${query}`);
    }

    const url = `https://api.spoonacular.com/food/ingredients/search?query=${query}&number=10&offset=${offset}&apiKey=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const result = await response.json();
        if (result.results && result.results.length > 0) {
            renderProductList(result.results);
        } else {
            document.getElementById('results').innerHTML = '<p>Keine Ergebnisse gefunden.</p>';
        }
    } catch (error) {
        console.error('Fehler bei der Suche:', error);
    }
}

// Produktdetails von Spoonacular API abrufen
async function getFoodDetailsById(id) {
    const url = `https://api.spoonacular.com/food/ingredients/${id}/information?amount=100&unit=grams&apiKey=${API_KEY}`;
    try {
        const response = await fetch(url);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Fehler bei der Detailanzeige:', error);
    }
}

// Produktliste anzeigen
function renderProductList(products) {
    document.getElementById('results').innerHTML = products.map(product => `
        <div>
            <h3>${product.name}</h3>
            <p>ID: ${product.id}</p>
            <button class="detail-btn" data-id="${product.id}">Details ansehen</button>
        </div>
    `).join('');
}

// Hinzufügen zur Mahlzeit
function addToMeal(food, grams, nutrients, category) {
    const foodItem = {
        name: food.name,
        grams: grams,
        nutrition: {
            calories: (nutrients.calories * grams) / 100,
            protein: (nutrients.protein * grams) / 100,
            carbs: (nutrients.carbs * grams) / 100,
            fat: (nutrients.fat * grams) / 100
        }
    };
    meal[category].push(foodItem);
    updateTotalNutrition(foodItem.nutrition, category);
    renderMealList(category);
    renderTotalNutrition(category);
    saveMeals();
}

// Aktualisiere die Nährwerte für eine bestimmte Kategorie
function updateTotalNutrition(nutrition, category) {
    totalNutrition[category].calories += nutrition.calories;
    totalNutrition[category].protein += nutrition.protein;
    totalNutrition[category].carbs += nutrition.carbs;
    totalNutrition[category].fat += nutrition.fat;
}

// Anzeige der gespeicherten Mahlzeiten in den Kategorien
function renderMealList(category) {
    const mealList = document.getElementById(`${category}-list`);
    mealList.innerHTML = meal[category].map((item, index) => `
        <div>
            <h4>${item.name} - ${item.grams}g</h4>
            <p>Kalorien: ${item.nutrition.calories.toFixed(2)} kcal</p>
            <p>Proteine: ${item.nutrition.protein.toFixed(2)} g</p>
            <p>Kohlenhydrate: ${item.nutrition.carbs.toFixed(2)} g</p>
            <p>Fett: ${item.nutrition.fat.toFixed(2)} g</p>
            <button onclick="editMeal('${category}', ${index})">Bearbeiten</button>
            <button onclick="deleteMeal('${category}', ${index})">Löschen</button>
        </div>
    `).join('');
}

// Anzeige der Gesamtnährwerte pro Kategorie
function renderTotalNutrition(category) {
    const totalNutritionDiv = document.getElementById(`${category}-nutrition`);
    totalNutritionDiv.innerHTML = `
        <p>Kalorien: ${totalNutrition[category].calories.toFixed(2)} kcal</p>
        <p>Proteine: ${totalNutrition[category].protein.toFixed(2)} g</p>
        <p>Kohlenhydrate: ${totalNutrition[category].carbs.toFixed(2)} g</p>
        <p>Fett: ${totalNutrition[category].fat.toFixed(2)} g</p>
    `;
}

// Speichern der Mahlzeiten im localStorage
function saveMeals() {
    localStorage.setItem('mealData', JSON.stringify(mealData));
}

// Laden der gespeicherten Mahlzeiten aus dem localStorage
function loadMeals() {
    const storedMealData = localStorage.getItem('mealData');
    const storedNutritionData = localStorage.getItem('totalNutritionData');
    if (storedMealData && storedNutritionData) {
        mealData = JSON.parse(storedMealData);
        totalNutrition = JSON.parse(storedNutritionData);
        renderMealsForDay();
    }
}

function renderMealsForDay() {
    ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(category => {
        renderMealList(category);
        renderTotalNutrition(category);
    });
}

// Funktion zum Bearbeiten einer Mahlzeit
function editMeal(category, index) {
    const foodItem = meal[category][index];
    const newGrams = prompt(`Gib die neue Grammzahl für ${foodItem.name} ein:`, foodItem.grams);

    if (newGrams !== null && newGrams > 0) {
        // Nährwerte aktualisieren
        const previousNutrition = foodItem.nutrition;
        const newNutrition = {
            calories: (previousNutrition.calories / foodItem.grams) * newGrams,
            protein: (previousNutrition.protein / foodItem.grams) * newGrams,
            carbs: (previousNutrition.carbs / foodItem.grams) * newGrams,
            fat: (previousNutrition.fat / foodItem.grams) * newGrams,
        };

        // Aktualisiere die Mahlzeit
        foodItem.grams = newGrams;
        foodItem.nutrition = newNutrition;

        // Gesamtwerte aktualisieren
        updateTotalNutritionAfterEdit(previousNutrition, newNutrition, category);
        renderMealList(category);
        renderTotalNutrition(category);
        saveMeals();
    }
}

// Funktion zum Löschen einer Mahlzeit
function deleteMeal(category, index) {
    const foodItem = meal[category][index];

    if (confirm(`Bist du sicher, dass du ${foodItem.name} löschen möchtest?`)) {
        // Nährwerte von den Gesamtnährwerten abziehen
        updateTotalNutritionAfterDelete(foodItem.nutrition, category);

        // Entferne das Element aus der Mahlzeit
        meal[category].splice(index, 1);
        renderMealList(category);
        renderTotalNutrition(category);
        saveMeals();
    }
}

// Nährwerte nach dem Bearbeiten einer Mahlzeit aktualisieren
function updateTotalNutritionAfterEdit(previousNutrition, newNutrition, category) {
    totalNutrition[category].calories += (newNutrition.calories - previousNutrition.calories);
    totalNutrition[category].protein += (newNutrition.protein - previousNutrition.protein);
    totalNutrition[category].carbs += (newNutrition.carbs - previousNutrition.carbs);
    totalNutrition[category].fat += (newNutrition.fat - previousNutrition.fat);
}

// Nährwerte nach dem Löschen einer Mahlzeit aktualisieren
function updateTotalNutritionAfterDelete(nutrition, category) {
    totalNutrition[category].calories -= nutrition.calories;
    totalNutrition[category].protein -= nutrition.protein;
    totalNutrition[category].carbs -= nutrition.carbs;
    totalNutrition[category].fat -= nutrition.fat;
}

// Anzeige der gespeicherten Mahlzeiten in den Kategorien mit Bearbeiten- und Löschen-Buttons
function renderMealList(category) {
    const mealList = document.getElementById(`${category}-list`);
    mealList.innerHTML = meal[category].map((item, index) => `
        <div>
            <h4>${item.name} - ${item.grams}g</h4>
            <p>Kalorien: ${item.nutrition.calories.toFixed(2)} kcal</p>
            <p>Proteine: ${item.nutrition.protein.toFixed(2)} g</p>
            <p>Kohlenhydrate: ${item.nutrition.carbs.toFixed(2)} g</p>
            <p>Fett: ${item.nutrition.fat.toFixed(2)} g</p>
            <button onclick="editMeal('${category}', ${index})">Bearbeiten</button>
            <button onclick="deleteMeal('${category}', ${index})">Löschen</button>
        </div>
    `).join('');
}

// Prüfen, ob der Benutzer bereits der Verwendung von Cookies zugestimmt hat
function checkCookieConsent() {
    if (!localStorage.getItem('cookieConsent')) {
        document.getElementById('cookie-banner').style.display = 'block';  // Cookie-Banner anzeigen
    }
}

// Funktion, um die Zustimmung zu speichern
function setCookieConsent() {
    localStorage.setItem('cookieConsent', 'true');  // Zustimmung im localStorage speichern
    document.getElementById('cookie-banner').style.display = 'none';  // Cookie-Banner ausblenden
}

// Event Listener für den "Akzeptieren"-Button
document.getElementById('accept-cookies-btn').addEventListener('click', function() {
    setCookieConsent();  // Zustimmung setzen
});

// Beim Laden der Seite prüfen, ob die Zustimmung bereits vorliegt
window.onload = function() {
    checkCookieConsent();  // Cookie-Zustimmung prüfen
    loadMeals();  // Falls vorhanden, bereits gespeicherte Mahlzeiten laden
};

// Initialisiere die Seite und lade gespeicherte Daten
window.onload = () => {
    loadMeals();
};

// Sprachumschaltung
document.getElementById('de-flag').addEventListener('click', () => {
    currentLanguage = 'de';
});

document.getElementById('en-flag').addEventListener('click', () => {
    currentLanguage = 'en';
});

// Suche nach Lebensmitteln
document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('food-input').value;
    if (query) {
        searchFoodByKeyword(query, 1);
    }
});

// Anzeige der Details
document.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('detail-btn')) {
        const foodId = e.target.getAttribute('data-id');
        getFoodDetailsById(foodId).then(foodData => {
            if (foodData) {
                selectedFood = foodData;
                selectedNutrients = {
                    calories: foodData.nutrition.nutrients.find(n => n.name === 'Calories')?.amount || 0,
                    protein: foodData.nutrition.nutrients.find(n => n.name === 'Protein')?.amount || 0,
                    carbs: foodData.nutrition.nutrients.find(n => n.name === 'Carbohydrates')?.amount || 0,
                    fat: foodData.nutrition.nutrients.find(n => n.name === 'Fat')?.amount || 0
                };
                document.getElementById('detail-content').innerHTML = `
                    <h3>${foodData.name}</h3>
                    <p>ID: ${foodData.id}</p>
                    <p>Einheit: ${foodData.unit}</p>
                    <p>Verfügbare Menge: ${foodData.amount}</p>
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
    const category = document.getElementById('meal-category').value;
    if (selectedFood && grams > 0 && category) {
        addToMeal(selectedFood, grams, selectedNutrients, category);
    }
});

// Zurück zur Suche
document.getElementById('back-btn').addEventListener('click', () => {
    document.getElementById('detail-view').style.display = 'none';
    document.getElementById('food-tracker').style.display = 'block';
});
