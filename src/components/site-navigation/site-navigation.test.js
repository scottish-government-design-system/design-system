const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, './site-navigation.html'), 'utf-8');
const testObj = {};

import MobileMenu from './site-navigation';

describe('site navigation', () => {
    describe('no site navigation', () => {
        it('should not have any errors', () => {
            const ppp = new MobileMenu();
            ppp.init();
        });
    });

    describe('with site navigation', () => {
        beforeEach(() => {
            document.documentElement.innerHTML = html.toString();

            window.scrollTo = () => {};

            testObj.siteNavigationElement = document.querySelector('#mobile-navigation-menu');
            testObj.siteNavigationModule = new MobileMenu(testObj.siteNavigationElement);

            testObj.siteNavigationModule.init();
        });

        describe('menu toggle button', () => {
            it ('should toggle the display of the mobile menu', () => {
                const menuToggleButton = document.querySelector('.js-toggle-menu');

                testObj.siteNavigationModule.openMenu = jest.fn(testObj.siteNavigationModule.openMenu);
                testObj.siteNavigationModule.closeMenu = jest.fn(testObj.siteNavigationModule.closeMenu);

                const event = new Event('click');
                menuToggleButton.dispatchEvent(event);
                expect(testObj.siteNavigationModule.openMenu.mock.calls.length).toEqual(1);

                menuToggleButton.dispatchEvent(event);
                expect(testObj.siteNavigationModule.closeMenu.mock.calls.length).toEqual(1);
            });
        });

        describe('menu close button', () => {
            it ('should close the mobile menu', () => {
                const menuCloseButton = document.querySelector('.js-close-menu');
                testObj.siteNavigationModule.closeMenu = jest.fn(testObj.siteNavigationModule.closeMenu);

                const event = new Event('click');
                menuCloseButton.dispatchEvent(event);
                expect(testObj.siteNavigationModule.closeMenu.mock.calls.length).toEqual(1);
            });
        });

        describe('open menu function', () => {
            it ('should close the mobile menu', () => {
                const menuElement = document.querySelector('#mobile-navigation-menu');
                testObj.siteNavigationModule.openMenu(menuElement);
            });
        });

        describe('close menu function', () => {
            it ('should close the mobile menu', () => {
                testObj.siteNavigationModule.closeMenu();
            });
        });
    });
});
