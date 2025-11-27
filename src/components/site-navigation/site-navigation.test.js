import { beforeEach, describe, expect, it } from 'vitest';
import loadHtml from '../../../loadHtml';
import MobileMenu from './site-navigation';

const testObj = {};

describe('site navigation', () => {
    beforeEach(async () => {
        await loadHtml('src/components/site-navigation/site-navigation.html');
    });

    describe('no site navigation', () => {
        it('should not have any errors', () => {
            const ppp = new MobileMenu(undefined);
            ppp.init();
        });
    });

    describe('with site navigation', () => {
        beforeEach(() => {
            testObj.siteNavigationElement = document.querySelector('[data-module="ds-mobile-navigation-menu"]');
            testObj.siteNavigationModule = new MobileMenu(testObj.siteNavigationElement);
        });

        describe('DOM transform', () => {
            it('should replace the label emlement with a button with certain expected attributes', () => {
                const label = document.querySelector('.js-toggle-menu');
                const expectedAttribs = {
                    controls: label.getAttribute('aria-controls'),
                    expanded: false
                };
                testObj.siteNavigationModule.init();

                const button = document.querySelector('button.js-toggle-menu');

                expect(document.querySelectorAll('button.js-toggle-menu').length).toEqual(1);
                expect(button.getAttribute('aria-controls')).toEqual(expectedAttribs.controls);
                expect(button.getAttribute('aria-expanded')).toEqual(expectedAttribs.expanded.toString());
            });
        });

        describe('open/close menu', () => {
            it('should show/hide the menu on click of the menu button', () => {
                testObj.siteNavigationModule.init();

                const button = document.querySelector('button.js-toggle-menu');
                const menu = document.querySelector('.ds_site-navigation--mobile');

                // OPEN
                const event = new Event('click');
                button.dispatchEvent(event);

                expect(menu.classList.contains('ds_site-navigation--open')).toBe(true);
                expect(button.classList.contains('ds_site-header__control--active')).toBe(true);
                expect(button.getAttribute('aria-expanded')).toEqual(true.toString());

                // CLOSE
                button.dispatchEvent(event);

                expect(menu.classList.contains('ds_site-navigation--open')).toBe(false);
                expect(button.classList.contains('ds_site-header__control--active')).toBe(false);
                expect(button.getAttribute('aria-expanded')).toEqual(false.toString());
            });
        });
    });
});
