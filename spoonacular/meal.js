let meal = [];
let totalNutrition = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
};

// Funktion zum Hinzufügen eines Lebensmittels zur Mahlzeit
function addToMeal(food, grams, nutrients) {
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
    meal.push(foodItem);
    updateTotalNutrition(foodItem.nutrition);
    renderMealList();
    renderTotalNutrition();
}

// Funktion zur Aktualisierung der Gesamtnährwerte
function updateTotalNutrition(nutrition) {
    totalNutrition.calories += nutrition.calories;
    totalNutrition.protein += nutrition.protein;
    totalNutrition.carbs += nutrition.carbs;
    totalNutrition.fat += nutrition.fat;
}

// Funktion zur Anzeige der Mahlzeit
function renderMealList() {
    const mealList = document.getElementById('meal-list');
    mealList.innerHTML = meal.map(item => `
        <div>
            <h4>${item.name} - ${item.grams}g</h4>
            <p>Kalorien: ${item.nutrition.calories.toFixed(2)} kcal</p>
            <p>Proteine: ${item.nutrition.protein.toFixed(2)} g</p>
            <p>Kohlenhydrate: ${item.nutrition.carbs.toFixed(2)} g</p>
            <p>Fett: ${item.nutrition.fat.toFixed(2)} g</p>
        </div>
    `).join('');
}

// Funktion zur Anzeige der Gesamtnährwerte
function renderTotalNutrition() {
    const totalNutritionDiv = document.getElementById('total-nutrition');
    totalNutritionDiv.innerHTML = `
        <p>Kalorien: ${totalNutrition.calories.toFixed(2)} kcal</p>
        <p>Proteine: ${totalNutrition.protein.toFixed(2)} g</p>
        <p>Kohlenhydrate: ${totalNutrition.carbs.toFixed(2)} g</p>
        <p>Fett: ${totalNutrition.fat.toFixed(2)} g</p>
    `;
}
