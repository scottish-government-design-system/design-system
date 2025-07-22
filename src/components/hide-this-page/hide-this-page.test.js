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
        });

        it('should exit the page on esc key', () => {
            testObj.hidePage = new HidePage(windowObj);
            testObj.hidePage.init();

            spyOn(testObj.hidePage, 'doHidePage');

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
            spyOn(testObj.hidePage, 'doHidePage');

            const event = document.createEvent('Event');
            event.keyCode = 1;
            event.initEvent('keyup');
            document.dispatchEvent(event);

            expect(testObj.hidePage.doHidePage).not.toHaveBeenCalled();
        });

        it('should exit the page on click of hide page button', () => {
            testObj.hidePage = new HidePage(windowObj);
            testObj.hidePage.init();

            spyOn(testObj.hidePage, 'doHidePage');

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

            spyOn(testObj.hidePage.window.location, 'replace');

            testObj.hidePage.doHidePage({ preventDefault: () => { } });

            expect(testObj.hidePage.window.location.replace).toHaveBeenCalledWith('https://foo.scot');
        });

        it('should go to google if a URL has not been provided', () => {
            testObj.hidePage = new HidePage(windowObj);
            testObj.hidePage.init();

            spyOn(testObj.hidePage.window.location, 'replace');

            testObj.hidePage.doHidePage({ preventDefault: () => { } });

            expect(testObj.hidePage.window.location.replace).toHaveBeenCalledWith('https://www.google.com');
        });

        // note: this might not be testable with this test tool. disabling spec.
        xit('should replace the current history entry', () => {
            testObj.hidePage = new HidePage(windowObj);
            testObj.hidePage.init();

            spyOn(testObj.hidePage.window.history, 'replaceState');

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

    it('should not bind any events if the hide this page button is not present', () => {
        loadFixtures('components/hide-this-page/hide-this-page.html');
        // remove the button
        const hidePageButton = document.querySelector('.js-hide-page');
        hidePageButton.parentNode.remove(hidePageButton);

        testObj.hidePage = new HidePage(windowObj);

        spyOn(testObj.hidePage, 'attachKeyboardEvents');
        spyOn(testObj.hidePage, 'attachMouseEvents');

        testObj.hidePage.init();

        expect(testObj.hidePage.attachKeyboardEvents).not.toHaveBeenCalled();
        expect(testObj.hidePage.attachMouseEvents).not.toHaveBeenCalled();
    });
});
