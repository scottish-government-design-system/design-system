import { vi, beforeEach, describe, expect, it } from 'vitest';
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
    beforeEach(async () => {
        await loadHtml('src/components/hide-this-page/hide-this-page.html');
        testObj.hidePageElement = document.querySelector('.ds_hide-page');
    });

    describe('with mocked window object', () => {
        it('should exit the page on esc key', () => {
            testObj.hidePage = new HidePage(testObj.hidePageElement, windowObj);
            testObj.hidePage.init();

            vi.spyOn(testObj.hidePage, 'doHidePage').mockImplementation();

            const event = new Event('keyup');
            event.key = 'Escape';
            document.dispatchEvent(event);

            expect(testObj.hidePage.doHidePage).toHaveBeenCalled();
        });

        it('should not exit the page on other keys', () => {
            testObj.hidePage = new HidePage(testObj.hidePageElement, windowObj);
            testObj.hidePage.init();

            // and if not the esc key, behave as normal
            vi.spyOn(testObj.hidePage, 'doHidePage').mockImplementation();

            const event = new Event('keyup');
            event.key = 'A';
            document.dispatchEvent(event);

            expect(testObj.hidePage.doHidePage).not.toHaveBeenCalled();
        });

        it('should exit the page on click of hide page button', () => {
            testObj.hidePage = new HidePage(testObj.hidePageElement, windowObj);
            testObj.hidePage.init();

            vi.spyOn(testObj.hidePage, 'doHidePage').mockImplementation();

            const hidePageButton = document.querySelector('.js-hide-page');
            const event = new Event('click');
            hidePageButton.dispatchEvent(event);

            expect(testObj.hidePage.doHidePage).toHaveBeenCalled();
        });

        it('should use window.location.replace to replace the current history entry and obfuscate the page', () => {
            testObj.hidePage = new HidePage(testObj.hidePageElement, windowObj);

            testObj.hidePage.init();

            vi.spyOn(testObj.hidePage.window.location, 'replace').mockImplementation();

            testObj.hidePage.doHidePage({ preventDefault: () => { } });

            expect(testObj.hidePage.window.location.replace).toHaveBeenCalled();
        });

        it('should go to a specified URL', () => {
            const hidePageButton = document.querySelector('.js-hide-page');
            hidePageButton.setAttribute('data-altlink', 'https://foo.scot');
            testObj.hidePage = new HidePage(testObj.hidePageElement, windowObj);

            testObj.hidePage.init();

            vi.spyOn(testObj.hidePage.window.location, 'replace').mockImplementation();

            testObj.hidePage.doHidePage({ preventDefault: () => { } });

            expect(testObj.hidePage.window.location.replace).toHaveBeenCalledWith('https://foo.scot');
        });

        it('should go to google if a URL has not been provided', () => {
            testObj.hidePage = new HidePage(testObj.hidePageElement, windowObj);
            testObj.hidePage.init();

            vi.spyOn(testObj.hidePage.window.location, 'replace').mockImplementation();

            testObj.hidePage.doHidePage({ preventDefault: () => { } });

            expect(testObj.hidePage.window.location.replace).toHaveBeenCalledWith('https://www.google.com');
        });

        it('should empty the body', () => {
            testObj.hidePage = new HidePage(testObj.hidePageElement, windowObj);
            testObj.hidePage.init();

            testObj.hidePage.doHidePage({ preventDefault: () => { } });

            expect(document.body.innerHTML).toEqual('');
        });
    });

    describe('with native window object', () => {
        beforeEach(function () {
            testObj.hidePage = new HidePage(testObj.hidePageElement);
            // we don't want to actually call this
            testObj.hidePage.doHidePage = function () { };
            testObj.hidePage.init();
        });

        it('should default to the using native window object', () => {
            expect(testObj.hidePage.window).toEqual(window);
        });
    });

    it('should not bind any events if the hide this page button is not present', async () => {
        // remove the button
        const hidePageButton = testObj.hidePageElement.querySelector('.js-hide-page');
        testObj.hidePageElement.removeChild(hidePageButton);

        testObj.hidePage = new HidePage(testObj.hidePageElement, windowObj);

        vi.spyOn(testObj.hidePage, 'attachKeyboardEvents').mockImplementation();
        vi.spyOn(testObj.hidePage, 'attachMouseEvents').mockImplementation();

        testObj.hidePage.init();

        expect(testObj.hidePage.attachKeyboardEvents).not.toHaveBeenCalled();
        expect(testObj.hidePage.attachMouseEvents).not.toHaveBeenCalled();
    });
});
