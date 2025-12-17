'use strict';

import DSComponent from "../../base/component/component";

/**
 * Mobile menu component
 *
 * @class MobileMenu
 * @extends DSComponent
 * @property {HTMLElement} mobileMenu - the mobile menu element
 * @property {HTMLButtonElement} newMenuButton - the new mobile menu button
 */
class MobileMenu extends DSComponent {
    private mobileMenu: HTMLElement;
    private newMenuButton: HTMLButtonElement;

    /**
     * Creates a mobile menu component
     *
     * @param {HTMLElement} mobileMenu - the mobile menu element
     */
    constructor(mobileMenu: HTMLElement) {
        super(mobileMenu);

        this.mobileMenu = mobileMenu;
    }

    /**
     * Set up the mobile menu if one has been provided to the constructor
     *
     * @returns {void}
     */
    init(): void {
        if (this.mobileMenu) {
            this.setupMobileNavigation();
            this.isInitialised = true;
        }
    }

    /**
     * Perform DOM transformation on the mobile nav
     * - add aria attributes to new markup
     * - add event listener to new markup
     *
     * @returns {void}
     */
    private setupMobileNavigation(): void {
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

    /**
     * Open the site nav menu
     *
     * @returns {void}
     */
    private openMenu(): void {
        this.mobileMenu.classList.add('ds_site-navigation--open');
        this.newMenuButton.classList.add('ds_site-header__control--active');
        this.newMenuButton.setAttribute('aria-expanded', true.toString());
    }

    /**
     * Close the site nav menu
     *
     * @returns {void}
     */
    private closeMenu(): void {
        this.mobileMenu.classList.remove('ds_site-navigation--open');
        this.newMenuButton.classList.remove('ds_site-header__control--active');
        this.newMenuButton.setAttribute('aria-expanded', false.toString());
    }
}

export default MobileMenu;
