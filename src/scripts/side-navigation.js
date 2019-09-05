'use strict';

const sideNavigationComponent = {
    init: function () {
        const sideNavigation = document.querySelector('.ds_side-navigation');
        if (sideNavigation) {
            this.setupSideNavigation(sideNavigation);
        }
    },

    setupSideNavigation: function (sideNavigation) {
        const checkbox = sideNavigation.querySelector('#show-side-navigation');
        checkbox.setAttribute('aria-expanded', false);

        checkbox.addEventListener('change', function (event) {
            const list = sideNavigation.querySelector('.ds_side-navigation__list--root');
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


        window.addEventListener('scroll', function () {
            const sideNavigationExpand = document.querySelector('.ds_side-navigation__expand');

            if (sideNavigationExpand.offsetTop > 1) {
                sideNavigationExpand.classList.add('ds_side-navigation__expand--shadow');
            } else {
                sideNavigationExpand.classList.remove('ds_side-navigation__expand--shadow');
            }
        });
    }
};

// self-initialize
sideNavigationComponent.init();

export default sideNavigationComponent;
