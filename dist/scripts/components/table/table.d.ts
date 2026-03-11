import DSComponent from "../../base/component/component";
/**
 * Mobile table component
 *
 * @class MobileTable
 * @extends DSComponent
 * @property {HTMLTableElement} element - the table element
 * @property {Window} window - the window object
 */
export declare class MobileTable extends DSComponent {
    private element;
    private window;
    /**
     * Creates a mobile table component
     *
     * @param {HTMLTableElement} element - the table element
     * @param _window - the window object
     */
    constructor(element: HTMLTableElement, _window?: Window);
    /**
     * Initialise mobile table functionality
     * - checks data-smallscreen attribute to determine functionality
     * - 'scrolling' adds scrolling class if table is wider than container
     * - 'boxes' adds data-heading attributes to tds for small screen styling
     *
     * @returns {void}
     */
    init(): void;
    /**
     * Check if table is wider than its container and add scrolling class if so
     *
     * @returns {void}
     */
    private checkScrollingTable;
    /**
     * Setup boxes table
     * - adds data-heading attributes to each td based on the relevant th in the header row
     *
     * @returns {void}
     */
    private setupBoxesTable;
}
/**
 * Mobile tables component (legacy)
 *
 * @class MobileTables
 * @extends DSComponent
 * @property {Window} window - the window object
 */
declare class MobileTables {
    private window;
    constructor(_window?: Window & typeof globalThis);
    /**
     * Initialise all mobile tables on the page
     * - finds all tables with data-smallscreen attribute
     * - initialises each MobileTable instance
     *
     * @returns {void}
     */
    init(): void;
}
export default MobileTables;
