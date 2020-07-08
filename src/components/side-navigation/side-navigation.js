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
        const idString = parseInt(Math.random() * 1000000, 10);
        this.navList = this.sideNavigation.querySelector('.ds_side-navigation__list');
        this.navList.id = this.navList.id || `side-navigation-${idString}`;

        navControl.checked = false;

        const navButton = document.createElement('button');
        navButton.classList.add('ds_side-navigation__expand', 'ds_link', 'js-side-navigation-button');
        navButton.setAttribute('aria-expanded', false);
        navButton.innerHTML = navLabel.innerHTML;
        navButton.setAttribute('aria-expanded', false);
        navButton.setAttribute('aria-controls', this.navList.id);

        navLabel.parentNode.removeChild(navLabel);
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
            navControl.setAttribute('data-navigation', `navigation-${navControl.checked ? 'close' : 'open'}`);
        });

        window.addEventListener('scroll', () => {
            const sideNavigationExpand = this.sideNavigation.querySelector('.ds_side-navigation__expand');

            if (sideNavigationExpand.offsetTop > 1) {
                sideNavigationExpand.classList.add('ds_side-navigation__expand--shadow');
            } else {
                sideNavigationExpand.classList.remove('ds_side-navigation__expand--shadow');
            }
        });
    }

    openSideNav() {
        this.navList.style.display = 'block';
        this.navList.style.maxHeight = this.navList.scrollHeight + 14 +  'px';
    }

    closeSideNav() {
        this.navList.style.maxHeight = 0;
        window.setTimeout(() => {
            this.navList.style.display = 'none';
        }, 200);
    }
}

export default SideNavigation;
