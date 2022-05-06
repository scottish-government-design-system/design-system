const testObj = {};

jasmine.getFixtures().fixturesPath = 'base/src/';

import Tabs from './tabs';

fdescribe('tabs', () => {
    beforeEach(() => {
        loadFixtures('components/tabs/tabs.html');
        testObj.tabsElement = document.querySelector('#tab');
        testObj.tabsModule = new Tabs(testObj.tabsElement);
    });

    afterEach(() => {
        viewport.reset();
        window.location.hash = '';
    });

    it('should not be initialised if smaller than medium size', () => {
        viewport.set(400); // set to a size smaller than medium
        testObj.tabsModule.init();
        expect(testObj.tabsElement.classList.contains('js-initialised')).toBe(false);
    });

    it('should set a class of "js-initialised" on set()', () => {
        expect(testObj.tabsElement.classList.contains('js-initialised')).toBe(false);
        testObj.tabsModule.init();
        expect(testObj.tabsElement.classList.contains('js-initialised')).toBe(true);
    });

    it('should set the list of tabs with a role attribute of "tablist" on set()', () => {
        let tabList = testObj.tabsElement.querySelector('.ds_tabs__list'); 
        expect(tabList.hasAttribute('role')).toBeFalsy();
        testObj.tabsModule.init();
        expect(tabList.getAttribute('role')).toEqual('tablist');
    });

    it('should abandon attempts to initialise after it has been init-ed', () => {
        testObj.tabsModule.init();
        spyOn(testObj.tabsModule.tabContainer.classList, 'add');
        testObj.tabsModule.init();
        expect(testObj.tabsModule.tabContainer.classList.add).not.toHaveBeenCalled();
    });

    it('should remove class of "js-initialised" on reset', () => {
        testObj.tabsModule.init();
        expect(testObj.tabsElement.classList.contains('js-initialised')).toBe(true);
        testObj.tabsModule.reset();
        expect(testObj.tabsElement.classList.contains('js-initialised')).toBe(false);
    });

    it('should remove the role attribute on the list of tabs on reset', () => {
        testObj.tabsModule.init();
        const tabList = testObj.tabsElement.querySelector('.ds_tabs__list'); 
        expect(tabList.hasAttribute('role')).toBeTruthy();
        testObj.tabsModule.reset();
        expect(tabList.hasAttribute('role')).toBeFalsy();
    });

    it('should abandon attempts to reset if it has not been init-ed', () => {
        expect(testObj.tabsElement.classList.contains('js-initialised')).toBe(false);
        testObj.tabsModule.reset();
        expect(testObj.tabsElement.classList.contains('js-initialised')).toBe(false);
    });

    it('should reset if the viewport is resized to become smaller than medium size', () => {
        const clock = jasmine.clock().install();
        viewport.set(800); // set to a size larger than medium
        testObj.tabsModule.init();
        expect(testObj.tabsElement.classList.contains('js-initialised')).toBe(true);

        // Send resize event
        viewport.set(400); // set to a size smaller than medium
        const event = new Event('resize');
        window.dispatchEvent(event);
        clock.tick(300); // wait for debounce interval

        expect(testObj.tabsElement.classList.contains('js-initialised')).toBe(false);
        clock.uninstall();
    });

    it('should be set if the viewport is resized to become larger than medium size', () => {
        const clock = jasmine.clock().install();
        viewport.set(400); // set to a size smaller than medium
        testObj.tabsModule.init();
        expect(testObj.tabsElement.classList.contains('js-initialised')).toBe(false);

        // Send resize event
        viewport.set(800); // set to a size larger than medium
        const event = new Event('resize');
        window.dispatchEvent(event);
        clock.tick(300); // wait for debounce interval

        expect(testObj.tabsElement.classList.contains('js-initialised')).toBe(true);
        clock.uninstall();
    });

    describe('tab items', () => {
        it ('should show first tab on init if no hash present', () => {
            const firstTabItem = testObj.tabsElement.querySelector('.ds_tabs__tab');

            testObj.tabsModule.init();
            expect(firstTabItem.classList.contains('ds_current')).toEqual(true);
        });

        it ('should have attributes added on init', () => {
            testObj.tabsModule.init();

            const tabItems = testObj.tabsElement.querySelectorAll('.ds_tabs__tab');

            for (let i = 0, il = tabItems.length; i < il; i++) {
                expect(tabItems[i].getAttribute('role')).toEqual('presentation');

                const tabLink = tabItems[i].querySelector('.ds_tabs__tab-link');
                expect(tabLink.getAttribute('role')).toEqual('tab');
                expect(tabLink.getAttribute('aria-controls')).toEqual('tab'+(i + 1));
                if(i == 0){
                    // First tab is selected
                    expect(tabLink.getAttribute('aria-selected')).toEqual('true');
                    expect(tabLink.getAttribute('tabindex')).toEqual('0');
                } else {
                    expect(tabLink.getAttribute('aria-selected')).toEqual('false');
                    expect(tabLink.getAttribute('tabindex')).toEqual('-1');
                }

            }

        });

        it ('should have attributes removed on reset', () => {
            testObj.tabsModule.init();
            testObj.tabsModule.reset();

            const tabItems = testObj.tabsElement.querySelectorAll('.ds_tabs__tab');

            for (let i = 0, il = tabItems.length; i < il; i++) {
                expect(tabItems[i].hasAttribute('role')).toBeFalsy();

                const tabLink = tabItems[i].querySelector('.ds_tabs__tab-link');
                expect(tabLink.hasAttribute('role')).toBeFalsy();
                expect(tabLink.hasAttribute('aria-controls')).toBeFalsy();
                expect(tabLink.hasAttribute('aria-selected')).toBeFalsy();
                expect(tabLink.hasAttribute('tabindex')).toBeFalsy();

            }
        });

        it ('should show specified tab on init if hash present', () => {
            window.location.hash = '#tab2';
            testObj.tabsModule.init();
            
            // Is initialised
            expect(testObj.tabsElement.classList.contains('js-initialised')).toBe(true);

            // Check current tab matches hash
            const currentTabItem = testObj.tabsElement.querySelector('.ds_current');
            expect(currentTabItem.querySelector('.ds_tabs__tab-link').getAttribute('href')).toBe('#tab2');
        });

        it ('should only change tab if a valid value is used on hash change event', () => {
            testObj.tabsModule.init();
            
            // Is initialised
            expect(testObj.tabsElement.classList.contains('js-initialised')).toBe(true);

            // Change hash
            window.location.hash = '#tab2';
            const event = new Event('hashchange');
            window.dispatchEvent(event);

            console.log(testObj.tabsElement);

            // Check current tab matches hash
            let currentTabItem = testObj.tabsElement.querySelector('.ds_current');

            console.log(currentTabItem.querySelector('.ds_tabs__tab-link').getAttribute('href'));
            //expect(currentTabItem.querySelector('.ds_tabs__tab-link').getAttribute('href')).toBe('#tab2');

            /*
            // Change hash to one that doesnt exist which should not change tabs
            window.location.hash = '#nonsense';
            const event2 = new Event('hashchange');
            window.dispatchEvent(event2);

            // Check current tab is still unchanged
            currentTabItem = testObj.tabsElement.querySelector('.ds_current');
            expect(currentTabItem.querySelector('.ds_tabs__tab-link').getAttribute('href')).toBe('#tab2');*/

        });

        it ('should change the selected tab to the one that is clicked if different to the current tab', () => {
            const firstTabItem = testObj.tabsElement.querySelector('.ds_tabs__tab');
            const firstTabLink = firstTabItem.querySelector('.ds_tabs__tab-link');
            // Set 2nd tab to be selected
            window.location.hash = '#tab2';
            testObj.tabsModule.init();

            // Click event on first tab
            const event = new Event('click');
            firstTabLink.dispatchEvent(event);

            // Check current tab is first tab
            const currentTabItem = testObj.tabsElement.querySelector('.ds_current');
            expect(currentTabItem.querySelector('.ds_tabs__tab-link').getAttribute('href')).toBe('#tab1');

            // On click hash is automatically changed in the browser to clicked tabs href

        });

        it ('should not change the tab on hash change if smaller than medium size', () => {
            viewport.set(400); // set to a size smaller than medium
            testObj.tabsModule.init();
            
            // Change hash
            window.location.hash = '#tab2';
            const event = new Event('hashchange');
            window.dispatchEvent(event);
            
            // Is not initialised
            expect(testObj.tabsElement.classList.contains('js-initialised')).toBe(false);

            // Get all tabs
            const tabItems = testObj.tabsElement.querySelectorAll('.ds_tabs__tab');

            // Check all tabs that none are selected
            for (let i = 0, il = tabItems.length; i < il; i++) {
                expect(tabItems[i].querySelector('.ds_current')).toBeFalsy();
            }
        });

        it ('should add the specified tab to the browser history', () => {

        });

        it ('should deactivate specified tab with deactivateTab()', () => {

        });

        it ('should return the tab that matches the specified hash', () => {

        });

        it ('should return currect tab on getCurrentTab()', () => {

        });

        it ('should return the href of the specified tab', () => {

        });

        it ('should return the content of the specified tab', () => {

        });

        it ('should show correct tab on init if hash present', () => {

        });

        it ('should change to previous tab on left arrow key press', () => {
            
        });

        it ('should change to previous tab on up arrow key press', () => {
            
        });

        it ('should change to next tab on right arrow key press', () => {
            
        });

        it ('should change to next tab on down arrow key press', () => {
            
        });
    });
});