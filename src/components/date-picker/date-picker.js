/* global document, window */

'use strict';

class DSDatePicker {
    constructor(el, options = {}) {
        if (!el) {
            return;
        }

        this.datePickerParent = el;
        this.inputElement = this.datePickerParent.querySelector('input');

        this.dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        this.monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        this.currentDate = new Date();
        this.currentDate.setHours(0, 0, 0, 0);
        this.calendarDays = [];
        this.imagePath = options.imagePath || '/assets/images/icons/';

        this.keycodes = {
            'tab': 9,
            'esc': 27,
            'pageup': 33,
            'pagedown': 34,
            'end': 35,
            'home': 36,
            'left': 37,
            'up': 38,
            'right': 39,
            'down': 40
        };

        if (options.minDate) {
            this.setMinDate(options.minDate);
        }

        if (options.maxDate) {
            this.setMaxDate(options.maxDate);
        }
    }

    init() {
        if (!this.inputElement || this.datePickerParent.classList.contains('js-initialised')) {
            return;
        }

        // insert calendar button
        const calendarButtonTempContainer = document.createElement('div');
        calendarButtonTempContainer.innerHTML = this.buttonTemplate();
        this.calendarButtonElement = calendarButtonTempContainer.firstChild;
        this.calendarButtonElement.setAttribute('data-button', `datepicker-${this.inputElement.id}-toggle`);

        this.inputElement.parentNode.appendChild(this.calendarButtonElement);
        this.inputElement.parentNode.classList.add('ds_input__wrapper--has-icon');

        // insert dialog template
        const dialog = document.createElement('div');
        dialog.id = 'datepicker-' + parseInt(Math.random() * 1000000, 10);
        dialog.titleId = 'datepicker-title-' + parseInt(Math.random() * 1000000, 10);
        dialog.setAttribute('class', 'ds_datepicker__dialog  datepickerDialog');
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-modal', 'true');
        dialog.setAttribute('aria-labelledby', dialog.titleId);
        dialog.innerHTML = this.dialogTemplate(dialog.titleId);

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
        return `<button class="ds_button  ds_button--icon-only  js-calendar-button">
            <span class="visually-hidden">Choose date</span>
            <svg class="ds_icon" aria-hidden="true" role="img"><use xlink:href="${this.imagePath}icons.stack.svg#calendar_today"></use></svg>
        </button>
        `;
    }

    dialogTemplate(titleId) {
        return `<div class="ds_datepicker__dialog__header ">
        <div class="ds_datepicker__dialog__navbuttons">
            <button class="ds_button  ds_button--icon-only  js-datepicker-prev-year" aria-label="previous year" data-button="button-datepicker-prevyear">
                <span class="visually-hidden">Previous year</span>
                <svg focusable="false" class="ds_icon" aria-hidden="true" role="img"><use xlink:href="${this.imagePath}icons.stack.svg#double_chevron_left"></use></svg>
            </button>

            <button class="ds_button  ds_button--icon-only  js-datepicker-prev-month" aria-label="previous month" data-button="button-datepicker-prevmonth">
                <span class="visually-hidden">Previous month</span>
                <svg focusable="false" class="ds_icon" aria-hidden="true" role="img"><use xlink:href="${this.imagePath}icons.stack.svg#chevron_left"></use></svg>
            </button>
        </div>

        <h2 id="${titleId}" class="ds_datepicker__dialog__title  js-datepicker-month-year" aria-live="polite">June 2020</h2>

        <div class="ds_datepicker__dialog__navbuttons">
            <button class="ds_button  ds_button--icon-only  js-datepicker-next-month" aria-label="next month" data-button="button-datepicker-nextmonth">
                <span class="visually-hidden">Next month</span>
                <svg focusable="false" class="ds_icon" aria-hidden="true" role="img"><use xlink:href="${this.imagePath}icons.stack.svg#chevron_right"></use></svg>
            </button>

            <button class="ds_button  ds_button--icon-only  js-datepicker-next-year" aria-label="next year" data-button="button-datepicker-nextyear">
                <span class="visually-hidden">Next year</span>
                <svg focusable="false" class="ds_icon" aria-hidden="true" role="img"><use xlink:href="${this.imagePath}icons.stack.svg#double_chevron_right"></use></svg>
            </button>
        </div>
      </div>

      <table class="ds_datepicker__dialog__table  js-datepicker-grid" role="grid" aria-labelledby="${titleId}">
      <caption class="ds_datepicker__dialog__table-caption">You can use the cursor keys to select a date</caption>
      <thead>
          <tr>
          <th scope="col" abbr="Sunday">Su</th>
          <th scope="col" abbr="Monday">Mo</th>
          <th scope="col" abbr="Tuesday">Tu</th>
          <th scope="col" abbr="Wednesday">We</th>
          <th scope="col" abbr="Thursday">Th</th>
          <th scope="col" abbr="Friday">Fr</th>
          <th scope="col" abbr="Saturday">Sa</th>
          </tr>
      </thead>

      <tbody></tbody>
      </table>

      <div class="ds_datepicker__dialog__buttongroup">
      <button class="ds_button  ds_button--small  ds_button--cancel  js-datepicker-cancel" value="cancel" data-button="button-datepicker-cancel">Cancel</button>
      <button class="ds_button  ds_button--small  js-datepicker-ok" value="ok" data-button="button-datepicker-ok">OK</button>
      </div>`;
    }

    leadingZeroes(value, length = 2) {
        let ret = value.toString();

        while (ret.length < length) {
            ret = '0' + ret.toString();
        }

        return ret;
    }

    setMinDate(date) {
        this.inputElement.dataset.mindate = this.formattedDateFromDate(date);
    }

    setMaxDate(date) {
        this.inputElement.dataset.maxdate = this.formattedDateFromDate(date);
    }

    setMinAndMaxDatesOnCalendar() {
        if (this.inputElement.dataset.mindate) {
            this.minDate = this.formattedDateFromString(this.inputElement.dataset.mindate, null);
            if (this.minDate && this.currentDate < this.minDate) {
                this.currentDate = this.minDate;
            }
        }

        if (this.inputElement.dataset.maxdate) {
            this.maxDate = this.formattedDateFromString(this.inputElement.dataset.maxdate, null);
            if (this.maxDate && this.currentDate > this.maxDate) {
                this.currentDate = this.maxDate;
            }
        }
    }

    formattedDateFromString(dateString, fallback = new Date()) {
        let formattedDate = null;
        const parts = dateString.split('/');

        if (dateString.match(/\d{1,4}\/\d{1,2}\/\d{1,4}/)) {
            switch (this.inputElement.dataset.dateformat) {
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

    formattedDateFromDate(date) {
        let formattedDate = null;

        switch (this.inputElement.dataset.dateformat) {
        case 'YMD':
            formattedDate = `${date.getFullYear()}/${this.leadingZeroes(date.getMonth() + 1)}/${this.leadingZeroes(date.getDate())}`;
            break;
        case 'MDY':
            formattedDate = `${this.leadingZeroes(date.getMonth() + 1)}/${this.leadingZeroes(date.getDate())}/${date.getFullYear()}`;
            break;
        case 'DMY':
        default:
            formattedDate = `${this.leadingZeroes(date.getDate())}/${this.leadingZeroes(date.getMonth() + 1)}/${date.getFullYear()}`;
            break;
        }

        return formattedDate;
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

    formattedDateHuman(date) {
        return `${this.dayLabels[date.getDay()]} ${date.getDate()} ${this.monthLabels[date.getMonth()]} ${date.getFullYear()}`;
    }

    firstButtonKeyup(event) {
        if (event.keyCode === this.keycodes.tab && event.shiftKey) {
            this.lastButtonInDialog.focus();
            event.preventDefault();
        }
    }

    lastButtonKeyup(event) {
        if (event.keyCode === this.keycodes.tab && !event.shiftKey) {
            this.firstButtonInDialog.focus();
            event.preventDefault();
        }
    }

    // render calendar
    updateCalendar() {
        this.dialogTitleNode.innerHTML = `${this.monthLabels[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;

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

            this.calendarDays[i].update(thisDay, hidden, disabled);

            thisDay.setDate(thisDay.getDate() + 1);
        }
    }

    setCurrentDate(focus = true) {
        const currentDate = this.currentDate;

        this.calendarDays.forEach((calendarDay) => {
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
            const enabledDays = this.calendarDays.filter(calendarDay => {
                return window.getComputedStyle(calendarDay.button).display === 'block' && !calendarDay.button.disabled;
            });

            enabledDays[0].button.setAttribute('tabindex', 0);

            this.currentDate = enabledDays[0].date;
        }
    }

    selectDate(date) {
        this.calendarButtonElement.querySelector('span').innerText = `Choose date. Selected date is ${this.formattedDateHuman(date)}`;
        this.inputElement.value = `${this.leadingZeroes(date.getDate())}/${this.leadingZeroes(date.getMonth() + 1)}/${date.getFullYear()}`;

        switch (this.inputElement.dataset.dateformat) {
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

        const changeEvent = document.createEvent('Event');
        changeEvent.initEvent('change', true, true);
        this.inputElement.dispatchEvent(changeEvent);

        this.closeDialog();
    }

    isOpen() {
        return this.dialogElement.classList.contains('ds_datepicker__dialog--open');
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

    openDialog() {
        // display the dialog
        this.dialogElement.style.display = 'block';
        this.dialogElement.classList.add('ds_datepicker__dialog--open');

        // position the dialog
        this.dialogElement.style.left = `${this.inputElement.offsetWidth + 16}px`;

        // get the date from the input element
        if (this.inputElement.value.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
            this.inputDate = this.formattedDateFromString(this.inputElement.value);
            this.currentDate = this.inputDate;
        }

        this.updateCalendar();
        this.setCurrentDate();
    }

    closeDialog() {
        this.dialogElement.style.display = 'none';
        this.dialogElement.classList.remove('ds_datepicker__dialog--open');
        this.calendarButtonElement.focus();
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

    // day navigation
    focusNextDay () {
        const date = new Date(this.currentDate);
        date.setDate(date.getDate() + 1);
        this.goToDate(date);
    }

    focusPreviousDay () {
        const date = new Date(this.currentDate);
        date.setDate(date.getDate() - 1);
        this.goToDate(date);
    }

    // week navigation
    focusNextWeek () {
        const date = new Date(this.currentDate);
        date.setDate(date.getDate() + 7);
        this.goToDate(date);
    }

    focusPreviousWeek () {
        const date = new Date(this.currentDate);
        date.setDate(date.getDate() - 7);
        this.goToDate(date);
    }

    focusFirstDayOfWeek () {
        const date = new Date(this.currentDate);
        date.setDate(date.getDate() - date.getDay());
        this.goToDate(date);
    }

    focusLastDayOfWeek () {
        const date = new Date(this.currentDate);
        date.setDate(date.getDate() - date.getDay() + 6);
        this.goToDate(date);
    }

    // month navigation
    focusNextMonth(event, focus = true) {
        event.preventDefault();
        const date = new Date(this.currentDate);
        date.setMonth(date.getMonth() + 1);
        this.goToDate(date, focus);
    }

    focusPreviousMonth (event, focus = true) {
        event.preventDefault();
        const date = new Date(this.currentDate);
        date.setMonth(date.getMonth() - 1);
        this.goToDate(date, focus);
    }

    // year navigation
    focusNextYear (event, focus = true) {
        event.preventDefault();
        const date = new Date(this.currentDate);
        date.setFullYear(date.getFullYear() + 1);
        this.goToDate(date, focus);
    }

    focusPreviousYear (event, focus = true) {
        event.preventDefault();
        const date = new Date(this.currentDate);
        date.setFullYear(date.getFullYear() - 1);
        this.goToDate(date, focus);
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
        this.button.innerHTML = day.getDate();
        this.date = new Date(day);

        if (disabled) {
            this.button.setAttribute('disabled', true);
        } else {
            this.button.removeAttribute('disabled');
        }

        if (hidden) {
            this.button.style.display = 'none';
        } else {
            this.button.style.display = 'block';
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
        case this.picker.keycodes.esc:
            this.picker.closeDialog();
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
