const testObj = {};

jasmine.getFixtures().fixturesPath = 'base/src/';

import Details from './details';

describe('details', () => {
    beforeEach(function () {
        loadFixtures('components/details/details.html');
    });

    describe('native details element', () => {
        it('should just work', () => {
            testObj.detailsElement = document.getElementById('native');
            testObj.detailsModule = new Details(testObj.detailsElement);
            testObj.detailsModule.init();
            // nothing to do
        });
    });

    describe('fallback details element', () => {
        beforeEach(() => {
            testObj.detailsElement = document.getElementById('fallback');
            testObj.detailsModule = new Details(testObj.detailsElement);
        });

        it('should toggle the display of the contents element on click of the summary element', () => {
            testObj.detailsModule.init();

            spyOn(testObj.detailsModule, 'openDetails').and.callThrough();
            spyOn(testObj.detailsModule, 'closeDetails').and.callThrough();

            const titleElement = testObj.detailsElement.querySelector('.ds_details__summary');
            const event = new Event('click');
            titleElement.dispatchEvent(event);

            expect(testObj.detailsElement.getAttribute('open')).toEqual('open');

            titleElement.dispatchEvent(event);

            expect(testObj.detailsElement.getAttribute('open')).toBeNull();
        });

        it('should toggle the display of the contents element on keyboard operation of the summary element', () => {
            testObj.detailsModule.init();

            spyOn(testObj.detailsModule, 'openDetails').and.callThrough();
            spyOn(testObj.detailsModule, 'closeDetails').and.callThrough();

            const titleElement = testObj.detailsElement.querySelector('.ds_details__summary');
            const event = document.createEvent('Event');
            event.keyCode = 32;
            event.initEvent('keypress');
            titleElement.dispatchEvent(event);

            expect(testObj.detailsElement.getAttribute('open')).toEqual('open');

            titleElement.dispatchEvent(event);

            expect(testObj.detailsElement.getAttribute('open')).toBeNull();
        });

        it('should not interfere with other keypresses', () => {
            testObj.detailsModule.init();

            spyOn(testObj.detailsModule, 'openDetails');

            const titleElement = testObj.detailsElement.querySelector('.ds_details__summary');
            const event = document.createEvent('Event');
            event.keyCode = 81;
            event.initEvent('keypress');
            titleElement.dispatchEvent(event);

            expect(testObj.detailsModule.openDetails).not.toHaveBeenCalled();
        });

        it('should swallow a space keyup event', () => {
            testObj.detailsModule.init();

            spyOn(testObj.detailsModule, 'openDetails');

            const titleElement = testObj.detailsElement.querySelector('.ds_details__summary');
            const event = document.createEvent('Event');
            event.keyCode = 32;
            event.initEvent('keyup');
            titleElement.dispatchEvent(event);

            expect(testObj.detailsModule.openDetails).not.toHaveBeenCalled();

            // cover a final branch that does nothing
            event.keyCode = 81;
            event.initEvent('keyup');
            titleElement.dispatchEvent(event);

            expect(testObj.detailsModule.openDetails).not.toHaveBeenCalled();
        });
    });

    describe('fake details element', () => {
        beforeEach(() => {
            testObj.detailsElement = document.getElementById('fake');
            testObj.detailsModule = new Details(testObj.detailsElement);
        });

        it('should toggle the display of the contents element on click of the summary element', () => {
            testObj.detailsModule.init();

            spyOn(testObj.detailsModule, 'openDetails').and.callThrough();
            spyOn(testObj.detailsModule, 'closeDetails').and.callThrough();

            const titleElement = testObj.detailsElement.querySelector('.ds_details__summary');
            const event = new Event('click');
            titleElement.dispatchEvent(event);

            expect(testObj.detailsElement.getAttribute('data-open')).toEqual('open');

            titleElement.dispatchEvent(event);

            expect(testObj.detailsElement.getAttribute('data-open')).toBeNull();
        });

        it('should toggle the display of the contents element on keyboard operation of the summary element', () => {
            testObj.detailsModule.init();

            spyOn(testObj.detailsModule, 'openDetails').and.callThrough();
            spyOn(testObj.detailsModule, 'closeDetails').and.callThrough();

            const titleElement = testObj.detailsElement.querySelector('.ds_details__summary');
            const event = document.createEvent('Event');
            event.keyCode = 32;
            event.initEvent('keypress');
            titleElement.dispatchEvent(event);

            expect(testObj.detailsElement.getAttribute('data-open')).toEqual('open');

            titleElement.dispatchEvent(event);

            expect(testObj.detailsElement.getAttribute('data-open')).toBeNull();
        });
    });
});
