import { vi, afterEach, beforeEach, describe, expect, it } from 'vitest';
import loadHtml from '../../../loadHtml';
import DSDatePicker from './date-picker';

function leadingZeroes(value, length = 2) {
    let ret = value.toString();

    while (ret.length < length) {
        ret = '0' + ret.toString();
    }

    return ret;
}

let testObj = {};

describe('date picker', () => {
    beforeEach(async () => {
        await loadHtml('src/components/date-picker/date-picker.html');
    });

    afterEach(() => {
        testObj = {};
    });

    it('should exit gracefully if instantiated without an element param', () => {
        testObj.datePickerModule = new DSDatePicker();

        // no syntax errors = test success
    });

    describe('init()', () => {
        it('should exit gracefully if initialised without an input element', () => {
            testObj.datePickerElement = document.querySelector('#noinput');
            testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement);
            testObj.datePickerModule.init();
            // no syntax errors = test success
        });

        it('should add a calendar button to the input wrapper (single input)', () => {
            testObj.datePickerElement = document.querySelector('#basic');
            testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement);
            testObj.datePickerModule.init();
            expect(testObj.datePickerElement.parentNode.querySelector('.js-calendar-button')).toBeDefined();
        });

        it('should add a calendar button to the input wrapper (multiple input)', () => {
            testObj.datePickerElement = document.querySelector('#multiple');
            testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement);
            testObj.datePickerModule.init();
            expect(testObj.datePickerElement.parentNode.querySelector('.js-calendar-button')).toBeDefined();
        });

        it('should add a calendar dialog', () => {
            testObj.datePickerElement = document.querySelector('#basic');
            testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement);
            testObj.datePickerModule.init();
            expect(testObj.datePickerElement.parentNode.parentNode.querySelector('.ds_datepicker__dialog')).toBeDefined();
        });

        describe('min date', () => {
            it('should set a min date if one is specified as a data attribute', () => {
                testObj.datePickerElement = document.querySelector('#minmaxdate');
                testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement);
                testObj.datePickerModule.init();
                expect(testObj.datePickerModule.minDate).toEqual(new Date('01/06/2020'));
            });

            it('should set a min date if one is specified in options param, YMD format', () => {
                testObj.datePickerElement = document.querySelector('#minmaxdate');

                const options = {
                    minDate: new Date('07/01/2020')
                };

                testObj.datePickerElement.querySelector('.ds_input').dataset.dateformat = 'YMD';

                testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement, options);
                testObj.datePickerModule.init();

                expect(testObj.datePickerModule.minDate).toEqual(new Date('07/01/2020'));
            });

            it('should set a min date if one is specified as a data attribute, MDY format', () => {
                testObj.datePickerElement = document.querySelector('#minmaxdate');

                const options = {
                    minDate: new Date('07/01/2020')
                };

                testObj.datePickerElement.querySelector('.ds_input').dataset.dateformat = 'MDY';

                testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement, options);
                testObj.datePickerModule.init();

                expect(testObj.datePickerModule.minDate).toEqual(new Date('07/01/2020'));
            });

            it('should set a min date if one is specified as a data attribute, DMY format', () => {
                testObj.datePickerElement = document.querySelector('#minmaxdate');

                const options = {
                    minDate: new Date('07/01/2020')
                };

                testObj.datePickerElement.querySelector('.ds_input').dataset.dateformat = 'DMY';

                testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement, options);
                testObj.datePickerModule.init();

                expect(testObj.datePickerModule.minDate).toEqual(new Date('07/01/2020'));
            });
        });

        it('should set a max date if one is specified as a data attribute', () => {
            testObj.datePickerElement = document.querySelector('#minmaxdate');
            testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement);
            testObj.datePickerModule.init();
            expect(testObj.datePickerModule.maxDate).toEqual(new Date('01/06/2021'));
        });

        it('should make the current date the earliest permitted date if the earliest permittted date is later than today', () => {
            testObj.datePickerElement = document.querySelector('#mindateoutofbounds');
            testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement);
            testObj.datePickerModule.init();
            expect(testObj.datePickerModule.currentDate).toEqual(new Date('01/06/2120'));
        });

        it('should make the current date the latest permitted date if the latest permittted date is earlier than today', () => {
            testObj.datePickerElement = document.querySelector('#maxdateoutofbounds');
            testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement);
            testObj.datePickerModule.init();
            expect(testObj.datePickerModule.currentDate).toEqual(new Date('01/06/1920'));
        });

        it('should set min and max dates if they are passed as parameters', () => {
            testObj.datePickerElement = document.querySelector('#basic');
            testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement, { minDate: new Date('01/06/2020'), maxDate: new Date('01/06/2021')});
            testObj.datePickerModule.init();
            expect(testObj.datePickerModule.minDate).toEqual(new Date('01/06/2020'));
            expect(testObj.datePickerModule.maxDate).toEqual(new Date('01/06/2021'));
        });

        it('should support presupplied dates in dd/mm/yyyy format', () => {
            testObj.datePickerElement = document.querySelector('#minmaxdate');
            testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement);
            testObj.datePickerModule.inputElement.dataset.dateformat = 'DMY';
            testObj.datePickerModule.inputElement.dataset.mindate = '01/07/2020';
            testObj.datePickerModule.init();
            expect(testObj.datePickerModule.minDate).toEqual(new Date('07/01/2020'));
        });

        it('should support presupplied dates in mm/dd/yyyy format', () => {
            testObj.datePickerElement = document.querySelector('#minmaxdate');
            testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement);
            testObj.datePickerModule.inputElement.dataset.dateformat = 'MDY';
            testObj.datePickerModule.inputElement.dataset.mindate = '07/01/2020';
            testObj.datePickerModule.init();
            expect(testObj.datePickerModule.minDate).toEqual(new Date('07/01/2020'));
        });

        it('should support presupplied dates in yyyy/mm/dd format', () => {
            testObj.datePickerElement = document.querySelector('#minmaxdate');
            testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement);
            testObj.datePickerModule.inputElement.dataset.dateformat = 'YMD';
            testObj.datePickerModule.inputElement.dataset.mindate = '2020/07/01';
            testObj.datePickerModule.init();
            expect(testObj.datePickerModule.minDate).toEqual(new Date('07/01/2020'));
        });

        it('should ignore presupplied dates that do not match the expected format', () => {
            testObj.datePickerElement = document.querySelector('#minmaxdate');
            testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement);
            testObj.datePickerModule.inputElement.dataset.dateformat = 'YMD';
            testObj.datePickerModule.inputElement.dataset.mindate = 'nonsense';
            testObj.datePickerModule.init();
            expect(testObj.datePickerModule.minDate).toBeNull();
        });
    });

    describe('functions', () => {
        beforeEach(() => {
            // setup
            testObj.datePickerElement = document.querySelector('#basic');
            testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement);
            testObj.datePickerModule.init();
        });

        it('should focus on today when opening the dialog with no value in the input element', () => {
            testObj.datePickerModule.openDialog();

            expect(testObj.datePickerModule.dialogElement.classList.contains('ds_datepicker__dialog--open')).toBe(true);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // current date is today
            expect(testObj.datePickerModule.currentDate).toEqual(today);

            // displayed date is today
            expect(document.activeElement.textContent).toEqual(today.getDate().toString());
        });

        it('should focus on today when opening the dialog with invalid value in the input element', () => {
            testObj.datePickerModule.inputElement.value = 'nonsense';
            testObj.datePickerModule.openDialog();

            expect(testObj.datePickerModule.dialogElement.classList.contains('ds_datepicker__dialog--open')).toBe(true);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // current date is today
            expect(testObj.datePickerModule.currentDate).toEqual(today);

            // focused element is today
            expect(document.activeElement.textContent).toEqual(today.getDate().toString());
        });

        it('should focus on date in the input element (if complete and valid) when opening the dialog (single input)', () => {
            testObj.datePickerModule.inputElement.value = '06/01/2020';

            testObj.datePickerModule.openDialog();

            expect(testObj.datePickerModule.dialogElement.classList.contains('ds_datepicker__dialog--open')).toBe(true);
            const targetDate = new Date('01/06/2020');

            // current date is today
            expect(testObj.datePickerModule.currentDate).toEqual(targetDate);

            // focused element is today
            expect(document.activeElement.textContent).toEqual(targetDate.getDate().toString());
        });

        it('should focus on date in the input element (if complete and valid) when opening the dialog (multiple input)', () => {
            let datePickerElement = document.querySelector('#multiple');
            let datePickerModule = new DSDatePicker(datePickerElement);
            datePickerModule.init();

            datePickerModule.dateInput.value = '06';
            datePickerModule.monthInput.value = '01';
            datePickerModule.yearInput.value = '2020';

            datePickerModule.openDialog();

            expect(datePickerModule.dialogElement.classList.contains('ds_datepicker__dialog--open')).toBe(true);
            const targetDate = new Date('01/06/2020');

            // current date is today
            expect(datePickerModule.currentDate).toEqual(targetDate);

            // focused element is today
            expect(document.activeElement.textContent).toEqual(targetDate.getDate().toString());
        });

        it('should focus on the calendar button closing the dialog', () => {
            testObj.datePickerModule.openDialog();
            testObj.datePickerModule.closeDialog();

            expect(testObj.datePickerModule.dialogElement.classList.contains('ds_datepicker__dialog--open')).toBe(false);

            // focused element is calendar button
            expect(document.activeElement.classList.contains('js-calendar-button')).toBe(true);
        });
    });

    describe('dialog navigation methods', () => {
        beforeEach(() => {
            // setup
            testObj.datePickerElement = document.querySelector('#basic');
            testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement);
            testObj.datePickerModule.init();

            testObj.currentDate = new Date('06/01/2020');

            // open dialog
            testObj.datePickerModule.openDialog();
        });

        it('next day', () => {
            const ppp = new Date(testObj.datePickerModule.currentDate);
            ppp.setDate(ppp.getDate() + 1);
            testObj.datePickerModule.focusNextDay();
            expect(testObj.datePickerModule.currentDate).toEqual(ppp);
        });

        it('previous day', () => {
            const ppp = new Date(testObj.datePickerModule.currentDate);
            ppp.setDate(ppp.getDate() - 1);
            testObj.datePickerModule.focusPreviousDay();
            expect(testObj.datePickerModule.currentDate).toEqual(ppp);
        });

        it('next week', () => {
            const ppp = new Date(testObj.datePickerModule.currentDate);
            ppp.setDate(ppp.getDate() + 7);
            testObj.datePickerModule.focusNextWeek();
            expect(testObj.datePickerModule.currentDate).toEqual(ppp);
        });

        it('previous week', () => {
            const ppp = new Date(testObj.datePickerModule.currentDate);
            ppp.setDate(ppp.getDate() - 7);
            testObj.datePickerModule.focusPreviousWeek();
            expect(testObj.datePickerModule.currentDate).toEqual(ppp);
        });

        it('first day of week', () => {
            const ppp = new Date(testObj.datePickerModule.currentDate);
            ppp.setDate(ppp.getDate() - ppp.getDay());
            testObj.datePickerModule.focusFirstDayOfWeek();
            expect(testObj.datePickerModule.currentDate).toEqual(ppp);
        });

        it('last day of week', () => {
            const ppp = new Date(testObj.datePickerModule.currentDate);
            ppp.setDate(ppp.getDate() - ppp.getDay() + 6);
            testObj.datePickerModule.focusLastDayOfWeek();
            expect(testObj.datePickerModule.currentDate).toEqual(ppp);
        });

        // general case: not the end of a long month
        it('next month', () => {
            testObj.datePickerModule.currentDate = new Date('10/15/2025');
            const expected = new Date('11/15/2025')
            testObj.datePickerModule.focusNextMonth({ preventDefault: function () { } });
            expect(testObj.datePickerModule.currentDate).toEqual(expected);
        });

        // special case: next month from the end of a long month into a short month (e.g. oct -> nov)
        it('next month from Oct 31', () => {
            testObj.datePickerModule.currentDate = new Date('10/31/2025');
            const expected = new Date('11/30/2025')
            testObj.datePickerModule.focusNextMonth({ preventDefault: function () { } });
            expect(testObj.datePickerModule.currentDate).toEqual(expected);
        });

        // general case: not the end of a long month
        it('previous month', () => {
            testObj.datePickerModule.currentDate = new Date('10/15/2025');
            const expected = new Date('09/15/2025')
            testObj.datePickerModule.focusPreviousMonth({ preventDefault: function () { } });
            expect(testObj.datePickerModule.currentDate).toEqual(expected);
        });

        // special case: prev month from the end of a long month into a short month (e.g. oct -> nov)
        it('prev month from Oct 31', () => {
            testObj.datePickerModule.currentDate = new Date('10/31/2025');
            const expected = new Date('09/30/2025')
            testObj.datePickerModule.focusPreviousMonth({ preventDefault: function () { } });
            expect(testObj.datePickerModule.currentDate).toEqual(expected);
        });

        it('next year', () => {
            const ppp = new Date(testObj.datePickerModule.currentDate);
            ppp.setFullYear(ppp.getFullYear() + 1);
            testObj.datePickerModule.focusNextYear({ preventDefault: function () { } });
            expect(testObj.datePickerModule.currentDate).toEqual(ppp);
        });

        it('previous year', () => {
            const ppp = new Date(testObj.datePickerModule.currentDate);
            ppp.setFullYear(ppp.getFullYear() - 1);
            testObj.datePickerModule.focusPreviousYear({ preventDefault: function () { } });
            expect(testObj.datePickerModule.currentDate).toEqual(ppp);
        });

        it('next month without focusing', () => {
            testObj.datePickerModule.currentDate = new Date('10/15/2025');
            const expected = new Date('11/01/2025')
            testObj.datePickerModule.focusNextMonth({ preventDefault: function () { } }, false);
            expect(testObj.datePickerModule.currentDate).toEqual(expected);
        });

        it('previous month without focusing', () => {
            testObj.datePickerModule.currentDate = new Date('10/15/2025');
            const expected = new Date('09/01/2025')
            testObj.datePickerModule.focusPreviousMonth({ preventDefault: function () { } }, false);
            expect(testObj.datePickerModule.currentDate).toEqual(expected);
        });

        it('next year without focusing', () => {
            const ppp = new Date(testObj.datePickerModule.currentDate);
            ppp.setFullYear(ppp.getFullYear() + 1);
            ppp.setDate(1);
            testObj.datePickerModule.focusNextYear({ preventDefault: function () { } }, false);
            expect(testObj.datePickerModule.currentDate).toEqual(ppp);
        });

        it('previous year without focusing', () => {
            const ppp = new Date(testObj.datePickerModule.currentDate);
            ppp.setFullYear(ppp.getFullYear() - 1);
            ppp.setDate(1);
            testObj.datePickerModule.focusPreviousYear({ preventDefault: function () { } }, false);
            expect(testObj.datePickerModule.currentDate).toEqual(ppp);
        });
    });

    describe('selection of new date', () => {
        it('go to new date (no restrictions)', () => {
            testObj.datePickerElement = document.querySelector('#basic');
            testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement);
            testObj.datePickerModule.currentDate = new Date('06/06/2020');
            testObj.datePickerModule.init();

            testObj.datePickerModule.goToDate(new Date('06/06/2019'));

            expect(testObj.datePickerModule.currentDate).toEqual(new Date('06/06/2019'));
        });

        // set current date
        it('should show the current date in the calendar and focus on it', () => {
            testObj.datePickerElement = document.querySelector('#basic');
            testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement);
            testObj.datePickerModule.currentDate = new Date('06/06/2020');
            testObj.datePickerModule.init();
            testObj.datePickerModule.openDialog();

            // expect only one date to be in tab order
            expect(testObj.datePickerModule.dialogElement.querySelector('.js-datepicker-grid').querySelectorAll('[tabindex="0"]').length).toEqual(1);

            // expect that date button to be current date
            expect(testObj.datePickerModule.dialogElement.querySelector('.js-datepicker-grid').querySelector('[tabindex="0"]').textContent).toEqual('6');

            // expect that date button to be have focus
            expect(testObj.datePickerModule.dialogElement.querySelector('.js-datepicker-grid').querySelector('[tabindex="0"]')).toEqual(document.activeElement);
        });

        it('should highlight the currently-input date (i.e. date from text input)', () => {
            testObj.datePickerElement = document.querySelector('#basic');
            testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement);
            testObj.datePickerModule.inputElement.value = '08/06/2020';
            testObj.datePickerModule.currentDate = new Date('06/06/2020');
            testObj.datePickerModule.init();
            testObj.datePickerModule.openDialog();

            expect(testObj.datePickerModule.dialogElement.querySelector('.js-datepicker-grid').querySelector('.ds_datepicker__current').textContent).toEqual('8');
        });

        it('should restore the default button text if the input is blurred', () => {
            testObj.datePickerElement = document.querySelector('#basic');
            testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement);
            testObj.datePickerModule.inputElement.value = '08/06/2020';
            testObj.datePickerModule.currentDate = new Date('06/06/2020');
            testObj.datePickerModule.init();
            testObj.datePickerModule.openDialog();

            const buttonSpan = testObj.datePickerElement.querySelector('.ds_datepicker__button span');
            buttonSpan.textContent = 'foo';

            const event = new MouseEvent( 'blur');
            testObj.datePickerModule.inputElement.dispatchEvent(event);

            expect(buttonSpan.textContent).toEqual('Choose date');
        });
    });

    describe('selecting a date', () => {
        beforeEach(() => {
            testObj.datePickerElement = document.querySelector('#basic');
            testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement);
            testObj.datePickerModule.inputElement.value = '01/07/2020';
        });

        it('should update the text input when a date is selected (default = DMY)', () => {
            testObj.datePickerModule.init();
            testObj.datePickerModule.selectDate(new Date('1/8/2020'));
            expect(testObj.datePickerModule.inputElement.value).toEqual('08/01/2020');
        });

        it('should update the text input when a date is selected (DMY)', () => {
            testObj.datePickerModule.inputElement.dataset.dateformat = 'DMY';
            testObj.datePickerModule.init();
            testObj.datePickerModule.selectDate(new Date('1/8/2020'));
            expect(testObj.datePickerModule.inputElement.value).toEqual('08/01/2020');
        });

        it('should update the text input when a date is selected (MDY)', () => {
            testObj.datePickerModule.inputElement.dataset.dateformat = 'MDY';
            testObj.datePickerModule.init();
            testObj.datePickerModule.selectDate(new Date('1/8/2020'));
            expect(testObj.datePickerModule.inputElement.value).toEqual('01/08/2020');
        });

        it('should update the text input when a date is selected (YMD)', () => {
            testObj.datePickerModule.inputElement.dataset.dateformat = 'YMD';
            testObj.datePickerModule.init();
            testObj.datePickerModule.selectDate(new Date('1/8/2020'));
            expect(testObj.datePickerModule.inputElement.value).toEqual('2020/01/08');
        });

        it('should update the text inputs when a date is selected (multiple inputs)', () => {
            let datePickerElement = document.querySelector('#multiple');
            let datePickerModule = new DSDatePicker(datePickerElement);

            datePickerModule.init();
            datePickerModule.selectDate(new Date('1/8/2020'));
            expect(datePickerModule.dateInput.value).toEqual('8');
            expect(datePickerModule.monthInput.value).toEqual('1');
            expect(datePickerModule.yearInput.value).toEqual('2020');
        });
    });

    describe('calendar events', () => {
        beforeEach(() => {
            testObj.datePickerElement = document.querySelector('#basic');
            testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement);
            testObj.datePickerModule.init();
        });

        it('should go to the next year on click of "next year" button', () => {
            testObj.datePickerModule.openDialog();
            vi.spyOn(testObj.datePickerModule, 'focusNextYear').mockImplementation();

            const button = testObj.datePickerModule.dialogElement.querySelector('.js-datepicker-next-year');

            const event = new MouseEvent( 'click', {
                bubbles: true
            });
            button.dispatchEvent(event);

            expect(testObj.datePickerModule.focusNextYear).toHaveBeenCalled();
        });

        it('should go to the next month on click of "next month" button', () => {
            testObj.datePickerModule.openDialog();
            vi.spyOn(testObj.datePickerModule, 'focusNextMonth').mockImplementation();

            const button = testObj.datePickerModule.dialogElement.querySelector('.js-datepicker-next-month');

            const event = new MouseEvent( 'click', {
                bubbles: true
            });
            button.dispatchEvent(event);

            expect(testObj.datePickerModule.focusNextMonth).toHaveBeenCalled();
        });

        it('should go to the previous month on click of "previous month" button', () => {
            testObj.datePickerModule.openDialog();
            vi.spyOn(testObj.datePickerModule, 'focusPreviousMonth').mockImplementation();

            const button = testObj.datePickerModule.dialogElement.querySelector('.js-datepicker-prev-month');

            const event = new MouseEvent( 'click', {
                bubbles: true
            });
            button.dispatchEvent(event);

            expect(testObj.datePickerModule.focusPreviousMonth).toHaveBeenCalled();
        });

        it('should go to the previous year on click of "previous year" button', () => {
            testObj.datePickerModule.openDialog();
            vi.spyOn(testObj.datePickerModule, 'focusPreviousYear').mockImplementation();

            const button = testObj.datePickerModule.dialogElement.querySelector('.js-datepicker-prev-year');

            const event = new MouseEvent( 'click', {
                bubbles: true
            });
            button.dispatchEvent(event);

            expect(testObj.datePickerModule.focusPreviousYear).toHaveBeenCalled();
        });

        it('should close the dialog on click of the "cancel" button', () => {
            testObj.datePickerModule.openDialog();
            vi.spyOn(testObj.datePickerModule, 'closeDialog').mockImplementation();

            const button = testObj.datePickerModule.dialogElement.querySelector('.js-datepicker-cancel');

            const event = new MouseEvent( 'click', {
                bubbles: true
            });
            button.dispatchEvent(event);

            expect(testObj.datePickerModule.closeDialog).toHaveBeenCalled();
        });

        it('should select the date on click of the "ok" button', () => {
            testObj.datePickerModule.openDialog();

            const button = testObj.datePickerModule.dialogElement.querySelector('.js-datepicker-ok');

            const event = new MouseEvent( 'click', {
                bubbles: true
            });
            button.dispatchEvent(event);

            // expected date is today's date
            const expectedDate = new Date();
            const expectedDateText = `${leadingZeroes(expectedDate.getDate())}/${leadingZeroes(expectedDate.getMonth() + 1)}/${expectedDate.getFullYear()}`;

            expect(testObj.datePickerModule.inputElement.value).toEqual(expectedDateText);
        });

        it('should toggle the display of the dialog on click of the calendar button', () => {
            vi.spyOn(testObj.datePickerModule, 'openDialog');
            vi.spyOn(testObj.datePickerModule, 'closeDialog');

            const button = testObj.datePickerModule.calendarButtonElement;

            let event = new MouseEvent( 'click', {
                bubbles: true
            });
            button.dispatchEvent(event);
            expect(testObj.datePickerModule.openDialog).toHaveBeenCalled();

            event = new MouseEvent( 'click', {
                bubbles: true
            });
            button.dispatchEvent(event);
            expect(testObj.datePickerModule.closeDialog).toHaveBeenCalled();
        });

        it('should cycle to the first button when tabbing from the last button', () => {
            testObj.datePickerModule.openDialog();

            const buttons = [].slice.call(testObj.datePickerModule.dialogElement.querySelectorAll('button:not([tabindex="-1"])'));
            const firstButton = buttons[0];
            const lastButton = buttons[buttons.length - 1];

            lastButton.focus();

            const event = new KeyboardEvent( 'keydown' , {'key': 'Tab'} );
            document.activeElement.dispatchEvent(event);

            expect (document.activeElement).toEqual(firstButton);
        });

        it('should cycle to the last button when reverse-tabbing from the first button', () => {
            testObj.datePickerModule.openDialog();

            const buttons = [].slice.call(testObj.datePickerModule.dialogElement.querySelectorAll('button:not([tabindex="-1"])'));
            const firstButton = buttons[0];
            const lastButton = buttons[buttons.length - 1];

            firstButton.focus();

            const event = new KeyboardEvent( 'keydown' , {'key': 'Tab', 'shiftKey': true} );
            document.activeElement.dispatchEvent(event);

            expect (document.activeElement).toEqual(lastButton);
        });

        it('other keypresses on first/last buttons take default behaviour', () => {
            testObj.datePickerModule.openDialog();

            const enabledButtons = [].slice.call(testObj.datePickerModule.dialogElement.querySelectorAll('button:not([tabindex="-1"]):not(:disabled)'));
            const firstEnabledButton = enabledButtons[0];
            const lastEnabledButton = enabledButtons[enabledButtons.length - 1];

            firstEnabledButton.focus();
            const event = new KeyboardEvent( 'keydown' , {'key': 'UpArrow'} );
            document.activeElement.dispatchEvent(event);

            lastEnabledButton.focus();
            const event2 = new KeyboardEvent( 'keydown' , {'key': 'UpArrow'} );
            document.activeElement.dispatchEvent(event2);
        });

        it('should close the calendar on click of any non-calendar element', () => {
            const event = new MouseEvent( 'mouseup', {
                bubbles: true
            });

            testObj.datePickerModule.openDialog();
            expect(testObj.datePickerModule.dialogElement.classList.contains('ds_datepicker__dialog--open')).toBe(true);

            document.body.dispatchEvent(event);
            expect(testObj.datePickerModule.dialogElement.classList.contains('ds_datepicker__dialog--open')).toBe(false);
        });
    });

    describe('calendar day events', () => {
        beforeEach(() => {
            testObj.datePickerElement = document.querySelector('#basic');
            testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement);
            testObj.datePickerModule.init();
            testObj.datePickerModule.openDialog();
        });

        it('left cursor goes to previous day', () => {
            vi.spyOn(testObj.datePickerModule, 'focusPreviousDay').mockImplementation();

            const event = new KeyboardEvent( 'keydown' , {'key': 'ArrowLeft'} );
            document.activeElement.dispatchEvent(event);

            expect(testObj.datePickerModule.focusPreviousDay).toHaveBeenCalled();
        });

        it('right cursor goes to next day', () => {
            vi.spyOn(testObj.datePickerModule, 'focusNextDay').mockImplementation();

            const event = new KeyboardEvent( 'keydown' , {'key': 'ArrowRight'} );
            document.activeElement.dispatchEvent(event);

            expect(testObj.datePickerModule.focusNextDay).toHaveBeenCalled();
        });

        it('up cursor goes to previous week', () => {
            vi.spyOn(testObj.datePickerModule, 'focusPreviousWeek').mockImplementation();

            const event = new KeyboardEvent( 'keydown' , {'key': 'ArrowUp'} );
            document.activeElement.dispatchEvent(event);

            expect(testObj.datePickerModule.focusPreviousWeek).toHaveBeenCalled();
        });

        it('down cursor goes to next week', () => {
            vi.spyOn(testObj.datePickerModule, 'focusNextWeek').mockImplementation();

            const event = new KeyboardEvent( 'keydown' , {'key': 'ArrowDown'} );
            document.activeElement.dispatchEvent(event);

            expect(testObj.datePickerModule.focusNextWeek).toHaveBeenCalled();
        });

        it('home goes to first day of week', () => {
            vi.spyOn(testObj.datePickerModule, 'focusFirstDayOfWeek');

            const event = new KeyboardEvent( 'keydown' , {'key': 'Home'} );
            document.activeElement.dispatchEvent(event);

            expect(testObj.datePickerModule.focusFirstDayOfWeek).toHaveBeenCalled();
        });

        it('end goes to first day of week', () => {
            vi.spyOn(testObj.datePickerModule, 'focusLastDayOfWeek');

            const event = new KeyboardEvent( 'keydown' , {'key': 'End'} );
            document.activeElement.dispatchEvent(event);

            expect(testObj.datePickerModule.focusLastDayOfWeek).toHaveBeenCalled();
        });

        it('pageup goes to previous month', () => {
            vi.spyOn(testObj.datePickerModule, 'focusPreviousMonth');

            const event = new KeyboardEvent( 'keydown' , {'key': 'PageUp'} );
            document.activeElement.dispatchEvent(event);

            expect(testObj.datePickerModule.focusPreviousMonth).toHaveBeenCalled();
        });

        it('shift-pageup goes to previous year', () => {
            vi.spyOn(testObj.datePickerModule, 'focusPreviousYear').mockImplementation();

            const event = new KeyboardEvent( 'keydown' , {'key': 'PageUp', 'shiftKey': true} );
            document.activeElement.dispatchEvent(event);

            expect(testObj.datePickerModule.focusPreviousYear).toHaveBeenCalled();
        });

        it('pagedown goes to next month', () => {
            vi.spyOn(testObj.datePickerModule, 'focusNextMonth');

            const event = new KeyboardEvent( 'keydown' , {'key': 'PageDown'} );
            document.activeElement.dispatchEvent(event);

            expect(testObj.datePickerModule.focusNextMonth).toHaveBeenCalled();
        });

        it('shift-pagedown goes to next year', () => {
            vi.spyOn(testObj.datePickerModule, 'focusNextYear').mockImplementation();

            const event = new KeyboardEvent( 'keydown' , {'key': 'PageDown', 'shiftKey': true} );
            document.activeElement.dispatchEvent(event);

            expect(testObj.datePickerModule.focusNextYear).toHaveBeenCalled();
        });

        it('any other key behaves normally', () => {
            vi.spyOn(testObj.datePickerModule, 'closeDialog').mockImplementation();

            const event = new KeyboardEvent( 'keydown' , {'key': 'A'} );
            document.activeElement.dispatchEvent(event);
        });

        it('click selects the day', () => {
            // pick a day
            const dayButton = testObj.datePickerModule.dialogElement.querySelector('button[tabindex="0"]');

            const event = new MouseEvent( 'click', {
                bubbles: true
            });
            dayButton.dispatchEvent(event);

            // expected date is today's date
            const expectedDate = new Date();
            const expectedDateText = `${leadingZeroes(expectedDate.getDate())}/${leadingZeroes(expectedDate.getMonth() + 1)}/${expectedDate.getFullYear()}`;
            expect(testObj.datePickerModule.inputElement.value).toEqual(expectedDateText);
        });
    });

    describe('calendar with disabled dates', () => {
        beforeEach(() => {
            testObj.datePickerElement = document.querySelector('#basic');
        });

        it('should not permit the selection of a disabled date (provided in options)', () => {
            testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement, {
                disabledDates: [
                    new Date()
                ]
            });
            testObj.datePickerModule.init();

            vi.spyOn(testObj.datePickerModule, 'setDate').mockImplementation();

            testObj.datePickerModule.openDialog();

            // pick a day
            const dayButton = testObj.datePickerModule.dialogElement.querySelector('table button[aria-disabled]');

            const event = new MouseEvent( 'click', {
                bubbles: true
            });
            dayButton.dispatchEvent(event);

            expect(testObj.datePickerModule.setDate).not.toHaveBeenCalled();
        });

        it('should not permit the selection of a disabled date (provided in data attribute)', () => {
            const date = new Date();
            testObj.datePickerElement.dataset.disableddates = `${leadingZeroes(date.getDate())}/${leadingZeroes(date.getMonth()+1)}/${leadingZeroes(date.getFullYear())}`
            testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement);
            testObj.datePickerModule.init();

            vi.spyOn(testObj.datePickerModule, 'setDate').mockImplementation();

            testObj.datePickerModule.openDialog();

            // pick a day
            const dayButton = testObj.datePickerModule.dialogElement.querySelector('table button[aria-disabled]');

            const event = new MouseEvent( 'click', {
                bubbles: true
            });
            dayButton.dispatchEvent(event);

            expect(testObj.datePickerModule.setDate).not.toHaveBeenCalled();
        });
    });

    it('should fire a callback function on dialog close, if specified', () => {
        testObj.datePickerElement = document.querySelector('#basic');
        testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement, {
            dateSelectCallback: function (value) {
                console.log('my value is', value);
            }
        });

        testObj.datePickerModule.init();

        vi.spyOn(testObj.datePickerModule, 'dateSelectCallback').mockImplementation();

        testObj.datePickerModule.selectDate(new Date('1/8/2020'));

        expect(testObj.datePickerModule.dateSelectCallback).toHaveBeenCalledWith(new Date('1/8/2020'));
    });
});
