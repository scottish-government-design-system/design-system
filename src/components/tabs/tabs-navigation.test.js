import { vi } from 'vitest';
import { page } from 'vitest/browser';
import loadHtml from '../../../loadHtml';
import tabsNavigation from './tabs-navigation';

const testObj = {};

describe('navigation tabs', () => {
    beforeEach(async () => {
        await loadHtml('src/components/tabs/tabs-navigation.html');
        testObj.tabsElement = document.querySelector('#tab');
        testObj.tabsModule = new tabsNavigation(testObj.tabsElement);
    });

    it('should not be initialised if larger than medium size', () => {
        testObj.tabsModule.init();
        expect(testObj.tabsElement.classList.contains('js-initialised')).toBe(false);
    });

    it('should set a class of "js-initialised" on set()', () => {
        const tabsList = testObj.tabsElement.querySelector('.ds_tabs__navigation');
        expect(tabsList.classList.contains('js-initialised')).toBe(false);
        testObj.tabsModule.init();
        expect(tabsList.classList.contains('js-initialised')).toBe(true);
    });

    it('should abandon attempts to initialise after it has been init-ed', () => {
        const tabsList = testObj.tabsElement.querySelector('.ds_tabs__navigation');
        testObj.tabsModule.init();
        vi.spyOn(tabsList.classList, 'add').mockImplementation();
        testObj.tabsModule.init();
        expect(tabsList.classList.add).not.toHaveBeenCalled();
    });

    it('should remove class of "js-initialised" on reset', () => {
        const tabsList = testObj.tabsElement.querySelector('.ds_tabs__navigation');
        testObj.tabsModule.init();
        expect(tabsList.classList.contains('js-initialised')).toBe(true);
        testObj.tabsModule.reset();
        expect(tabsList.classList.contains('js-initialised')).toBe(false);
    });

    it('should reset if the viewport is resized to become larger than medium size', async () => {
        vi.useFakeTimers();
        const tabsList = testObj.tabsElement.querySelector('.ds_tabs__navigation');
        // viewport.set(400); // set to a size larger than medium
        await page.viewport(400, 400);
        testObj.tabsModule.init();
        expect(tabsList.classList.contains('js-initialised')).toBe(true);

        // Send resize event
        // viewport.set(800); // set to a size larger than medium
        await page.viewport(800, 400);
        const event = new Event('resize');
        window.dispatchEvent(event);
        vi.advanceTimersByTime(300)

        expect(tabsList.classList.contains('js-initialised')).toBe(false);
    });

    it('should be set if the viewport is resized to become smaller than medium size', async () => {
        vi.useFakeTimers();
        const tabsList = testObj.tabsElement.querySelector('.ds_tabs__navigation');
        await page.viewport(800, 400); // set to a size larger than medium
        testObj.tabsModule.init();
        expect(tabsList.classList.contains('js-initialised')).toBe(false);

        // Send resize event
        await page.viewport(400, 400); // set to a size smaller than medium
        const event = new Event('resize');
        window.dispatchEvent(event);
        vi.advanceTimersByTime(300); // wait for debounce interval

        expect(tabsList.classList.contains('js-initialised')).toBe(true);
    });

    it('should change aria-labelledby if current page label is included', () => {
        const tabsList = testObj.tabsElement.querySelector('.ds_tabs__navigation');
        expect(tabsList.getAttribute('aria-labelledby')).toEqual('ds_tabs__title');
        testObj.tabsModule.init();
        expect(tabsList.getAttribute('aria-labelledby')).toEqual('ds_tabs__current');
    });

    it('should toggle aria-expanded on button click event', () => {
        testObj.tabsModule.init();
        const tabsToggleButton = testObj.tabsElement.querySelector('.ds_tabs__toggle');
        expect(tabsToggleButton.getAttribute('aria-expanded')).toBe('false');

        // Click event on button
        const event = new Event('click');
        tabsToggleButton.dispatchEvent(event);
        expect(tabsToggleButton.getAttribute('aria-expanded')).toBe('true');

        // Click event on button
        const event2 = new Event('click');
        tabsToggleButton.dispatchEvent(event2);
        expect(tabsToggleButton.getAttribute('aria-expanded')).toBe('false');
    });
});
