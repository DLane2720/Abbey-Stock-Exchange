// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const manageModal = document.getElementById('manage-drinks-modal');
    
    // If we're in the sales page, handle the "Manage All Drinks" button
    const manageDrinksBtn = document.querySelector('.manage-drinks-btn');
    if (manageDrinksBtn && manageModal) {
        // Change the href to a javascript void to prevent navigation
        manageDrinksBtn.setAttribute('href', 'javascript:void(0)');
        
        // Add click event to open modal
        manageDrinksBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal(manageModal);
        });
    }
    
    // Set up all close buttons
    const closeModalButtons = document.querySelectorAll('.modal-close-btn');
    closeModalButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close on overlay click
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    modalOverlays.forEach(function(overlay) {
        overlay.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const visibleModal = document.querySelector('.modal.visible');
            if (visibleModal) {
                closeModal(visibleModal);
            }
        }
    });
    
    // Functions to open and close modals
    function openModal(modal) {
        modal.classList.remove('hidden');
        modal.classList.add('visible');
        document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
    }
    
    function closeModal(modal) {
        modal.classList.remove('visible');
        modal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
    }
});