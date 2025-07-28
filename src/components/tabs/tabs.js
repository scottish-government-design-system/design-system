/* global document, window */

'use strict';

import breakpointCheck from '../../base/utilities/breakpoint-check/breakpoint-check';

class Tabs {
    constructor(tabContainer) {
        this.resizeTimer = null;
        this.eventsEnabled = false;

        this.automaticActivation = !tabContainer.classList.contains('ds_tabs--manual');

        this.tabContainer = tabContainer;
        // The list containing the tabs
        this.tabList = tabContainer.querySelector('.ds_tabs__list');
        // The tab items
        this.tabHeaders = [].slice.call(tabContainer.querySelectorAll('.ds_tabs__tab'));
        // The tabs contents
        this.tabContents = [].slice.call(tabContainer.querySelectorAll('.ds_tabs__content'));

        this.keycodes = {
            'space': 32,
            'end': 35,
            'home': 36,
            'left': 37,
            'right': 39
        };

        // Handle hashchange events
        this.boundOnHashChange = this.onHashChange.bind(this)
        window.addEventListener('hashchange', this.boundOnHashChange, true);

        // Handle resize events
        this.boundOnResize = this.onResize.bind(this)
        window.addEventListener('resize', this.boundOnResize, true);
    }

    // Setup tabs
    set() {
        if (!this.tabContainer.classList.contains('js-initialised')) {
            this.tabList.setAttribute('role', 'tablist');
            this.tabHeaders.forEach((tabHeader, index) => this.initTab(tabHeader, index));

            this.tabContents.forEach(item => {
                item.setAttribute('tabindex', '0')
                item.setAttribute('role', 'tabpanel');
            });

            // Set the active tab based on the URL's hash or the first tab
            let currentTabLink = this.getTab(window.location.hash) || this.tabHeaders[0].querySelector('.ds_tabs__tab-link');
            let currentTab = currentTabLink.parentElement;
            this.goToTab(currentTab);

            // Mark as initialised for specific layout support
            this.tabContainer.classList.add('js-initialised');
        }
    }

    // Initialise tabs if medium size or larger
    init() {
        if (breakpointCheck('medium')) {
            this.set();
            this.eventsEnabled = true;
        }
    }

    // Reset tabs to original
    reset() {
        if (this.tabContainer.classList.contains('js-initialised')) {
            this.tabContainer.classList.remove('js-initialised');

            // reset attributes to default behaviour
            this.tabList.removeAttribute('role');
            this.tabHeaders.forEach((tabHeader, index) => this.resetTab(tabHeader, index));

            this.tabContents.forEach(item => {
                item.removeAttribute('tabindex');
                item.removeAttribute('role');
            });
        }
    }

    // Runs when the browser is resized - includes debounce to prevent multiple calls in quick succession
    onResize() {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            if (breakpointCheck('medium')) {
                this.set();
            } else {
                this.reset();
            }
        }, 150);
    }

    // Runs when the hash value in the browser changes
    onHashChange() {
        let tabWithHashLink = this.getTab(window.location.hash);
        if (!tabWithHashLink) {
            return;
        }

        let tabWithHash = tabWithHashLink.parentElement;

        if (breakpointCheck('medium')) {
            this.goToTab(tabWithHash);
            tabWithHash.querySelector('.ds_tabs__tab-link').focus();
        }
    }

    // Add the specified tab to the browser history
    createHistoryEntry(tab) {
        let tabId = this.getHref(tab);
        history.pushState(null,null,tabId);
    }

    // Reset tab back to original state
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

    // Initialise tab and add event listeners for click and arrow keys
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
        if(!this.eventsEnabled){
            tabLink.addEventListener('click', event => {
                if (breakpointCheck('medium')) {
                    event.preventDefault();
                    this.goToTab(tabHeader);
                }
            });

            tabLink.addEventListener('keydown', (event) => {
                if (breakpointCheck('medium')) {
                    const tab = event.target.parentElement;
                    let tabNavKey = true;

                    if (event.keyCode === this.keycodes.right) {
                        this.navToTab(this.getNextTab(tab));
                    } else if (event.keyCode === this.keycodes.left) {
                        this.navToTab(this.getPreviousTab(tab));
                    } else if (event.keyCode === this.keycodes.home) {
                        this.navToTab(this.getFirstTab());
                    } else if (event.keyCode === this.keycodes.end) {
                        this.navToTab(this.getLastTab());
                    } else if (event.keyCode === this.keycodes.space) {
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

    navToTab(tab) {
        // first, focus the tab
        tab.querySelector('.ds_tabs__tab-link').focus();

        // then navigate
        if (this.automaticActivation) {
            this.goToTab(tab);
        }
    }

    getNextTab(currentTab) {
        return currentTab.nextElementSibling || this.getFirstTab();
    }

    getPreviousTab(currentTab) {
        return currentTab.previousElementSibling || this.getLastTab();
    }

    getFirstTab() {
        return this.tabHeaders[0];
    }

    getLastTab() {
        return this.tabHeaders[this.tabHeaders.length - 1];
    }

    // Go to specified tab
    goToTab(targetTab) {
        let oldTab = this.getCurrentTab();

        if (oldTab === targetTab) {
            return;
        }

        let targetTabLink = targetTab.querySelector('.ds_tabs__tab-link');
        let targetTabContent = this.getTabContent(targetTab);

        targetTab.classList.add('ds_current');
        targetTabLink.setAttribute('aria-selected', true);
        targetTabLink.setAttribute('tabindex', '0')

        // Show content for tab
        targetTabContent.classList.remove('ds_tabs__content--hidden');

        this.deactivateTab(oldTab);
        this.createHistoryEntry(targetTab);
    }

    // Deactivate specified tab
    deactivateTab(targetTab) {
        if(!targetTab){
            return;
        }
        let targetTabLink = targetTab.querySelector('.ds_tabs__tab-link');
        let targetTabContent = this.getTabContent(targetTab);

        targetTab.classList.remove('ds_current');
        targetTabLink.setAttribute('aria-selected', false);
        targetTabLink.setAttribute('tabindex', '-1')

        // Hide content for tab
        targetTabContent.classList.add('ds_tabs__content--hidden');
    }

    // Returns the tab which matches the specified hash value
    getTab(hash) {
        return this.tabContainer.querySelector('.ds_tabs__tab-link[href="' + hash + '"]');
    }

    // Returns the current tab
    getCurrentTab() {
        return this.tabList.querySelector('.ds_tabs__tab.ds_current')
    }

    // Returns the href of the specified tab
    getHref(tab) {
        let tabLink = tab.querySelector('.ds_tabs__tab-link');
        let href = tabLink.getAttribute('href');
        return href.slice(href.indexOf('#'), href.length);
    }

    // Returns the content for the specified tab
    getTabContent(tab) {
        return this.tabContainer.querySelector(this.getHref(tab))
    }
}

export default Tabs;
