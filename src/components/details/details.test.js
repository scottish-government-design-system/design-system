import { vi } from 'vitest';
import loadHtml from '../../../loadHtml';
import Details from './details';

const testObj = {};

describe('details', () => {
    beforeEach(async () => {
        await loadHtml('src/components/details/details.html');
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

            vi.spyOn(testObj.detailsModule, 'openDetails');
            vi.spyOn(testObj.detailsModule, 'closeDetails');

            const titleElement = testObj.detailsElement.querySelector('.ds_details__summary');
            const event = new Event('click');
            titleElement.dispatchEvent(event);

            expect(testObj.detailsElement.getAttribute('open')).toEqual('open');

            titleElement.dispatchEvent(event);

            expect(testObj.detailsElement.getAttribute('open')).toBeNull();
        });

        it('should toggle the display of the contents element on keyboard operation of the summary element', () => {
            testObj.detailsModule.init();

            vi.spyOn(testObj.detailsModule, 'openDetails');
            vi.spyOn(testObj.detailsModule, 'closeDetails');

            const titleElement = testObj.detailsElement.querySelector('.ds_details__summary');
            const event = new Event('keypress');
            event.key = 'Enter';
            titleElement.dispatchEvent(event);

            expect(testObj.detailsElement.getAttribute('open')).toEqual('open');

            titleElement.dispatchEvent(event);

            expect(testObj.detailsElement.getAttribute('open')).toBeNull();
        });

        it('should not interfere with other keypresses', () => {
            testObj.detailsModule.init();

            vi.spyOn(testObj.detailsModule, 'openDetails').mockImplementation();

            const titleElement = testObj.detailsElement.querySelector('.ds_details__summary');
            const event = new Event('keypress');
            event.key = 'A';
            titleElement.dispatchEvent(event);

            expect(testObj.detailsModule.openDetails).not.toHaveBeenCalled();
        });

        it.only('should swallow a space keyup event', () => {
            testObj.detailsModule.init();

            vi.spyOn(testObj.detailsModule, 'openDetails').mockImplementation();

            const titleElement = testObj.detailsElement.querySelector('.ds_details__summary');
            const event = new Event('keyup');
            event.key = ' ';
            titleElement.dispatchEvent(event);

            expect(testObj.detailsModule.openDetails).not.toHaveBeenCalled();

            // cover a final branch that does nothing
            event.key = 'A';
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

            vi.spyOn(testObj.detailsModule, 'openDetails');
            vi.spyOn(testObj.detailsModule, 'closeDetails');

            const titleElement = testObj.detailsElement.querySelector('.ds_details__summary');
            const event = new Event('click');
            titleElement.dispatchEvent(event);

            expect(testObj.detailsElement.getAttribute('data-open')).toEqual('open');

            titleElement.dispatchEvent(event);

            expect(testObj.detailsElement.getAttribute('data-open')).toBeNull();
        });

        it('should toggle the display of the contents element on keyboard operation of the summary element', () => {
            testObj.detailsModule.init();

            vi.spyOn(testObj.detailsModule, 'openDetails');
            vi.spyOn(testObj.detailsModule, 'closeDetails');

            const titleElement = testObj.detailsElement.querySelector('.ds_details__summary');
            const event = new Event('keypress');
            event.key = ' ';
            titleElement.dispatchEvent(event);

            expect(testObj.detailsElement.getAttribute('data-open')).toEqual('open');

            titleElement.dispatchEvent(event);

            expect(testObj.detailsElement.getAttribute('data-open')).toBeNull();
        });
    });
});
