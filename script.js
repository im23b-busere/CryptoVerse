// Crypto prices API
const API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,litecoin,ethereum,dogecoin&vs_currencies=usd';


async function fetchCryptoPrices() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        updatePrices(data);
    } catch (error) {
        console.error('Error fetching crypto prices:', error);
    }
}

function updatePrices(data) {
    document.getElementById('btc-price').textContent = `$${data.bitcoin.usd}`;
    document.getElementById('eth-price').textContent = `$${data.ethereum.usd}`;
    document.getElementById('doge-price').textContent = `$${data.dogecoin.usd}`;
    document.getElementById('ltc-price').textContent = `$${data.litecoin.usd}`;

}

// Fetch prices on page load and every 30 seconds
fetchCryptoPrices();
setInterval(fetchCryptoPrices, 30000);