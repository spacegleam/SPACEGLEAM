document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');

    const isLocalSimpleServer = (
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
        window.location.port !== '8888'
    );

    if (isLocalSimpleServer) {
        document.querySelectorAll('a[href^="/"]').forEach((link) => {
            const href = link.getAttribute('href');
            if (href === '/blog' || href.startsWith('/blog#') || href.startsWith('/blog?')) {
                link.setAttribute('href', href.replace('/blog', '/blog/'));
            }
        });
    }

    let headerFrame = 0;
    let lastHeaderScrolled = null;
    const updateHeader = () => {
        headerFrame = 0;
        const headerScrolled = window.scrollY > 12;
        if (header && headerScrolled !== lastHeaderScrolled) {
            header.classList.toggle('is-scrolled', headerScrolled);
            lastHeaderScrolled = headerScrolled;
        }
    };
    const requestHeaderUpdate = () => {
        if (headerFrame) return;
        headerFrame = window.requestAnimationFrame(updateHeader);
    };

    updateHeader();
    window.addEventListener('scroll', requestHeaderUpdate, { passive: true });

    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('is-open');
            navToggle.classList.toggle('is-open', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
            document.body.classList.toggle('nav-open', isOpen);
        });
    }

    const prefetchedMenuPages = new Set();
    const warmMenuDestination = (target) => {
        const link = target?.closest?.('.nav a[href]');
        if (!link || link.target === '_blank') return;
        let url;
        try { url = new URL(link.href, window.location.href); } catch (_) { return; }
        if (url.origin !== window.location.origin || url.href === window.location.href || prefetchedMenuPages.has(url.href)) return;
        prefetchedMenuPages.add(url.href);
        fetch(url.href, { credentials: 'same-origin', cache: 'force-cache', priority: 'low' }).catch(() => {});
    };
    nav?.addEventListener('pointerover', (event) => warmMenuDestination(event.target), { passive: true });
    nav?.addEventListener('focusin', (event) => warmMenuDestination(event.target), { passive: true });
    nav?.addEventListener('touchstart', (event) => warmMenuDestination(event.target), { passive: true });
    nav?.addEventListener('pointerdown', (event) => {
        const link = event.target.closest('.nav a[href]');
        if (link) link.classList.add('is-activating');
    }, { passive: true });
    window.addEventListener('load', () => {
        const warmAllMenuPages = () => {
            nav?.querySelectorAll('a[href]').forEach((link, index) => {
                setTimeout(() => warmMenuDestination(link), index * 120);
            });
        };
        if ('requestIdleCallback' in window) requestIdleCallback(warmAllMenuPages, { timeout: 2200 });
        else setTimeout(warmAllMenuPages, 800);
    }, { once: true });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            nav?.classList.remove('is-open');
            navToggle?.classList.remove('is-open');
            navToggle?.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('nav-open');
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px 80px 0px', threshold: 0.01 });
        revealElements.forEach((element) => observer.observe(element));
    } else {
        revealElements.forEach((element) => element.classList.add('is-visible'));
    }

});
