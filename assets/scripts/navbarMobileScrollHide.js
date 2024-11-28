// Throttle function
function throttle(func, wait) {
    var lastFunc;
    var lastRan;
    return function() {
        var context = this;
        var args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= wait) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, wait - (Date.now() - lastRan));
        }
    };
}

let lastScrollTop = 0;
const toleranceTop = 100;  // # pixels to scroll from top before navbar shows, adjust as needed.
const toleranceScroll = 40;  // 40 pixels of scroll before navbar hides/shows, adjust as needed.

const navbarElement = document.querySelector(".navbar");

function navbarLogic () {
    // Detects if on mobile view
    if(window.innerWidth <= 768) {
        let currentScrollTop = window.scrollY || document.documentElement.scrollTop;
        
        // Always show if at top of page
        if (currentScrollTop < toleranceTop) {
            document.querySelector(".navbar").classList.remove("hide");
            return;
        }
        // Check for toleranceScroll
        if (Math.abs(lastScrollTop - currentScrollTop) <= toleranceScroll) return;
        
        if (currentScrollTop > lastScrollTop){
            // Scrolling down
            document.querySelector(".navbar").classList.add("hide");
        } else {
            // Scrolling up
            document.querySelector(".navbar").classList.remove("hide");
        }
        lastScrollTop = currentScrollTop;
    }
}

const handleNavbar = throttle(navbarLogic, 300); // Throttle 300ms, adjust as needed.

window.addEventListener("scroll", handleNavbar, false);