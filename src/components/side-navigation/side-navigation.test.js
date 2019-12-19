const testObj = {};

jasmine.getFixtures().fixturesPath = 'base/src/';

import SideNavigation from './side-navigation';

describe('side navigation', () => {

    beforeEach(function () {
        loadFixtures('components/side-navigation/side-navigation.html');
    });

    describe('no side navigation', () => {
        it('should not have any errors', () => {
            const ppp = new SideNavigation();
            ppp.init();
        });
    });

    describe('with side navigation', () => {
        beforeEach(() => {
            testObj.sideNavigationElement = document.querySelector('[data-module="ds-side-navigation"]');
            testObj.sideNavigationModule = new SideNavigation(testObj.sideNavigationElement);
        });

        it ('should set an initial ARIA value on the container', () => {
            testObj.sideNavigationModule.init();
            expect(testObj.sideNavigationElement.getAttribute('aria-expanded')).toEqual('false');
        });

        it ('should toggle display of the side navigation on click of the label', () => {
            testObj.sideNavigationModule.init();

            const label = testObj.sideNavigationElement.querySelector('.ds_side-navigation__expand');
            const list = testObj.sideNavigationElement.querySelector('.ds_side-navigation__list--root');

            // opening nav
            const event = new Event('click');
            label.dispatchEvent(event);
            expect(list.style.display).toEqual('block');

            // closing nav
            label.dispatchEvent(event);
            expect(parseInt(list.style.maxHeight, 10)).toEqual(0);

        });

        it ('should toggle a class on the navigation if the navigation button is sticky', function () {
            const sideNavigationExpand = testObj.sideNavigationElement.querySelector('.ds_side-navigation__expand');

            const event = new Event('scroll');
            window.dispatchEvent(event);
            expect(sideNavigationExpand.classList.contains('ds_side-navigation__expand--shadow')).toEqual(false);

            // todo: some way of influencing top offset
            //window.dispatchEvent(event);
            //expect(sideNavigationExpand.classList.contains('ds_side-navigation__expand--shadow')).toEqual(true);
        });
    });
});
