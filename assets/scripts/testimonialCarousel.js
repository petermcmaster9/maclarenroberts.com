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
        this.setupDragHandlers();
        this.startAutoScroll();
    }

      /* ---------- NEW: drag / swipe support ---------- */
    setupDragHandlers() {
        /* Unifies mouse + touch with modern Pointer Events. */
        let isDragging   = false;
        let startX       = 0;   // pointer-down position
        let prevOffset   = 0;   // tx() when the drag started
        let liveOffset   = 0;   // tx() while dragging

        const track = this.track;

        const pointerDown = (e) => {
        /* Ignore right-clicks etc. */
        if (e.button && e.button !== 0) return;

        this.handleUserInteraction();   // stop auto-scroll
        isDragging = true;
        track.classList.add('dragging');

        startX     = e.clientX ?? e.touches?.[0].clientX;
        prevOffset = -(this.currentIndex * this.slideAmount);
        };

        const pointerMove = (e) => {
        if (!isDragging) return;
        const x = e.clientX ?? e.touches?.[0].clientX;
        const dx = x - startX;
        liveOffset = prevOffset + dx;
        /* Optional clamp so you can’t drag way past the ends: */
        const maxOffset = 0;
        const minOffset = -((this.totalCards - this.cardsPerView) * this.slideAmount);
        track.style.transform = `translateX(${Math.max(minOffset, Math.min(maxOffset, liveOffset))}px)`;
        };

        const pointerUp = () => {
        if (!isDragging) return;
        isDragging = false;
        track.classList.remove('dragging');

        const movedBy = liveOffset - prevOffset;
        const threshold = 50;   // px before we advance a card

        if (movedBy < -threshold) {
            this.moveToNextCard();  // swipe left → next
        } else if (movedBy > threshold) {
            this.moveToPrevCard();  // swipe right → prev
        } else {
            this.updateCardPositions();   // snap back
        }
        };

        /* Pointer Events cover desktop + mobile (Safari 13.4+). */
        track.addEventListener('pointerdown', pointerDown);
        track.addEventListener('pointermove', pointerMove);
        window.addEventListener('pointerup',   pointerUp);
        window.addEventListener('pointercancel', pointerUp);
    }
  /* ---------- end of drag helpers ---------- */


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
            this.cardsPerView = 2;
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
            this.cardWidth = Math.max(260, containerWidth);
            this.slideAmount = this.cardWidth + gap;
        } else if (this.cardsPerView === 2) {
            // For tablet view
            this.cardWidth = Math.max(260, (containerWidth - (gap * (this.cardsPerView - 1))) / this.cardsPerView);
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