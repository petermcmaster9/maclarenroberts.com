document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.navbar__link');
    let lastScrollTop = 0;
    const scrollThreshold = 400;
    
    // Handle navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 1s delay to allow the scroll to finish
            setTimeout(() => {
                navbar.classList.add('navbar--hidden');
            }, 1000);
        });
    });
    
    window.addEventListener('scroll', function() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // At the top of the page - always show navbar
        if (currentScrollTop <= 0) {
            navbar.classList.remove('navbar--hidden');
            return;
        }
        
        // Past threshold - apply hide/show logic based on scroll direction
        if (currentScrollTop > scrollThreshold) {
            // Scrolling down - hide navbar
            if (currentScrollTop > lastScrollTop) {
                navbar.classList.add('navbar--hidden');
            } 
            // Scrolling up - show navbar
            else {
                navbar.classList.remove('navbar--hidden');
            }
        } 
        // Between top and threshold - always show navbar
        else {
            navbar.classList.remove('navbar--hidden');
        }
        
        lastScrollTop = currentScrollTop;
    });
});