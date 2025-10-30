import { vi } from 'vitest';
import loadHtml from '../../../loadHtml';
import HidePage from './hide-this-page';

// mock window
const windowObj = {
    location: {
        replace: () => { }
    },
    history: {
        replaceState: () => { }
    },
    open: () => { }
};

const testObj = {};

describe('hide page', () => {
    describe('with mocked window object', () => {
        beforeEach(async () => {
            await loadHtml('src/components/hide-this-page/hide-this-page.html');
        });

        it('should exit the page on esc key', () => {
            testObj.hidePage = new HidePage(windowObj);
            testObj.hidePage.init();

            vi.spyOn(testObj.hidePage, 'doHidePage').mockImplementation();

            const event = document.createEvent('Event');
            event.key = 'Escape';
            event.initEvent('keyup');
            document.dispatchEvent(event);

            expect(testObj.hidePage.doHidePage).toHaveBeenCalled();
        });

        it('should not exit the page on other keys', () => {
            testObj.hidePage = new HidePage(windowObj);
            testObj.hidePage.init();

            // and if not the esc key, behave as normal
            vi.spyOn(testObj.hidePage, 'doHidePage').mockImplementation();

            const event = document.createEvent('Event');
            event.keyCode = 1;
            event.initEvent('keyup');
            document.dispatchEvent(event);

            expect(testObj.hidePage.doHidePage).not.toHaveBeenCalled();
        });

        it('should exit the page on click of hide page button', () => {
            testObj.hidePage = new HidePage(windowObj);
            testObj.hidePage.init();

            vi.spyOn(testObj.hidePage, 'doHidePage').mockImplementation();

            const hidePageButton = document.querySelector('.js-hide-page');
            const event = new Event('click');
            hidePageButton.dispatchEvent(event);

            expect(testObj.hidePage.doHidePage).toHaveBeenCalled();
        });

        it('should go to a specified URL', () => {
            testObj.hidePage = new HidePage(windowObj);
            const hidePageButton = document.querySelector('.js-hide-page');
            hidePageButton.setAttribute('data-altlink', 'https://foo.scot');

            testObj.hidePage.init();

            vi.spyOn(testObj.hidePage.window.location, 'replace').mockImplementation();

            testObj.hidePage.doHidePage({ preventDefault: () => { } });

            expect(testObj.hidePage.window.location.replace).toHaveBeenCalledWith('https://foo.scot');
        });

        it('should go to google if a URL has not been provided', () => {
            testObj.hidePage = new HidePage(windowObj);
            testObj.hidePage.init();

            vi.spyOn(testObj.hidePage.window.location, 'replace').mockImplementation();

            testObj.hidePage.doHidePage({ preventDefault: () => { } });

            expect(testObj.hidePage.window.location.replace).toHaveBeenCalledWith('https://www.google.com');
        });

        // note: this might not be testable with this test tool. disabling spec.
        it.skip('should replace the current history entry', () => {
            testObj.hidePage = new HidePage(windowObj);
            testObj.hidePage.init();

            vi.spyOn(testObj.hidePage.window.history, 'replaceState').mockImplementation();

            testObj.hidePage.doHidePage({ preventDefault: () => { } });

            expect(testObj.hidePage.window.history.replaceState).toHaveBeenCalledWith(Object({}), '', '/');
        });

        it('should empty the body', () => {
            testObj.hidePage = new HidePage(windowObj);
            testObj.hidePage.init();

            testObj.hidePage.doHidePage({ preventDefault: () => { } });

            expect(document.body.innerHTML).toEqual('');
        });
    });

    describe('with native window object', () => {
        beforeEach(function () {
            testObj.hidePage = new HidePage();
            // we don't want to actually call this
            testObj.hidePage.doHidePage = function () { };
            testObj.hidePage.init();
        });

        it('should default to the using native window object', () => {
            expect(testObj.hidePage.window).toEqual(window);
        });
    });

    it('should not bind any events if the hide this page button is not present', async () => {
        await loadHtml('src/components/hide-this-page/hide-this-page.html');
        // remove the button
        const hidePageButton = document.querySelector('.js-hide-page');
        hidePageButton.parentElement.remove(hidePageButton);

        testObj.hidePage = new HidePage(windowObj);

        vi.spyOn(testObj.hidePage, 'attachKeyboardEvents').mockImplementation();
        vi.spyOn(testObj.hidePage, 'attachMouseEvents').mockImplementation();

        testObj.hidePage.init();

        expect(testObj.hidePage.attachKeyboardEvents).not.toHaveBeenCalled();
        expect(testObj.hidePage.attachMouseEvents).not.toHaveBeenCalled();
    });
});
