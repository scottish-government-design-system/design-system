import DSComponent from '../../base/component/component';
/**
 * Tabs component
 *
 * @class Tabs
 * @extends DSComponent
 * @property {HTMLElement} tabContainer - the tab container element
 * @property {HTMLElement[]} tabContents - the tab content elements
 * @property {HTMLElement[]} tabHeaders - the tab header elements
 * @property {HTMLElement} tabList - the tab list element
 * @property {boolean} hasAutomaticActivation - whether tabs activate automatically on focus
 * @property {boolean} hasEventsEnabled - whether event listeners have been added
 * @property {number} resizeTimer - timer for debouncing resize events
 */
declare class Tabs extends DSComponent {
    private hasAutomaticActivation;
    private boundOnHashChange;
    private boundOnResize;
    private hasEventsEnabled;
    private resizeTimer?;
    private tabContainer;
    private tabContents;
    private tabHeaders;
    private tabList;
    /**
     * Creates a tabs component
     *
     * @param {HTMLElement} tabContainer - the tab container element
     */
    constructor(tabContainer: HTMLElement);
    /**
     * Initialise tabs if medium size or larger
     *
     * @returns {void}
     */
    init(): void;
    /**
     * Setup tabs
     * - set roles and attributes
     * - add event listeners
     * - set initial active tab
     *
     * @returns {void}
     */
    private set;
    /**
     * Reset tabs to original state
     * - removes roles and attributes
     *
     * @returns {void}
     */
    private reset;
    /**
     * Runs when the browser is resized - includes debounce to prevent multiple calls in quick succession
     *
     * @returns {void}
     */
    private onResize;
    /**
     * Runs when the hash value in the browser changes
     * - navigates to the tab matching the hash value
     *
     * @returns {void}
     */
    private onHashChange;
    /**
     * Add the specified tab to the browser history
     * - adds the tab's href to the browser history
     *
     * @param {HTMLElement} tab - The tab to add to the browser history
     * @returns {void}
     */
    private createHistoryEntry;
    /**
     * Reset tab back to original state
     * - removes roles and attributes
     *
     * @param {HTMLElement} tabHeader - The tab header element
     * @param {number} index - The index of the tab
     * @returns {void}
     */
    private resetTab;
    /**
     * Initialise tab and add event listeners for click and arrow keys
     * - sets aria attributes
     * - adds event listeners for click and arrow keys
     *
     * @param {HTMLElement} tabHeader - The tab header element
     * @param {number} index - The index of the tab
     * @returns {void}
     */
    private initTab;
    /**
     * Navigates to the specified tab
     * - focuses the tab
     * - activates the tab if automatic activation is enabled
     *
     * @param {HTMLElement} tab - The tab to navigate to
     * @returns {void}
     */
    private navToTab;
    /**
     * Returns the next tab
     *
     * @param {HTMLElement} currentTab - The current tab
     * @returns {HTMLElement} - The next tab
     */
    private getNextTab;
    /**
     * Returns the previous tab
     *
     * @param {HTMLElement} currentTab - The current tab
     * @returns {HTMLElement} - The previous tab
     */
    private getPreviousTab;
    /**
     * Returns the first tab
     *
     * @returns {HTMLElement} - The first tab
     */
    private getFirstTab;
    /**
     * Returns the last tab
     *
     * @returns {HTMLElement} - The last tab
     */
    private getLastTab;
    /**
     * Go to specified tab
     * - activates the tab and shows the relevant content
     * - deactivates the previous tab and hides its content
     * - updates browser history if required
     *
     * @param {HTMLElement} targetTab - The tab to activate
     * @param {boolean} updateHistory - Whether to update the browser history
     * @returns {void}
     */
    private goToTab;
    /**
     * Deactivate the specified tab
     * - removes active classes and hides content
     * - sets aria attributes
     *
     * @param {HTMLElement} targetTab - The tab to deactivate
     * @returns {void}
     */
    private deactivateTab;
    /**
     * Returns the tab which matches the specified hash value
     *
     * @param {string} hash - The hash value to match
     * @returns {HTMLElement} - The matching tab element
     */
    private getTab;
    /**
     * Returns the current tab
     *
     * @returns {HTMLElement} - The current tab
     */
    private getCurrentTab;
    /**
     * Returns the href of the specified tab
     *
     * @param {HTMLElement} tab - The tab element
     * @returns {string} - The href of the specified tab
     */
    private getHref;
    /**
     * Returns the content element for the specified tab
     *
     * @param {HTMLElement} tab - The tab element
     * @returns {HTMLElement} - The content element for the specified tab
     */
    private getTabContent;
}
export default Tabs;
