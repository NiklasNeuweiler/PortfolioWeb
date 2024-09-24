const apiKey = 'AIV5EF6X3SMWHA61';
const symbol = 'AAPL'; // You can change this to any stock symbol
const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

// Function to fetch stock data
async function fetchStockData() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

        if (data['Time Series (Daily)']) {
            displayStockData(data['Time Series (Daily)']);
        } else {
            document.getElementById('stock-container').innerHTML = '<p>No stock data found.</p>';
        }
    } catch (error) {
        console.error('Error fetching stock data:', error);
        document.getElementById('stock-container').innerHTML = '<p>Error loading stock data.</p>';
    }
}

// Function to display stock data
function displayStockData(stockData) {
    const stockContainer = document.getElementById('stock-container');
    stockContainer.innerHTML = ''; // Clear container

    // Get the latest stock data
    const latestDate = Object.keys(stockData)[0];
    const latestStock = stockData[latestDate];
    
    const stockItem = `
        <div class="stock-item">
            <h3>${symbol} (${latestDate})</h3>
            <p>Open: ${latestStock['1. open']}</p>
            <p>High: ${latestStock['2. high']}</p>
            <p>Low: ${latestStock['3. low']}</p>
            <p>Close: ${latestStock['4. close']}</p>
            <p>Volume: ${latestStock['5. volume']}</p>
        </div>
    `;
    stockContainer.innerHTML = stockItem;
}

// Fetch stock data when the page loads
document.addEventListener('DOMContentLoaded', fetchStockData);
