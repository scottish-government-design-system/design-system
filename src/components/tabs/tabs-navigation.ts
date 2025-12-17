'use strict';

import DSComponent from '../../base/component/component';
import breakpointCheck from '../../base/utilities/breakpoint-check/breakpoint-check';

/**
 * Tabs navigation component
 *
 * @class TabsNavigation
 * @extends DSComponent
 * @property {HTMLElement} tabContainer - the tab container element
 * @property {HTMLElement[]} tabHeaders - the tab items
 * @property {HTMLElement} tabList - the list containing the tabs
 * @property {HTMLElement} tabNavigation - the tab navigation
 * @property {HTMLElement} tabTitle - the tab navigation title
 * @property {Function} breakpointCheck - the breakpoint check function
 * @property {boolean} hasEventsEnabled - whether events are enabled
 * @property {number} [resizeTimer] - the resize timer
 * @property {Function} boundOnResize - the bound on resize function
 */
class TabsNavigation extends DSComponent {
    boundOnResize: () => void;
    breakpointCheck: (size: string) => boolean;
    hasEventsEnabled: boolean;
    resizeTimer?: number;
    tabContainer: HTMLElement;
    tabHeaders: HTMLElement[];
    tabList: HTMLElement;
    tabNavigation: HTMLElement;
    tabTitle: HTMLElement;

    /**
     * Creates a tabs navigation component
     *
     * @param {HTMLElement} tabContainer - the tab container element
     * @param {Function} _breakpointCheck - the breakpoint check function
     */
    constructor(tabContainer: HTMLElement, _breakpointCheck = breakpointCheck) {
        super(tabContainer)

        this.breakpointCheck = _breakpointCheck;
        this.resizeTimer = null;
        this.hasEventsEnabled = false;

        this.tabContainer = tabContainer;
        // The list containing the tabs
        this.tabList = tabContainer.querySelector('.ds_tabs__list');
        // The tab items
        this.tabHeaders = [].slice.call(tabContainer.querySelectorAll('.ds_tabs__tab'));
        // The tab navigation
        this.tabNavigation = tabContainer.querySelector('.ds_tabs__navigation');
        // The tab navigation title
        this.tabTitle = tabContainer.querySelector('.ds_tabs__title');

        // Handle resize events
        this.boundOnResize = this.onResize.bind(this)
        window.addEventListener('resize', this.boundOnResize as EventListenerOrEventListenerObject, true);
    }

    /**
     * Initialise tab navigation if smaller than medium size
     * - checks breakpoint and sets up tab navigation dropdown
     *
     * @returns {void}
     */
    init(): void {
        if (breakpointCheck('medium')) {
            // do nothing
        } else {
            this.set();
            this.hasEventsEnabled = true;
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
    private set(): void {
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
                } else {
                    navButton.setAttribute('aria-expanded', true.toString());
                }
            });

            // If current page label is shown use it as aria label for navigation
            const currentPage = this.tabContainer.querySelector('.ds_tabs__current');
            if(currentPage) {
                this.tabNavigation.setAttribute('aria-labelledby','ds_tabs__current');
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
    private reset(): void {
        if (this.isInitialised) {
            this.isInitialised = false;

            // Remove button
            const navButton = this.tabContainer.querySelector('.ds_tabs__toggle');
            navButton.parentNode.removeChild(navButton);

            // Set aria-labelledby back to using the tab list heading
            this.tabNavigation.setAttribute('aria-labelledby','ds_tabs__title');
        }
    }

    /**
     * Runs when the browser is resized - includes debounce to prevent multiple calls in quick succession
     * - resets the tabs if the screen is smaller than medium
     *
     * @returns {void}
     */
    private onResize(): void {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = window.setTimeout(() => {
            if (breakpointCheck('medium')) {
                this.reset();
            } else {
                this.set();
            }
        }, 150);
    }

}

export default TabsNavigation;
