const testObj = {};

jasmine.getFixtures().fixturesPath = 'base/src/';

import tabsNavigation from './tabs-navigation';

describe('navigation tabs', () => {
    beforeEach(() => {
        loadFixtures('components/tabs/tabs-navigation.html');
        testObj.tabsElement = document.querySelector('#tab');
        testObj.tabsModule = new tabsNavigation(testObj.tabsElement);
    });

    afterEach(() => {
        // reset viewport size
        viewport.reset();
    });

    it('should not be initialised if larger than medium size', () => {
        viewport.set(800); // set to a size larger than medium
        testObj.tabsModule.init();
        expect(testObj.tabsElement.classList.contains('js-initialised')).toBe(false);
    });

    it('should set a class of "js-initialised" on set()', () => {
        viewport.set(400); // set to a size smaller than medium
        const tabsList = testObj.tabsElement.querySelector('.ds_tabs__navigation');
        expect(tabsList.classList.contains('js-initialised')).toBe(false);
        testObj.tabsModule.init();
        expect(tabsList.classList.contains('js-initialised')).toBe(true);
    });

    it('should abandon attempts to initialise after it has been init-ed', () => {
        viewport.set(400); // set to a size smaller than medium
        const tabsList = testObj.tabsElement.querySelector('.ds_tabs__navigation');
        testObj.tabsModule.init();
        spyOn(tabsList.classList, 'add');
        testObj.tabsModule.init();
        expect(tabsList.classList.add).not.toHaveBeenCalled();
    });

    it('should remove class of "js-initialised" on reset', () => {
        viewport.set(400); // set to a size smaller than medium
        const tabsList = testObj.tabsElement.querySelector('.ds_tabs__navigation');
        testObj.tabsModule.init();
        expect(tabsList.classList.contains('js-initialised')).toBe(true);
        testObj.tabsModule.reset();
        expect(tabsList.classList.contains('js-initialised')).toBe(false);
    });

    it('should reset if the viewport is resized to become larger than medium size', () => {
        const clock = jasmine.clock().install();
        const tabsList = testObj.tabsElement.querySelector('.ds_tabs__navigation');
        viewport.set(400); // set to a size smaller than medium
        testObj.tabsModule.init();
        expect(tabsList.classList.contains('js-initialised')).toBe(true);

        // Send resize event
        viewport.set(800); // set to a size larger than medium
        const event = new Event('resize');
        window.dispatchEvent(event);
        clock.tick(300); // wait for debounce interval

        expect(tabsList.classList.contains('js-initialised')).toBe(false);
        clock.uninstall();
    });

    it('should be set if the viewport is resized to become smaller than medium size', () => {
        const clock = jasmine.clock().install();
        const tabsList = testObj.tabsElement.querySelector('.ds_tabs__navigation');
        viewport.set(800); // set to a size larger than medium
        testObj.tabsModule.init();
        expect(tabsList.classList.contains('js-initialised')).toBe(false);

        // Send resize event
        viewport.set(400); // set to a size smaller than medium
        const event = new Event('resize');
        window.dispatchEvent(event);
        clock.tick(300); // wait for debounce interval

        expect(tabsList.classList.contains('js-initialised')).toBe(true);
        clock.uninstall();
    });

    it('should change aria-labelledby if current page label is included', () => {
        viewport.set(400); // set to a size smaller than medium
        const tabsList = testObj.tabsElement.querySelector('.ds_tabs__navigation');
        expect(tabsList.getAttribute('aria-labelledby')).toEqual('ds_tabs__title');
        testObj.tabsModule.init();
        expect(tabsList.getAttribute('aria-labelledby')).toEqual('ds_tabs__current');
    });

    it('should toggle aria-expanded on button click event', () => {
        viewport.set(400); // set to a size smaller than medium
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