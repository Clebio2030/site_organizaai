// Aguarda o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    // Header elements
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');

    // Carousel elements
    const carousel = document.querySelector('.carousel');
    const carouselInner = carousel.querySelector('.carousel-inner');
    const carouselItems = carousel.querySelectorAll('.carousel-item');
    const prevButton = carousel.querySelector('.prev');
    const nextButton = carousel.querySelector('.next');
    const indicators = carousel.querySelectorAll('.indicator');

    let currentSlide = 0;

    // Carregamento otimizado de imagens do carrossel
    function initCarouselOptimization() {
        const carouselItems = document.querySelectorAll('.carousel-item img');
        const imageUrls = Array.from(carouselItems).map(img => img.src);
        
        // Preload das próximas imagens
        function preloadNextImages(currentIndex) {
            const nextIndex = (currentIndex + 1) % carouselItems.length;
            const nextNextIndex = (currentIndex + 2) % carouselItems.length;
            
            [nextIndex, nextNextIndex].forEach(index => {
                const img = new Image();
                img.src = imageUrls[index];
            });
        }

        // Lazy loading inicial
        carouselItems.forEach((img, index) => {
            if (index === 0) {
                img.src = imageUrls[0];
                preloadNextImages(0);
            } else {
                img.loading = 'lazy';
            }
        });

        return { preloadNextImages };
    }

    // Modificar a função showSlide para incluir preload
    function showSlide(index) {
        carouselItems.forEach(item => item.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        carouselItems[index].classList.add('active');
        indicators[index].classList.add('active');
        
        // Preload das próximas imagens
        carouselOptimization.preloadNextImages(index);
    }

    // Inicializar otimização do carrossel
    const carouselOptimization = initCarouselOptimization();

    function nextSlide() {
        currentSlide = (currentSlide + 1) % carouselItems.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + carouselItems.length) % carouselItems.length;
        showSlide(currentSlide);
    }

    // Initialize carousel
    if (carousel) {
        prevButton.addEventListener('click', prevSlide);
        nextButton.addEventListener('click', nextSlide);

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });

        // Auto-advance slides
        setInterval(nextSlide, 5000);
    }

    // Mobile menu functionality
    menuToggle.addEventListener('click', () => {
        header.classList.toggle('menu-open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!header.contains(e.target)) {
            header.classList.remove('menu-open');
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            header.classList.remove('menu-open');
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // FAQ accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't open
            if (!isOpen) {
                item.classList.add('active');
            }
        });
    });

    // Controle de exibição do header no scroll
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up', 'scroll-down');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Slider de comparação antes/depois
    initImageCompare();

    // Funcionalidade de tela cheia para o carrossel
    const modal = document.querySelector('.fullscreen-modal');
    const modalImg = modal.querySelector('img');
    const closeBtn = modal.querySelector('.fullscreen-close');
    const prevBtn = modal.querySelector('.fullscreen-prev');
    const nextBtn = modal.querySelector('.fullscreen-next');

    let currentFullscreenIndex = 0;

    // Abrir modal em tela cheia
    carousel.addEventListener('click', () => {
        const activeItem = document.querySelector('.carousel-item.active');
        const activeImg = activeItem.querySelector('img');
        currentFullscreenIndex = Array.from(carouselItems).indexOf(activeItem);
        
        modalImg.src = activeImg.src;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Fechar modal
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Navegação no modo tela cheia
    prevBtn.addEventListener('click', () => {
        currentFullscreenIndex = (currentFullscreenIndex - 1 + carouselItems.length) % carouselItems.length;
        const prevImg = carouselItems[currentFullscreenIndex].querySelector('img');
        modalImg.src = prevImg.src;
    });

    nextBtn.addEventListener('click', () => {
        currentFullscreenIndex = (currentFullscreenIndex + 1) % carouselItems.length;
        const nextImg = carouselItems[currentFullscreenIndex].querySelector('img');
        modalImg.src = nextImg.src;
    });

    // Fechar com tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Navegação com setas do teclado
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        }
    });
});

// Slider de comparação antes/depois
function initImageCompare() {
    const container = document.querySelector('.image-compare');
    if (!container) return;

    const beforeImage = container.querySelector('.before-image');
    const sliderHandle = container.querySelector('.slider-handle');
    let isResizing = false;

    function handleResize(e) {
        if (!isResizing) return;

        const containerRect = container.getBoundingClientRect();
        let position = (e.pageX - containerRect.left) / containerRect.width;

        position = Math.max(0, Math.min(1, position));
        beforeImage.style.width = `${position * 100}%`;
        sliderHandle.style.left = `${position * 100}%`;
    }

    sliderHandle.addEventListener('mousedown', () => {
        isResizing = true;
    });

    window.addEventListener('mousemove', handleResize);
    window.addEventListener('mouseup', () => {
        isResizing = false;
    });

    sliderHandle.addEventListener('touchstart', () => {
        isResizing = true;
    });

    window.addEventListener('touchmove', (e) => {
        if (!isResizing) return;
        const touch = e.touches[0];
        handleResize(touch);
    });

    window.addEventListener('touchend', () => {
        isResizing = false;
    });
} 