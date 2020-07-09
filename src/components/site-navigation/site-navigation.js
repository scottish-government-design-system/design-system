'use strict';

class MobileMenu {
    constructor (mobileMenu) {
        this.mobileMenu = mobileMenu;
        this.menuElement = document.querySelector('#mobile-navigation-menu');
    }

    init() {
        if (!this.mobileMenu) {
            return;
        }

        const menuToggleButton = document.querySelector('.js-toggle-menu');
        const menuCloseButton = document.querySelector('.js-close-menu');

        menuToggleButton.addEventListener('click', () => {
            this.menuElement.classList.toggle('menu-is-open');
            const menuIsOpen = this.menuElement.classList.contains('menu-is-open');

            if (menuIsOpen) {
                this.openMenu();
            } else {
                this.closeMenu();
            }

            menuToggleButton.setAttribute('aria-expanded', menuIsOpen);
            menuCloseButton.setAttribute('aria-expanded', menuIsOpen);
            menuIsOpen? menuToggleButton.classList.add('ds_mobile-navigation__button--open') : menuToggleButton.classList.remove('ds_mobile-navigation__button--open');
        });

        menuCloseButton.addEventListener('click', () => {
            this.menuElement.classList.remove('menu-is-open');
            this.closeMenu();

            menuToggleButton.setAttribute('aria-expanded', false);
            menuCloseButton.setAttribute('aria-expanded', false);
            menuToggleButton.classList.remove('ds_mobile-navigation__button--open');
        });
    }

    openMenu () {
        window.scrollTo(0, window.scrollX);
        const htmlElement = document.querySelector('html');
        const bodyElement = document.querySelector('body');

        // position overlay
        const offsetElement = document.querySelector(this.menuElement.dataset.offsetselector);
        const offsetHeight = offsetElement ? offsetElement.offsetHeight : 0;
        const offsetTop = offsetElement ? offsetElement.offsetTop : 0;
        this.menuElement.style.top = offsetHeight + 'px';

        // handle any need for the menu to scroll if it is longer than the viewport
        if ((this.menuElement.offsetHeight + offsetHeight) > window.innerHeight) {
            this.menuElement.style.bottom = offsetHeight - window.innerHeight + 'px';
        } else {
            this.menuElement.style.bottom = null;
        }

        const menuHeight = this.menuElement.offsetHeight;
        this.menuElement.querySelector('.ds_mobile-navigation__backdrop').style.top = menuHeight + offsetHeight + offsetTop + 'px';

        // set overflow on body and html
        htmlElement.style.position = 'relative';
        bodyElement.style.position = 'relative';

        htmlElement.classList.add('menu-is-open');
        htmlElement.style.height = window.innerHeight + "px";
        bodyElement.style.height = window.innerHeight + "px";
    }

    closeMenu () {
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
}

export default MobileMenu;
