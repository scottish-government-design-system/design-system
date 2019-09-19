'use strict';

const mobileMenuComponent = {
    init: function () {
        const menuElement = document.querySelector('#mobile-navigation-menu');

        if (!menuElement) {
            return;
        }

        const menuToggleButton = document.querySelector('.js-toggle-menu');
        const menuContainer = document.querySelector('#mobile-navigation-menu');
        const menuCloseButton = document.querySelector('.js-close-menu');

        menuToggleButton.addEventListener('click', function () {
            menuContainer.classList.toggle('menu-is-open');
            const menuIsOpen = menuContainer.classList.contains('menu-is-open');

            if (menuIsOpen) {
                mobileMenuComponent.openMenu(menuElement);
            } else {
                mobileMenuComponent.closeMenu();
            }

            menuToggleButton.setAttribute('aria-expanded', menuIsOpen);
            menuCloseButton.setAttribute('aria-expanded', menuIsOpen);
            menuIsOpen? menuToggleButton.classList.add('ds_mobile-navigation__button--open') : menuToggleButton.classList.remove('ds_mobile-navigation__button--open');
        });

        menuCloseButton.addEventListener('click', function () {
            menuContainer.classList.remove('menu-is-open');
            mobileMenuComponent.closeMenu();

            menuToggleButton.setAttribute('aria-expanded', false);
            menuCloseButton.setAttribute('aria-expanded', false);
            menuToggleButton.classList.remove('ds_mobile-navigation__button--open');
        });
    },

    openMenu: function (menuElement) {
        window.scrollTo(0, window.scrollX);

        const htmlElement = document.querySelector('html');
        const bodyElement = document.querySelector('body');

        // position overlay
        const offsetElement = document.querySelector(menuElement.dataset.offsetselector);
        const offsetHeight = offsetElement ? offsetElement.offsetHeight : 0;
        const offsetTop = offsetElement ? offsetElement.offsetTop : 0;
        const mobileNavigation = document.querySelector('.ds_mobile-navigation');
        mobileNavigation.style.top = offsetHeight + 'px';

        // handle any need for the menu to scroll if it is longer than the viewport
        if ((mobileNavigation.offsetHeight + offsetHeight) > window.innerHeight) {
            mobileNavigation.style.bottom = offsetHeight - window.innerHeight + 'px';
        } else {
            mobileNavigation.style.bottom = null;
        }

        const menuHeight = mobileNavigation.offsetHeight;
        mobileNavigation.querySelector('.ds_mobile-navigation__backdrop').style.top = menuHeight + offsetHeight + offsetTop + 'px';

        // set overflow on body and html
        htmlElement.style.position = 'relative';
        bodyElement.style.position = 'relative';

        htmlElement.classList.add('menu-is-open');
        htmlElement.style.height = window.innerHeight + "px";
        bodyElement.style.height = window.innerHeight + "px";
    },

    closeMenu: function () {
        const htmlElement = document.querySelector('html');
        const bodyElement = document.querySelector('body');
        const mobileNavigation = document.querySelector('.ds_mobile-navigation');

        // unset overflow on body and html
        htmlElement.style.position = null;
        bodyElement.style.position = null;
        htmlElement.classList.remove('menu-is-open');
        htmlElement.style.height = null;
        bodyElement.style.height = null;

        mobileNavigation.style.bottom = null;
    }
};

// self-initialize
mobileMenuComponent.init();

export {mobileMenuComponent};
