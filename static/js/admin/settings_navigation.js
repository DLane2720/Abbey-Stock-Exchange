// JavaScript for settings navigation and future popup functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    
    // Currently, this just scrolls to sections, but it will be updated to show/hide popups
    navButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // For now, just scroll to the section
                targetSection.scrollIntoView({ behavior: 'smooth' });
                
                // In the future, this would open the section as a popup/modal
                // Commented code below shows how this might work
                /*
                // Hide all sections
                document.querySelectorAll('.settings-panel, .inventory-panel, .backup-section').forEach(function(section) {
                    section.classList.add('hidden');
                });
                
                // Show just the target as a popup
                targetSection.classList.remove('hidden');
                targetSection.classList.add('modal-popup');
                */
            }
        });
    });
    
    // In the future, add code here for closing popups, etc.
});