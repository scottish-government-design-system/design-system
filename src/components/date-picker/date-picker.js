/* global document, window */
import elementIdModifier from '../../base/tools/id-modifier/id-modifier';

'use strict';

class DSDatePicker {
    constructor(el, options = {}) {
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

        this.dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        this.monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        this.currentDate = new Date();
        this.currentDate.setHours(0, 0, 0, 0);
        this.calendarDays = [];
        this.imagePath = options.imagePath || '/assets/images/icons/';
        this.disabledDates = [];

        this.keycodes = {
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
    }

    init() {
        if (!this.inputElement || this.datePickerParent.classList.contains('js-initialised')) {
            return;
        }

        this.setOptions();

        // insert calendar button
        const calendarButtonTempContainer = document.createElement('div');
        calendarButtonTempContainer.innerHTML = this.buttonTemplate();
        this.calendarButtonElement = calendarButtonTempContainer.firstChild;
        this.calendarButtonElement.setAttribute('data-button', `datepicker-${this.inputElement.id}-toggle`);

        if (this.isMultipleInput) {
            this.inputElement.parentNode.parentNode.appendChild(this.calendarButtonElement);
        } else {
            this.inputElement.parentNode.appendChild(this.calendarButtonElement);
            this.inputElement.parentNode.classList.add('ds_input__wrapper--has-icon');
        }

        // insert dialog template
        const dialog = document.createElement('div');
        dialog.id = 'datepicker-' + elementIdModifier();
        dialog.setAttribute('class', 'ds_datepicker__dialog  datepickerDialog');
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-modal', 'true');
        dialog.innerHTML = this.dialogTemplate(dialog.id);
        this.calendarButtonElement.setAttribute('aria-controls', dialog.id);
        this.calendarButtonElement.setAttribute('aria-expanded', false);

        this.dialogElement = dialog;
        this.datePickerParent.appendChild(dialog);

        this.dialogTitleNode = this.dialogElement.querySelector('.js-datepicker-month-year');

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
        this.prevMonthButton = this.dialogElement.querySelector('.js-datepicker-prev-month');
        this.prevYearButton = this.dialogElement.querySelector('.js-datepicker-prev-year');
        this.nextMonthButton = this.dialogElement.querySelector('.js-datepicker-next-month');
        this.nextYearButton = this.dialogElement.querySelector('.js-datepicker-next-year');
        this.prevMonthButton.addEventListener('click', (event) => this.focusPreviousMonth(event, false));
        this.prevYearButton.addEventListener('click', (event) => this.focusPreviousYear(event, false));
        this.nextMonthButton.addEventListener('click', (event) => this.focusNextMonth(event, false));
        this.nextYearButton.addEventListener('click', (event) => this.focusNextYear(event, false));

        const dateInputFields = [this.inputElement, this.dateInput, this.monthInput, this.yearInput];
        dateInputFields.forEach(input => {
            if (input) {
                input.addEventListener('blur', () => { this.calendarButtonElement.querySelector('span').innerText = 'Choose date'; });
            }
        });

        this.cancelButton = this.dialogElement.querySelector('.js-datepicker-cancel');
        this.okButton = this.dialogElement.querySelector('.js-datepicker-ok');
        this.cancelButton.addEventListener('click', (event) => { event.preventDefault(); this.closeDialog(event); });
        this.okButton.addEventListener('click', () => this.selectDate(this.currentDate));

        const dialogButtons = this.dialogElement.querySelectorAll('button:not([disabled="true"])');
        this.firstButtonInDialog = dialogButtons[0];
        this.lastButtonInDialog = dialogButtons[dialogButtons.length - 1];
        this.firstButtonInDialog.addEventListener('keydown', (event) => this.firstButtonKeyup(event));
        this.lastButtonInDialog.addEventListener('keydown', (event) => this.lastButtonKeyup(event));

        this.calendarButtonElement.addEventListener('click', (event) => this.toggleDialog(event));

        document.body.addEventListener('mouseup', (event) => this.backgroundClick(event));

        // populates calendar with inital dates, avoids Wave errors about null buttons
        this.updateCalendar();

        this.datePickerParent.classList.add('js-initialised');
    }

    buttonTemplate() {
        return `<button class="ds_button  ds_button--icon-only  ds_datepicker__button  ds_no-margin  js-calendar-button" aria-expanded="false">
            <span class="visually-hidden">Choose date</span>
            <svg class="ds_icon" aria-hidden="true" role="img"><use href="${this.imagePath}icons.stack.svg#calendar_today"></use></svg>
        </button>
        `;
    }

    dialogTemplate(id) {
        return `<div class="ds_datepicker__dialog__header">
        <div class="ds_datepicker__dialog__navbuttons">
            <button class="ds_button  ds_button--icon-only  js-datepicker-prev-year" aria-label="previous year" data-button="button-datepicker-prevyear">
                <span class="visually-hidden">Previous year</span>
                <svg focusable="false" class="ds_icon" aria-hidden="true" role="img"><use href="${this.imagePath}icons.stack.svg#double_chevron_left"></use></svg>
            </button>

            <button class="ds_button  ds_button--icon-only  js-datepicker-prev-month" aria-label="previous month" data-button="button-datepicker-prevmonth">
                <span class="visually-hidden">Previous month</span>
                <svg focusable="false" class="ds_icon" aria-hidden="true" role="img"><use href="${this.imagePath}icons.stack.svg#chevron_left"></use></svg>
            </button>
        </div>

        <h2 class="ds_datepicker__dialog__title  js-datepicker-month-year">June 2020</h2>

        <div class="ds_datepicker__dialog__navbuttons">
            <button class="ds_button  ds_button--icon-only  js-datepicker-next-month" aria-label="next month" data-button="button-datepicker-nextmonth">
                <span class="visually-hidden">Next month</span>
                <svg focusable="false" class="ds_icon" aria-hidden="true" role="img"><use href="${this.imagePath}icons.stack.svg#chevron_right"></use></svg>
            </button>

            <button class="ds_button  ds_button--icon-only  js-datepicker-next-year" aria-label="next year" data-button="button-datepicker-nextyear">
                <span class="visually-hidden">Next year</span>
                <svg focusable="false" class="ds_icon" aria-hidden="true" role="img"><use href="${this.imagePath}icons.stack.svg#double_chevron_right"></use></svg>
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

    leadingZeroes(value, length = 2) {
        let ret = value.toString();

        while (ret.length < length) {
            ret = '0' + ret.toString();
        }

        return ret;
    }

    backgroundClick(event) {
        if (this.isOpen() &&
            !this.dialogElement.contains(event.target) &&
            !this.inputElement.contains(event.target) &&
            !this.calendarButtonElement.contains(event.target)) {

            event.preventDefault();
            this.closeDialog();
        }
    }

    closeDialog() {
        this.dialogElement.classList.remove('ds_datepicker__dialog--open');
        this.calendarButtonElement.setAttribute('aria-expanded', false);
        this.calendarButtonElement.focus();
    }

    firstButtonKeyup(event) {
        if (event.keyCode === this.keycodes.tab && event.shiftKey) {
            this.lastButtonInDialog.focus();
            event.preventDefault();
        }
    }

    // day navigation
    focusNextDay(date = new Date(this.currentDate)) {
        date.setDate(date.getDate() + 1);
        if (this.isDisabledDate(date)) {
            this.focusNextDay(date);
            return;
        }
        this.goToDate(date);
    }

    focusPreviousDay(date = new Date(this.currentDate)) {
        date.setDate(date.getDate() - 1);
        if (this.isDisabledDate(date)) {
            this.focusPreviousDay(date);
            return;
        }
        this.goToDate(date);
    }

    // week navigation
    focusNextWeek (date = new Date(this.currentDate)) {
        date.setDate(date.getDate() + 7);
        if (this.isDisabledDate(date)) {
            this.focusNextWeek(date);
            return;
        }
        this.goToDate(date);
    }

    focusPreviousWeek (date = new Date(this.currentDate)) {
        date.setDate(date.getDate() - 7);
        if (this.isDisabledDate(date)) {
            this.focusPreviousWeek(date);
            return;
        }
        this.goToDate(date);
    }

    focusFirstDayOfWeek() {
        const date = new Date(this.currentDate);
        date.setDate(date.getDate() - date.getDay());
        if (this.isDisabledDate(date)) {
            this.focusNextDay(date);
            return;
        }
        this.goToDate(date);
    }

    focusLastDayOfWeek() {
        const date = new Date(this.currentDate);
        date.setDate(date.getDate() - date.getDay() + 6);
        if (this.isDisabledDate(date)) {
            this.focusPreviousDay(date);
            return;
        }
        this.goToDate(date);
    }

    // month navigation
    focusNextMonth(event, focus = true) {
        event.preventDefault();
        const date = new Date(this.currentDate);
        date.setMonth(date.getMonth() + 1);
        if (this.isDisabledDate(date)) {
            this.focusNextDay(date);
            return;
        }
        this.goToDate(date, focus);
    }

    focusPreviousMonth (event, focus = true) {
        event.preventDefault();
        const date = new Date(this.currentDate);
        date.setMonth(date.getMonth() - 1);
        if (this.isDisabledDate(date)) {
            this.focusPreviousDay(date);
            return;
        }
        this.goToDate(date, focus);
    }

    // year navigation
    focusNextYear (event, focus = true) {
        event.preventDefault();
        const date = new Date(this.currentDate);
        date.setFullYear(date.getFullYear() + 1);
        if (this.isDisabledDate(date)) {
            this.focusNextDay(date);
            return;
        }
        this.goToDate(date, focus);
    }

    focusPreviousYear (event, focus = true) {
        event.preventDefault();
        const date = new Date(this.currentDate);
        date.setFullYear(date.getFullYear() - 1);
        if (this.isDisabledDate(date)) {
            this.focusPreviousDay(date);
            return;
        }
        this.goToDate(date, focus);
    }

    formattedDateFromString(dateString, fallback = new Date()) {
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

        if (formattedDate instanceof Date && !isNaN(formattedDate)) {
            return formattedDate;
        } else {
            return fallback;
        }
    }

    formattedDateHuman(date) {
        return `${this.dayLabels[date.getDay()]} ${date.getDate()} ${this.monthLabels[date.getMonth()]} ${date.getFullYear()}`;
    }

    goToDate(date, focus) {
        if (this.minDate && this.minDate > date) {
            date = this.minDate;
        }

        if (this.maxDate && this.maxDate < date) {
            date = this.maxDate;
        }

        const current = this.currentDate;

        this.currentDate = date;

        if (current.getMonth() !== this.currentDate.getMonth() || current.getFullYear() !== this.currentDate.getFullYear()) {
            this.updateCalendar();
        }

        this.setCurrentDate(focus);
    }

    isDisabledDate(date) {
        let disabled = false;
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

    lastButtonKeyup(event) {
        if (event.keyCode === this.keycodes.tab && !event.shiftKey) {
            this.firstButtonInDialog.focus();
            event.preventDefault();
        }
    }

    openDialog() {
        // display the dialog
        this.dialogElement.classList.add('ds_datepicker__dialog--open');
        this.calendarButtonElement.setAttribute('aria-expanded', true);

        // position the dialog
        let leftOffset;

        // get the date from the input element(s)
        let dateAsString;

        if (this.isMultipleInput) {
            leftOffset = `${this.calendarButtonElement.offsetLeft + this.calendarButtonElement.offsetWidth + 16}px`;
            dateAsString = `${this.dateInput.value}/${this.monthInput.value}/${this.yearInput.value}`;
        } else {
            leftOffset = `${this.inputElement.offsetWidth + 16}px`;
            dateAsString = this.inputElement.value;
        }

        this.dialogElement.style.left = leftOffset;

        if (dateAsString.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
            this.inputDate = this.formattedDateFromString(dateAsString);
            this.currentDate = this.inputDate;
        }

        this.updateCalendar();
        this.setCurrentDate();
    }

    selectDate(date) {
        this.calendarButtonElement.querySelector('span').innerText = `Choose date. Selected date is ${this.formattedDateHuman(date)}`;
        this.setDate(date);

        const changeEvent = document.createEvent('Event');
        changeEvent.initEvent('change', true, true);
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
            calendarDay.button.setAttribute('tabindex', -1);
            calendarDay.button.classList.remove('ds_selected');
            const calendarDayDate = calendarDay.date;
            calendarDayDate.setHours(0, 0, 0, 0);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (calendarDayDate.getTime() === currentDate.getTime() && !calendarDay.disabled) {
                if (focus) {
                    calendarDay.button.setAttribute('tabindex', 0);
                    calendarDay.button.focus();
                    calendarDay.button.classList.add('ds_selected');
                }
            }

            if (this.inputDate && calendarDayDate.getTime() === this.inputDate.getTime()) {
                calendarDay.button.classList.add('ds_datepicker__current');
                calendarDay.button.setAttribute('aria-selected', true);
            } else {
                calendarDay.button.classList.remove('ds_datepicker__current');
                calendarDay.button.removeAttribute('aria-selected');
            }

            if (calendarDayDate.getTime() === today.getTime()) {
                calendarDay.button.classList.add('ds_datepicker__today');
            } else {
                calendarDay.button.classList.remove('ds_datepicker__today');
            }
        });

        // if no date is tab-able, make the first non-disabled date tab-able
        if (!focus) {
            filteredDays[0].button.setAttribute('tabindex', 0);
            this.currentDate = filteredDays[0].date;
        }
    }

    setDate(date) {
        if (this.isMultipleInput) {
            this.dateInput.value = date.getDate();
            this.monthInput.value = date.getMonth() + 1;
            this.yearInput.value = date.getFullYear();
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

    toggleDialog(event) {
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
        this.dialogTitleNode.innerHTML = `${this.monthLabels[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        this.dialogElement.setAttribute('aria-label', this.dialogTitleNode.innerHTML);

        let day = this.currentDate;

        const firstOfMonth = new Date(day.getFullYear(), day.getMonth(), 1);
        const dayOfWeek = firstOfMonth.getDay();

        firstOfMonth.setDate(firstOfMonth.getDate() - dayOfWeek);

        const thisDay = new Date(firstOfMonth);

        // loop through our days
        for (let i = 0; i < this.calendarDays.length; i++) {
            let hidden = thisDay.getMonth() !== day.getMonth();

            let disabled;

            if (thisDay < this.minDate) {
                disabled = true;
            }

            if (thisDay > this.maxDate) {
                disabled = true;
            }

            if (this.isDisabledDate(thisDay)) {
                disabled = true;
            }

            this.calendarDays[i].update(thisDay, hidden, disabled);

            thisDay.setDate(thisDay.getDate() + 1);
        }
    }
}

class DSCalendarDay {
    constructor(button, index, row, column, picker) {
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

    update(day, hidden, disabled) {
        this.date = new Date(day);
        this.button.innerHTML = day.getDate();
        this.button.setAttribute('aria-label', this.picker.formattedDateHuman(this.date));

        if (disabled) {
            this.button.setAttribute('disabled', true);
        } else {
            this.button.removeAttribute('disabled');
        }

        if (hidden) {
            this.button.classList.add('fully-hidden');
        } else {
            this.button.classList.remove('fully-hidden');
        }
    }

    click(event) {
        this.picker.goToDate(this.date);
        this.picker.selectDate(this.date);

        event.stopPropagation();
        event.preventDefault();
    }

    keyPress(event) {
        let calendarNavKey = true;

        switch (event.keyCode) {
        case this.picker.keycodes.left:
            this.picker.focusPreviousDay();
            break;
        case this.picker.keycodes.right:
            this.picker.focusNextDay();
            break;
        case this.picker.keycodes.up:
            this.picker.focusPreviousWeek();
            break;
        case this.picker.keycodes.down:
            this.picker.focusNextWeek();
            break;
        case this.picker.keycodes.home:
            this.picker.focusFirstDayOfWeek();
            break;
        case this.picker.keycodes.end:
            this.picker.focusLastDayOfWeek();
            break;
        case this.picker.keycodes.pageup:
            event.shiftKey ? this.picker.focusPreviousYear(event) : this.picker.focusPreviousMonth(event);
            break;
        case this.picker.keycodes.pagedown:
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
