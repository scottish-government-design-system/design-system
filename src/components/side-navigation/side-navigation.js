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
        const navList = this.sideNavigation.querySelector('.ds_side-navigation__list');
        const idString = parseInt(Math.random() * 1000000, 10);

        navControl.checked = false;

        const navButton = document.createElement('button');
        navButton.classList.add('ds_side-navigation__expand', 'ds_link', 'js-side-navigation-button');
        navButton.setAttribute('aria-expanded', false);
        navButton.innerHTML = navLabel.innerHTML;
        navButton.setAttribute('aria-expanded', false);

        navList.id = navList.id || `side-navigation-${parseInt(Math.random() * 1e8, 10)}`;
        navButton.setAttribute('aria-controls', navList.id);

        navLabel.parentNode.removeChild(navLabel);
        this.sideNavigation.insertBefore(navButton, navList);

        navList.id = navList.id || `side-navigation-${idString}`;
        navButton.setAttribute('aria-controls', navList.id);

        // events
        navButton.addEventListener('click', () => {
            const isOpen = navControl.checked;

            if (!isOpen) {
                navList.style.display = 'block';
                navList.style.maxHeight = navList.scrollHeight + 14 +  'px';
            } else {
                navList.style.maxHeight = 0;
                window.setTimeout(function () {
                    navList.style.display = 'none';
                }, 200);
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
}

export default SideNavigation;
