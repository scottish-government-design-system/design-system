import { vi, beforeEach, describe, expect, it } from 'vitest';
import loadHtml from '../../../loadHtml';
import SideNavigation from './side-navigation';

const testObj = {};

describe('side navigation', () => {

    beforeEach(async () => {
        await loadHtml('src/components/side-navigation/side-navigation.html');
    });

    describe('no side navigation', () => {
        it('should not have any errors', () => {
            const ppp = new SideNavigation();
            ppp.init();
        });
    });

    describe('with side navigation', () => {
        beforeEach(() => {
            testObj.sideNavigationElement = document.querySelector('#withlistid');
            testObj.sideNavigationModule = new SideNavigation(testObj.sideNavigationElement);
        });

        it('should abandon attempts to call init() after it has been init-ed', () => {
            testObj.sideNavigationModule.init();

            vi.spyOn(testObj.sideNavigationModule.sideNavigation.classList, 'add').mockImplementation();
            testObj.sideNavigationModule.init();
            expect(testObj.sideNavigationModule.sideNavigation.classList.add).not.toHaveBeenCalledWith('js-initialised');
        });

        it('should set an initial aria-expanded value on the control', () => {
            testObj.sideNavigationModule.init();
            const sideNavButton = testObj.sideNavigationElement.querySelector('.js-side-navigation-button');
            expect(sideNavButton.getAttribute('aria-expanded')).toEqual('false');
        });

        it('should update the control\'s aria-expanded attribute when interacted with', () => {
            testObj.sideNavigationModule.init();
            const sideNavButton = testObj.sideNavigationElement.querySelector('.js-side-navigation-button');
            const label = testObj.sideNavigationElement.querySelector('button.ds_side-navigation__expand');

            // opening nav
            const event = new Event('click');
            label.dispatchEvent(event);

            expect(sideNavButton.getAttribute('aria-expanded')).toEqual('true');
        });

        it('should toggle a shadow on the navigation if the navigation button is sticky', function () {
            testObj.sideNavigationModule.init();
            const sideNavigationExpand = testObj.sideNavigationElement.querySelector('button.ds_side-navigation__expand');

            expect(sideNavigationExpand.classList.contains('ds_side-navigation__expand--shadow')).toEqual(false);

            const event = new Event('scroll');
            window.scrollTo(200, 200);
            window.dispatchEvent(event);

            expect(sideNavigationExpand.classList.contains('ds_side-navigation__expand--shadow')).toEqual(true);
        });

        it('should fully hide the toggle checkbox on init', () => {
            const toggle = testObj.sideNavigationElement.querySelector('.js-toggle-side-navigation');
            expect(toggle.classList.contains('fully-hidden')).toBe(false);
            expect(toggle.classList.contains('visually-hidden')).toBe(true);

            testObj.sideNavigationModule.init();
            expect(toggle.classList.contains('fully-hidden')).toBe(true);
            expect(toggle.classList.contains('visually-hidden')).toBe(false);
        });
    });

    it('should assign an ID to the navigation list if one wasn\'t already in the markup', () => {
        testObj.sideNavigationElement = document.querySelector('#withoutlistid');
        testObj.sideNavigationModule = new SideNavigation(testObj.sideNavigationElement);

        const listElement = testObj.sideNavigationElement.querySelector('.ds_side-navigation__list');

        expect(listElement.id).toEqual('');
        testObj.sideNavigationModule.init();
        expect(listElement.id).not.toEqual('');
    });
});
