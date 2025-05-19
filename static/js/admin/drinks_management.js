// JavaScript for the drinks management modal functionality

// Function to refresh the drinks list container via AJAX
function refreshDrinksList() {
    // Show a loading indicator (optional)
    const container = document.getElementById('drinks-list-container');
    if (container) {
        container.innerHTML = '<div class="loading">Refreshing drink list...</div>';
    }
    
    // Fetch the updated HTML from our API endpoint
    fetch('/api/drinks/html')
        .then(response => response.text())
        .then(html => {
            if (container) {
                // Replace the container contents with the new HTML
                container.innerHTML = html;
                
                // Re-attach event listeners to the new elements
                attachDrinksListEventListeners();
            }
        })
        .catch(error => {
            console.error('Error refreshing drinks list:', error);
            if (container) {
                container.innerHTML = '<div class="error">Error refreshing list. Please try again.</div>';
            }
        });
}

// Function to attach event listeners to the drinks list elements
function attachDrinksListEventListeners() {
    // Attach event listeners to edit buttons
    document.querySelectorAll('.btn-edit').forEach(function(btn) {
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
            const editCustomMinPriceCheckbox = document.getElementById('edit_custom_min_price');
            const editMinPriceInput = document.getElementById('edit_min_price');
            
            if (editCustomMinPriceCheckbox && editMinPriceInput) {
                editCustomMinPriceCheckbox.checked = customMinPrice;
                editMinPriceInput.disabled = !customMinPrice;
            }
            
            const editDrinkForm = document.getElementById('edit-drink-form');
            const addDrinkForm = document.getElementById('add-drink-form');
            
            if (editDrinkForm) {
                editDrinkForm.classList.remove('hidden');
            }
            
            if (addDrinkForm) {
                addDrinkForm.classList.add('hidden');
            }
        });
    });
    
    // Attach event listeners to delete buttons
    document.querySelectorAll('.delete-drink-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const drinkName = this.getAttribute('data-name');
            
            // Create form data for delete operation
            const formData = new FormData();
            formData.append('action', 'delete');
            formData.append('name', drinkName);
            
            // Send POST request
            fetch('/admin/settings', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    // Just refresh the drinks list instead of reloading the page
                    refreshDrinksList();
                } else {
                    alert('Error deleting drink. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
        });
    });
    
    // Attach event listeners to move up/down buttons
    document.querySelectorAll('.move-up-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (this.hasAttribute('disabled')) return; // Skip if disabled
            
            const drinkName = this.getAttribute('data-name');
            
            // Create form data for move operation
            const formData = new FormData();
            formData.append('action', 'move_up');
            formData.append('name', drinkName);
            
            // Send POST request
            fetch('/admin/settings', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    // Just refresh the drinks list instead of reloading the page
                    refreshDrinksList();
                } else {
                    alert('Error moving drink. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
        });
    });
    
    document.querySelectorAll('.move-down-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (this.hasAttribute('disabled')) return; // Skip if disabled
            
            const drinkName = this.getAttribute('data-name');
            
            // Create form data for move operation
            const formData = new FormData();
            formData.append('action', 'move_down');
            formData.append('name', drinkName);
            
            // Send POST request
            fetch('/admin/settings', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    // Just refresh the drinks list instead of reloading the page
                    refreshDrinksList();
                } else {
                    alert('Error moving drink. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Handle edit drink form submission
    const editDrinkForm = document.getElementById('edit-drink-form-element');
    if (editDrinkForm) {
        editDrinkForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Create FormData object
            const formData = new FormData(this);
            
            // Send POST request
            fetch(this.getAttribute('action'), {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    // Hide the edit form
                    const editFormContainer = document.getElementById('edit-drink-form');
                    if (editFormContainer) {
                        editFormContainer.classList.add('hidden');
                    }
                    
                    // Refresh just the drinks list
                    refreshDrinksList();
                } else {
                    alert('Error updating drink. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
        });
    }
    
    // Handle add drink form submission
    const addDrinkForm = document.querySelector('#add-drink-form form');
    if (addDrinkForm) {
        addDrinkForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Create FormData object
            const formData = new FormData(this);
            
            // Send POST request
            fetch(this.getAttribute('action'), {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    // Clear the form
                    this.reset();
                    
                    // Hide the add form
                    const addFormContainer = document.getElementById('add-drink-form');
                    if (addFormContainer) {
                        addFormContainer.classList.add('hidden');
                    }
                    
                    // Refresh just the drinks list
                    refreshDrinksList();
                } else {
                    alert('Error adding drink. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
        });
    }
    
    // Initial setup of event listeners
    attachDrinksListEventListeners();
});

// Make the refreshDrinksList function globally available so it can be called from other scripts
window.refreshDrinksList = refreshDrinksList;