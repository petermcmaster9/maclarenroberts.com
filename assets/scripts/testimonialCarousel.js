class TestimonialCarousel {
    constructor() {
        this.track = document.querySelector('.testimonials__track');
        this.cards = Array.from(this.track.children);
        this.nextButton = document.querySelector('.testimonials__button.next');
        this.prevButton = document.querySelector('.testimonials__button.prev');
        
        this.currentIndex = 0;
        this.totalCards = this.cards.length;
        this.autoScrollInterval = null;
        this.autoScrollDelay = 6000; // 3 seconds
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
        this.cardsPerView = window.innerWidth >= 768 ? 3 : 1;
        
        // Calculate single card width including gap
        const gap = 32; // 2rem = 32px
        const containerWidth = this.track.parentElement.clientWidth - 80; // Account for parent padding
        
        if (this.cardsPerView === 1) {
            this.cardWidth = containerWidth;
            this.slideAmount = this.cardWidth + gap;
        } else {
            // For desktop/tablet view
            this.cardWidth = (containerWidth - (gap * (this.cardsPerView - 1))) / this.cardsPerView;
            this.slideAmount = this.cardWidth + gap;
        }
        
        // Set width for each card
        this.cards.forEach(card => {
            card.style.width = `${this.cardWidth}px`;
        });
        
        // Ensure current index is valid for new view
        const maxIndex = this.totalCards - this.cardsPerView;
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
        if (this.currentIndex < this.totalCards - this.cardsPerView) {
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
            this.currentIndex = this.totalCards - this.cardsPerView;
            this.updateCardPositions();
        }
    }
}

// Initialize the carousel when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialCarousel();
});