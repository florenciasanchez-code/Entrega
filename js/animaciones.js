(() => {
    'use strict';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nav = document.querySelector('.nav');

    // Navegación más compacta al desplazarse.
    const updateNav = () => {
        if (nav) nav.classList.toggle('nav--scroll', window.scrollY > 45);
    };
    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });

    // Define qué elementos aparecen al entrar en pantalla.
    const animationGroups = [
        { selector: '.intro-text, .title, .compra-header, .checkout-intro, .ordenes-header, .merch-section > *, .world-tour-header, footer > *', className: 'reveal' },
        { selector: '.grid-item, .info-card, .producto-card, .tour-fila, .orden-card, .dato-item, .faq-item, .data li', className: 'reveal' },
        { selector: '.home-shop-text, .text-block, .contacto-col:first-child', className: 'reveal-left' },
        { selector: '.home-shop-panel, .llegar-img-wrap, .contacto-col:last-child', className: 'reveal-right' },
        { selector: '.fw-image, .map-full, .carrito-layout, .checkout-shell, .ordenes-dashboard', className: 'reveal-scale' }
    ];

    const elements = [];
    animationGroups.forEach(({ selector, className }) => {
        document.querySelectorAll(selector).forEach((element) => {
            if (!element.classList.contains('reveal') &&
                !element.classList.contains('reveal-left') &&
                !element.classList.contains('reveal-right') &&
                !element.classList.contains('reveal-scale')) {
                element.classList.add(className);
                elements.push(element);
            }
        });
    });

    // Delay escalonado dentro de grupos repetidos.
    const staggerGroups = [
        '.grid-home .grid-item',
        '.info-cards .info-card',
        '.productos-grid .producto-card',
        '.tour-grid .tour-fila',
        '.ordenes-dashboard .orden-card',
        '.faq-acordeon .faq-item',
        '.data li',
        'footer > *'
    ];

    staggerGroups.forEach((selector) => {
        document.querySelectorAll(selector).forEach((element, index) => {
            element.style.setProperty('--reveal-delay', `${Math.min(index * 75, 450)}ms`);
        });
    });

    if (reducedMotion || !('IntersectionObserver' in window)) {
        elements.forEach((element) => element.classList.add('is-visible'));
    } else {
        const observer = new IntersectionObserver((entries, currentObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    currentObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -45px 0px'
        });

        elements.forEach((element) => observer.observe(element));
    }

    // Parallax muy leve en imágenes grandes; no altera la composición.
    const parallaxImages = document.querySelectorAll('.fw-image img, .llegar-img');
    if (!reducedMotion && parallaxImages.length) {
        let ticking = false;

        const updateParallax = () => {
            parallaxImages.forEach((image) => {
                const parent = image.parentElement;
                if (!parent) return;
                const rect = parent.getBoundingClientRect();
                if (rect.bottom < 0 || rect.top > window.innerHeight) return;

                const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                const movement = (progress - 0.5) * 18;
                image.style.transform = `scale(1.035) translateY(${movement}px)`;
            });
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });

        updateParallax();
    }
})();
