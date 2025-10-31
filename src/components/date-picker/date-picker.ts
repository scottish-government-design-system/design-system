/* global document, window */
import elementIdModifier from '../../base/tools/id-modifier/id-modifier';

'use strict';

type CalendarDay = {
    init: Function;
    update: Function;
    click: Function;
    keyPress: Function;

    button: HTMLButtonElement;
    date: Date;
    isDisabled?: boolean
    isHidden?: boolean
}

class DSDatePicker {
    options: any;

    calendarButtonElement: HTMLButtonElement;
    dateInput: HTMLInputElement;
    datePickerParent: HTMLElement;
    dialogElement: HTMLElement;
    dialogTitleElement: HTMLElement;
    firstButtonInDialog: HTMLButtonElement;
    inputElement: HTMLInputElement;
    lastButtonInDialog: HTMLButtonElement;
    monthInput: HTMLInputElement;
    yearInput: HTMLInputElement;

    isMultipleInput: boolean;

    dateSelectCallback: Function;

    currentDate: Date;
    disabledDates: Date[];
    inputDate: Date;
    maxDate: Date;
    minDate: Date;

    calendarDays: CalendarDay[];

    dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    icons = {
        calendar_today: '<svg class="ds_icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/></svg>',
        chevron_left: '<svg focusable="false" class="ds_icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>',
        chevron_right: '<svg focusable="false" class="ds_icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>',
        double_chevron_left: '<svg focusable="false" class="ds_icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 16.6 17.6 18l-6-6 6-6L19 7.4 14.4 12l4.6 4.6Zm-6.6 0L11 18l-6-6 6-6 1.4 1.4L7.8 12l4.6 4.6Z"/></svg>',
        double_chevron_right: '<svg focusable="false" class="ds_icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.6 12 5 7.4 6.4 6l6 6-6 6L5 16.6 9.6 12Zm6.6 0-4.6-4.6L13 6l6 6-6 6-1.4-1.4 4.6-4.6Z"/></svg>',
    }

    constructor(el: HTMLElement, options = {}) {
        if (!el) {
            return;
        }

        this.datePickerParent = el;
        this.options = options;
        this.inputElement = this.datePickerParent.querySelector('input');
        this.isMultipleInput = el.classList.contains('ds_datepicker--multiple');
        this.dateInput = el.querySelector('.js-datepicker-date');
        this.monthInput = el.querySelector('.js-datepicker-month');
        this.yearInput = el.querySelector('.js-datepicker-year');

        this.currentDate = new Date();
        this.currentDate.setHours(0, 0, 0, 0);
        this.calendarDays = [];
        this.disabledDates = [];
    }

    init() {
        if (!this.inputElement || this.datePickerParent.classList.contains('js-initialised')) {
            return;
        }

        this.setOptions();

        // insert calendar button
        const calendarButtonTempContainer = document.createElement('div');
        calendarButtonTempContainer.innerHTML = this.buttonTemplate();
        this.calendarButtonElement = calendarButtonTempContainer.firstChild as HTMLButtonElement;
        this.calendarButtonElement.setAttribute('data-button', `datepicker-${this.inputElement.id}-toggle`);

        if (this.isMultipleInput) {
            this.inputElement.parentElement.parentElement.appendChild(this.calendarButtonElement);
        } else {
            this.inputElement.parentElement.appendChild(this.calendarButtonElement);
            this.inputElement.parentElement.classList.add('ds_input__wrapper--has-icon');
        }

        // insert dialog template
        const dialog = document.createElement('div');
        dialog.id = 'datepicker-' + elementIdModifier();
        dialog.setAttribute('class', 'ds_datepicker__dialog  datepickerDialog');
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-modal', 'true');
        dialog.innerHTML = this.dialogTemplate(dialog.id);
        this.calendarButtonElement.setAttribute('aria-controls', dialog.id);
        this.calendarButtonElement.setAttribute('aria-expanded', false.toString());

        this.dialogElement = dialog;
        this.datePickerParent.appendChild(dialog);

        this.dialogTitleElement = this.dialogElement.querySelector('.js-datepicker-month-year');

        this.setMinAndMaxDatesOnCalendar();

        // create calendar
        const tbody = this.datePickerParent.querySelector('tbody');
        let dayCount = 0;
        for (let i = 0; i < 6; i++) {
            // create row
            const row = tbody.insertRow(i);

            for (let j = 0; j < 7; j++) {
                // create cell (day)
                const cell = document.createElement('td');
                const dateButton = document.createElement('button');
                dateButton.type = 'button';
                dateButton.dataset.form = 'date-select';

                cell.appendChild(dateButton);
                row.appendChild(cell);

                const calendarDay = new DSCalendarDay(dateButton, dayCount, i, j, this);
                calendarDay.init();
                this.calendarDays.push(calendarDay);
                dayCount++;
            }
        }

        // add event listeners
        const prevMonthButton = this.dialogElement.querySelector('.js-datepicker-prev-month');
        const prevYearButton = this.dialogElement.querySelector('.js-datepicker-prev-year');
        const nextMonthButton = this.dialogElement.querySelector('.js-datepicker-next-month');
        const nextYearButton = this.dialogElement.querySelector('.js-datepicker-next-year');
        prevMonthButton.addEventListener('click', (event) => this.focusPreviousMonth(event, false));
        prevYearButton.addEventListener('click', (event) => this.focusPreviousYear(event, false));
        nextMonthButton.addEventListener('click', (event) => this.focusNextMonth(event, false));
        nextYearButton.addEventListener('click', (event) => this.focusNextYear(event, false));

        const dateInputFields = [this.inputElement, this.dateInput, this.monthInput, this.yearInput];
        dateInputFields.forEach(input => {
            if (input) {
                input.addEventListener('blur', () => { this.calendarButtonElement.querySelector('span').textContent = 'Choose date'; });
            }
        });

        const cancelButton = this.dialogElement.querySelector('.js-datepicker-cancel');
        const okButton = this.dialogElement.querySelector('.js-datepicker-ok');
        cancelButton.addEventListener('click', (event) => { event.preventDefault(); this.closeDialog(); });
        okButton.addEventListener('click', () => this.selectDate(this.currentDate));

        const dialogButtons = this.dialogElement.querySelectorAll('button:not([disabled="true"])');
        this.firstButtonInDialog = dialogButtons[0] as HTMLButtonElement;
        this.lastButtonInDialog = dialogButtons[dialogButtons.length - 1] as HTMLButtonElement;
        this.firstButtonInDialog.addEventListener('keydown', (event) => this.firstButtonKeyup(event));
        this.lastButtonInDialog.addEventListener('keydown', (event) => this.lastButtonKeyup(event));

        this.calendarButtonElement.addEventListener('click', (event) => this.toggleDialog(event));

        document.body.addEventListener('mouseup', (event) => this.backgroundClick(event));

        // populates calendar with inital dates, avoids Wave errors about null buttons
        this.updateCalendar();

        this.datePickerParent.classList.add('js-initialised');
    }

    addMonths(date: Date, months: number) {
        const tempDate = date.getDate();
        date.setMonth(date.getMonth() + +months);
        if (date.getDate() !== tempDate) {
          date.setDate(0);
        }
        return date;
    }

    buttonTemplate() {
        return `<button type="button" class="ds_button  ds_button--icon-only  ds_datepicker__button  ds_no-margin  js-calendar-button" aria-expanded="false">
            <span class="visually-hidden">Choose date</span>
            ${this.icons.calendar_today}
        </button>
        `;
    }

    dialogTemplate(id: string) {
        return `<div class="ds_datepicker__dialog__header">
        <div class="ds_datepicker__dialog__navbuttons">
            <button type="button" class="ds_button  ds_button--icon-only  js-datepicker-prev-year" aria-label="previous year" data-button="button-datepicker-prevyear">
                <span class="visually-hidden">Previous year</span>
                ${this.icons.double_chevron_left}
            </button>

            <button type="button" class="ds_button  ds_button--icon-only  js-datepicker-prev-month" aria-label="previous month" data-button="button-datepicker-prevmonth">
                <span class="visually-hidden">Previous month</span>
                ${this.icons.chevron_left}
            </button>
        </div>

        <h2 class="ds_datepicker__dialog__title  js-datepicker-month-year" aria-live="polite">June 2020</h2>

        <div class="ds_datepicker__dialog__navbuttons">
            <button type="button" class="ds_button  ds_button--icon-only  js-datepicker-next-month" aria-label="next month" data-button="button-datepicker-nextmonth">
                <span class="visually-hidden">Next month</span>
                ${this.icons.chevron_right}
            </button>

            <button type="button" class="ds_button  ds_button--icon-only  js-datepicker-next-year" aria-label="next year" data-button="button-datepicker-nextyear">
                <span class="visually-hidden">Next year</span>
                ${this.icons.double_chevron_right}
            </button>
        </div>
      </div>

      <table class="ds_datepicker__dialog__table  js-datepicker-grid" role="grid">
      <caption id="${id}-caption" class="ds_datepicker__dialog__table-caption">You can use the cursor keys to select a date</caption>
      <thead>
          <tr>
          <th scope="col">
            <span aria-hidden="true">Su</span>
            <span class="visually-hidden">Sunday</span>
          </th>
          <th scope="col">
            <span aria-hidden="true">Mo</span>
            <span class="visually-hidden">Monday</span>
          </th>
          <th scope="col">
            <span aria-hidden="true">Tu</span>
            <span class="visually-hidden">Tuesday</span>
          </th>
          <th scope="col">
            <span aria-hidden="true">We</span>
            <span class="visually-hidden">Wednesday</span>
          </th>
          <th scope="col">
            <span aria-hidden="true">Th</span>
            <span class="visually-hidden">Thursday</span>
          </th>
          <th scope="col">
            <span aria-hidden="true">Fr</span>
            <span class="visually-hidden">Friday</span>
          </th>
          <th scope="col">
            <span aria-hidden="true">Sa</span>
            <span class="visually-hidden">Saturday</span>
          </th>
          </tr>
      </thead>

      <tbody></tbody>
      </table>

      <div class="ds_datepicker__dialog__buttongroup">
      <button type="button" class="ds_button  ds_button--small  ds_button--cancel  js-datepicker-cancel" value="cancel" data-button="button-datepicker-cancel">Cancel</button>
      <button type="button" class="ds_button  ds_button--small  js-datepicker-ok" value="ok" data-button="button-datepicker-ok">OK</button>
      </div>`;
    }

    leadingZeroes(value: number, length = 2) {
        let ret = value.toString();

        while (ret.length < length) {
            ret = '0' + ret.toString();
        }

        return ret;
    }

    backgroundClick(event: MouseEvent) {
        const target = event.target as Node;
        if (this.isOpen() &&
            !this.dialogElement.contains(target) &&
            !this.inputElement.contains(target) &&
            !this.calendarButtonElement.contains(target)) {

            event.preventDefault();
            this.closeDialog();
        }
    }

    closeDialog() {
        this.dialogElement.classList.remove('ds_datepicker__dialog--open');
        this.calendarButtonElement.setAttribute('aria-expanded', false.toString());
        this.calendarButtonElement.focus();
    }

    firstButtonKeyup(event: KeyboardEvent) {
        if (event.key === 'Tab' && event.shiftKey) {
            this.lastButtonInDialog.focus();
            event.preventDefault();
        }
    }

    // day navigation
    focusNextDay(date = new Date(this.currentDate)) {
        date.setDate(date.getDate() + 1);
        this.goToDate(date);
    }

    focusPreviousDay(date = new Date(this.currentDate)) {
        date.setDate(date.getDate() - 1);
        this.goToDate(date);
    }

    // week navigation
    focusNextWeek(date = new Date(this.currentDate)) {
        date.setDate(date.getDate() + 7);
        this.goToDate(date);
    }

    focusPreviousWeek(date = new Date(this.currentDate)) {
        date.setDate(date.getDate() - 7);
        this.goToDate(date);
    }

    focusFirstDayOfWeek() {
        const date = new Date(this.currentDate);
        date.setDate(date.getDate() - date.getDay());
        this.goToDate(date);
    }

    focusLastDayOfWeek() {
        const date = new Date(this.currentDate);
        date.setDate(date.getDate() - date.getDay() + 6);
        this.goToDate(date);
    }

    // month navigation
    focusNextMonth(event: Event, focus = true) {
        event.preventDefault();
        const date = new Date(this.currentDate);
        this.addMonths(date, 1);
        this.goToDate(date, focus);
    }

    focusPreviousMonth (event: Event, focus = true) {
        event.preventDefault();
        const date = new Date(this.currentDate);
        this.addMonths(date, -1);
        this.goToDate(date, focus);
    }

    // year navigation
    focusNextYear (event: Event, focus = true) {
        event.preventDefault();
        const date = new Date(this.currentDate);
        date.setFullYear(date.getFullYear() + 1);
        this.goToDate(date, focus);
    }

    focusPreviousYear (event: Event, focus = true) {
        event.preventDefault();
        const date = new Date(this.currentDate);
        date.setFullYear(date.getFullYear() - 1);
        this.goToDate(date, focus);
    }

    formattedDateFromString(dateString: string, fallback = new Date()) {
        let formattedDate = null;
        const parts = dateString.split('/');

        if (dateString.match(/\d{1,4}\/\d{1,2}\/\d{1,4}/)) {
            switch (this.datePickerParent.dataset.dateformat) {
                case 'YMD':
                formattedDate = new Date(`${parts[1]}/${parts[2]}/${parts[0]}`);
                break;
            case 'MDY':
                formattedDate = new Date(`${parts[0]}/${parts[1]}/${parts[2]}`);
                break;
            case 'DMY':
            default:
                formattedDate = new Date(`${parts[1]}/${parts[0]}/${parts[2]}`);
                break;
            }
        }

        if (formattedDate instanceof Date && !isNaN(formattedDate.getTime())) {
            return formattedDate;
        } else {
            return fallback;
        }
    }

    formattedDateHuman(date: Date) {
        return `${this.dayLabels[date.getDay()]} ${date.getDate()} ${this.monthLabels[date.getMonth()]} ${date.getFullYear()}`;
    }

    goToDate(date: Date, focus = false) {
        const current = this.currentDate;

        this.currentDate = date;

        if (current.getMonth() !== this.currentDate.getMonth() || current.getFullYear() !== this.currentDate.getFullYear()) {
            this.updateCalendar();
        }

        this.setCurrentDate(focus);
    }

    isDisabledDate(date: Date) {
        let disabled = false;

        if (this.minDate && this.minDate > date) {
            disabled = true;
        }

        if (this.maxDate && this.maxDate < date) {
            disabled = true;
        }

        for (const disabledDate of this.disabledDates) {
            if (date.toDateString() === disabledDate.toDateString()) {
                disabled = true;
            }
        }
        return disabled;
    }

    isOpen() {
        return this.dialogElement.classList.contains('ds_datepicker__dialog--open');
    }

    lastButtonKeyup(event: KeyboardEvent) {
        if (event.key === 'Tab' && !event.shiftKey) {
            this.firstButtonInDialog.focus();
            event.preventDefault();
        }
    }

    openDialog() {
        // display the dialog
        this.dialogElement.classList.add('ds_datepicker__dialog--open');
        this.calendarButtonElement.setAttribute('aria-expanded', true.toString());

        // position the dialog
        let leftOffset: string;

        // get the date from the input element(s)
        let dateAsString: string;

        if (this.isMultipleInput) {
            // leftOffset in multiples of the 8px spacing
            leftOffset = this.calendarButtonElement.offsetLeft + this.calendarButtonElement.offsetWidth + 16;
            dateAsString = `${this.dateInput.value}/${this.monthInput.value}/${this.yearInput.value}`;
        } else {
            // leftOffset in multiples of the 8px spacing
            leftOffset = this.inputElement.offsetWidth + 16;
            dateAsString = this.inputElement.value;
        }

        const dialogElementSpacingUnits = Math.ceil(leftOffset / 8);

        this.dialogElement.classList.forEach(className => {
            if (className.match(/ds_!_off-l-/)) {
                this.dialogElement.classList.remove(className);
            }
        });
        this.dialogElement.classList.add(`ds_!_off-l-${dialogElementSpacingUnits}`);

        if (dateAsString.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
            this.inputDate = this.formattedDateFromString(dateAsString);
            this.currentDate = this.inputDate;
        }

        this.updateCalendar();
        this.setCurrentDate();
    }

    selectDate(date: Date) {
        if (this.isDisabledDate(date)) {
            return false;
        }

        this.calendarButtonElement.querySelector('span').textContent = `Choose date. Selected date is ${this.formattedDateHuman(date)}`;
        this.setDate(date);

        const changeEvent = new Event('change'); // todo: true true (bubbles, etc?)
        this.inputElement.dispatchEvent(changeEvent);

        if (this.dateSelectCallback) {
            this.dateSelectCallback(date);
        }

        this.closeDialog();
    }

    setCurrentDate(focus = true) {
        const currentDate = this.currentDate;

        const filteredDays = this.calendarDays.filter(calendarDay => calendarDay.button.classList.contains('fully-hidden') === false);

        filteredDays.forEach((calendarDay) => {
            calendarDay.button.setAttribute('tabindex', (-1).toString());
            calendarDay.button.classList.remove('ds_selected');
            const calendarDayDate = calendarDay.date;
            calendarDayDate.setHours(0, 0, 0, 0);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (calendarDayDate.getTime() === currentDate.getTime() && !calendarDay.isDisabled) {
                if (focus) {
                    calendarDay.button.setAttribute('tabindex', (0).toString());
                    calendarDay.button.focus();
                    calendarDay.button.classList.add('ds_selected');
                }
            }

            if (this.inputDate
                && !this.isDisabledDate(this.inputDate)
                && calendarDayDate.getTime() === this.inputDate.getTime()
            ) {
                calendarDay.button.classList.add('ds_datepicker__current');
                calendarDay.button.setAttribute('aria-description', 'selected date');
            } else {
                calendarDay.button.classList.remove('ds_datepicker__current');
                calendarDay.button.removeAttribute('aria-description');
            }

            if (calendarDayDate.getTime() === today.getTime()) {
                calendarDay.button.classList.add('ds_datepicker__today');
                calendarDay.button.setAttribute('aria-current', 'date');
            } else {
                calendarDay.button.classList.remove('ds_datepicker__today');
                calendarDay.button.removeAttribute('aria-current');
            }
        });

        // if no date is tab-able, make the first non-disabled date tab-able
        if (!focus) {
            filteredDays[0].button.setAttribute('tabindex', (0).toString());
            this.currentDate = filteredDays[0].date;
        }
    }

    setDate(date: Date) {
        if (this.isMultipleInput) {
            this.dateInput.value = date.getDate().toString();
            this.monthInput.value = (date.getMonth() + 1).toString();
            this.yearInput.value = date.getFullYear().toString();
        } else {
            this.inputElement.value = `${this.leadingZeroes(date.getDate())}/${this.leadingZeroes(date.getMonth() + 1)}/${date.getFullYear()}`;

            switch (this.datePickerParent.dataset.dateformat) {
            case 'YMD':
                this.inputElement.value = `${date.getFullYear()}/${this.leadingZeroes(date.getMonth() + 1)}/${this.leadingZeroes(date.getDate())}`;
                break;
            case 'MDY':
                this.inputElement.value = `${this.leadingZeroes(date.getMonth() + 1)}/${this.leadingZeroes(date.getDate())}/${date.getFullYear()}`;
                break;
            case 'DMY':
            default:
                this.inputElement.value = `${this.leadingZeroes(date.getDate())}/${this.leadingZeroes(date.getMonth() + 1)}/${date.getFullYear()}`;
                break;
            }
        }
    }

    setMinAndMaxDatesOnCalendar() {
        if (this.minDate && this.currentDate < this.minDate) {
            this.currentDate = this.minDate;
        }

        if (this.maxDate && this.currentDate > this.maxDate) {
            this.currentDate = this.maxDate;
        }
    }

    setOptions() {
        this.transformLegacyDataAttributes();

        if (this.options.minDate) {
            this.minDate = this.options.minDate;
        } else if (this.datePickerParent.dataset.mindate) {
            this.minDate = this.formattedDateFromString(this.datePickerParent.dataset.mindate, null);
        }

        if (this.options.maxDate) {
            this.maxDate = this.options.maxDate;
        } else if (this.datePickerParent.dataset.maxdate) {
            this.maxDate = this.formattedDateFromString(this.datePickerParent.dataset.maxdate, null);
        }

        if (this.options.dateSelectCallback) {
            this.dateSelectCallback = this.options.dateSelectCallback;
        }

        if (this.options.disabledDates) {
            this.disabledDates = this.options.disabledDates;
        } else if (this.datePickerParent.dataset.disableddates) {
            this.disabledDates = this.datePickerParent.dataset.disableddates
                .replace(/\s+/, ' ')
                .split(' ')
                .map(item => this.formattedDateFromString(item, null))
                .filter(item => item);
        }
    }

    toggleDialog(event: Event) {
        event.preventDefault();
        if (this.isOpen()) {
            this.closeDialog();
        } else {
            this.setMinAndMaxDatesOnCalendar();
            this.openDialog();
        }
    }

    transformLegacyDataAttributes() {
        if (this.inputElement.dataset.mindate) {
            this.datePickerParent.dataset.mindate = this.inputElement.dataset.mindate;
        }

        if (this.inputElement.dataset.maxdate) {
            this.datePickerParent.dataset.maxdate = this.inputElement.dataset.maxdate;
        }

        if (this.inputElement.dataset.dateformat) {
            this.datePickerParent.dataset.dateformat = this.inputElement.dataset.dateformat;
        }
    }

     // render calendar
    updateCalendar() {
        this.dialogTitleElement.innerHTML = `${this.monthLabels[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        this.dialogElement.setAttribute('aria-label', this.dialogTitleElement.innerHTML);

        let day = this.currentDate;

        const firstOfMonth = new Date(day.getFullYear(), day.getMonth(), 1);
        const dayOfWeek = firstOfMonth.getDay();

        firstOfMonth.setDate(firstOfMonth.getDate() - dayOfWeek);

        const thisDay = new Date(firstOfMonth);

        // loop through our days
        for (const element of this.calendarDays) {
            let hidden = thisDay.getMonth() !== day.getMonth();

            let isDisabled: boolean;

            if (thisDay < this.minDate) {
                isDisabled = true;
            }

            if (thisDay > this.maxDate) {
                isDisabled = true;
            }

            if (this.isDisabledDate(thisDay)) {
                isDisabled = true;
            }

            element.update(thisDay, hidden, isDisabled);

            thisDay.setDate(thisDay.getDate() + 1);
        }
    }
}

class DSCalendarDay {
    index: number;
    row: number;
    column: number;
    button: HTMLButtonElement;
    picker: DSDatePicker;
    date: Date;

    constructor(button: HTMLButtonElement, index: number, row: number, column: number, picker: DSDatePicker) {
        this.index = index;
        this.row = row;
        this.column = column;
        this.button = button;
        this.picker = picker;

        this.date = new Date();
    }

    init() {
        this.button.addEventListener('keydown', this.keyPress.bind(this));
        this.button.addEventListener('click', this.click.bind(this));
    }

    update(day: Date, isHidden: boolean, isDisabled: boolean) {
        this.date = new Date(day);
        this.button.innerHTML = day.getDate().toString();
        this.button.setAttribute('aria-label', this.picker.formattedDateHuman(this.date));

        if (isDisabled) {
            this.button.setAttribute('aria-disabled', true.toString());
        } else {
            this.button.removeAttribute('aria-disabled');
        }

        if (isHidden) {
            this.button.classList.add('fully-hidden');
        } else {
            this.button.classList.remove('fully-hidden');
        }
    }

    click(event: MouseEvent) {
        this.picker.goToDate(this.date);
        this.picker.selectDate(this.date);

        event.stopPropagation();
        event.preventDefault();
    }

    keyPress(event: KeyboardEvent) {
        let calendarNavKey = true;

        switch (event.key) {
        case 'ArrowLeft':
            this.picker.focusPreviousDay();
            break;
        case 'ArrowRight':
            this.picker.focusNextDay();
            break;
        case 'ArrowUp':
            this.picker.focusPreviousWeek();
            break;
        case 'ArrowDown':
            this.picker.focusNextWeek();
            break;
        case 'Home':
            this.picker.focusFirstDayOfWeek();
            break;
        case 'End':
            this.picker.focusLastDayOfWeek();
            break;
        case 'PageUp':
            event.shiftKey ? this.picker.focusPreviousYear(event) : this.picker.focusPreviousMonth(event);
            break;
        case 'PageDown':
            event.shiftKey ? this.picker.focusNextYear(event) : this.picker.focusNextMonth(event);
            break;
        default:
            calendarNavKey = false;
            break;
        }

        if (calendarNavKey) {
            event.preventDefault();
            event.stopPropagation();
        }
    }
}

export default DSDatePicker;
