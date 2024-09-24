async function fetchStockData() {
    const url = 'https://alpha-vantage.p.rapidapi.com/query?function=TIME_SERIES_DAILY&symbol=MSFT&outputsize=compact&datatype=json';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'e71f71d07emsh4dec3cdfc232955p1f1b37jsn6484d10ae2bd',
            'x-rapidapi-host': 'alpha-vantage.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json(); // Fetch and parse JSON
        console.log(result);
        displayStockData(result); // Display the result on the page
    } catch (error) {
        console.error('Error fetching stock data:', error);
        const container = document.getElementById('stocks-container');
        container.innerHTML = '<p>Error loading stock data.</p>';
    }
}

function displayStockData(stockData) {
    const container = document.getElementById('stocks-container');

    if (!container) {
        console.error('Container element not found');
        return;
    }

    const timeSeries = stockData['Time Series (Daily)'];
    if (!timeSeries) {
        container.innerHTML = '<p>No stock data found.</p>';
        return;
    }

    // Get the latest stock data entry
    const latestEntryKey = Object.keys(timeSeries)[0];
    const latestEntry = timeSeries[latestEntryKey];

    // Create HTML content for the stock data
    container.innerHTML = `
        <h3>Stock Data (Latest)</h3>
        <p><strong>Date:</strong> ${latestEntryKey}</p>
        <p><strong>Open:</strong> ${latestEntry['1. open']}</p>
        <p><strong>High:</strong> ${latestEntry['2. high']}</p>
        <p><strong>Low:</strong> ${latestEntry['3. low']}</p>
        <p><strong>Close:</strong> ${latestEntry['4. close']}</p>
        <p><strong>Volume:</strong> ${latestEntry['5. volume']}</p>
    `;
}

// Load stock data on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchStockData();
});
