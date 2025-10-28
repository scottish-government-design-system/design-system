import { vi, beforeEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import loadHtml from '../../loadHtml';
import DS from '../index';

describe('ALL', () => {
    beforeEach(async () => {
        await loadHtml('src/all/all.html');
        await page.viewport(800, 400);
    });

    it('initAll should init all expected DS components', () => {
        const accordionElement = document.querySelector('#accordion');
        const backToTopElement = document.querySelector('#back-to-top');
        const cookieNotificationElement = document.querySelector('#cookie-notification');
        const datePickerElement = document.querySelector('#date-picker');
        const detailsElement = document.querySelector('#details');
        const hideThisPageElement = document.querySelector('#hide-this-page');
        const notificationBannerElement = document.querySelector('#notification-banner');
        const sideNavigationElement = document.querySelector('#side-navigation');
        const siteNavigationElement = document.querySelector('#site-navigation');
        const skipLinksSpy = vi.spyOn(DS.components.skipLinks, 'init');
        const stepNavigationElement = document.querySelector('#step-navigation');
        const tabsElement = document.querySelector('#tabs');
        const characterCountElement = document.querySelector('#character-count');
        const checkboxElement = document.querySelector('#checkbox');
        const trackingSpy = vi.spyOn(DS.base.tools.tracking, 'init');

        DS.initAll();

        expect(accordionElement.classList.contains('js-initialised')).toBe(true);
        expect(backToTopElement.classList.contains('js-initialised')).toBe(true);
        expect(cookieNotificationElement.classList.contains('js-initialised')).toBe(true);
        expect(datePickerElement.classList.contains('js-initialised')).toBe(true);
        expect(detailsElement.classList.contains('js-initialised')).toBe(true);
        expect(hideThisPageElement.querySelector('.js-hide-page').classList.contains('js-initialised')).toBe(true);
        expect(notificationBannerElement.classList.contains('js-initialised')).toBe(true);
        expect(sideNavigationElement.classList.contains('js-initialised')).toBe(true);
        expect(siteNavigationElement.classList.contains('js-initialised')).toBe(true);
        expect(skipLinksSpy).toHaveBeenCalled();
        expect(stepNavigationElement.classList.contains('js-initialised')).toBe(true);
        expect(tabsElement.classList.contains('js-initialised')).toBe(true);
        expect(characterCountElement.classList.contains('js-initialised')).toBe(true);
        expect(checkboxElement.classList.contains('js-initialised')).toBe(true);
        expect(trackingSpy).toHaveBeenCalled();
    });

    it('viewport-specific test for tables', async () => {
        await page.viewport(10, 400);
        const tableElement = document.querySelector('#table');

        DS.initAll();

        expect(tableElement.classList.contains('js-initialised')).toBe(true);
    });

    it('viewport-specific test for tabs nav', async () => {
        await page.viewport(400, 400);
        const tabsNavigationElement = document.querySelector('#tabs-navigation');

        DS.initAll();

        expect(tabsNavigationElement.classList.contains('js-initialised')).toBe(true);
    });
});
