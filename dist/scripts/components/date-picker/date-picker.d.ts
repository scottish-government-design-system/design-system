import DSComponent from '../../base/component/component';
type DatePickerOptionsArgs = {
    dateSelectCallback?: (date: Date) => void;
    disabledDates?: Date[];
    maxDate?: Date;
    minDate?: Date;
};
/**
 * Date picker component
 *
 * @class DSDatePicker
 * @extends DSComponent
 * @property {HTMLElement} datePickerParent - the date picker parent element
 * @property {HTMLButtonElement} calendarButtonElement - the calendar button element
 * @property {HTMLInputElement} dateInput - the date input element
 * @property {HTMLElement} dialogElement - the date picker dialog element
 * @property {HTMLElement} dialogTitleElement - the date picker dialog title element
 * @property {HTMLButtonElement} firstButtonInDialog - the first button in the date picker dialog
 * @property {HTMLInputElement} inputElement - the main input element
 * @property {HTMLButtonElement} lastButtonInDialog - the last button in the date picker dialog
 * @property {HTMLInputElement} monthInput - the month input element
 * @property {HTMLInputElement} yearInput - the year input element
 * @property {boolean} isMultipleInput - whether the date picker uses multiple input fields
 * @property {function} dateSelectCallback - callback function to be called when a date is selected
 * @property {Date} currentDate - the currently selected date
 * @property {Date[]} disabledDates - array of disabled dates
 * @property {Date} inputDate - the date currently in the input field
 * @property {Date} maxDate - the maximum selectable date
 * @property {Date} minDate - the minimum selectable date
 * @property {CalendarDayArgs[]} calendarDays - array of calendar day objects
 * @property {string[]} dayLabels - array of day labels
 * @property {string[]} monthLabels - array of month labels
 * @property {object} icons - object containing SVG icon templates
 */
declare class DSDatePicker extends DSComponent {
    private options;
    private calendarButtonElement;
    private dateInput;
    private datePickerParent;
    private dialogElement;
    private dialogTitleElement;
    private firstButtonInDialog;
    private inputElement;
    private lastButtonInDialog;
    private monthInput;
    private yearInput;
    private isMultipleInput;
    private currentDate;
    private inputDate?;
    private calendarDays;
    private dayLabels;
    private monthLabels;
    private icons;
    /**
     * Creates a date picker component
     *
     * @param {HTMLElement} el - the date picker element
     * @param {object} options - configuration options for the date picker
     */
    constructor(el: HTMLElement, options?: DatePickerOptionsArgs);
    /**
     * Initialise the date picker
     * - inserts button and dialog into the DOM
     * - sets up event listeners
     * - populates the calendar with initial dates
     *
     * @returns {void}
     */
    init(): void;
    /**
     * Adds months to a date
     *
     * @param {Date} date - the date to add months to
     * @param {number} months - number of months to add (negative to subtract)
     * @returns {Date} - the new date after adding months
     */
    private addMonths;
    /**
     * Date picker button template
     *
     * @returns {string} - HTML template for the date picker button
     */
    private buttonTemplate;
    /**
     * Date picker dialog template
     *
     * @param {string} id
     * @returns {string} - HTML template for the date picker dialog
     */
    private dialogTemplate;
    /**
     * Formats a number with leading zeroes
     *
     * @param {number} value - value to format
     * @param {number} length - desired length of output string
     * @returns {string} - formatted string
     */
    private leadingZeroes;
    /**
     * Handle clicks outside the date picker dialog
     * - closes the dialog if open and the click is outside the dialog
     *
     * @param {MouseEvent} event
     * @returns {void}
     */
    private backgroundClick;
    /**
     * Close the date picker dialog
     * - sets aria-expanded to false on the calendar button
     * - focuses the calendar button
     *
     * @returns {void}
     */
    private closeDialog;
    /**
     * Handles the keyup event on the first button in the dialog
     * - focuses the first button in the dialog if the Tab and Shift keys are pressed
     *
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    private firstButtonKeyup;
    /**
     * Focuses the next day in the calendar
     *
     * @param {Date} date
     * @returns {void}
     */
    focusNextDay(date?: Date): void;
    /**
     * Focuses the previous day in the calendar
     *
     * @param {Date} date
     * @returns {void}
     */
    focusPreviousDay(date?: Date): void;
    /**
     * Focuses the next week in the calendar
     *
     * @param {Date} date
     * @returns {void}
     */
    focusNextWeek(date?: Date): void;
    /**
     * Focuses the previous week in the calendar
     *
     * @param {Date} date
     * @returns {void}
     */
    focusPreviousWeek(date?: Date): void;
    /**
     * Focuses the first day of the week in the calendar
     *
     * @returns {void}
     */
    focusFirstDayOfWeek(): void;
    /**
     * Focuses the last day of the week in the calendar
     *
     * @returns {void}
     */
    focusLastDayOfWeek(): void;
    /**
     * Focuses the next month in the calendar
     *
     * @param {Event} event
     * @param {boolean} focus
     * @returns {void}
     */
    focusNextMonth(event: Event, focus?: boolean): void;
    /**
     * Focuses the previous month in the calendar
     *
     * @param {Event} event
     * @param {boolean} focus
     * @returns {void}
     */
    focusPreviousMonth(event: Event, focus?: boolean): void;
    /**
     * Focuses the next year in the calendar
     *
     * @param {Event} event
     * @param {boolean} focus
     * @returns {void}
     */
    focusNextYear(event: Event, focus?: boolean): void;
    /**
     * Focuses the previous year in the calendar
     *
     * @param {Event} event
     * @param {boolean} focus
     * @returns {void}
     */
    focusPreviousYear(event: Event, focus?: boolean): void;
    /**
     * Formats a date string into a Date object
     * - according to the date format set on the date picker parent element
     * - falls back to the provided fallback date if formatting fails
     *
     * @param {string} dateString - The date string to format
     * @param {Date | null} fallback - The fallback date if formatting fails
     * @returns {Date} - The formatted date
     */
    private formattedDateFromString;
    /**
     * Formats a date in a human-readable format
     *
     * @param {Date} date - The date to format
     * @returns {string} - The formatted date
     */
    formattedDateHuman(date: Date): string;
    /**
     * Go to a specific date in the calendar
     *
     * @param {Date} date - The date to go to
     * @param {boolean} focus - Whether to focus the date in the calendar
     * @returns {void}
     */
    goToDate(date: Date, focus?: boolean): void;
    /**
     * Check whether a date is disabled
     * - Checks if the date is before minDate or after maxDate
     * - Checks if the date is in the disabledDates array
     *
     * @param {Date} date - The date to check
     * @returns {boolean} - whether the date is disabled
     */
    private isDisabledDate;
    /**
     * Checks whether the date picker dialog is open
     *
     * @returns {boolean} - whether the dialog is open
     */
    private isOpen;
    /**
     * Handles the keyup event on the last button in the dialog
     * - focuses the first button in the dialog if the Tab key is pressed
     *
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    private lastButtonKeyup;
    /**
     * Opens the date picker dialog
     * - displays the dialog
     * - positions the dialog
     * - gets the date from the input element(s)
     * - updates the calendar
     * - sets the current date
     *
     * @returns {void}
     */
    private openDialog;
    /**
     * Selects a date from the calendar
     * - Updates the calendar button text
     * - Sets the date in the input field(s)
     * - Dispatches a change event on the input element
     * - Calls the dateSelectCallback if provided
     * - Closes the dialog
     *
     * @param {Date} date The date to select
     * @returns {void | false}
     */
    selectDate(date: Date): void | false;
    /**
     * Sets the current date in the calendar
     * - Sets the current date in the calendar
     * - Focuses the current date button if focus is true
     * - Marks today and selected date with appropriate classes and attributes
     *
     * @param {boolean} focus Whether to focus the current date button
     * @returns {void}
     */
    private setCurrentDate;
    /**
     * Sets the date in the input field(s)
     *
     * @param {Date} date - The date to set
     * @returns {void}
     */
    private setDate;
    /**
     * Sets the current date to be within the min and max date range
     *
     * @returns {void}
     */
    private setMinAndMaxDatesOnCalendar;
    /**
     * Sets options for the date picker from both passed options and data attributes
     *
     * @returns {void}
     */
    private setOptions;
    /**
     * Toggles the date picker dialog open or closed
     *
     * @param {Event} event - The event that triggered the toggle
     * @returns {void}
     */
    private toggleDialog;
    /**
     * Transforms legacy data attributes from the input element to the date picker parent element
     *
     * @returns {void}
     */
    private transformLegacyDataAttributes;
    /**
     * Updates the calendar display by redrawing it
     * - Sets the dialog title to the current month and year
     * - Updates each day button in the calendar grid
     * - Hides days from previous/next month
     * - Disables days outside min/max date range or in disabled dates list
     *
     * @returns {void}
     */
    private updateCalendar;
}
export default DSDatePicker;
