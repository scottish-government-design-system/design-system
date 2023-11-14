/* global document, window */
import elementIdModifier from '../../base/tools/id-modifier/id-modifier';

'use strict';

class SideNavigation {
    constructor (sideNavigation) {
        this.sideNavigation = sideNavigation;
    }

    init() {
        // detect support for CSS custom properties
        if (window.CSS && CSS.supports('color', 'var(--primary)')) {
            if (this.sideNavigation && !this.sideNavigation.classList.contains('js-initialised')) {
                this.setupSideNavigation();
                this.sideNavigation.classList.add('js-initialised');
            }
        }
    }

    setupSideNavigation() {
        // transform markup to button-driven version
        const navControl = this.sideNavigation.querySelector('.js-toggle-side-navigation');
        const navLabel = this.sideNavigation.querySelector('.ds_side-navigation__expand');
        this.navList = this.sideNavigation.querySelector('.ds_side-navigation__list');
        this.navList.id = this.navList.id || `side-navigation-${elementIdModifier()}`;

        navControl.checked = false;

        const navButton = document.createElement('button');
        navButton.classList.add('ds_side-navigation__expand');
        navButton.classList.add('ds_link');
        navButton.classList.add('js-side-navigation-button');
        navButton.setAttribute('aria-expanded', false);
        navButton.innerHTML = navLabel.innerHTML;
        navButton.setAttribute('aria-expanded', false);
        navButton.setAttribute('aria-controls', this.navList.id);

        navLabel.classList.add('fully-hidden');

        this.sideNavigation.insertBefore(navButton, this.navList);

        navButton.setAttribute('aria-controls', this.navList.id);

        // events
        navButton.addEventListener('click', () => {
            const isOpen = navControl.checked;

            if (!isOpen) {
                this.openSideNav();
            } else {
                this.closeSideNav();
            }

            navButton.setAttribute('aria-expanded', !isOpen);
            navControl.checked = !isOpen;
        });

        window.addEventListener('scroll', () => {
            if (navButton.offsetTop >= 1) {
                navButton.classList.add('ds_side-navigation__expand--shadow');
            } else {
                navButton.classList.remove('ds_side-navigation__expand--shadow');
            }
        });

        this.sideNavigation.classList.add('js-initialised');
        document.documentElement.style.setProperty('--ds-side-nav-max-height', 0);
    }

    openSideNav() {
        document.documentElement.style.setProperty('--ds-side-nav-max-height', this.navList.scrollHeight + 16 + 'px');
    }

    closeSideNav() {
        document.documentElement.style.setProperty('--ds-side-nav-max-height', 0);
    }
}

export default SideNavigation;
