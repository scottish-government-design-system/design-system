/* global document, window */
import elementIdModifier from '../../base/tools/id-modifier/id-modifier';

'use strict';

class SideNavigation {
    constructor (sideNavigation) {
        this.sideNavigation = sideNavigation;
    }

    init() {
        if (this.sideNavigation) {
            this.setupSideNavigation();
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
    }

    openSideNav() {
        this.navList.style.display = 'block';
        window.setTimeout(() => {
            this.navList.style.maxHeight = this.navList.scrollHeight + 16 + 'px';
        }, 0);
    }

    closeSideNav() {
        this.navList.style.maxHeight = 0;
        window.setTimeout(() => {
            this.navList.style.display = 'none';
        }, 200);
    }
}

export default SideNavigation;
