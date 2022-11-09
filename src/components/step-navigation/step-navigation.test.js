const testObj = {};

jasmine.getFixtures().fixturesPath = 'base/src/';

import stepNav from './step-navigation';

describe('step navigation', () => {
    beforeEach(function () {
        loadFixtures('components/step-navigation/step-navigation.html');
        testObj.stepNavigationElement = document.querySelector('#stepNav');
    });

    it('should highlight the current link', () => {
        const _window = {
            location: {
                origin: window.location.origin,
                pathname: '/my/target/link'
            }
        };

        testObj.stepNavigationModule = new stepNav(testObj.stepNavigationElement, _window);
        testObj.stepNavigationModule.init();

        const targetLink = document.querySelector('#target-link');
        const currentBodyLinks = document.querySelectorAll('.ds_accordion-item__body a.ds_step-navigation__current-link');

        expect(targetLink.classList.contains('ds_step-navigation__current-link')).toBeTrue();
        expect(currentBodyLinks.length).toEqual(1);
    });

    it('should use the native window object by default', () => {
        testObj.stepNavigationModule = new stepNav(testObj.stepNavigationElement);

        expect(testObj.stepNavigationModule.window).toEqual(window);
    });
});
