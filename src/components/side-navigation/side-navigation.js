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
        const navList = this.sideNavigation.querySelector('.ds_side-navigation__list--root');

        navControl.checked = false;
        this.sideNavigation.setAttribute('aria-expanded', false);

        const navButton = document.createElement('button');
        navButton.classList.add('ds_side-navigation__expand', 'ds_link');
        navButton.innerHTML = navLabel.innerHTML;

        navLabel.parentNode.removeChild(navLabel);
        this.sideNavigation.insertBefore(navButton, navList);

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

            this.sideNavigation.setAttribute('aria-expanded', !isOpen);
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
