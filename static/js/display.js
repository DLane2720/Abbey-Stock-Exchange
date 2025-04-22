// JavaScript for the display menu page - TV-Optimized version

// Audio element for bell sound
let bellSound;

// DOM ready function
function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

// Set up the countdown timer and price updates
let timeUntilUpdate = 0;
let updateInterval = 90; // Default, will be overridden by server value
let countdownTimer;

// Store current prices for comparison
const currentPrices = {};

// Format currency helper function
function formatCurrency(value) {
    return '$' + parseFloat(value).toFixed(2);
}

// Format time to MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Function to update the drinks list from the server
function updateDrinksList() {
    fetch('/api/drinks')
        .then(response => response.json())
        .then(data => {
            // Update drinks list
            const drinksList = document.getElementById('drinks-list');
            if (!drinksList) return;
            
            drinksList.innerHTML = '';
            
            for (const [name, drink] of Object.entries(data.drinks)) {
                const drinkItem = document.createElement('div');
                drinkItem.className = 'drink-item';
                drinkItem.setAttribute('data-name', name);
                drinkItem.setAttribute('data-price', drink.current_price);
                
                const drinkName = document.createElement('div');
                drinkName.className = 'drink-name';
                drinkName.textContent = name;
                
                const currentPrice = document.createElement('div');
                currentPrice.className = 'current-price';
                currentPrice.textContent = formatCurrency(drink.current_price);
                
                // Check if price has changed and add animation classes
                if (currentPrices[name] && drink.current_price > currentPrices[name]) {
                    currentPrice.classList.add('price-increased');
                } else if (currentPrices[name] && drink.current_price < currentPrices[name]) {
                    currentPrice.classList.add('price-decreased');
                }
                
                const trend = document.createElement('div');
                trend.className = 'trend';
                
                let trendIcon;
                if (drink.trend === 'up') {
                    trendIcon = '<i class="fas fa-arrow-up trend-up"></i>';
                } else if (drink.trend === 'down') {
                    trendIcon = '<i class="fas fa-arrow-down trend-down"></i>';
                } else {
                    trendIcon = '<i class="fas fa-minus trend-stable"></i>';
                }
                
                trend.innerHTML = trendIcon;
                
                drinkItem.appendChild(drinkName);
                drinkItem.appendChild(currentPrice);
                drinkItem.appendChild(trend);
                
                drinksList.appendChild(drinkItem);
                
                // Update stored price
                currentPrices[name] = drink.current_price;
            }
            
            // Update countdown timer
            timeUntilUpdate = data.time_until_update;
            updateCountdown();
        })
        .catch(error => {
            console.error('Error fetching drinks data:', error);
        });
}

// Update the countdown display
function updateCountdown() {
    const countdownElement = document.getElementById('countdown-timer');
    if (!countdownElement) return;
    
    countdownElement.textContent = formatTime(timeUntilUpdate);
    countdownElement.setAttribute('data-seconds', timeUntilUpdate);
    
    // Add pulse effect when countdown is low
    if (timeUntilUpdate <= 10) {
        countdownElement.classList.add('pulse');
    } else {
        countdownElement.classList.remove('pulse');
    }
}

// Initialize countdown timer
function initCountdown() {
    // Clear any existing timer
    if (countdownTimer) {
        clearInterval(countdownTimer);
    }
    
    // Update countdown timer every second
    countdownTimer = setInterval(function() {
        timeUntilUpdate -= 1;
        
        if (timeUntilUpdate <= 0) {
            // Play bell sound when timer reaches zero
            playBellSound();
            
            // When countdown reaches zero, update drinks list
            updateDrinksList();
        } else {
            updateCountdown();
        }
    }, 1000);
}

// Initialize price data
function initPriceData() {
    document.querySelectorAll('.drink-item').forEach(function(item) {
        const name = item.getAttribute('data-name');
        const price = parseFloat(item.getAttribute('data-price'));
        currentPrices[name] = price;
    });
}

// Remove animation classes after they complete
function setupAnimationListeners() {
    document.addEventListener('animationend', function(e) {
        if (e.target.classList.contains('price-increased')) {
            e.target.classList.remove('price-increased');
        } else if (e.target.classList.contains('price-decreased')) {
            e.target.classList.remove('price-decreased');
        }
    });
}

// Calculate ideal font sizes based on viewport and drink count
function optimizeForTV() {
    // Check if the aspect ratio is close to 16:9
    const aspectRatio = window.innerWidth / window.innerHeight;
    const isWidescreen = aspectRatio >= 1.7; // Close to 16:9 ratio
    
    if (isWidescreen) {
        // Calculate the number of items that can fit vertically
        const headerHeight = document.querySelector('header').offsetHeight;
        const footerHeight = document.querySelector('footer').offsetHeight;
        const menuHeaderHeight = document.querySelector('.menu-header').offsetHeight;
        
        const availableHeight = window.innerHeight - headerHeight - footerHeight - menuHeaderHeight;
        const drinksList = document.querySelector('.drinks-list');
        const drinkItems = document.querySelectorAll('.drink-item');
        
        if (drinksList) {
            // Apply max-height to prevent overflow
            drinksList.style.maxHeight = `${availableHeight}px`;
            
            // Further optimize if we have many drinks
            const drinkCount = drinkItems.length;
            if (drinkCount > 7) {
                // Apply compact styles for many items
                document.body.classList.add('compact-view');
                
                // Calculate ideal height per item
                const idealItemHeight = Math.floor(availableHeight / drinkCount) - 2; // 2px for borders
                
                // Don't let items get too small
                const minItemHeight = 36; // minimum reasonable height
                const itemHeight = Math.max(idealItemHeight, minItemHeight);
                
                // Apply consistent height to all items
                drinkItems.forEach(item => {
                    item.style.height = `${itemHeight}px`;
                });
            } else {
                document.body.classList.remove('compact-view');
                drinkItems.forEach(item => {
                    item.style.height = '';
                });
            }
        }
    }
}

// Preload the bell sound
function preloadAudio() {
    bellSound = new Audio('/static/sounds/threeBells.wav');
    bellSound.load();
    
    // Set initial state
    bellSound.isPlaying = false;
    
    // Make sure the isPlaying flag is reset if the sound stops for any reason
    bellSound.addEventListener('ended', function() {
        bellSound.isPlaying = false;
    });
    
    bellSound.addEventListener('pause', function() {
        bellSound.isPlaying = false;
    });
    
    bellSound.addEventListener('error', function() {
        bellSound.isPlaying = false;
    });
}

// Play bell sound
function playBellSound() {
    if (bellSound && !bellSound.isPlaying) {
        // Prevent playing again until sound finishes
        bellSound.isPlaying = true;
        
        // Reset to beginning
        bellSound.currentTime = 0;
        
        // Play the sound
        bellSound.play().catch(error => {
            console.error('Error playing sound:', error);
            bellSound.isPlaying = false;
        });
        
        // When sound ends, reset the isPlaying flag
        bellSound.onended = function() {
            bellSound.isPlaying = false;
        };
    }
}

// Initialize page
ready(function() {
    // Preload bell sound
    preloadAudio();
    // Get initial update interval from the page
    const countdownElement = document.getElementById('countdown-timer');
    if (countdownElement) {
        // Parse the initial time value from the element
        timeUntilUpdate = parseInt(countdownElement.getAttribute('data-seconds') || countdownElement.textContent) || 0;
        // Update the display to show formatted time
        countdownElement.textContent = formatTime(timeUntilUpdate);
    }
    
    // Initialize price data for comparisons
    initPriceData();
    
    // Setup animation listeners
    setupAnimationListeners();
    
    // Initialize countdown
    initCountdown();
    
    // Optimize layout for TV display
    optimizeForTV();
    window.addEventListener('resize', optimizeForTV);
    
    // Poll for updates every 5 seconds
    setInterval(function() {
        updateDrinksList();
    }, 5000);
});