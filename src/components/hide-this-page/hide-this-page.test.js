const testObj = {};

jasmine.getFixtures().fixturesPath = 'base/src/';

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

describe('hide page', () => {
    describe('with mocked window object', () => {
        beforeEach(function () {
            loadFixtures('components/hide-this-page/hide-this-page.html');
            testObj.hidePage = new HidePage(windowObj);
            testObj.hidePage.init();
        });

        it('should exit the page on esc key', () => {
            spyOn(testObj.hidePage, 'doHidePage');

            const event = document.createEvent('Event');
            event.keyCode = 27;
            event.initEvent('keyup');
            document.dispatchEvent(event);

            expect(testObj.hidePage.doHidePage).toHaveBeenCalled();
        });

        it('should not exit the page on other keys', () => {
            // and if not the esc key, behave as normal
            spyOn(testObj.hidePage, 'doHidePage');

            const event = document.createEvent('Event');
            event.keyCode = 1;
            event.initEvent('keyup');
            document.dispatchEvent(event);

            expect(testObj.hidePage.doHidePage).not.toHaveBeenCalled();
        });

        it('should exit the page on click of hide page button', () => {
            spyOn(testObj.hidePage, 'doHidePage');

            const hidePageButton = document.querySelector('.js-hide-page');
            const event = new Event('click');
            hidePageButton.dispatchEvent(event);

            expect(testObj.hidePage.doHidePage).toHaveBeenCalled();
        });

        it('should go to a specified URL', () => {
            spyOn(testObj.hidePage.window.location, 'replace');

            testObj.hidePage.doHidePage({ preventDefault: () => { } });

            expect(testObj.hidePage.window.location.replace).toHaveBeenCalledWith('https://www.google.co.uk');
        });

        xit('should replace the current history entry', () => {
            spyOn(testObj.hidePage.window.history, 'replaceState');

            testObj.hidePage.doHidePage({ preventDefault: () => { } });

            expect(testObj.hidePage.window.history.replaceState).toHaveBeenCalledWith(Object({}), '', '/');
        });

        it('should empty the body', () => {
            testObj.hidePage.doHidePage({ preventDefault: () => { } });

            expect(document.body.innerHTML).toEqual('');
        });
    });

    describe('with native window object', () => {
        beforeEach(function () {
            loadFixtures('components/hide-this-page/hide-this-page.html');
            testObj.hidePage = new HidePage();
            // we don't want to actually call this
            testObj.hidePage.doHidePage = function () { };
            testObj.hidePage.init();
        });

        it('should default to the using native window object', () => {
            expect(testObj.hidePage.window).toEqual(window);
        });
    });
});
