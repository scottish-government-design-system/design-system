'use strict';

import DSComponent from '../../base/component/component';
import elementIdModifier from '../../base/tools/id-modifier/id-modifier';

/**
 * Side navigation component
 *
 * @class SideNavigation
 * @extends DSComponent
 * @property {HTMLElement} navList - the side navigation list element
 * @property {HTMLElement} sideNavigation - the side navigation element
 */
class SideNavigation extends DSComponent {
    private navList: HTMLElement;
    private sideNavigation: HTMLElement;

    /**
     * Creates a side navigation component
     *
     * @param {HTMLElement} sideNavigation - the side navigation element
     */
    constructor(sideNavigation: HTMLElement) {
        super(sideNavigation);
        this.sideNavigation = sideNavigation;
    }

    /**
     * Set up the side nav if one has been provided to the constructor
     *
     * @returns {void}
     */
    init(): void {
        if (this.sideNavigation && !this.isInitialised) {
            this.setupSideNavigation();
            this.isInitialised = true;
        }
    }

    /**
     * Perform DOM transformation on the side nav
     * - add aria attributes to new markup
     * - add event listener to new markup
     *
     * @returns {void}
     */
    private setupSideNavigation(): void {
        // transform markup to button-driven version
        const navControl: HTMLInputElement = this.sideNavigation.querySelector('.js-toggle-side-navigation');
        const navLabel: HTMLElement = this.sideNavigation.querySelector('.ds_side-navigation__expand');
        this.navList = this.sideNavigation.querySelector('.ds_side-navigation__list');
        this.navList.id = this.navList.id || `side-navigation-${elementIdModifier()}`;

        navControl.checked = false;

        const navButton = document.createElement('button');
        navButton.classList.add('ds_side-navigation__expand');
        navButton.classList.add('ds_link');
        navButton.classList.add('js-side-navigation-button');
        navButton.setAttribute('aria-expanded', false.toString());
        navButton.innerHTML = navLabel.innerHTML;
        navButton.setAttribute('aria-expanded', false.toString());
        navButton.setAttribute('aria-controls', this.navList.id);

        navLabel.classList.add('fully-hidden');
        navControl.classList.add('fully-hidden');
        navControl.classList.remove('visually-hidden');

        this.sideNavigation.insertBefore(navButton, this.navList);

        navButton.setAttribute('aria-controls', this.navList.id);

        // events
        navButton.addEventListener('click', () => {
            const isOpen = navControl.checked;

            navButton.setAttribute('aria-expanded', (!isOpen).toString());
            navControl.checked = !isOpen;
        });

        window.addEventListener('scroll', () => {
            if (navButton.offsetTop >= 1) {
                navButton.classList.add('ds_side-navigation__expand--shadow');
            } else {
                navButton.classList.remove('ds_side-navigation__expand--shadow');
            }
        });
    }
}

export default SideNavigation;
