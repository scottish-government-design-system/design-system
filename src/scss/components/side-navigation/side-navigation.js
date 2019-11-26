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
        const checkbox = this.sideNavigation.querySelector('#show-side-navigation');
        checkbox.setAttribute('aria-expanded', false);

        checkbox.addEventListener('change', (event) => {
            const list = this.sideNavigation.querySelector('.ds_side-navigation__list--root');
            if (event.target.checked) {
                list.style.display = 'block';
                list.style.maxHeight = list.scrollHeight + 14 +  'px';
            } else {
                list.style.maxHeight = 0;
                window.setTimeout(function () {
                    list.style.display = 'none';
                }, 200);
            }

            checkbox.setAttribute('aria-expanded', event.target.checked);

            // tracking
            checkbox.setAttribute('data-navigation', `navigation-${event.target.checked ? 'close' : 'open'}`);
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
