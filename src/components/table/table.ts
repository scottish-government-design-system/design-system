'use strict';

import DSComponent from "../../base/component/component";

/**
 * Mobile table component
 *
 * @class MobileTable
 * @extends DSComponent
 * @property {HTMLTableElement} element - the table element
 * @property {Window} window - the window object
 */
export class MobileTable extends DSComponent {
    private element: HTMLTableElement;
    private window: Window;

    /**
     * Creates a mobile table component
     *
     * @param {HTMLTableElement} element - the table element
     * @param _window - the window object
     */
    constructor(element: HTMLTableElement, _window: Window = window) {
        super(element);
        this.element = element;
        this.window = _window;
    }

    /**
     * Initialise mobile table functionality
     * - checks data-smallscreen attribute to determine functionality
     * - 'scrolling' adds scrolling class if table is wider than container
     * - 'boxes' adds data-heading attributes to tds for small screen styling
     *
     * @returns {void}
     */
    init(): void {
        if (this.element.dataset.smallscreen === 'scrolling') {
            this.checkScrollingTable();
            this.window.addEventListener('resize', () => { this.checkScrollingTable(); });
            this.isInitialised = true;
        } else if (this.element.dataset.smallscreen === 'boxes') {
            this.setupBoxesTable();
            this.isInitialised = true;
        }
    }

    /**
     * Check if table is wider than its container and add scrolling class if so
     *
     * @returns {void}
     */
    private checkScrollingTable(): void {
        const tableBodyElement = this.element.querySelector('tbody') as HTMLTableSectionElement;
        const tableParentElement = this.element.parentElement as HTMLElement;
        if (tableParentElement && tableBodyElement.offsetWidth > tableParentElement.offsetWidth) {
            this.element.classList.add('js-is-scrolling');
        } else {
            this.element.classList.remove('js-is-scrolling');
        }
    }

    /**
     * Setup boxes table
     * - adds data-heading attributes to each td based on the relevant th in the header row
     *
     * @returns {void}
     */
    private setupBoxesTable(): void {
        const trs = this.element.querySelectorAll('tr');
        let headerRow: HTMLTableRowElement | undefined;

        if ([].slice.call(trs[0].cells).filter((cell: HTMLTableCellElement) => cell.tagName === 'TH').length === trs[0].cells.length) {
            headerRow = trs[0];
        }

        if (headerRow) {
            for (let j = 1, jl = trs.length; j < jl; j++) {
                [].slice.call(trs[j].cells).forEach((td: HTMLTableCellElement, index: number) => {
                    td.setAttribute('data-heading', headerRow.cells[index].textContent);
                });
            }
        }
    }
}

/**
 * Mobile tables component (legacy)
 *
 * @class MobileTables
 * @extends DSComponent
 * @property {Window} window - the window object
 */
class MobileTables {
    private window: Window;

    constructor(_window = window) {
        this.window = _window;
    }

    /**
     * Initialise all mobile tables on the page
     * - finds all tables with data-smallscreen attribute
     * - initialises each MobileTable instance
     *
     * @returns {void}
     */
    init(): void {
        const mobileTables = document.querySelectorAll('table[data-smallscreen]');
        mobileTables.forEach(table =>  new MobileTable(table as HTMLTableElement, this.window).init())
    }
}

export default MobileTables;
