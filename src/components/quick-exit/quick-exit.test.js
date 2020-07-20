const testObj = {};

jasmine.getFixtures().fixturesPath = 'base/src/';

import QuickExit from './quick-exit';

// mock window
const windowObj = {
    location: {
        replace: () => { }
    },
    history: {
        replaceState: () => { }
    }
};

describe('quick exit', () => {
    beforeEach(function () {
        loadFixtures('components/quick-exit/quick-exit.html');
        testObj.quickExit = new QuickExit(windowObj);
        testObj.quickExit.init();
    });

    it('should exit the page on esc key', () => {
        spyOn(testObj.quickExit, 'doQuickExit');

        const event = document.createEvent('Event');
        event.keyCode = 27;
        event.initEvent('keyup');
        document.dispatchEvent(event);

        expect(testObj.quickExit.doQuickExit).toHaveBeenCalled();
    });

    it('should not exit the page on other keys', () => {
        // and if not the esc key, behave as normal
        spyOn(testObj.quickExit, 'doQuickExit');

        const event = document.createEvent('Event');
        event.keyCode = 1;
        event.initEvent('keyup');
        document.dispatchEvent(event);

        expect(testObj.quickExit.doQuickExit).not.toHaveBeenCalled();
    });

    it('should exit the page on click of quick exit button', () => {
        spyOn(testObj.quickExit, 'doQuickExit');

        const quickExitButton = document.querySelector('.js-quick-exit');
        const event = new Event('click');
        quickExitButton.dispatchEvent(event);

        expect(testObj.quickExit.doQuickExit).toHaveBeenCalled();
    });

    it('should go to a specified URL', () => {
        spyOn(testObj.quickExit.window.location, 'replace');

        testObj.quickExit.doQuickExit({ preventDefault: () => { } });

        expect(testObj.quickExit.window.location.replace).toHaveBeenCalledWith('https://www.google.com/');
    });

    it('should replace the current history entry', () => {
        spyOn(testObj.quickExit.window.history, 'replaceState');

        testObj.quickExit.doQuickExit({ preventDefault: () => { } });

        expect(testObj.quickExit.window.history.replaceState).toHaveBeenCalledWith(Object({  }), '', '/');
    });

    it ('should empty the body', () => {
        testObj.quickExit.doQuickExit({ preventDefault: () => { } });

        expect(document.body.innerHTML).toEqual('');
    });
});
