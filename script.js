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



// add event on element inspired from: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
const addEventOnElem = function (elem, type, callback) {
    if (elem.length > 1) {
        for (let i = 0; i < elem.length; i++) {
            elem[i].addEventListener(type, callback);
        }
    } else {
        elem.addEventListener(type, callback);
    }
}



// scroll effect inspired from: https://www.shecodes.io/athena/7981-how-to-create-scroll-animations-on-a-website
const sections = document.querySelectorAll("[data-section]");

const scrollReveal = function () {
    for (let i = 0; i < sections.length; i++) {
        if (sections[i].getBoundingClientRect().top < window.innerHeight / 1.5) {
            sections[i].classList.add("active");
        } else {
            sections[i].classList.remove("active");
        }
    }
}

scrollReveal();

addEventOnElem(window, "scroll", scrollReveal);