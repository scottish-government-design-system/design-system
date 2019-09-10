const fs = require('fs');
const path = require('path');

const siteNavigationScript = require('../src/scripts/site-navigation');
const html = fs.readFileSync(path.resolve(__dirname, 'html/site-navigation.html'), 'utf-8');

// things we'll be mocking
const actualScrollTo = window.scrollTo;
const actualOpenMenu = siteNavigationScript.mobileMenuComponent.openMenu;
const actualCloseMenu = siteNavigationScript.mobileMenuComponent.closeMenu;

describe('site navigation', () => {
    describe('no site navigation', () => {
        it('should not have any errors', () => {
            siteNavigationScript.mobileMenuComponent.init();
        });
    });

    describe('with site navigation', () => {
        beforeEach(() => {
            document.documentElement.innerHTML = html.toString();
            siteNavigationScript.mobileMenuComponent.init();
            window.scrollTo = () => {};
        });

        afterEach(() => {
            window.scrollTo = actualScrollTo;
            siteNavigationScript.mobileMenuComponent.openMenu = actualOpenMenu;
            siteNavigationScript.mobileMenuComponent.closeMenu = actualCloseMenu;
        });

        describe('menu toggle button', () => {
            it ('should toggle the display of the mobile menu', () => {
                const menuToggleButton = document.querySelector('.js-toggle-menu');

                // siteNavigationScript.mobileMenuComponent.closeMenu = jest.fn();
                siteNavigationScript.mobileMenuComponent.openMenu = jest.fn();
                siteNavigationScript.mobileMenuComponent.closeMenu = jest.fn();

                const event = new Event('click');
                menuToggleButton.dispatchEvent(event);
                expect(siteNavigationScript.mobileMenuComponent.openMenu.mock.calls.length).toEqual(1);

                menuToggleButton.dispatchEvent(event);
                expect(siteNavigationScript.mobileMenuComponent.closeMenu.mock.calls.length).toEqual(1);
            });
        });

        describe('menu close button', () => {
            it ('should close the mobile menu', () => {
                const menuCloseButton = document.querySelector('.js-close-menu');
                siteNavigationScript.mobileMenuComponent.closeMenu = jest.fn(() => siteNavigationScript.mobileMenuComponent.closeMenu);

                const event = new Event('click');
                menuCloseButton.dispatchEvent(event);
                expect(siteNavigationScript.mobileMenuComponent.closeMenu.mock.calls.length).toEqual(1);
            });
        });

        describe('open menu function', () => {
            it ('should close the mobile menu', () => {
                const menuElement = document.querySelector('#mobile-navigation-menu');
                siteNavigationScript.mobileMenuComponent.openMenu(menuElement);
            });
        });

        describe('close menu function', () => {
            it ('should close the mobile menu', () => {
                siteNavigationScript.mobileMenuComponent.closeMenu();
            });
        });
    });
});
