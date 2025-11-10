'use strict';

import DSComponent from "../../base/component/component";

class MobileMenu extends DSComponent {
    private mobileMenu: HTMLElement;
    private newMenuButton: HTMLButtonElement;

    constructor(mobileMenu: HTMLElement) {
        super(mobileMenu);

        this.mobileMenu = mobileMenu;
    }

    init() {
        this.setupMobileNavigation();
    }

    private setupMobileNavigation() {
        // dom transform:
        const oldMenuButton = document.querySelector('.js-toggle-menu');
        const newMenuButton = document.createElement('button');
        newMenuButton.innerHTML = oldMenuButton.innerHTML;
        newMenuButton.setAttribute('class', oldMenuButton.getAttribute('class'));
        newMenuButton.classList.add('ds_link');
        newMenuButton.setAttribute('aria-controls', oldMenuButton.getAttribute('aria-controls'));
        newMenuButton.setAttribute('aria-expanded', false.toString());
        oldMenuButton.parentNode.appendChild(newMenuButton);
        oldMenuButton.classList.add('fully-hidden');

        // events
        newMenuButton.addEventListener('click', (event) => {
            event.preventDefault();

            this.mobileMenu = document.getElementById(newMenuButton.getAttribute('aria-controls'));

            if (this.mobileMenu.classList.contains('ds_site-navigation--open')) {
                this.closeMenu();
            } else {
                this.openMenu();
            }
        });

        this.newMenuButton = newMenuButton;
    }

    private openMenu() {
        this.mobileMenu.classList.add('ds_site-navigation--open');
        this.newMenuButton.classList.add('ds_site-header__control--active');
        this.newMenuButton.setAttribute('aria-expanded', true.toString());
    }

    private closeMenu() {
        this.mobileMenu.classList.remove('ds_site-navigation--open');
        this.newMenuButton.classList.remove('ds_site-header__control--active');
        this.newMenuButton.setAttribute('aria-expanded', false.toString());
    }
}

export default MobileMenu;
