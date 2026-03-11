'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = __importDefault(require("../../base/component/component"));
const breakpoint_check_1 = __importDefault(require("../../base/utilities/breakpoint-check/breakpoint-check"));
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
class Tabs extends component_1.default {
    hasAutomaticActivation;
    boundOnHashChange;
    boundOnResize;
    hasEventsEnabled;
    resizeTimer;
    tabContainer;
    tabContents;
    tabHeaders;
    tabList;
    /**
     * Creates a tabs component
     *
     * @param {HTMLElement} tabContainer - the tab container element
     */
    constructor(tabContainer) {
        super(tabContainer);
        this.resizeTimer = 0;
        this.hasEventsEnabled = false;
        this.hasAutomaticActivation = !tabContainer.classList.contains('ds_tabs--manual');
        this.tabContainer = tabContainer;
        // The list containing the tabs
        this.tabList = tabContainer.querySelector('.ds_tabs__list');
        // The tab items
        this.tabHeaders = [].slice.call(tabContainer.querySelectorAll('.ds_tabs__tab'));
        // The tabs contents
        this.tabContents = [].slice.call(tabContainer.querySelectorAll('.ds_tabs__content'));
        // Handle hashchange events
        this.boundOnHashChange = this.onHashChange.bind(this);
        window.addEventListener('hashchange', this.boundOnHashChange, true);
        // Handle resize events
        this.boundOnResize = this.onResize.bind(this);
        window.addEventListener('resize', this.boundOnResize, true);
    }
    /**
     * Initialise tabs if medium size or larger
     *
     * @returns {void}
     */
    init() {
        if ((0, breakpoint_check_1.default)('medium')) {
            this.set();
            this.hasEventsEnabled = true;
        }
    }
    /**
     * Setup tabs
     * - set roles and attributes
     * - add event listeners
     * - set initial active tab
     *
     * @returns {void}
     */
    set() {
        if (!this.isInitialised) {
            this.tabList.setAttribute('role', 'tablist');
            this.tabHeaders.forEach((tabHeader, index) => this.initTab(tabHeader, index));
            this.tabContents.forEach(item => {
                item.setAttribute('tabindex', '0');
                item.setAttribute('role', 'tabpanel');
            });
            // Set the active tab based on the URL's hash or the first tab
            const currentTabLink = this.getTab(window.location.hash) || this.tabHeaders[0].querySelector('.ds_tabs__tab-link');
            const currentTab = currentTabLink.parentElement;
            this.goToTab(currentTab);
            // Mark as initialised for specific layout support
            this.isInitialised = true;
        }
    }
    /**
     * Reset tabs to original state
     * - removes roles and attributes
     *
     * @returns {void}
     */
    reset() {
        if (this.isInitialised) {
            this.isInitialised = false;
            // reset attributes to default behaviour
            this.tabList.removeAttribute('role');
            this.tabHeaders.forEach((tabHeader, index) => this.resetTab(tabHeader, index));
            this.tabContents.forEach(item => {
                item.removeAttribute('tabindex');
                item.removeAttribute('role');
            });
        }
    }
    /**
     * Runs when the browser is resized - includes debounce to prevent multiple calls in quick succession
     *
     * @returns {void}
     */
    onResize() {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = window.setTimeout(() => {
            if ((0, breakpoint_check_1.default)('medium')) {
                this.set();
            }
            else {
                this.reset();
            }
        }, 150);
    }
    /**
     * Runs when the hash value in the browser changes
     * - navigates to the tab matching the hash value
     *
     * @returns {void}
     */
    onHashChange() {
        const tabWithHashLink = this.getTab(window.location.hash);
        if (!tabWithHashLink) {
            return;
        }
        const tabWithHash = tabWithHashLink.parentElement;
        if ((0, breakpoint_check_1.default)('medium')) {
            this.goToTab(tabWithHash);
            tabWithHash.querySelector('.ds_tabs__tab-link').focus();
        }
    }
    /**
     * Add the specified tab to the browser history
     * - adds the tab's href to the browser history
     *
     * @param {HTMLElement} tab - The tab to add to the browser history
     * @returns {void}
     */
    createHistoryEntry(tab) {
        const tabId = this.getHref(tab);
        history.pushState(null, '', tabId);
    }
    /**
     * Reset tab back to original state
     * - removes roles and attributes
     *
     * @param {HTMLElement} tabHeader - The tab header element
     * @param {number} index - The index of the tab
     * @returns {void}
     */
    resetTab(tabHeader, index) {
        tabHeader.removeAttribute('role');
        tabHeader.classList.remove('ds_current');
        const tabLink = tabHeader.querySelector('.ds_tabs__tab-link');
        const tabContent = this.tabContents[index];
        tabLink.removeAttribute('role');
        tabLink.removeAttribute('aria-controls');
        tabLink.removeAttribute('aria-selected');
        tabLink.removeAttribute('tabindex');
        tabContent.classList.remove('ds_tabs__content--hidden');
    }
    /**
     * Initialise tab and add event listeners for click and arrow keys
     * - sets aria attributes
     * - adds event listeners for click and arrow keys
     *
     * @param {HTMLElement} tabHeader - The tab header element
     * @param {number} index - The index of the tab
     * @returns {void}
     */
    initTab(tabHeader, index) {
        tabHeader.setAttribute('role', 'presentation');
        const tabLink = tabHeader.querySelector('.ds_tabs__tab-link');
        const tabContent = this.tabContents[index];
        const tabId = tabContent.getAttribute('id');
        tabLink.setAttribute('role', 'tab');
        tabLink.setAttribute('aria-controls', tabId);
        tabLink.setAttribute('aria-selected', 'false');
        tabLink.setAttribute('tabindex', '-1');
        tabContent.classList.add('ds_tabs__content--hidden');
        // Only set event listeners on initial setup
        if (!this.hasEventsEnabled) {
            tabLink.addEventListener('click', event => {
                if ((0, breakpoint_check_1.default)('medium')) {
                    event.preventDefault();
                    this.goToTab(tabHeader, true);
                }
            });
            tabLink.addEventListener('keydown', (event) => {
                if ((0, breakpoint_check_1.default)('medium')) {
                    const tab = event.target.parentElement;
                    let tabNavKey = true;
                    if (event.key === 'ArrowRight') {
                        this.navToTab(this.getNextTab(tab));
                    }
                    else if (event.key === 'ArrowLeft') {
                        this.navToTab(this.getPreviousTab(tab));
                    }
                    else if (event.key === 'Home') {
                        this.navToTab(this.getFirstTab());
                    }
                    else if (event.key === 'End') {
                        this.navToTab(this.getLastTab());
                    }
                    else if (event.key === 'Spacebar' || event.key === ' ') {
                        this.goToTab(tab, true);
                    }
                    else {
                        tabNavKey = false;
                    }
                    if (tabNavKey) {
                        event.preventDefault();
                    }
                }
            });
        }
    }
    /**
     * Navigates to the specified tab
     * - focuses the tab
     * - activates the tab if automatic activation is enabled
     *
     * @param {HTMLElement} tab - The tab to navigate to
     * @returns {void}
     */
    navToTab(tab) {
        // first, focus the tab
        tab.querySelector('.ds_tabs__tab-link').focus();
        // then navigate
        if (this.hasAutomaticActivation) {
            this.goToTab(tab, true);
        }
    }
    /**
     * Returns the next tab
     *
     * @param {HTMLElement} currentTab - The current tab
     * @returns {HTMLElement} - The next tab
     */
    getNextTab(currentTab) {
        const tab = currentTab.nextElementSibling || this.getFirstTab();
        return tab;
    }
    /**
     * Returns the previous tab
     *
     * @param {HTMLElement} currentTab - The current tab
     * @returns {HTMLElement} - The previous tab
     */
    getPreviousTab(currentTab) {
        const tab = currentTab.previousElementSibling || this.getLastTab();
        return tab;
    }
    /**
     * Returns the first tab
     *
     * @returns {HTMLElement} - The first tab
     */
    getFirstTab() {
        return this.tabHeaders[0];
    }
    /**
     * Returns the last tab
     *
     * @returns {HTMLElement} - The last tab
     */
    getLastTab() {
        return this.tabHeaders[this.tabHeaders.length - 1];
    }
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
    goToTab(targetTab, updateHistory = false) {
        const oldTab = this.getCurrentTab();
        if (oldTab === targetTab) {
            return;
        }
        const targetTabLink = targetTab.querySelector('.ds_tabs__tab-link');
        const targetTabContent = this.getTabContent(targetTab);
        targetTab.classList.add('ds_current');
        targetTabLink.setAttribute('aria-selected', true.toString());
        targetTabLink.setAttribute('tabindex', '0');
        // Show content for tab
        targetTabContent.classList.remove('ds_tabs__content--hidden');
        this.deactivateTab(oldTab);
        if (updateHistory) {
            this.createHistoryEntry(targetTab);
        }
    }
    /**
     * Deactivate the specified tab
     * - removes active classes and hides content
     * - sets aria attributes
     *
     * @param {HTMLElement} targetTab - The tab to deactivate
     * @returns {void}
     */
    deactivateTab(targetTab) {
        if (!targetTab) {
            return;
        }
        const targetTabLink = targetTab.querySelector('.ds_tabs__tab-link');
        const targetTabContent = this.getTabContent(targetTab);
        targetTab.classList.remove('ds_current');
        targetTabLink.setAttribute('aria-selected', false.toString());
        targetTabLink.setAttribute('tabindex', '-1');
        // Hide content for tab
        targetTabContent.classList.add('ds_tabs__content--hidden');
    }
    /**
     * Returns the tab which matches the specified hash value
     *
     * @param {string} hash - The hash value to match
     * @returns {HTMLElement} - The matching tab element
     */
    getTab(hash) {
        return this.tabContainer.querySelector('.ds_tabs__tab-link[href="' + hash + '"]');
    }
    /**
     * Returns the current tab
     *
     * @returns {HTMLElement} - The current tab
     */
    getCurrentTab() {
        return this.tabList.querySelector('.ds_tabs__tab.ds_current');
    }
    /**
     * Returns the href of the specified tab
     *
     * @param {HTMLElement} tab - The tab element
     * @returns {string} - The href of the specified tab
     */
    getHref(tab) {
        const tabLink = tab.querySelector('.ds_tabs__tab-link');
        const href = tabLink.href;
        return href.slice(href.indexOf('#'), href.length);
    }
    /**
     * Returns the content element for the specified tab
     *
     * @param {HTMLElement} tab - The tab element
     * @returns {HTMLElement} - The content element for the specified tab
     */
    getTabContent(tab) {
        return this.tabContainer.querySelector(this.getHref(tab));
    }
}
exports.default = Tabs;
