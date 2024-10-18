// API-Schlüssel
const API_KEY = "b9d0491a4dba49edaa46691944aacf5a"; // Spoonacular API-Schlüssel
const DEEPL_API_KEY = "30c13504-9c75-4e46-9dc1-baf0717dcb36:fx"; // DeepL API-Schlüssel

// Funktion zur Übersetzung des Suchbegriffs von Deutsch nach Englisch mit DeepL
async function translateToEnglish(query) {
  const url = `https://api-free.deepl.com/v2/translate`;
  const params = new URLSearchParams({
    auth_key: DEEPL_API_KEY,
    text: query,
    source_lang: "DE",
    target_lang: "EN",
  });

  try {
    const response = await fetch(url, { method: "POST", body: params });
    const result = await response.json();
    return result.translations[0].text;
  } catch (error) {
    console.error("Fehler bei der Übersetzung:", error);
  }
}

// Funktion zur Suche nach Rezepten über die Spoonacular API
async function searchRecipes(query) {
  const url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const result = await response.json();
    return result.results;
  } catch (error) {
    console.error("Fehler bei der Rezepte-Suche:", error);
    return [];
  }
}

// Funktion zur Anzeige der Rezepte
function renderRecipes(recipes) {
  const recipeContainer = document.getElementById("recipe-results");
  recipeContainer.innerHTML = "";

  recipes.forEach((recipe) => {
    const recipeItem = document.createElement("div");
    recipeItem.classList.add("result-item");

    recipeItem.innerHTML = `
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}">
            <a href="https://spoonacular.com/recipes/${recipe.title
              .toLowerCase()
              .split(" ")
              .join("-")}-${recipe.id}" target="_blank">
                <button type="button">Original Rezept ansehen</button>
            </a>
        `;

    recipeContainer.appendChild(recipeItem);
  });
}

// Event Listener für den Such-Button
document.getElementById("search-btn").addEventListener("click", async () => {
  const searchInput = document.getElementById("food-input").value;

  if (searchInput) {
    // Übersetzen des Suchbegriffs ins Englische, falls nötig
    const translatedQuery = await translateToEnglish(searchInput);
    console.log(`Übersetzte Suchanfrage: ${translatedQuery}`);

    // Rezepte suchen und anzeigen
    const recipes = await searchRecipes(translatedQuery);
    renderRecipes(recipes);
  }
});
