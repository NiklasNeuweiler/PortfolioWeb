const apiKey = '01b59540f6a1238a616be59063b9ed83';  // Füge hier deinen API-Schlüssel von WeatherAPI ein
const weatherForm = document.getElementById('weatherForm');
const weatherResult = document.getElementById('weatherResult');

// Event Listener für das Formular
weatherForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = document.getElementById('cityInput').value;
  fetchWeatherData(city);
});

// Funktion zum Abrufen der Wetterdaten von WeatherAPI
function fetchWeatherData(city) {
  const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=de`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => displayWeather(data))
    .catch(error => {
      weatherResult.innerHTML = '<p>Stadt nicht gefunden. Bitte versuchen Sie es erneut.</p>';
    });
}

// Funktion zum Anzeigen der Wetterdaten
function displayWeather(data) {
  if (!data || !data.location) {
    weatherResult.innerHTML = '<p>Stadt nicht gefunden. Bitte versuchen Sie es erneut.</p>';
    return;
  }

  const weatherHTML = `
    <h3>Wetter in ${data.location.name}, ${data.location.country}</h3>
    <p>Temperatur: ${data.current.temp_c}°C</p>
    <p>Wetter: ${data.current.condition.text}</p>
    <p>Luftfeuchtigkeit: ${data.current.humidity}%</p>
    <img src="${data.current.condition.icon}" alt="Wetter Icon">
  `;

  weatherResult.innerHTML = weatherHTML;
}
