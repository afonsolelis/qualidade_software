class PresentationController {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 22;
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.slideListBtn = document.getElementById('slide-list-btn');
        this.slideList = document.getElementById('slide-list');
        this.currentSlideElement = document.getElementById('current-slide');
        this.totalSlidesElement = document.getElementById('total-slides');
        this.progressFill = document.querySelector('.progress-fill');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.generateSlideList();
        this.updateSlideDisplay();
        this.updateProgress();
        this.updateNavButtons();
    }
    
    setupEventListeners() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Slide list toggle
        this.slideListBtn.addEventListener('click', () => this.toggleSlideList());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Close slide list when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.slideList.contains(e.target) && !this.slideListBtn.contains(e.target)) {
                this.hideSlideList();
            }
        });
        
        // Prevent slide list from closing when clicking inside it
        this.slideList.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    generateSlideList() {
        const slideNames = [
            'Título',
            'Objetivos de Aprendizagem',
            'Fundamentação Teórica - ISO/IEC 25010',
            'Oito Características de Qualidade',
            'Adequação Funcional',
            'Eficiência de Desempenho',
            'Compatibilidade',
            'Usabilidade',
            'Confiabilidade',
            'Segurança',
            'Manutenibilidade',
            'Portabilidade',
            'Processos de Garantia de Qualidade',
            'Métricas de Qualidade',
            'Ferramentas de Qualidade',
            'Metodologias',
            'Clean Code e Boas Práticas',
            'DevOps e Qualidade',
            'Ciclo de Vida e Qualidade',
            'Atividades Práticas',
            'Conclusões',
            'Referências'
        ];
        
        this.slideList.innerHTML = '';
        
        slideNames.forEach((name, index) => {
            const slideNumber = index + 1;
            const listItem = document.createElement('button');
            listItem.className = 'slide-list-item';
            listItem.textContent = `${slideNumber}. ${name}`;
            listItem.addEventListener('click', () => {
                this.goToSlide(slideNumber);
                this.hideSlideList();
            });
            
            if (slideNumber === this.currentSlide) {
                listItem.classList.add('active');
            }
            
            this.slideList.appendChild(listItem);
        });
    }
    
    updateSlideDisplay() {
        // Hide all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Show current slide
        const currentSlideElement = document.querySelector(`[data-slide="${this.currentSlide}"]`);
        if (currentSlideElement) {
            currentSlideElement.classList.add('active');
        }
        
        // Update slide counter
        this.currentSlideElement.textContent = this.currentSlide;
        this.totalSlidesElement.textContent = this.totalSlides;
        
        // Update slide list active state
        const slideListItems = this.slideList.querySelectorAll('.slide-list-item');
        slideListItems.forEach((item, index) => {
            item.classList.toggle('active', index + 1 === this.currentSlide);
        });
    }
    
    updateProgress() {
        const progressPercent = (this.currentSlide / this.totalSlides) * 100;
        this.progressFill.style.width = `${progressPercent}%`;
    }
    
    updateNavButtons() {
        this.prevBtn.disabled = this.currentSlide === 1;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides;
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.currentSlide++;
            this.updateSlideDisplay();
            this.updateProgress();
            this.updateNavButtons();
            this.animateSlideTransition('next');
        }
    }
    
    previousSlide() {
        if (this.currentSlide > 1) {
            this.currentSlide--;
            this.updateSlideDisplay();
            this.updateProgress();
            this.updateNavButtons();
            this.animateSlideTransition('prev');
        }
    }
    
    goToSlide(slideNumber) {
        if (slideNumber >= 1 && slideNumber <= this.totalSlides && slideNumber !== this.currentSlide) {
            const direction = slideNumber > this.currentSlide ? 'next' : 'prev';
            this.currentSlide = slideNumber;
            this.updateSlideDisplay();
            this.updateProgress();
            this.updateNavButtons();
            this.animateSlideTransition(direction);
        }
    }
    
    animateSlideTransition(direction) {
        const currentSlideElement = document.querySelector(`[data-slide="${this.currentSlide}"]`);
        if (currentSlideElement) {
            // Remove any existing animation classes
            currentSlideElement.classList.remove('slide-enter-left', 'slide-enter-right');
            
            // Add appropriate animation class
            if (direction === 'next') {
                currentSlideElement.classList.add('slide-enter-right');
            } else {
                currentSlideElement.classList.add('slide-enter-left');
            }
            
            // Remove animation class after animation completes
            setTimeout(() => {
                currentSlideElement.classList.remove('slide-enter-left', 'slide-enter-right');
            }, 400);
        }
    }
    
    toggleSlideList() {
        if (this.slideList.classList.contains('hidden')) {
            this.showSlideList();
        } else {
            this.hideSlideList();
        }
    }
    
    showSlideList() {
        this.slideList.classList.remove('hidden');
        this.slideListBtn.setAttribute('aria-expanded', 'true');
        
        // Focus on current slide in list
        const activeSlideItem = this.slideList.querySelector('.slide-list-item.active');
        if (activeSlideItem) {
            activeSlideItem.scrollIntoView({ block: 'nearest' });
        }
    }
    
    hideSlideList() {
        this.slideList.classList.add('hidden');
        this.slideListBtn.setAttribute('aria-expanded', 'false');
    }
    
    handleKeydown(e) {
        // Don't handle keydown if user is typing in an input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch (e.key) {
            case 'ArrowRight':
            case ' ':
            case 'PageDown':
                e.preventDefault();
                this.nextSlide();
                break;
                
            case 'ArrowLeft':
            case 'PageUp':
                e.preventDefault();
                this.previousSlide();
                break;
                
            case 'Home':
                e.preventDefault();
                this.goToSlide(1);
                break;
                
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
                
            case 'Escape':
                e.preventDefault();
                this.hideSlideList();
                break;
                
            default:
                // Handle number keys for direct slide navigation
                if (e.key >= '1' && e.key <= '9') {
                    const slideNumber = parseInt(e.key);
                    if (slideNumber <= this.totalSlides) {
                        e.preventDefault();
                        this.goToSlide(slideNumber);
                    }
                }
                break;
        }
    }
    
    // Method to handle touch gestures for mobile devices
    setupTouchGestures() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Only handle horizontal swipes that are more horizontal than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    // Swipe right - go to previous slide
                    this.previousSlide();
                } else {
                    // Swipe left - go to next slide
                    this.nextSlide();
                }
            }
        });
    }
    
    // Method to handle fullscreen mode
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
}

// Utility functions
function formatSlideContent() {
    // Add fade-in animation to slide content elements
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        const content = slide.querySelector('.slide-content');
        if (content) {
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px)';
            content.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
    });
}

function animateSlideContent() {
    const activeSlide = document.querySelector('.slide.active');
    if (activeSlide) {
        const content = activeSlide.querySelector('.slide-content');
        if (content) {
            setTimeout(() => {
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }, 100);
        }
    }
}

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const presentation = new PresentationController();
    
    // Setup touch gestures for mobile
    presentation.setupTouchGestures();
    
    // Format slide content
    formatSlideContent();
    
    // Animate initial slide content
    setTimeout(() => {
        animateSlideContent();
    }, 100);
    
    // Add fullscreen toggle on F11
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F11') {
            e.preventDefault();
            presentation.toggleFullscreen();
        }
    });
    
    // Re-animate content when slide changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && 
                mutation.attributeName === 'class' && 
                mutation.target.classList.contains('active')) {
                animateSlideContent();
            }
        });
    });
    
    // Observe all slides for class changes
    document.querySelectorAll('.slide').forEach(slide => {
        observer.observe(slide, { attributes: true });
    });
    
    // Add keyboard shortcut help
    console.log(`
🎯 Princípios da Qualidade de Software - Atalhos de Teclado:
    
📍 Navegação:
    → ou Espaço: Próximo slide
    ← ou Page Up: Slide anterior
    Home: Primeiro slide
    End: Último slide
    1-9: Ir para slide específico
    
🔧 Controles:
    Esc: Fechar lista de slides
    F11: Modo tela cheia
    
📱 Mobile:
    Deslize para esquerda/direita para navegar
    `);
});

// Add CSS for slide transitions
const additionalStyles = `
.slide-enter-left {
    animation: slideInLeft 0.4s ease;
}

.slide-enter-right {
    animation: slideInRight 0.4s ease;
}

@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* Smooth scrolling for slide list */
.slide-list {
    scroll-behavior: smooth;
}

/* Enhanced focus styles for accessibility */
.nav-btn:focus,
.slide-list-item:focus {
    outline: 2px solid #93c5fd;
    outline-offset: 2px;
}

/* Loading state for slides */
.slide-content.loading {
    opacity: 0.5;
    pointer-events: none;
}

/* Print styles */
@media print {
    .presentation-header,
    .presentation-nav {
        display: none !important;
    }
    
    .slide {
        display: block !important;
        opacity: 1 !important;
        transform: none !important;
        page-break-after: always;
        min-height: auto;
        padding: 2rem;
    }
    
    .slide-content {
        min-height: auto;
    }
    
    body {
        background: white !important;
        color: black !important;
    }
    
    .slide-title,
    .slide-subtitle,
    h1, h2, h3, h4, h5, h6 {
        color: black !important;
    }
    
    .characteristic-card,
    .objective-item,
    .process-item,
    .metric-card,
    .tool-card,
    .methodology-card,
    .phase-item,
    .activity-item,
    .conclusion-item {
        background: #f8f9fa !important;
        border: 1px solid #dee2e6 !important;
        color: black !important;
    }
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Accessibility improvements
function enhanceAccessibility() {
    // Add ARIA labels
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        slide.setAttribute('role', 'tabpanel');
        slide.setAttribute('aria-label', `Slide ${index + 1} of ${slides.length}`);
    });
    
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Pular para o conteúdo principal';
    skipLink.className = 'sr-only';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 100;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main landmark
    const slidesContainer = document.querySelector('.slides-container');
    if (slidesContainer) {
        slidesContainer.setAttribute('role', 'main');
        slidesContainer.setAttribute('id', 'main-content');
    }
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', enhanceAccessibility);

// Performance optimization
function optimizePerformance() {
    // Lazy load slide content
    const slides = document.querySelectorAll('.slide:not(.active)');
    slides.forEach(slide => {
        slide.style.visibility = 'hidden';
    });
    
    // Show active slide
    const activeSlide = document.querySelector('.slide.active');
    if (activeSlide) {
        activeSlide.style.visibility = 'visible';
    }
    
    // Update visibility when slides change
    const slideObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const slide = mutation.target;
                if (slide.classList.contains('active')) {
                    slide.style.visibility = 'visible';
                } else {
                    slide.style.visibility = 'hidden';
                }
            }
        });
    });
    
    document.querySelectorAll('.slide').forEach(slide => {
        slideObserver.observe(slide, { attributes: true });
    });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', optimizePerformance);