const testObj = {};

jasmine.getFixtures().fixturesPath = 'base/src/';

import Tabs from './tabs';

describe('tabs', () => {
    const keycodes = {
        'enter': 13,
        'space': 32,
        'left': 37,
        'up': 38,
        'right': 39,
        'down': 40
    };

    beforeEach(function () {
        loadFixtures('components/tabs/tabs.html');

        testObj.tabs = new Tabs(document.querySelector('.ds_tab-container'));
        testObj.tabs.init();
    });

    describe('tabs', () => {
        // check init

        // check focus prev
        it('should move focus to the next tab on press of "left"', () => {
            // focus on a tab
            testObj.tabs.tabHeaders[0].querySelector('button').focus();

            event = document.createEvent('Event');
            event.keyCode = keycodes.left;
            event.initEvent('keyup');
            document.activeElement.dispatchEvent(event);
            expect(document.activeElement === testObj.tabs.tabHeaders[2].querySelector('button')).toBeTrue();
        });

        it('should move focus to the next tab on press of "up"', () => {
            // focus on a tab
            testObj.tabs.tabHeaders[0].querySelector('button').focus();

            event = document.createEvent('Event');
            event.keyCode = keycodes.up;
            event.initEvent('keyup');
            document.activeElement.dispatchEvent(event);
            expect(document.activeElement === testObj.tabs.tabHeaders[2].querySelector('button')).toBeTrue();
        });

        // check focus next
        it('should move focus to the next tab on press of "right"', () => {
            // focus on a tab
            testObj.tabs.tabHeaders[0].querySelector('button').focus();

            event = document.createEvent('Event');
            event.keyCode = keycodes.right;
            event.initEvent('keyup');
            document.activeElement.dispatchEvent(event);
            expect(document.activeElement === testObj.tabs.tabHeaders[1].querySelector('button')).toBeTrue();
        });

        it('should move focus to the next tab on press of "down"', () => {
            // focus on a tab
            testObj.tabs.tabHeaders[0].querySelector('button').focus();

            event = document.createEvent('Event');
            event.keyCode = keycodes.down;
            event.initEvent('keyup');
            document.activeElement.dispatchEvent(event);
            expect(document.activeElement === testObj.tabs.tabHeaders[1].querySelector('button')).toBeTrue();
        });

        it('should change tab on click of tab', () => {
            spyOn(testObj.tabs, 'activateTab').and.callThrough();

            event = document.createEvent('Event');
            event.initEvent('click');
            testObj.tabs.tabHeaders[1].querySelector('button').dispatchEvent(event);

            expect(testObj.tabs.activateTab).toHaveBeenCalled();
            expect(testObj.tabs.tabContainer.querySelector('.ds_current') === testObj.tabs.tabHeaders[1]).toBeTrue();
        });

        // check activate
        it('chould change tabs on demand', () => {
            testObj.tabs.activateTab(testObj.tabs.tabHeaders[1]);

            expect(testObj.tabs.tabHeaders[1].classList.contains('ds_current')).toBeTrue();
            expect(window.getComputedStyle(testObj.tabs.tabHeaders[1].nextElementSibling).display).toEqual('block');
        });

        // check cycling focus
        it('should loop focus back around to the first element when moving past the last tab', () => {
            const eventObj = {
                preventDefault: () => { },
                stopPropagation: () => { }
            };

            testObj.tabs.focusNextTab(eventObj);
            testObj.tabs.focusNextTab(eventObj);
            testObj.tabs.focusNextTab(eventObj);

            expect(document.activeElement === testObj.tabs.tabHeaders[0].querySelector('.ds_tab__label')).toBeTrue();
        });

        it('should loop focus back around to the last element when moving back from the first tab', () => {
            const eventObj = {
                preventDefault: () => { },
                stopPropagation: () => { }
            };

            testObj.tabs.focusPreviousTab(eventObj);
            expect(document.activeElement === testObj.tabs.tabHeaders[2].querySelector('.ds_tab__label')).toBeTrue();

            testObj.tabs.focusPreviousTab(eventObj);
            testObj.tabs.focusPreviousTab(eventObj);
            testObj.tabs.focusPreviousTab(eventObj);
            expect(document.activeElement === testObj.tabs.tabHeaders[2].querySelector('.ds_tab__label')).toBeTrue();
        });

        // check tabindex
        it('should set tabindex to -1 on any inactive tabs', () => {
            // initial state
            expect (testObj.tabs.tabHeaders[0].querySelector('.ds_tab__label').getAttribute('tabindex')).toEqual('0');
            expect (testObj.tabs.tabHeaders[1].querySelector('.ds_tab__label').getAttribute('tabindex')).toEqual('-1');
            expect (testObj.tabs.tabHeaders[2].querySelector('.ds_tab__label').getAttribute('tabindex')).toEqual('-1');

            // change the selected tab
            testObj.tabs.activateTab(testObj.tabs.tabHeaders[1]);

            expect (testObj.tabs.tabHeaders[0].querySelector('.ds_tab__label').getAttribute('tabindex')).toEqual('-1');
            expect (testObj.tabs.tabHeaders[1].querySelector('.ds_tab__label').getAttribute('tabindex')).toEqual('0');
            expect (testObj.tabs.tabHeaders[2].querySelector('.ds_tab__label').getAttribute('tabindex')).toEqual('-1');
        });
    });


});
