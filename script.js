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
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Fecha todas as respostas
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
                const otherAnswer = faqItem.querySelector('.faq-answer');
                otherAnswer.style.maxHeight = null;
            });
            
            // Abre a resposta clicada se não estava aberta
            if (!isOpen) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
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

    // Animação do raio flutuante
    const lightning = document.createElement('div');
    lightning.className = 'floating-lightning';
    
    // Usa a nova imagem do logo
    const img = document.createElement('img');
    // Tenta diferentes caminhos possíveis para a imagem
    const possiblePaths = [
        './assets/images/LogoTransp.png',
        './assets/LogoTransp.png',
        '/assets/images/LogoTransp.png',
        '/assets/LogoTransp.png',
        'LogoTransp.png'
    ];

    // Função para verificar se a imagem existe
    const checkImage = (path) => {
        return new Promise((resolve) => {
            const tempImg = new Image();
            tempImg.onload = () => resolve(true);
            tempImg.onerror = () => resolve(false);
            tempImg.src = path;
        });
    };

    // Tenta carregar a imagem de diferentes caminhos
    Promise.all(possiblePaths.map(path => checkImage(path)))
        .then(results => {
            const validPath = possiblePaths[results.findIndex(result => result)];
            if (validPath) {
                img.src = validPath;
            } else {
                console.log('Não foi possível encontrar a imagem do raio');
            }
        });

    img.alt = 'Logo Raio';
    lightning.appendChild(img);
    lightning.style.cursor = 'grab';
    lightning.classList.remove('active'); // Começa invisível

    document.body.appendChild(lightning);

    // Variáveis para controle de arrasto
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    let isInPlanosSection = false;

    // Função para iniciar o arrasto
    const dragStart = (e) => {
        if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }

        if (e.target === lightning || lightning.contains(e.target)) {
            isDragging = true;
            lightning.style.cursor = 'grabbing';
        }
    };

    // Função para arrastar
    const drag = (e) => {
        if (isDragging) {
            e.preventDefault();

            if (e.type === "touchmove") {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, lightning);
        }
    };

    // Função para finalizar o arrasto
    const dragEnd = () => {
        if (isDragging) {
            isDragging = false;
            lightning.style.cursor = 'grab';
        }
    };

    // Função para definir a posição do elemento
    const setTranslate = (xPos, yPos, el) => {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    };

    // Adiciona os eventos de arrasto
    lightning.addEventListener('touchstart', dragStart, false);
    lightning.addEventListener('mousedown', dragStart, false);
    document.addEventListener('touchmove', drag, false);
    document.addEventListener('mousemove', drag, false);
    document.addEventListener('touchend', dragEnd, false);
    document.addEventListener('mouseup', dragEnd, false);

    // Adiciona evento de clique para flash
    lightning.addEventListener('click', (e) => {
        if (!isDragging) {
            // Toca o som do trovão
            thunderSound.play().catch(error => {
                console.log('Erro ao tocar som:', error);
            });

            // Adiciona efeito de flash na tela inteira com flash mais intenso
            const flashOverlay = document.createElement('div');
            flashOverlay.style.position = 'fixed';
            flashOverlay.style.top = '0';
            flashOverlay.style.left = '0';
            flashOverlay.style.width = '100%';
            flashOverlay.style.height = '100%';
            flashOverlay.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            flashOverlay.style.zIndex = '9998';
            flashOverlay.style.pointerEvents = 'none';
            flashOverlay.style.transition = 'opacity 0.15s ease-out';
            document.body.appendChild(flashOverlay);

            // Salva a posição atual antes do flash
            const currentTransform = lightning.style.transform;

            // Adiciona múltiplos flashes rápidos
            lightning.classList.add('flash');
            lightning.style.filter = 'brightness(1.5) contrast(1.2)';

            // Sequência de flashes mantendo a posição
            setTimeout(() => {
                flashOverlay.style.opacity = '0';
                lightning.style.filter = 'brightness(2) contrast(1.5)';
                lightning.style.transform = currentTransform; // Mantém a posição
            }, 50);

            setTimeout(() => {
                flashOverlay.style.opacity = '0.9';
                lightning.style.filter = 'brightness(1.8) contrast(1.3)';
                lightning.style.transform = currentTransform; // Mantém a posição
            }, 100);

            setTimeout(() => {
                flashOverlay.style.opacity = '0';
                lightning.style.filter = '';
                lightning.style.transform = currentTransform; // Mantém a posição
            }, 150);

            // Remove o flash após a animação
            setTimeout(() => {
                flashOverlay.remove();
                lightning.classList.remove('flash');
                lightning.style.transform = currentTransform; // Mantém a posição final
            }, 300);
        }
    });

    let lastScrollTop = 0;
    let isAnimating = false;
    let timeoutId = null;
    const thunderSound = new Audio('./assets/thunder.mp3');
    thunderSound.volume = 0.3;

    // Função para calcular a posição final do raio
    const calculateFinalPosition = (planosSection) => {
        const planosSectionRect = planosSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        return planosSectionRect.top + (planosSectionRect.height * 0.2); // 20% da altura da seção
    };

    // Função para remover a animação
    const removeLightningAnimation = () => {
        // Primeiro remove apenas o flash
        lightning.classList.remove('flash');
        
        // Inicia a animação de subida imediatamente
        lightning.style.animation = 'lightningRiseUp 1s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        
        // Remove a classe active quando a animação de subida terminar
        setTimeout(() => {
            lightning.classList.remove('active');
            isAnimating = false;
            lightning.style.animation = '';
        }, 1000);
    };

    // Função para atualizar a classe do lightning baseado na posição
    function updateLightningClass(scrollTop) {
        const trimestralCard = document.querySelector('.pricing-card:nth-child(1)');
        const semestralCard = document.querySelector('.pricing-card:nth-child(2)');
        const anualCard = document.querySelector('.pricing-card:nth-child(3)');
        const lightning = document.querySelector('.floating-lightning');

        if (!trimestralCard || !semestralCard || !anualCard || !lightning) return;

        const trimestralRect = trimestralCard.getBoundingClientRect();
        const semestralRect = semestralCard.getBoundingClientRect();
        const anualRect = anualCard.getBoundingClientRect();
        const viewportMiddle = window.innerHeight / 2;

        // Remove todas as classes de plano
        lightning.classList.remove('trimestral', 'semestral', 'anual');

        // Adiciona a classe apropriada baseado na posição
        if (trimestralRect.top <= viewportMiddle && trimestralRect.bottom >= viewportMiddle) {
            lightning.classList.add('trimestral');
        } else if (semestralRect.top <= viewportMiddle && semestralRect.bottom >= viewportMiddle) {
            lightning.classList.add('semestral');
        } else if (anualRect.top <= viewportMiddle && anualRect.bottom >= viewportMiddle) {
            lightning.classList.add('anual');
        }
    }

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const planosSection = document.getElementById('planos');
        
        if (!planosSection) return;
        
        const planosSectionTop = planosSection.offsetTop;
        const planosSectionBottom = planosSectionTop + planosSection.offsetHeight;
        const viewportMiddle = scrollTop + (window.innerHeight / 2);
        
        // Verifica se está dentro da seção de planos
        if (viewportMiddle >= planosSectionTop && 
            viewportMiddle <= planosSectionBottom) {
            
            if (!isInPlanosSection) {
                isInPlanosSection = true;
                lightning.classList.add('active');
                
                // Toca o som do trovão (com tratamento de erro)
                thunderSound.play().catch(error => {
                    console.log('Erro ao tocar som:', error);
                });

                // Atualiza a classe do lightning baseado na posição
                updateLightningClass(scrollTop);

                // Adiciona o efeito de flash após um pequeno delay
                setTimeout(() => {
                    lightning.classList.add('flash');
                }, 1000);
            } else {
                // Atualiza a classe mesmo quando já está na seção
                updateLightningClass(scrollTop);
            }
        } else {
            // Se saiu da seção de planos, remove a animação e esconde o raio
            if (isInPlanosSection) {
                isInPlanosSection = false;
                lightning.classList.remove('flash', 'trimestral', 'semestral', 'anual');
                
                // Inicia a animação de subida
                lightning.style.animation = 'lightningRiseUp 1s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                
                // Remove a classe active após a animação terminar
                setTimeout(() => {
                    lightning.classList.remove('active');
                    lightning.style.animation = '';
                }, 1000);
            }
        }

        lastScrollTop = scrollTop;
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