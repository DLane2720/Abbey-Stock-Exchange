// JavaScript for the display menu page - TV-Optimized version with full-width 16:9 ratio

// Audio element for bell sound
let bellSound;
let audioContext; // Add audio context for better browser support
let audioEnabled = false; // Track if audio is enabled

// Audio indicator management
function updateAudioIndicator(enabled, show = true) {
    const indicator = document.getElementById('audio-indicator');
    const icon = document.getElementById('audio-icon');
    
    if (!indicator || !icon) return;
    
    if (show) {
        indicator.classList.add('active');
        
        if (enabled) {
            indicator.classList.remove('disabled');
            indicator.classList.add('enabled');
            icon.className = 'fas fa-volume-up';
        } else {
            indicator.classList.remove('enabled');
            indicator.classList.add('disabled');
            icon.className = 'fas fa-volume-mute';
        }
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            indicator.classList.remove('active');
        }, 3000);
    } else {
        indicator.classList.remove('active');
    }
}

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
            
            // Sort drinks by position
            const sortedDrinks = Object.entries(data.drinks).sort((a, b) => a[1].position - b[1].position);
            
            // Count the items for styling purposes
            const itemCount = sortedDrinks.length;
            
            // Apply classes based on the number of items for responsive display
            if (itemCount > 12) {
                drinksList.classList.add('many-many-items');
                drinksList.classList.add('many-items');
                document.documentElement.style.setProperty('--items-count', itemCount);
            } else if (itemCount > 8) {
                drinksList.classList.add('many-items');
                drinksList.classList.remove('many-many-items');
                document.documentElement.style.setProperty('--items-count', itemCount);
            } else {
                drinksList.classList.remove('many-items');
                drinksList.classList.remove('many-many-items');
                document.documentElement.style.setProperty('--items-count', itemCount);
            }
            
            for (const [name, drink] of sortedDrinks) {
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

// Preload the bell sound with better error handling
function preloadAudio() {
    bellSound = new Audio('/static/sounds/threeBells.wav');
    bellSound.preload = 'auto';
    bellSound.volume = 0.8; // Set a reasonable volume
    
    // Create audio context for better browser support
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.warn('AudioContext not supported:', e);
    }
    
    // Remove the custom isPlaying flag - use the audio element's properties instead
    
    bellSound.addEventListener('loadstart', function() {
        console.log('Bell sound loading started');
    });
    
    bellSound.addEventListener('canplaythrough', function() {
        console.log('Bell sound ready to play');
    });
    
    bellSound.addEventListener('error', function(e) {
        console.error('Error loading bell sound:', e);
    });
    
    // Force load the audio
    bellSound.load();
}

// Improved bell sound function with better reliability
async function playBellSound() {
    if (!bellSound) {
        console.warn('Bell sound not initialized');
        return;
    }
    
    try {
        // Resume audio context if suspended (required for autoplay policy)
        if (audioContext && audioContext.state === 'suspended') {
            await audioContext.resume();
        }
        
        // Check if audio is already playing
        if (!bellSound.paused) {
            console.log('Bell sound already playing, skipping');
            return;
        }
        
        // Reset to beginning
        bellSound.currentTime = 0;
        
        // Ensure audio is ready to play
        if (bellSound.readyState < 2) {
            console.log('Bell sound not ready, waiting...');
            await new Promise((resolve, reject) => {
                const onCanPlay = () => {
                    bellSound.removeEventListener('canplay', onCanPlay);
                    bellSound.removeEventListener('error', onError);
                    resolve();
                };
                const onError = (e) => {
                    bellSound.removeEventListener('canplay', onCanPlay);
                    bellSound.removeEventListener('error', onError);
                    reject(e);
                };
                bellSound.addEventListener('canplay', onCanPlay);
                bellSound.addEventListener('error', onError);
                
                // Timeout after 2 seconds
                setTimeout(() => {
                    bellSound.removeEventListener('canplay', onCanPlay);
                    bellSound.removeEventListener('error', onError);
                    reject(new Error('Timeout waiting for audio to be ready'));
                }, 2000);
            });
        }
        
        // Play the sound
        const playPromise = bellSound.play();
        
        if (playPromise !== undefined) {
            await playPromise;
            console.log('Bell sound played successfully');
            
            // Show audio indicator briefly when bell plays
            if (audioEnabled) {
                updateAudioIndicator(true, true);
            }
        }
        
    } catch (error) {
        console.error('Error playing bell sound:', error);
        
        // If autoplay failed, show a user message or try alternative approach
        if (error.name === 'NotAllowedError') {
            console.warn('Audio autoplay blocked by browser. User interaction required.');
            // You could show a notification to the user here
        }
    }
}

// Add user interaction handler to enable audio (for autoplay policy compliance)
function enableAudioOnUserInteraction() {
    const enableAudio = async () => {
        try {
            if (audioContext && audioContext.state === 'suspended') {
                await audioContext.resume();
                console.log('Audio context resumed after user interaction');
            }
            
            // Test play the audio at low volume to "unlock" it
            if (bellSound) {
                const originalVolume = bellSound.volume;
                bellSound.volume = 0.01;
                const playPromise = bellSound.play();
                if (playPromise) {
                    await playPromise;
                    bellSound.pause();
                    bellSound.currentTime = 0;
                    bellSound.volume = originalVolume;
                    console.log('Audio unlocked after user interaction');
                    
                    // Update audio status and show indicator
                    audioEnabled = true;
                    updateAudioIndicator(true, true);
                }
            }
        } catch (e) {
            console.log('Could not unlock audio:', e);
            audioEnabled = false;
            updateAudioIndicator(false, true);
        }
        
        // Remove listeners after first interaction
        document.removeEventListener('click', enableAudio);
        document.removeEventListener('keydown', enableAudio);
        document.removeEventListener('touchstart', enableAudio);
    };
    
    // Listen for user interactions
    document.addEventListener('click', enableAudio);
    document.addEventListener('keydown', enableAudio);
    document.addEventListener('touchstart', enableAudio);
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
            console.log('Countdown reached zero, playing bell sound');
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

// Function to calculate and update scale factor based on window width
function updateScaleFactor() {
    // Get window width and calculate scale factor based on 1920px as reference
    const windowWidth = window.innerWidth;
    const scaleFactor = windowWidth / 1920;
    
    // Apply the scale factor to the CSS variable
    document.documentElement.style.setProperty('--scale-factor', scaleFactor);
    
    // Check how many drinks we have and apply appropriate styling
    const drinksList = document.getElementById('drinks-list');
    if (drinksList) {
        const itemCount = drinksList.children.length;
        // Set the CSS variable for item count
        document.documentElement.style.setProperty('--items-count', itemCount);
        
        if (itemCount > 12) {
            drinksList.classList.add('many-many-items');
            drinksList.classList.add('many-items');
        } else if (itemCount > 8) {
            drinksList.classList.add('many-items');
            drinksList.classList.remove('many-many-items');
        } else {
            drinksList.classList.remove('many-items');
            drinksList.classList.remove('many-many-items');
        }
    }
}

// Initialize page
ready(function() {
    // Preload bell sound
    preloadAudio();
    
    // Enable audio on user interaction (for autoplay policy)
    enableAudioOnUserInteraction();
    
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
    
    // Set up scale factor based on window width
    updateScaleFactor();
    window.addEventListener('resize', updateScaleFactor);
    
    // Poll for updates every 5 seconds
    setInterval(function() {
        updateDrinksList();
    }, 5000);
});