import DSComponent from "../../base/component/component";
/**
 * Hide this page component
 *
 * @class HidePage
 * @extends DSComponent
 * @property {string} altlink - the alternative link to navigate to
 * @property {HTMLAnchorElement} button - the hide page button element
 * @property {Window} window - the window object
 */
declare class HidePage extends DSComponent {
    private altlink;
    private button;
    private window;
    /**
     * Creates a hide page component
     *
     * @param {HTMLElement} element - the hide page element
     * @param {Window} _window - the window object
     */
    constructor(element: HTMLElement, _window?: Window);
    /**
     * Attach event listeners to the hide page button
     *
     * @returns {void}
     */
    init(): void;
    /**
     * Add keyboard events
     * - hide page on 'esc'
     *
     * @returns {void}
     */
    private attachKeyboardEvents;
    /**
     * Add mouse events
     * - hide page on click
     *
     * @returns {void}
     */
    private attachMouseEvents;
    /**
     * Hide the current page and navigate to an alternative link
     * - clear page body
     * - navigate to alt link in current tab
     * - open primary link in new tab
     *
     * @param {Event} event
     * @returns {void}
     */
    doHidePage(event: Event): void;
}
export default HidePage;
