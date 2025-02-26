// Aguarda o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    // Menu mobile e header
    const header = document.querySelector('.header');
    const menuButton = document.createElement('button');
    menuButton.classList.add('menu-toggle');
    menuButton.innerHTML = '<i class="fas fa-bars"></i>';
    header.querySelector('.container').appendChild(menuButton);

    menuButton.addEventListener('click', () => {
        header.classList.toggle('menu-open');
    });

    // Controle de exibição do header no scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
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

    // Animação dos números nas estatísticas
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Animar estatísticas quando visíveis
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statsElements = document.querySelectorAll('.stat-item h3');
                statsElements.forEach(stat => {
                    const value = parseInt(stat.textContent);
                    animateValue(stat, 0, value, 2000);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.results-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Efeito parallax nos elementos flutuantes
    const floatingElements = document.querySelectorAll('.floating-element');
    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        floatingElements.forEach(element => {
            const moveX = (clientX - centerX) / 50;
            const moveY = (clientY - centerY) / 50;
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });

    // FAQ Toggle com animação suave
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Fecha todos os itens com animação
            faqItems.forEach(faqItem => {
                const answer = faqItem.querySelector('.faq-answer');
                if (faqItem.classList.contains('active')) {
                    answer.style.maxHeight = '0px';
                    setTimeout(() => {
                        faqItem.classList.remove('active');
                    }, 300);
                }
            });

            // Abre o item clicado com animação
            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // Animação dos cards de benefícios
    const benefitCards = document.querySelectorAll('.benefit-card');
    benefitCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.querySelector('i').classList.add('animate-bounce');
        });

        card.addEventListener('mouseleave', () => {
            card.querySelector('i').classList.remove('animate-bounce');
        });
    });

    // Efeito de hover nos botões CTA
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.classList.add('animate-pulse');
        });

        button.addEventListener('mouseleave', () => {
            button.classList.remove('animate-pulse');
        });

        // Scroll suave para a seção de planos ao clicar
        button.addEventListener('click', () => {
            const plansSection = document.querySelector('#planos');
            if (plansSection) {
                plansSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animação de entrada dos elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elementos para animar
    const animateElements = document.querySelectorAll(
        '.benefit-card, .pricing-card, .before-after-card, .faq-item, .hero-content'
    );

    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Fecha o menu mobile se estiver aberto
                header.classList.remove('menu-open');
            }
        });
    });

    // Adiciona classe para indicar que o JavaScript está carregado
    document.body.classList.add('js-loaded');

    // Timer de urgência nos planos
    function updateTimer() {
        const now = new Date();
        const end = new Date();
        end.setHours(23, 59, 59);

        const diff = end - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.querySelectorAll('.timer').forEach(timer => {
            timer.innerHTML = `Oferta expira em: ${hours}h ${minutes}m ${seconds}s`;
        });
    }

    setInterval(updateTimer, 1000);
    updateTimer();
}); 