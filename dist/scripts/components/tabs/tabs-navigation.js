'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = __importDefault(require("../../base/component/component"));
const breakpoint_check_1 = __importDefault(require("../../base/utilities/breakpoint-check/breakpoint-check"));
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
class TabsNavigation extends component_1.default {
    boundOnResize;
    breakpointCheck;
    resizeTimer;
    tabContainer;
    tabList;
    tabNavigation;
    tabTitle;
    /**
     * Creates a tabs navigation component
     *
     * @param {HTMLElement} tabContainer - the tab container element
     * @param {Function} _breakpointCheck - the breakpoint check function
     */
    constructor(tabContainer, _breakpointCheck = breakpoint_check_1.default) {
        super(tabContainer);
        this.breakpointCheck = _breakpointCheck;
        this.resizeTimer = 0;
        this.tabContainer = tabContainer;
        // The list containing the tabs
        this.tabList = tabContainer.querySelector('.ds_tabs__list');
        // The tab navigation
        this.tabNavigation = tabContainer.querySelector('.ds_tabs__navigation');
        // The tab navigation title
        this.tabTitle = tabContainer.querySelector('.ds_tabs__title');
        // Handle resize events
        this.boundOnResize = this.onResize.bind(this);
        window.addEventListener('resize', this.boundOnResize, true);
    }
    /**
     * Initialise tab navigation if smaller than medium size
     * - checks breakpoint and sets up tab navigation dropdown
     *
     * @returns {void}
     */
    init() {
        if (this.breakpointCheck('medium')) {
            // do nothing
        }
        else {
            this.set();
        }
    }
    /**
     * Setup tab navigation dropdown
     * - adds toggle button
     * - adds event listener to button
     * - sets aria-labelledby if current page label is shown
     *
     * @returns {void}
     */
    set() {
        if (!this.isInitialised) {
            // Swap title to button
            const navButton = document.createElement('button');
            const tabListId = this.tabList.getAttribute('id');
            navButton.classList.add('ds_tabs__toggle');
            navButton.setAttribute('aria-expanded', false.toString());
            navButton.innerHTML = this.tabTitle.innerHTML;
            navButton.setAttribute('aria-controls', tabListId);
            this.tabNavigation.insertBefore(navButton, this.tabList);
            // Event listener for button toggle
            navButton.addEventListener('click', () => {
                if (navButton.getAttribute('aria-expanded') === 'true') {
                    navButton.setAttribute('aria-expanded', false.toString());
                }
                else {
                    navButton.setAttribute('aria-expanded', true.toString());
                }
            });
            // If current page label is shown use it as aria label for navigation
            const currentPage = this.tabContainer.querySelector('.ds_tabs__current');
            if (currentPage) {
                this.tabNavigation.setAttribute('aria-labelledby', 'ds_tabs__current');
            }
            // Mark as initialised for specific layout support
            this.isInitialised = true;
        }
    }
    /**
     * Reset tabs to original state
     * - removes toggle button
     *
     * @returns {void}
     */
    reset() {
        if (this.isInitialised) {
            this.isInitialised = false;
            // Remove button
            const navButton = this.tabContainer.querySelector('.ds_tabs__toggle');
            navButton.parentNode?.removeChild(navButton);
            // Set aria-labelledby back to using the tab list heading
            this.tabNavigation.setAttribute('aria-labelledby', 'ds_tabs__title');
        }
    }
    /**
     * Runs when the browser is resized - includes debounce to prevent multiple calls in quick succession
     * - resets the tabs if the screen is smaller than medium
     *
     * @returns {void}
     */
    onResize() {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = window.setTimeout(() => {
            if (this.breakpointCheck('medium')) {
                this.reset();
            }
            else {
                this.set();
            }
        }, 150);
    }
}
exports.default = TabsNavigation;
