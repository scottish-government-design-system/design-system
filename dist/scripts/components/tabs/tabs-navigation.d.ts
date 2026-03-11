import DSComponent from '../../base/component/component';
import breakpointCheck from '../../base/utilities/breakpoint-check/breakpoint-check';
/**
 * Tabs navigation component
 *
 * @class TabsNavigation
 * @extends DSComponent
 * @property {HTMLElement} tabContainer - the tab container element
 * @property {HTMLElement} tabList - the list containing the tabs
 * @property {HTMLElement} tabNavigation - the tab navigation
 * @property {HTMLElement} tabTitle - the tab navigation title
 * @property {Function} breakpointCheck - the breakpoint check function
 * @property {number} [resizeTimer] - the resize timer
 * @property {Function} boundOnResize - the bound on resize function
 */
declare class TabsNavigation extends DSComponent {
    private boundOnResize;
    private breakpointCheck;
    private resizeTimer?;
    private tabContainer;
    private tabList;
    private tabNavigation;
    private tabTitle;
    /**
     * Creates a tabs navigation component
     *
     * @param {HTMLElement} tabContainer - the tab container element
     * @param {Function} _breakpointCheck - the breakpoint check function
     */
    constructor(tabContainer: HTMLElement, _breakpointCheck?: typeof breakpointCheck);
    /**
     * Initialise tab navigation if smaller than medium size
     * - checks breakpoint and sets up tab navigation dropdown
     *
     * @returns {void}
     */
    init(): void;
    /**
     * Setup tab navigation dropdown
     * - adds toggle button
     * - adds event listener to button
     * - sets aria-labelledby if current page label is shown
     *
     * @returns {void}
     */
    private set;
    /**
     * Reset tabs to original state
     * - removes toggle button
     *
     * @returns {void}
     */
    private reset;
    /**
     * Runs when the browser is resized - includes debounce to prevent multiple calls in quick succession
     * - resets the tabs if the screen is smaller than medium
     *
     * @returns {void}
     */
    private onResize;
}
export default TabsNavigation;
