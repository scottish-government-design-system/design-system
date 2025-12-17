'use strict';

import DSComponent from '../../base/component/component';
import breakpointCheck from '../../base/utilities/breakpoint-check/breakpoint-check';

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
class Tabs extends DSComponent {
    private hasAutomaticActivation: boolean;
    private boundOnHashChange: () => void;
    private boundOnResize: () => void;
    private hasEventsEnabled: boolean;
    private resizeTimer?: number;
    private tabContainer: HTMLElement;
    private tabContents: HTMLElement[];
    private tabHeaders: HTMLElement[];
    private tabList: HTMLElement;

    /**
     * Creates a tabs component
     *
     * @param {HTMLElement} tabContainer - the tab container element
     */
    constructor(tabContainer: HTMLElement) {
        super(tabContainer);

        this.resizeTimer = null;
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
        this.boundOnHashChange = this.onHashChange.bind(this)
        window.addEventListener('hashchange', this.boundOnHashChange as EventListenerOrEventListenerObject, true);

        // Handle resize events
        this.boundOnResize = this.onResize.bind(this)
        window.addEventListener('resize', this.boundOnResize as EventListenerOrEventListenerObject, true);
    }

    /**
     * Initialise tabs if medium size or larger
     *
     * @returns {void}
     */
    init(): void {
        if (breakpointCheck('medium')) {
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
    private set(): void {
        if (!this.isInitialised) {
            this.tabList.setAttribute('role', 'tablist');
            this.tabHeaders.forEach((tabHeader, index) => this.initTab(tabHeader, index));

            this.tabContents.forEach(item => {
                item.setAttribute('tabindex', '0')
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
    private reset(): void {
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
    private onResize(): void {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = window.setTimeout(() => {
            if (breakpointCheck('medium')) {
                this.set();
            } else {
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
    private onHashChange(): void {
        const tabWithHashLink = this.getTab(window.location.hash);
        if (!tabWithHashLink) {
            return;
        }

        const tabWithHash = tabWithHashLink.parentElement;

        if (breakpointCheck('medium')) {
            this.goToTab(tabWithHash);
            (tabWithHash.querySelector('.ds_tabs__tab-link') as HTMLElement).focus();
        }
    }

    /**
     * Add the specified tab to the browser history
     * - adds the tab's href to the browser history
     *
     * @param {HTMLElement} tab - The tab to add to the browser history
     * @returns {void}
     */
    private createHistoryEntry(tab: HTMLElement): void {
        const tabId = this.getHref(tab);
        history.pushState(null,null,tabId);
    }

    /**
     * Reset tab back to original state
     * - removes roles and attributes
     *
     * @param {HTMLElement} tabHeader - The tab header element
     * @param {number} index - The index of the tab
     * @returns {void}
     */
    private resetTab(
        tabHeader: HTMLElement,
        index: number
    ): void {
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
    private initTab(
        tabHeader: HTMLElement,
        index: number
    ): void {
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
                if (breakpointCheck('medium')) {
                    event.preventDefault();
                    this.goToTab(tabHeader, true);
                }
            });

            tabLink.addEventListener('keydown', (event: KeyboardEvent) => {
                if (breakpointCheck('medium')) {
                    const tab = (event.target as HTMLElement).parentElement;
                    let tabNavKey = true;

                    if (event.key === 'ArrowRight') {
                        this.navToTab(this.getNextTab(tab));
                    } else if (event.key === 'ArrowLeft') {
                        this.navToTab(this.getPreviousTab(tab));
                    } else if (event.key === 'Home') {
                        this.navToTab(this.getFirstTab());
                    } else if (event.key === 'End') {
                        this.navToTab(this.getLastTab());
                    } else if (event.key === 'Spacebar' || event.key === ' ') {
                        this.goToTab(tab, true)
                    } else {
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
    private navToTab(tab: HTMLElement): void {
        // first, focus the tab
        (tab.querySelector('.ds_tabs__tab-link') as HTMLElement).focus();

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
    private getNextTab(currentTab: HTMLElement): HTMLElement {
        const tab = currentTab.nextElementSibling || this.getFirstTab();
        return tab as HTMLElement;
    }

    /**
     * Returns the previous tab
     *
     * @param {HTMLElement} currentTab - The current tab
     * @returns {HTMLElement} - The previous tab
     */
    private getPreviousTab(currentTab: HTMLElement): HTMLElement {
        const tab = currentTab.previousElementSibling || this.getLastTab();
        return tab as HTMLElement;
    }

    /**
     * Returns the first tab
     *
     * @returns {HTMLElement} - The first tab
     */
    private getFirstTab(): HTMLElement {
        return this.tabHeaders[0];
    }

    /**
     * Returns the last tab
     *
     * @returns {HTMLElement} - The last tab
     */
    private getLastTab(): HTMLElement {
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
    private goToTab(targetTab: HTMLElement, updateHistory: boolean = false): void {
        const oldTab = this.getCurrentTab();

        if (oldTab === targetTab) {
            return;
        }

        const targetTabLink = targetTab.querySelector('.ds_tabs__tab-link');
        const targetTabContent = this.getTabContent(targetTab);

        targetTab.classList.add('ds_current');
        targetTabLink.setAttribute('aria-selected', true.toString());
        targetTabLink.setAttribute('tabindex', '0')

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
    private deactivateTab(targetTab: HTMLElement): void {
        if(!targetTab){
            return;
        }
        const targetTabLink = targetTab.querySelector('.ds_tabs__tab-link');
        const targetTabContent = this.getTabContent(targetTab);

        targetTab.classList.remove('ds_current');
        targetTabLink.setAttribute('aria-selected', false.toString());
        targetTabLink.setAttribute('tabindex', '-1')

        // Hide content for tab
        targetTabContent.classList.add('ds_tabs__content--hidden');
    }

    /**
     * Returns the tab which matches the specified hash value
     *
     * @param {string} hash - The hash value to match
     * @returns {HTMLElement} - The matching tab element
     */
    private getTab(hash: string): HTMLElement {
        return this.tabContainer.querySelector('.ds_tabs__tab-link[href="' + hash + '"]') as HTMLElement;
    }

    /**
     * Returns the current tab
     *
     * @returns {HTMLElement} - The current tab
     */
    private getCurrentTab(): HTMLElement {
        return this.tabList.querySelector('.ds_tabs__tab.ds_current') as HTMLElement;
    }

    /**
     * Returns the href of the specified tab
     *
     * @param {HTMLElement} tab - The tab element
     * @returns {string} - The href of the specified tab
     */
    private getHref(tab: HTMLElement): string {
        const tabLink = tab.querySelector('.ds_tabs__tab-link');
        const href = tabLink.getAttribute('href');
        return href.slice(href.indexOf('#'), href.length);
    }

    /**
     * Returns the content element for the specified tab
     *
     * @param {HTMLElement} tab - The tab element
     * @returns {HTMLElement} - The content element for the specified tab
     */
    private getTabContent(tab: HTMLElement): HTMLElement {
        return this.tabContainer.querySelector(this.getHref(tab)) as HTMLElement;
    }
}

export default Tabs;
