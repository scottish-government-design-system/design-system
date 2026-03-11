'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileTable = void 0;
const component_1 = __importDefault(require("../../base/component/component"));
/**
 * Mobile table component
 *
 * @class MobileTable
 * @extends DSComponent
 * @property {HTMLTableElement} element - the table element
 * @property {Window} window - the window object
 */
class MobileTable extends component_1.default {
    element;
    window;
    /**
     * Creates a mobile table component
     *
     * @param {HTMLTableElement} element - the table element
     * @param _window - the window object
     */
    constructor(element, _window = window) {
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
    init() {
        if (this.element.dataset.smallscreen === 'scrolling') {
            this.checkScrollingTable();
            this.window.addEventListener('resize', () => { this.checkScrollingTable(); });
            this.isInitialised = true;
        }
        else if (this.element.dataset.smallscreen === 'boxes') {
            this.setupBoxesTable();
            this.isInitialised = true;
        }
    }
    /**
     * Check if table is wider than its container and add scrolling class if so
     *
     * @returns {void}
     */
    checkScrollingTable() {
        const tableBodyElement = this.element.querySelector('tbody');
        const tableParentElement = this.element.parentElement;
        if (tableParentElement && tableBodyElement.offsetWidth > tableParentElement.offsetWidth) {
            this.element.classList.add('js-is-scrolling');
        }
        else {
            this.element.classList.remove('js-is-scrolling');
        }
    }
    /**
     * Setup boxes table
     * - adds data-heading attributes to each td based on the relevant th in the header row
     *
     * @returns {void}
     */
    setupBoxesTable() {
        const trs = this.element.querySelectorAll('tr');
        let headerRow;
        if ([].slice.call(trs[0].cells).filter((cell) => cell.tagName === 'TH').length === trs[0].cells.length) {
            headerRow = trs[0];
        }
        if (headerRow) {
            for (let j = 1, jl = trs.length; j < jl; j++) {
                [].slice.call(trs[j].cells).forEach((td, index) => {
                    td.setAttribute('data-heading', headerRow.cells[index].textContent);
                });
            }
        }
    }
}
exports.MobileTable = MobileTable;
/**
 * Mobile tables component (legacy)
 *
 * @class MobileTables
 * @extends DSComponent
 * @property {Window} window - the window object
 */
class MobileTables {
    window;
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
    init() {
        const mobileTables = document.querySelectorAll('table[data-smallscreen]');
        mobileTables.forEach(table => new MobileTable(table, this.window).init());
    }
}
exports.default = MobileTables;
