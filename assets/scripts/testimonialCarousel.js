class TestimonialCarousel {
    constructor() {
        this.track = document.querySelector('.testimonials__track');
        this.cards = Array.from(this.track.children);
        this.nextButton = document.querySelector('.testimonials__button.next');
        this.prevButton = document.querySelector('.testimonials__button.prev');
        
        this.currentIndex = 0;
        this.totalCards = this.cards.length;
        this.autoScrollInterval = null;
        this.autoScrollDelay = 8000; // 8 seconds
        this.userInteracted = false;
        
        this.updateView();
        this.setupEventListeners();
        this.startAutoScroll();
    }

    startAutoScroll() {
        // Clear any existing interval
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
        }

        // Only start auto-scroll if user hasn't interacted
        if (!this.userInteracted) {
            this.autoScrollInterval = setInterval(() => {
                this.moveToNextCard();
            }, this.autoScrollDelay);
        }
    }

    stopAutoScroll() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
            this.autoScrollInterval = null;
        }
    }

    handleUserInteraction() {
        this.userInteracted = true;
        this.stopAutoScroll();
    }

    updateView() {
        // Calculate cards per view based on screen width
        if (window.innerWidth >= 1280) {        // large desktop
            this.cardsPerView = 3;
        } else if (window.innerWidth >= 768) {  // tablet‑ish
            this.cardsPerView = 2;
        } else {                                // mobile
            this.cardsPerView = 1;
        }
        
        // Get the Carousel Container width
        const carouselContainer = this.track.parentElement;
        const containerStyles = window.getComputedStyle(carouselContainer);
        const paddingLeft = parseInt(containerStyles.paddingLeft, 10);
        const paddingRight = parseInt(containerStyles.paddingRight, 10);

        // Calculate available width accounting for container padding
        const containerWidth = carouselContainer.clientWidth - paddingLeft - paddingRight;
        const gap = parseInt(window.getComputedStyle(this.track).gap, 10);

        // Calculate card width based on cards per view and gap
        if (this.cardsPerView === 1) {
            this.cardWidth = Math.max(260, containerWidth - 1.5*gap); // minimum width of 280px
            this.slideAmount = this.cardWidth + gap;
        } else if (this.cardsPerView === 2) {
            // For tablet view
            this.cardWidth = Math.max(260, (containerWidth - gap - (gap * (this.cardsPerView - 1))) / this.cardsPerView);
            this.slideAmount = this.cardWidth + gap;
        } else {
            // For tablet view
            this.cardWidth = Math.max(260, (containerWidth - (gap * (this.cardsPerView - 1))) / this.cardsPerView);
            this.slideAmount = this.cardWidth + gap;
        }
        // unit tests ...
        console.log(`Available container width (after padding) containerWidth: ${containerWidth}px`);
        console.log(`carouselContainer.clientWidth ${carouselContainer.clientWidth}px`);
        console.log(`paddingLeft ${paddingLeft}px`);
        console.log(`paddingLRight ${paddingRight}px`);
        console.log(`cardWidth: ${this.cardWidth}`);
        console.log(`slideAmount: ${this.slideAmount}`);
        
        // Set width for each card
        this.cards.forEach(card => {
            card.style.width = `${this.cardWidth}px`;
        });
        
        // Ensure current index is valid for new view
        const maxIndex = Math.max(0, this.totalCards - this.cardsPerView);
        if (this.currentIndex > maxIndex) {
            this.currentIndex = maxIndex;
        }
        
        // Update card positions
        this.updateCardPositions();
    }

    updateCardPositions() {
        const offset = -(this.currentIndex * this.slideAmount);
        this.track.style.transform = `translateX(${offset}px)`;
    }

    setupEventListeners() {
        this.nextButton.addEventListener('click', () => {
            this.handleUserInteraction();
            this.moveToNextCard();
        });
        
        this.prevButton.addEventListener('click', () => {
            this.handleUserInteraction();
            this.moveToPrevCard();
        });
        
        // Handle responsive changes
        window.addEventListener('resize', () => {
            this.updateView();
        });
    }

    moveToNextCard() {
        const maxIndex = Math.max(0, this.totalCards - this.cardsPerView);
        if (this.currentIndex < maxIndex) {
            this.currentIndex++;
            this.updateCardPositions();
        } else {
            // Loop back to start
            this.currentIndex = 0;
            this.updateCardPositions();
        }
    }

    moveToPrevCard() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCardPositions();
        } else {
            // Loop to end
            this.currentIndex = Math.max(0, this.totalCards - this.cardsPerView);
            this.updateCardPositions();
        }
    }
}

// Initialize the carousel when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialCarousel();
});