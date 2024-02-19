/* global document */

'use strict';

class MobileMenu {
    constructor (mobileMenu) {
        this.mobileMenu = mobileMenu;
    }

    init() {
        // detect support for CSS custom properties
        if (window.CSS && CSS.supports('color', 'var(--primary)')) {
            if (this.mobileMenu) {
                this.setupMobileNavigation();
            }
        }
    }

    setupMobileNavigation() {
        // dom transform:
        const oldMenuButton = document.querySelector('.js-toggle-menu');
        const newMenuButton = document.createElement('button');
        newMenuButton.innerHTML = oldMenuButton.innerHTML;
        newMenuButton.setAttribute('class', oldMenuButton.getAttribute('class'));
        newMenuButton.classList.add('ds_link');
        newMenuButton.setAttribute('aria-controls', oldMenuButton.getAttribute('aria-controls'));
        newMenuButton.setAttribute('aria-expanded', false);
        oldMenuButton.parentNode.appendChild(newMenuButton);
        oldMenuButton.classList.add('fully-hidden');

        // events
        newMenuButton.addEventListener('click', (event) => {
            event.preventDefault();

            this.mobileMenu = document.getElementById(newMenuButton.getAttribute('aria-controls'));

            document.documentElement.style.setProperty('--ds-mobile-menu-height', this.mobileMenu.scrollHeight + 'px');

            if (this.mobileMenu.classList.contains('ds_site-navigation--open')) {
                this.closeMenu();
            } else {
                this.openMenu();
            }
        });

        this.newMenuButton = newMenuButton;
    }

    openMenu() {
        this.mobileMenu.classList.add('ds_site-navigation--open');
        this.newMenuButton.classList.add('ds_site-header__control--active');
        this.newMenuButton.setAttribute('aria-expanded', true);
    }

    closeMenu() {
        this.mobileMenu.classList.remove('ds_site-navigation--open');
        this.newMenuButton.classList.remove('ds_site-header__control--active');
        this.newMenuButton.setAttribute('aria-expanded', false);
    }
}

export default MobileMenu;
