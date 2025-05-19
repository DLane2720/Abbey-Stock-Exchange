// JavaScript for the admin panel pages

// DOM ready function
function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

// Handle the countdown timer on the sales page
function initSalesCountdown() {
    const countdownElement = document.getElementById('countdown-timer');
    if (!countdownElement) return;
    
    let timeUntilUpdate = parseInt(countdownElement.textContent) || 0;
    
    setInterval(function() {
        timeUntilUpdate -= 1;
        
        if (timeUntilUpdate <= 0) {
            // When countdown reaches zero, reload the page to reflect price updates
            window.location.reload();
        } else {
            countdownElement.textContent = timeUntilUpdate;
        }
    }, 1000);
}

// Handle dynamic scaling of drink grid
function initScaleControl() {
    const scaleSlider = document.getElementById('scale-slider');
    const scaleValueDisplay = document.getElementById('scale-value');
    const drinkGrid = document.querySelector('.drink-grid');
    
    if (!scaleSlider || !drinkGrid) return;
    
    // Function to apply scaling
    function applyScale(value) {
        const scaleValue = parseInt(value);
        
        // Set a data attribute on body to track the current scale
        document.body.setAttribute('data-scale-value', scaleValue);
        
        // Apply the scaling to the grid
        drinkGrid.style.transform = `scale(${scaleValue/100})`;
        drinkGrid.style.transformOrigin = 'top center';
        
        // Adjust margins to prevent overflow issues
        const scaleFactor = scaleValue / 100;
        
        // If scaling up, add margin to compensate for larger size
        if (scaleFactor > 1) {
            const extraSpace = (drinkGrid.scrollHeight * scaleFactor - drinkGrid.scrollHeight) / 2;
            drinkGrid.style.marginBottom = `${extraSpace}px`;
        } else {
            drinkGrid.style.marginBottom = '0';
        }
        
        // Update the display value
        if (scaleValueDisplay) {
            scaleValueDisplay.textContent = `${scaleValue}%`;
        }
        
        // Store preference in localStorage
        localStorage.setItem('adminDisplayScale', scaleValue);
    }
    
    // Check if we have a saved preference
    const savedScale = localStorage.getItem('adminDisplayScale');
    if (savedScale) {
        scaleSlider.value = savedScale;
        applyScale(savedScale);
    }
    
    // Add event listener for the slider
    scaleSlider.addEventListener('input', function() {
        applyScale(this.value);
    });
    
    // Also handle touch events explicitly for better mobile experience
    scaleSlider.addEventListener('touchmove', function() {
        applyScale(this.value);
    });
    
    // Initial scaling if no saved preference
    if (!savedScale) {
        applyScale(scaleSlider.value);
    }
}

// Set up visual feedback for cards without using transformations
function setupCardFeedback() {
    const cards = document.querySelectorAll('.drink-card, .new-drink-card');
    
    // Prevent default form submission behaviors that might cause page refresh
    document.addEventListener('click', function(e) {
        // If it's one of our cards and within a form
        if ((e.target.closest('.drink-card') || e.target.closest('.new-drink-card')) && 
            e.target.closest('form')) {
            // If it's the new drink card (which should open modal, not submit)
            if (e.target.closest('#open-add-drink-modal')) {
                e.preventDefault();
            }
        }
    });
    
    cards.forEach(card => {
        // Use CSS classes for visual feedback instead of styles that could affect layout
        ['mousedown', 'touchstart'].forEach(eventType => {
            card.addEventListener(eventType, () => {
                card.classList.add('card-active');
            }, { passive: true });
        });
        
        ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(eventType => {
            card.addEventListener(eventType, () => {
                card.classList.remove('card-active');
            }, { passive: true });
        });
    });
}

// Add Drink and Open Add Drink Modal functionality
function initAddDrinkModal() {
    const openModalBtn = document.getElementById('open-add-drink-modal');
    const addDrinkModal = document.getElementById('add-drink-modal');
    
    if (openModalBtn && addDrinkModal) {
        openModalBtn.addEventListener('click', function() {
            openModal(addDrinkModal);
            // Focus on the drink name input
            setTimeout(() => {
                document.getElementById('modal_name').focus();
            }, 100);
        });
    }
    
    // Add form handling with AJAX
    const addDrinkForm = document.getElementById('modal-add-drink-form');
    if (addDrinkForm) {
        addDrinkForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Create FormData object
            const formData = new FormData(this);
            
            // Get the form action URL
            const formAction = this.getAttribute('action');
            
            // Send POST request
            fetch(formAction, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    // Close modal
                    closeModal(addDrinkModal);
                    // Reset form for next use
                    this.reset();
                    
                    // Refresh the drinks list in the manage drinks modal
                    if (typeof refreshDrinksList === 'function') {
                        refreshDrinksList();
                    } else {
                        // If we're not on a page with the refreshDrinksList function,
                        // just reload the page
                        window.location.reload();
                    }
                } else {
                    alert('Error adding drink. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
        });
        
        // Handle custom minimum price checkbox
        const initialPriceInput = document.getElementById('modal_initial_price');
        const minPriceInput = document.getElementById('modal_min_price');
        const customMinPriceCheckbox = document.getElementById('modal_custom_min_price');
        
        if (initialPriceInput && minPriceInput && customMinPriceCheckbox) {
            // Set initial price value first time
            if (initialPriceInput.value) {
                minPriceInput.value = initialPriceInput.value;
            }
            
            // Update min price when initial price changes (if checkbox not checked)
            initialPriceInput.addEventListener('input', function() {
                if (!customMinPriceCheckbox.checked) {
                    minPriceInput.value = this.value;
                }
            });
            
            // Enable/disable min price field based on checkbox
            customMinPriceCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    minPriceInput.disabled = false;
                    minPriceInput.focus();
                } else {
                    minPriceInput.disabled = true;
                    minPriceInput.value = initialPriceInput.value;
                }
            });
        }
    }
    
    // Modal cancel button
    const cancelModalBtn = document.querySelector('.modal-cancel-btn');
    if (cancelModalBtn && addDrinkModal) {
        cancelModalBtn.addEventListener('click', function() {
            closeModal(addDrinkModal);
        });
    }
}

// Initialize the page
ready(function() {
    // Initialize functionality based on the current page
    if (document.querySelector('.sales-panel')) {
        initSalesCountdown();
        initScaleControl();
        setupCardFeedback();
        initAddDrinkModal();
    }
    
    // Handle alerts (auto-hide after 5 seconds)
    const alerts = document.querySelectorAll('.alert');
    if (alerts.length) {
        setTimeout(function() {
            alerts.forEach(function(alert) {
                alert.style.opacity = '0';
                setTimeout(function() {
                    alert.remove();
                }, 500);
            });
        }, 5000);
    }
});