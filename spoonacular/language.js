const translations = {
    en: {
        headerTitle: 'Fitness & Food Tracker',
        navFoodTracker: 'Food Tracker',
        navRecipes: 'Recipes',
        navMeal: 'Create Meal',
        foodTrackerTitle: 'Track your Meals',
        productDetailsTitle: 'Product Details',
        labelQuantity: 'Quantity in grams:',
        addMealBtn: 'Add to Meal',
        backBtn: 'Back to Search',
        mealTrackerTitle: 'Your Meal',
        totalNutritionTitle: 'Total Nutrition'
    },
    de: {
        headerTitle: 'Fitness & Food Tracker',
        navFoodTracker: 'Food Tracker',
        navRecipes: 'Rezepte',
        navMeal: 'Mahlzeit zusammenstellen',
        foodTrackerTitle: 'Tracke deine Mahlzeiten',
        productDetailsTitle: 'Produktdetails',
        labelQuantity: 'Menge in Gramm:',
        addMealBtn: 'Zur Mahlzeit hinzufügen',
        backBtn: 'Zurück zur Suche',
        mealTrackerTitle: 'Deine Mahlzeit',
        totalNutritionTitle: 'Gesamtnährwerte'
    }
};

// Funktion, um die Sprache zu wechseln
function changeLanguage(lang) {
    document.getElementById('header-title').innerText = translations[lang].headerTitle;
    document.getElementById('nav-food-tracker').innerText = translations[lang].navFoodTracker;
    document.getElementById('nav-recipes').innerText = translations[lang].navRecipes;
    document.getElementById('nav-meal').innerText = translations[lang].navMeal;
    document.getElementById('food-tracker-title').innerText = translations[lang].foodTrackerTitle;
    document.getElementById('product-details-title').innerText = translations[lang].productDetailsTitle;
    document.getElementById('label-quantity').innerText = translations[lang].labelQuantity;
    document.getElementById('add-meal-btn').innerText = translations[lang].addMealBtn;
    document.getElementById('back-btn').innerText = translations[lang].backBtn;
    document.getElementById('meal-tracker-title').innerText = translations[lang].mealTrackerTitle;
    document.getElementById('total-nutrition-title').innerText = translations[lang].totalNutritionTitle;
}

// Event Listener für Sprachumschaltung
document.getElementById('de-flag').addEventListener('click', () => {
    changeLanguage('de');
});

document.getElementById('en-flag').addEventListener('click', () => {
    changeLanguage('en');
});
