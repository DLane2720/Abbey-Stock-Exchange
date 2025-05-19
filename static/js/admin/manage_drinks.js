// JavaScript for manage drinks functionality
document.addEventListener('DOMContentLoaded', function() {
    // Show/hide add drink form
    const addDrinkBtn = document.getElementById('add-drink-btn');
    const addDrinkForm = document.getElementById('add-drink-form');
    const cancelAddBtn = document.getElementById('cancel-add');
    
    if (addDrinkBtn && addDrinkForm && cancelAddBtn) {
        // Add event handlers for the custom minimum price checkbox
        const initialPriceInput = document.getElementById('initial_price');
        const minPriceInput = document.getElementById('min_price');
        const customMinPriceCheckbox = document.getElementById('custom_min_price');
        
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
        
        // Check if URL has #add-drink hash
        if (window.location.hash === '#add-drink') {
            addDrinkForm.classList.remove('hidden');
            // Scroll to the form
            document.getElementById('inventory-section').scrollIntoView({ behavior: 'smooth' });
        }
        
        addDrinkBtn.addEventListener('click', function() {
            addDrinkForm.classList.remove('hidden');
            
            const editDrinkForm = document.getElementById('edit-drink-form');
            if (editDrinkForm) {
                editDrinkForm.classList.add('hidden');
            }
        });
        
        cancelAddBtn.addEventListener('click', function() {
            addDrinkForm.classList.add('hidden');
            // Remove hash from URL
            history.replaceState(null, null, ' ');
        });
    }
    
    // Show/hide edit drink form
    const editBtns = document.querySelectorAll('.btn-edit');
    const editDrinkForm = document.getElementById('edit-drink-form');
    const cancelEditBtn = document.getElementById('cancel-edit');
    
    if (editBtns.length && editDrinkForm && cancelEditBtn) {
        // Add edit form event handlers for the custom minimum price checkbox
        const editInitialPriceInput = document.getElementById('edit_initial_price');
        const editMinPriceInput = document.getElementById('edit_min_price');
        const editCustomMinPriceCheckbox = document.getElementById('edit_custom_min_price');
        
        if (editInitialPriceInput && editMinPriceInput && editCustomMinPriceCheckbox) {
            // Update min price when initial price changes (if checkbox not checked)
            editInitialPriceInput.addEventListener('input', function() {
                if (!editCustomMinPriceCheckbox.checked) {
                    editMinPriceInput.value = this.value;
                }
            });
            
            // Enable/disable min price field based on checkbox
            editCustomMinPriceCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    editMinPriceInput.disabled = false;
                    editMinPriceInput.focus();
                } else {
                    editMinPriceInput.disabled = true;
                    editMinPriceInput.value = editInitialPriceInput.value;
                }
            });
        }
        
        // Set up edit buttons click event
        editBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const name = this.getAttribute('data-name');
                const initial = this.getAttribute('data-initial');
                const min = this.getAttribute('data-min');
                const max = this.getAttribute('data-max');
                
                document.getElementById('original-name').value = name;
                document.getElementById('edit_name').value = name;
                document.getElementById('edit_initial_price').value = initial;
                document.getElementById('edit_min_price').value = min;
                document.getElementById('edit_max_price').value = max;
                
                // Check if min price is different from initial price
                const customMinPrice = parseFloat(min) !== parseFloat(initial);
                editCustomMinPriceCheckbox.checked = customMinPrice;
                editMinPriceInput.disabled = !customMinPrice;
                
                editDrinkForm.classList.remove('hidden');
                
                if (addDrinkForm) {
                    addDrinkForm.classList.add('hidden');
                }
            });
        });
        
        cancelEditBtn.addEventListener('click', function() {
            editDrinkForm.classList.add('hidden');
        });
    }
});