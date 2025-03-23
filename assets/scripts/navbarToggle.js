document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.querySelector('.navbar__toggle');
    const navList = document.querySelector('.navbar__navlist');
    
    toggleButton.addEventListener('click', () => {
        // Toggle active class on button for X animation
        toggleButton.classList.toggle('active');
        
        // Toggle active class on nav list for showing/hiding
        navList.classList.toggle('active');
    });
    
    // Close menu when clicking on a link (mobile)
    const navLinks = document.querySelectorAll('.navbar__link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (toggleButton.classList.contains('active')) {
                toggleButton.classList.remove('active');
                navList.classList.remove('active');
            }
        });
    });
    
    // Close menu when clicking outside (mobile)
    document.addEventListener('click', (event) => {
        const isClickInsideNav = navList.contains(event.target);
        const isClickOnToggle = toggleButton.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnToggle && toggleButton.classList.contains('active')) {
            toggleButton.classList.remove('active');
            navList.classList.remove('active');
        }
    });
});