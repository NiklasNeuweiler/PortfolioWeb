// Funktion zur Sprachumschaltung
function switchLanguage(lang) {
    const elementsToTranslate = document.querySelectorAll('[data-i18n]'); // Elemente mit Datenattribut für Übersetzung
    elementsToTranslate.forEach(element => {
        const translationKey = element.getAttribute('data-i18n');
        element.innerText = translations[lang][translationKey];
    });
}

// Event Listener für die Sprachflaggen
document.getElementById('de-flag').addEventListener('click', () => {
    switchLanguage('de');
});

document.getElementById('en-flag').addEventListener('click', () => {
    switchLanguage('en');
});

// Übersetzungen für beide Sprachen
const translations = {
    en: {
        "title": "Fitness & Food Tracker",
        "trackMeals": "Track your meals",
        "recipes": "Recipes",
        "assembleMeal": "Assemble meal",
        "chooseDay": "Choose a day",
        "loadDay": "Load Day",
        "newDay": "Start new day",
        "deleteDay": "Delete Day",
        "summary": "Summary of the day",
        "breakfast": "Breakfast",
        "lunch": "Lunch",
        "dinner": "Dinner",
        "snacks": "Snacks",
        "addToMeal": "Add to meal",
        "backToSearch": "Back to search",
        "productDetails": "Product details",
        "quantity": "Quantity in grams",
        "category": "Category",
        "search": "Search",
        "cookieNotice": "We use cookies to enhance your experience. By using the site, you agree to the use of cookies.",
        "acceptCookies": "Accept"
    },
    de: {
        "title": "Fitness & Food Tracker",
        "trackMeals": "Tracke deine Mahlzeiten",
        "recipes": "Rezepte",
        "assembleMeal": "Mahlzeit zusammenstellen",
        "chooseDay": "Wähle einen Tag",
        "loadDay": "Tag laden",
        "newDay": "Neuen Tag beginnen",
        "deleteDay": "Tag löschen",
        "summary": "Zusammenfassung des Tages",
        "breakfast": "Frühstück",
        "lunch": "Mittagessen",
        "dinner": "Abendessen",
        "snacks": "Snacks",
        "addToMeal": "Zu Mahlzeit hinzufügen",
        "backToSearch": "Zurück zur Suche",
        "productDetails": "Produktdetails",
        "quantity": "Menge in Gramm",
        "category": "Kategorie",
        "search": "Suche",
        "cookieNotice": "Wir verwenden Cookies, um Ihre Erfahrung zu verbessern. Indem Sie die Seite nutzen, stimmen Sie der Verwendung von Cookies zu.",
        "acceptCookies": "Akzeptieren"
    }
};

// Lade die Standardsprache (Deutsch)
switchLanguage('de');
