const testObj = {};

jasmine.getFixtures().fixturesPath = 'base/src/';

import MobileMenu from './site-navigation';

describe('site navigation', () => {
    beforeEach(function () {
        loadFixtures('components/site-navigation/site-navigation.html');
    });

    describe('no site navigation', () => {
        it('should not have any errors', () => {
            const ppp = new MobileMenu();
            ppp.init();
        });
    });

    describe('with site navigation', () => {
        beforeEach(() => {
            window.scrollTo = () => {};

            testObj.siteNavigationElement = document.querySelector('[data-module="ds-mobile-navigation-menu"]');
            testObj.siteNavigationModule = new MobileMenu(testObj.siteNavigationElement);

            testObj.siteNavigationModule.init();
        });

        describe('menu toggle button', () => {
            it ('should toggle the display of the mobile menu', () => {
                const menuToggleButton = document.querySelector('.js-toggle-menu');

                spyOn(testObj.siteNavigationModule, 'openMenu');
                spyOn(testObj.siteNavigationModule, 'closeMenu');

                const event = new Event('click');
                menuToggleButton.dispatchEvent(event);
                expect(testObj.siteNavigationModule.openMenu).toHaveBeenCalled();

                menuToggleButton.dispatchEvent(event);
                expect(testObj.siteNavigationModule.closeMenu).toHaveBeenCalled();
            });
        });

        describe('menu close button', () => {
            it ('should close the mobile menu', () => {
                const menuCloseButton = document.querySelector('.js-close-menu');

                spyOn(testObj.siteNavigationModule, 'closeMenu');

                const event = new Event('click');
                menuCloseButton.dispatchEvent(event);
                expect(testObj.siteNavigationModule.closeMenu).toHaveBeenCalled();
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

    describe('with offset element', () => {
        it('should place the menu below a specified offset element', () => {
            testObj.siteNavigationElement = document.querySelector('[data-module="ds-mobile-navigation-menu"]');
            testObj.siteNavigationElement.dataset.offsetselector = '#offsetelement';

            testObj.siteNavigationModule = new MobileMenu(testObj.siteNavigationElement);

            testObj.siteNavigationModule.init();

            testObj.siteNavigationModule.openMenu();

            expect(testObj.siteNavigationModule.menuElement.style.top).toEqual(document.querySelector('#offsetelement').style.height);
        });

    });
});
