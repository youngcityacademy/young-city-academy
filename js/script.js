const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', String(!expanded));
        navLinks.classList.toggle('open');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('js-enabled');

    const revealElements = document.querySelectorAll(
        '.hero-content, .section-heading, .info-card, .team-card, .gallery-card, .contact-form, footer'
    );

    const observer = new IntersectionObserver(
        (entries, observerRef) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('appear');
                observerRef.unobserve(entry.target);
            });
        },
        {
            threshold: 0.15,
        }
    );

    revealElements.forEach((el, index) => {
        el.style.setProperty('--reveal-delay', `${index * 0.12}s`);
        observer.observe(el);
    });
});
