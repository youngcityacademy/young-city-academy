const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', String(!expanded));
        navLinks.classList.toggle('open');
    });
}

// Accordion functionality for match categories
const accordionButtons = document.querySelectorAll('.accordion-button');
accordionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        const content = document.getElementById(category);
        
        // Toggle active state
        button.classList.toggle('active');
        content.classList.toggle('active');
        
        // Close other accordions
        accordionButtons.forEach(otherButton => {
            if (otherButton !== button) {
                const otherCategory = otherButton.getAttribute('data-category');
                const otherContent = document.getElementById(otherCategory);
                otherButton.classList.remove('active');
                otherContent.classList.remove('active');
            }
        });
    });
});

// Accordion functionality for team categories
const teamAccordionButtons = document.querySelectorAll('.team-accordion-button');
teamAccordionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const team = button.getAttribute('data-team');
        const content = document.getElementById(team);
        
        // Toggle active state
        button.classList.toggle('active');
        content.classList.toggle('active');
        
        // Close other accordions
        teamAccordionButtons.forEach(otherButton => {
            if (otherButton !== button) {
                const otherTeam = otherButton.getAttribute('data-team');
                const otherContent = document.getElementById(otherTeam);
                otherButton.classList.remove('active');
                otherContent.classList.remove('active');
            }
        });
    });
});

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