// Young City Academy — mobile nav + team accordion

document.addEventListener('DOMContentLoaded', function () {

    // Mobile menu toggle
    var menuToggle = document.querySelector('.menu-toggle');
    var navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function () {
            var isOpen = navLinks.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Close menu after tapping a link (useful on mobile)
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Team category accordion
    var accordionButtons = document.querySelectorAll('.team-accordion-button');

    accordionButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            var parent = button.closest('.team-accordion');
            var isActive = parent.classList.contains('active');

            // Close any other open accordion
            document.querySelectorAll('.team-accordion.active').forEach(function (el) {
                if (el !== parent) {
                    el.classList.remove('active');
                    el.querySelector('.team-accordion-button').setAttribute('aria-expanded', 'false');
                }
            });

            parent.classList.toggle('active', !isActive);
            button.setAttribute('aria-expanded', isActive ? 'false' : 'true');
        });
    });

});
