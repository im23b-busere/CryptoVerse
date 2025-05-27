// Crypto prices API
const API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin,dogecoin,cardano,solana,polkadot,ripple,chainlink,uniswap&vs_currencies=usd';


async function fetchCryptoPrices() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            updatePricesFailedFetch();
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        updatePrices(data);
        setupInfiniteScroll(); // Setup infinite scroll after prices are updated
    } catch (error) {
        console.error('Error fetching crypto prices:', error);
    }
}


// Update prices based on fetched data
function updatePrices(data) {
    document.getElementById('btc-price').textContent = `$${data.bitcoin.usd}`;
    document.getElementById('eth-price').textContent = `$${data.ethereum.usd}`;
    document.getElementById('doge-price').textContent = `$${data.dogecoin.usd}`;
    document.getElementById('ltc-price').textContent = `$${data.litecoin.usd}`;
    document.getElementById('ada-price').textContent = `$${data.cardano.usd}`;
    document.getElementById('sol-price').textContent = `$${data.solana.usd}`;
    document.getElementById('dot-price').textContent = `$${data.polkadot.usd}`;
    document.getElementById('xrp-price').textContent = `$${data.ripple.usd}`;
    document.getElementById('link-price').textContent = `$${data.chainlink.usd}`;
    document.getElementById('uni-price').textContent = `$${data.uniswap.usd}`;
}


// Update prices with default values if fetch fails
function updatePricesFailedFetch() {
    document.getElementById('btc-price').textContent = "$97038";
    document.getElementById('eth-price').textContent = "$3697.16";
    document.getElementById('doge-price').textContent = "$109.79";
    document.getElementById('ltc-price').textContent = "$0.428462";
    document.getElementById('ada-price').textContent = "$0.45";
    document.getElementById('sol-price').textContent = "$98.76";
    document.getElementById('dot-price').textContent = "$6.54";
    document.getElementById('xrp-price').textContent = "$0.52";
    document.getElementById('link-price').textContent = "$14.23";
    document.getElementById('uni-price').textContent = "$5.67";
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
const navLinks = document.querySelectorAll(".navbar-link");

const scrollReveal = function () {
    // Update active section for animation
    for (let i = 0; i < sections.length; i++) {
        if (sections[i].getBoundingClientRect().top < window.innerHeight / 1.5) {
            sections[i].classList.add("active");
        } else {
            sections[i].classList.remove("active");
        }
    }

    // Update active navigation link
    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href").includes(current)) {
            link.classList.add("active");
        }
    });
}

scrollReveal();

addEventOnElem(window, "scroll", scrollReveal);

// Chat functionality
const chatIcon = document.getElementById('chat-icon');
const chatWindow = document.getElementById('chat-window');
const closeChat = document.getElementById('close-chat');
const chatInput = document.getElementById('chat-input');
const sendMessage = document.getElementById('send-message');
const chatContent = document.getElementById('chat-content');
const groqApiKey = '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';

// chat window
chatIcon.addEventListener('click', () => {
    chatWindow.classList.toggle('hidden');
});

closeChat.addEventListener('click', () => {
    chatWindow.classList.add('hidden');
});

// Send message
sendMessage.addEventListener('click', handleUserMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserMessage();
});

async function handleUserMessage() {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    appendMessage('user', userMessage);
    chatInput.value = '';
    const botReply = await getBotReply(userMessage);
    appendMessage('bot', botReply);
}

// Append messages to chat
function appendMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', sender);
    messageElement.textContent = message;
    chatContent.appendChild(messageElement);
    chatContent.scrollTop = chatContent.scrollHeight; // Scroll to bottom
}

// Fetch bot reply
async function getBotReply(userMessage) {
    const prompt = "Sie sind ein hilfreicher Assistent, der Informationen über die Website und Kryptowährungen bereitstellt. Antworte immer kurz und klar";
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${groqApiKey}`,
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content: prompt,
                    },
                    {
                        role: 'user',
                        content: userMessage,
                    },
                ],
                model: 'llama3-8b-8192',
            }),
        });

        // error handling inspired by: https://stackoverflow.com/questions/78391185/how-do-i-avoid-sdk-and-use-raw-fetch-with-groq-api
        if (!response.ok) throw new Error('Failed to fetch from Groq API');
        const data = await response.json();
        return data.choices[0]?.message?.content || 'Entschuldigung, ich konnte keine Antwort finden.';
    } catch (error) {
        console.error('Error fetching bot reply:', error);
        return 'Entschuldigung, es ist ein Fehler aufgetreten.';
    }
}


const menuToggle = document.getElementById("menu-toggle");
const navbar = document.querySelector(".navbar");

menuToggle.addEventListener("click", () => {
    navbar.classList.toggle("hidden");
    if (window.innerWidth <= 768) {
        navbar.classList.toggle("mobile-open");
    }
});

// hiding menu on mobile inspired by: https://stackoverflow.com/questions/31223341/detecting-scroll-direction
window.addEventListener('scroll', function() {
    if (window.innerWidth <= 768) {
        if (window.scrollY === 0) {
            menuToggle.style.display = 'block';
        } else {
            menuToggle.style.display = 'none';
        }
    }
});

// Center live prices scrollbar on page load
function centerLivePricesScroll() {
    const livePricesContent = document.querySelector('.live-prices .content');
    if (livePricesContent) {
        const scrollWidth = livePricesContent.scrollWidth;
        const clientWidth = livePricesContent.clientWidth;
        livePricesContent.scrollLeft = (scrollWidth - clientWidth) / 2;
    }
}

// Clone items for infinite scroll
function setupInfiniteScroll() {
    const livePricesContent = document.querySelector('.live-prices .content');
    if (!livePricesContent) return;

    // Clone all items and append them
    const items = livePricesContent.querySelectorAll('li');
    items.forEach(item => {
        const clone = item.cloneNode(true);
        livePricesContent.appendChild(clone);
    });

    // Start auto-scrolling
    startAutoScroll();
}

// Auto-scroll functionality
let autoScrollInterval;
let isScrolling = false;

function startAutoScroll() {
    const livePricesContent = document.querySelector('.live-prices .content');
    if (!livePricesContent) return;

    // Clear any existing interval
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
    }

    // Set up auto-scroll
    autoScrollInterval = setInterval(() => {
        if (!isScrolling) {
            livePricesContent.scrollLeft += 2;
            
            // Reset scroll position when reaching the end
            if (livePricesContent.scrollLeft >= livePricesContent.scrollWidth / 2) {
                livePricesContent.scrollLeft = 0;
            }
        }
    }, 15);

    // Pause auto-scroll on hover
    livePricesContent.addEventListener('mouseenter', () => {
        isScrolling = true;
    });

    livePricesContent.addEventListener('mouseleave', () => {
        isScrolling = false;
    });

    // Pause auto-scroll on touch
    livePricesContent.addEventListener('touchstart', () => {
        isScrolling = true;
    });

    livePricesContent.addEventListener('touchend', () => {
        isScrolling = false;
    });
}




