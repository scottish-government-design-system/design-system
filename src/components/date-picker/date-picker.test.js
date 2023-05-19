let testObj = {};

jasmine.getFixtures().fixturesPath = 'base/src/';

import DSDatePicker from './date-picker';

function leadingZeroes(value, length = 2) {
    let ret = value.toString();

    while (ret.length < length) {
        ret = '0' + ret.toString();
    }

    return ret;
}

describe('date picker', () => {
    const keycodes = {
        'tab': 9,
        'pageup': 33,
        'pagedown': 34,
        'end': 35,
        'home': 36,
        'left': 37,
        'up': 38,
        'right': 39,
        'down': 40
    };

    beforeEach(() => {
        loadFixtures('components/date-picker/date-picker.html');
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
            expect(testObj.datePickerElement.parentNode.querySelector('.js-calendar-button')).toBeTruthy();
        });

        it('should add a calendar button to the input wrapper (multiple input)', () => {
            testObj.datePickerElement = document.querySelector('#multiple');
            testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement);
            testObj.datePickerModule.init();
            expect(testObj.datePickerElement.parentNode.querySelector('.js-calendar-button')).toBeTruthy();
        });

        it('should add a calendar dialog', () => {
            testObj.datePickerElement = document.querySelector('#basic');
            testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement);
            testObj.datePickerModule.init();
            expect(testObj.datePickerElement.parentNode.parentNode.querySelector('.ds_datepicker__dialog')).toBeTruthy();
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

            expect(testObj.datePickerModule.dialogElement.classList.contains('ds_datepicker__dialog--open')).toBeTruthy();
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // current date is today
            expect(testObj.datePickerModule.currentDate).toEqual(today);

            // displayed date is today
            expect(document.activeElement.innerText).toEqual(today.getDate().toString());
        });

        it('should focus on today when opening the dialog with invalid value in the input element', () => {
            testObj.datePickerModule.inputElement.value = 'nonsense';
            testObj.datePickerModule.openDialog();

            expect(testObj.datePickerModule.dialogElement.classList.contains('ds_datepicker__dialog--open')).toBeTruthy();
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // current date is today
            expect(testObj.datePickerModule.currentDate).toEqual(today);

            // focused element is today
            expect(document.activeElement.innerText).toEqual(today.getDate().toString());
        });

        it('should focus on date in the input element (if complete and valid) when opening the dialog (single input)', () => {
            testObj.datePickerModule.inputElement.value = '06/01/2020';

            testObj.datePickerModule.openDialog();

            expect(testObj.datePickerModule.dialogElement.classList.contains('ds_datepicker__dialog--open')).toBeTruthy();
            const targetDate = new Date('01/06/2020');

            // current date is today
            expect(testObj.datePickerModule.currentDate).toEqual(targetDate);

            // focused element is today
            expect(document.activeElement.innerText).toEqual(targetDate.getDate().toString());
        });

        it('should focus on date in the input element (if complete and valid) when opening the dialog (multiple input)', () => {
            let datePickerElement = document.querySelector('#multiple');
            let datePickerModule = new DSDatePicker(datePickerElement);
            datePickerModule.init();

            datePickerModule.dateInput.value = '06';
            datePickerModule.monthInput.value = '01';
            datePickerModule.yearInput.value = '2020';

            datePickerModule.openDialog();

            expect(datePickerModule.dialogElement.classList.contains('ds_datepicker__dialog--open')).toBeTruthy();
            const targetDate = new Date('01/06/2020');

            // current date is today
            expect(datePickerModule.currentDate).toEqual(targetDate);

            // focused element is today
            expect(document.activeElement.innerText).toEqual(targetDate.getDate().toString());
        });

        it('should focus on the calendar button closing the dialog', () => {
            testObj.datePickerModule.openDialog();
            testObj.datePickerModule.closeDialog();

            expect(testObj.datePickerModule.dialogElement.classList.contains('ds_datepicker__dialog--open')).toBeFalsy();

            // focused element is calendar button
            expect(document.activeElement.classList.contains('js-calendar-button')).toBeTruthy();
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

        it('next month', () => {
            const ppp = new Date(testObj.datePickerModule.currentDate);
            ppp.setMonth(ppp.getMonth() + 1);
            testObj.datePickerModule.focusNextMonth({ preventDefault: function () { } });
            expect(testObj.datePickerModule.currentDate).toEqual(ppp);
        });

        it('previous month', () => {
            const ppp = new Date(testObj.datePickerModule.currentDate);
            ppp.setMonth(ppp.getMonth() - 1);
            testObj.datePickerModule.focusPreviousMonth({ preventDefault: function () { } });
            expect(testObj.datePickerModule.currentDate).toEqual(ppp);
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
            const ppp = new Date(testObj.datePickerModule.currentDate);
            ppp.setMonth(ppp.getMonth() + 1);
            ppp.setDate(1);
            testObj.datePickerModule.focusNextMonth({ preventDefault: function () { } }, false);
            expect(testObj.datePickerModule.currentDate).toEqual(ppp);
        });

        it('previous month without focusing', () => {
            const ppp = new Date(testObj.datePickerModule.currentDate);
            ppp.setMonth(ppp.getMonth() - 1);
            ppp.setDate(1);
            testObj.datePickerModule.focusPreviousMonth({ preventDefault: function () { } }, false);
            expect(testObj.datePickerModule.currentDate).toEqual(ppp);
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

        it('go to new date (beyond min date)', () => {
            testObj.datePickerElement = document.querySelector('#minmaxdate');
            testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement);
            testObj.datePickerModule.currentDate = new Date('06/06/2020');
            testObj.datePickerModule.init();

            testObj.datePickerModule.goToDate(new Date('06/06/2019'));

            expect(testObj.datePickerModule.currentDate).toEqual(new Date('01/06/2020'));
        });

        it('go to new date (beyond max date)', () => {
            testObj.datePickerElement = document.querySelector('#minmaxdate');
            testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement);
            testObj.datePickerModule.currentDate = new Date('06/06/2020');
            testObj.datePickerModule.init();

            testObj.datePickerModule.goToDate(new Date('06/06/2021'));

            expect(testObj.datePickerModule.currentDate).toEqual(new Date('01/06/2021'));
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
            expect(testObj.datePickerModule.dialogElement.querySelector('.js-datepicker-grid').querySelector('[tabindex="0"]').innerText).toEqual('6');

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

            expect(testObj.datePickerModule.dialogElement.querySelector('.js-datepicker-grid').querySelector('.ds_datepicker__current').innerText).toEqual('8');
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
            spyOn(testObj.datePickerModule, 'focusNextYear');

            const button = testObj.datePickerModule.dialogElement.querySelector('.js-datepicker-next-year');

            event = document.createEvent('Event');
            event.initEvent('click');
            button.dispatchEvent(event);

            expect(testObj.datePickerModule.focusNextYear).toHaveBeenCalled();
        });

        it('should go to the next month on click of "next month" button', () => {
            testObj.datePickerModule.openDialog();
            spyOn(testObj.datePickerModule, 'focusNextMonth');

            const button = testObj.datePickerModule.dialogElement.querySelector('.js-datepicker-next-month');

            event = document.createEvent('Event');
            event.initEvent('click');
            button.dispatchEvent(event);

            expect(testObj.datePickerModule.focusNextMonth).toHaveBeenCalled();
        });

        it('should go to the previous month on click of "previous month" button', () => {
            testObj.datePickerModule.openDialog();
            spyOn(testObj.datePickerModule, 'focusPreviousMonth');

            const button = testObj.datePickerModule.dialogElement.querySelector('.js-datepicker-prev-month');

            event = document.createEvent('Event');
            event.initEvent('click');
            button.dispatchEvent(event);

            expect(testObj.datePickerModule.focusPreviousMonth).toHaveBeenCalled();
        });

        it('should go to the previous year on click of "previous year" button', () => {
            testObj.datePickerModule.openDialog();
            spyOn(testObj.datePickerModule, 'focusPreviousYear');

            const button = testObj.datePickerModule.dialogElement.querySelector('.js-datepicker-prev-year');

            event = document.createEvent('Event');
            event.initEvent('click');
            button.dispatchEvent(event);

            expect(testObj.datePickerModule.focusPreviousYear).toHaveBeenCalled();
        });

        it('should close the dialog on click of the "cancel" button', () => {
            testObj.datePickerModule.openDialog();
            spyOn(testObj.datePickerModule, 'closeDialog');

            const button = testObj.datePickerModule.dialogElement.querySelector('.js-datepicker-cancel');

            event = document.createEvent('Event');
            event.initEvent('click');
            button.dispatchEvent(event);

            expect(testObj.datePickerModule.closeDialog).toHaveBeenCalled();
        });

        it('should select the date on click of the "ok" button', () => {
            testObj.datePickerModule.openDialog();

            const button = testObj.datePickerModule.dialogElement.querySelector('.js-datepicker-ok');

            event = document.createEvent('Event');
            event.initEvent('click');
            button.dispatchEvent(event);

            // expected date is today's date
            const expectedDate = new Date();
            const expectedDateText = `${leadingZeroes(expectedDate.getDate())}/${leadingZeroes(expectedDate.getMonth() + 1)}/${expectedDate.getFullYear()}`;

            expect(testObj.datePickerModule.inputElement.value).toEqual(expectedDateText);
        });

        it('should toggle the display of the dialog on click of the calendar button', () => {
            spyOn(testObj.datePickerModule, 'openDialog').and.callThrough();
            spyOn(testObj.datePickerModule, 'closeDialog').and.callThrough();

            const button = testObj.datePickerModule.calendarButtonElement;

            event = document.createEvent('Event');
            event.initEvent('click');
            button.dispatchEvent(event);
            expect(testObj.datePickerModule.openDialog).toHaveBeenCalled();

            event = document.createEvent('Event');
            event.initEvent('click');
            button.dispatchEvent(event);
            expect(testObj.datePickerModule.closeDialog).toHaveBeenCalled();
        });

        it('should cycle to the first enabled button when tabbing from the last enabled button', () => {
            testObj.datePickerModule.openDialog();

            const enabledButtons = [].slice.call(testObj.datePickerModule.dialogElement.querySelectorAll('button:not([tabindex="-1"]):not(:disabled)'));
            const firstEnabledButton = enabledButtons[0];
            const lastEnabledButton = enabledButtons[enabledButtons.length - 1];

            lastEnabledButton.focus();

            event = document.createEvent('Event');
            event.keyCode = keycodes.tab;
            event.initEvent('keydown');
            document.activeElement.dispatchEvent(event);

            expect (document.activeElement).toEqual(firstEnabledButton);
        });

        it('should cycle to the last enabled button when reverse-tabbing from the first enabled button', () => {
            testObj.datePickerModule.openDialog();

            const enabledButtons = [].slice.call(testObj.datePickerModule.dialogElement.querySelectorAll('button:not([tabindex="-1"]):not(:disabled)'));
            const firstEnabledButton = enabledButtons[0];
            const lastEnabledButton = enabledButtons[enabledButtons.length - 1];

            firstEnabledButton.focus();

            event = document.createEvent('Event');
            event.keyCode = keycodes.tab;
            event.shiftKey = true;
            event.initEvent('keydown');
            document.activeElement.dispatchEvent(event);

            expect (document.activeElement).toEqual(lastEnabledButton);
        });

        it('other keypresses on first/last buttons take default behaviour', () => {
            testObj.datePickerModule.openDialog();

            const enabledButtons = [].slice.call(testObj.datePickerModule.dialogElement.querySelectorAll('button:not([tabindex="-1"]):not(:disabled)'));
            const firstEnabledButton = enabledButtons[0];
            const lastEnabledButton = enabledButtons[enabledButtons.length - 1];

            firstEnabledButton.focus();
            event = document.createEvent('Event');
            event.keyCode = keycodes.up;
            event.initEvent('keydown');
            document.activeElement.dispatchEvent(event);

            lastEnabledButton.focus();
            event = document.createEvent('Event');
            event.keyCode = keycodes.up;
            event.initEvent('keydown');
            document.activeElement.dispatchEvent(event);
        });

        it('should close the calendar on click of any non-calendar element', () => {
            event = document.createEvent('Event');
            event.initEvent('mouseup');

            testObj.datePickerModule.openDialog();
            expect(testObj.datePickerModule.dialogElement.classList.contains('ds_datepicker__dialog--open')).toBeTrue();

            document.body.dispatchEvent(event);
            expect(testObj.datePickerModule.dialogElement.classList.contains('ds_datepicker__dialog--open')).toBeFalse();
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
            spyOn(testObj.datePickerModule, 'focusPreviousDay');

            event = document.createEvent('Event');
            event.keyCode = keycodes.left;
            event.initEvent('keydown');
            document.activeElement.dispatchEvent(event);

            expect(testObj.datePickerModule.focusPreviousDay).toHaveBeenCalled();
        });

        it('right cursor goes to next day', () => {
            spyOn(testObj.datePickerModule, 'focusNextDay');

            event = document.createEvent('Event');
            event.keyCode = keycodes.right;
            event.initEvent('keydown');
            document.activeElement.dispatchEvent(event);

            expect(testObj.datePickerModule.focusNextDay).toHaveBeenCalled();
        });

        it('up cursor goes to previous week', () => {
            spyOn(testObj.datePickerModule, 'focusPreviousWeek');

            event = document.createEvent('Event');
            event.keyCode = keycodes.up;
            event.initEvent('keydown');
            document.activeElement.dispatchEvent(event);

            expect(testObj.datePickerModule.focusPreviousWeek).toHaveBeenCalled();
        });

        it('down cursor goes to next week', () => {
            spyOn(testObj.datePickerModule, 'focusNextWeek');

            event = document.createEvent('Event');
            event.keyCode = keycodes.down;
            event.initEvent('keydown');
            document.activeElement.dispatchEvent(event);

            expect(testObj.datePickerModule.focusNextWeek).toHaveBeenCalled();
        });

        it('home goes to first day of week', () => {
            spyOn(testObj.datePickerModule, 'focusFirstDayOfWeek').and.callThrough();

            event = document.createEvent('Event');
            event.keyCode = keycodes.home;
            event.initEvent('keydown');
            document.activeElement.dispatchEvent(event);

            expect(testObj.datePickerModule.focusFirstDayOfWeek).toHaveBeenCalled();
        });

        it('end goes to first day of week', () => {
            spyOn(testObj.datePickerModule, 'focusLastDayOfWeek').and.callThrough();

            event = document.createEvent('Event');
            event.keyCode = keycodes.end;
            event.initEvent('keydown');
            document.activeElement.dispatchEvent(event);

            expect(testObj.datePickerModule.focusLastDayOfWeek).toHaveBeenCalled();
        });

        it('pageup goes to previous month', () => {
            spyOn(testObj.datePickerModule, 'focusPreviousMonth').and.callThrough();

            event = document.createEvent('Event');
            event.keyCode = keycodes.pageup;
            event.initEvent('keydown');
            document.activeElement.dispatchEvent(event);

            expect(testObj.datePickerModule.focusPreviousMonth).toHaveBeenCalled();
        });

        it('shift-pageup goes to previous year', () => {
            spyOn(testObj.datePickerModule, 'focusPreviousYear');

            event = document.createEvent('Event');
            event.keyCode = keycodes.pageup;
            event.shiftKey = true;
            event.initEvent('keydown');
            document.activeElement.dispatchEvent(event);

            expect(testObj.datePickerModule.focusPreviousYear).toHaveBeenCalled();
        });

        it('pagedown goes to next month', () => {
            spyOn(testObj.datePickerModule, 'focusNextMonth').and.callThrough();

            event = document.createEvent('Event');
            event.keyCode = keycodes.pagedown;
            event.initEvent('keydown');
            document.activeElement.dispatchEvent(event);

            expect(testObj.datePickerModule.focusNextMonth).toHaveBeenCalled();
        });

        it('shift-pagedown goes to next year', () => {
            spyOn(testObj.datePickerModule, 'focusNextYear');

            event = document.createEvent('Event');
            event.keyCode = keycodes.pagedown;
            event.shiftKey = true;
            event.initEvent('keydown');
            document.activeElement.dispatchEvent(event);

            expect(testObj.datePickerModule.focusNextYear).toHaveBeenCalled();
        });

        it('any other key behaves normally', () => {
            spyOn(testObj.datePickerModule, 'closeDialog');

            event = document.createEvent('Event');
            event.keyCode = 1;
            event.initEvent('keydown');
            document.activeElement.dispatchEvent(event);
        });

        it('click selects the day', () => {
            // pick a day
            const dayButton = testObj.datePickerModule.dialogElement.querySelector('button[tabindex="0"]');

            event = document.createEvent('Event');
            event.initEvent('click');
            dayButton.dispatchEvent(event);

            // expected date is today's date
            const expectedDate = new Date();
            const expectedDateText = `${leadingZeroes(expectedDate.getDate())}/${leadingZeroes(expectedDate.getMonth() + 1)}/${expectedDate.getFullYear()}`;
            expect(testObj.datePickerModule.inputElement.value).toEqual(expectedDateText);
        });
    });

    describe('calendar with disabled dates, keyboard interactions:', () => {
        beforeEach(() => {
            testObj.datePickerElement = document.querySelector('#basic');
            testObj.datePickerModule = new DSDatePicker(testObj.datePickerElement, {
                disabledDates: [
                    new Date(2023, 3, 9),
                    new Date(2023, 3, 10),
                    new Date(2023, 3, 11),
                    new Date(2023, 3, 15)
                ]
            });
            testObj.datePickerModule.init();
        });

        it('moving to next day should skip disabled days', () => {
            testObj.datePickerModule.currentDate = new Date(2023, 3, 14);
            testObj.datePickerModule.openDialog();

            event = document.createEvent('Event');
            event.keyCode = keycodes.right;
            event.initEvent('keydown');
            document.activeElement.dispatchEvent(event);

            // 15th is disabled, expect 16th
            expect(testObj.datePickerModule.currentDate).toEqual(new Date(2023, 3, 16));
        });

        it('moving to previous day should skip disabled days', () => {
            testObj.datePickerModule.currentDate = new Date(2023, 3, 12);
            testObj.datePickerModule.openDialog();

            event = document.createEvent('Event');
            event.keyCode = keycodes.left;
            event.initEvent('keydown');
            document.activeElement.dispatchEvent(event);

            // 9th-11th disabled, expect 8th
            expect(testObj.datePickerModule.currentDate).toEqual(new Date(2023, 3, 8));
        });

        it('moving to next week should skip disabled days', () => {
            testObj.datePickerModule.currentDate = new Date(2023, 3, 8);
            testObj.datePickerModule.openDialog();

            event = document.createEvent('Event');
            event.keyCode = keycodes.down;
            event.initEvent('keydown');
            document.activeElement.dispatchEvent(event);

            // 15th is disabled, expect the following week (22nd)
            expect(testObj.datePickerModule.currentDate).toEqual(new Date(2023, 3, 22));
        });

        it('moving to previous week should skip disabled days', () => {
            testObj.datePickerModule.currentDate = new Date(2023, 3, 22);
            testObj.datePickerModule.openDialog();

            event = document.createEvent('Event');
            event.keyCode = keycodes.up;
            event.initEvent('keydown');
            document.activeElement.dispatchEvent(event);

            // 15th is disabled, expect the previous week (8th)
            expect(testObj.datePickerModule.currentDate).toEqual(new Date(2023, 3, 8));
        });

        it('moving to first day of week should focus the first non-disabled day', () => {
            testObj.datePickerModule.currentDate = new Date(2023, 3, 13);
            testObj.datePickerModule.openDialog();

            event = document.createEvent('Event');
            event.keyCode = keycodes.home;
            event.initEvent('keydown');
            document.activeElement.dispatchEvent(event);

            // 9th-11th is disabled, expect the next available day (12th)
            expect(testObj.datePickerModule.currentDate).toEqual(new Date(2023, 3, 12));
        });

        it('moving to last day of week should focus the last non-disabled day', () => {
            testObj.datePickerModule.currentDate = new Date(2023, 3, 13);
            testObj.datePickerModule.openDialog();

            event = document.createEvent('Event');
            event.keyCode = keycodes.end;
            event.initEvent('keydown');
            document.activeElement.dispatchEvent(event);

            // 15th is disabled, expect the first available day (14th)
            expect(testObj.datePickerModule.currentDate).toEqual(new Date(2023, 3, 14));
        });

        it('moving to next month should skip to first non-disabled day', () => {
            testObj.datePickerModule.currentDate = new Date(2023, 2, 10);
            testObj.datePickerModule.openDialog();

            event = document.createEvent('Event');
            event.keyCode = keycodes.pagedown;
            event.initEvent('keydown');
            document.activeElement.dispatchEvent(event);

            expect(testObj.datePickerModule.currentDate).toEqual(new Date(2023, 3, 12));
        });

        it('moving to previous month should skip to first non-disabled day', () => {
            testObj.datePickerModule.currentDate = new Date(2023, 4, 10);
            testObj.datePickerModule.openDialog();

            event = document.createEvent('Event');
            event.keyCode = keycodes.pageup;
            event.initEvent('keydown');
            document.activeElement.dispatchEvent(event);

            expect(testObj.datePickerModule.currentDate).toEqual(new Date(2023, 3, 8));
        });

        it('moving to next year should skip to first non-disabled day', () => {
            testObj.datePickerModule.currentDate = new Date(2022, 3, 10);
            testObj.datePickerModule.openDialog();

            event = document.createEvent('Event');
            event.keyCode = keycodes.pagedown;
            event.shiftKey = true;
            event.initEvent('keydown');
            document.activeElement.dispatchEvent(event);

            expect(testObj.datePickerModule.currentDate).toEqual(new Date(2023, 3, 12));
        });

        it('moving to previous year should skip to first non-disabled day', () => {
            testObj.datePickerModule.currentDate = new Date(2024, 3, 10);
            testObj.datePickerModule.openDialog();

            event = document.createEvent('Event');
            event.keyCode = keycodes.pageup;
            event.shiftKey = true;
            event.initEvent('keydown');
            document.activeElement.dispatchEvent(event);

            expect(testObj.datePickerModule.currentDate).toEqual(new Date(2023, 3, 8));
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

        spyOn(testObj.datePickerModule, 'dateSelectCallback');

        testObj.datePickerModule.selectDate(new Date('1/8/2020'));

        expect(testObj.datePickerModule.dateSelectCallback).toHaveBeenCalledWith(new Date('1/8/2020'));
    });
});
