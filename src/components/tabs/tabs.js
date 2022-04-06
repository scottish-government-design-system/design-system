/* global document, window */

'use strict';

import breakpointCheck from '../../base/utilities/breakpoint-check/breakpoint-check';

class Tabs {
    constructor(tabContainer) {
        this.tabContainer = tabContainer;
        // The list containing the tabs
        this.tabList = tabContainer.querySelector('.ds_tabs__list'); 
        // The tab items
        this.tabHeaders = [].slice.call(tabContainer.querySelectorAll('.ds_tabs__tab'));
        // The tabs contents
        this.tabContents = [].slice.call(tabContainer.querySelectorAll('.ds_tabs__content'));

        this.keycodes = {
            'left': 37,
            'up': 38,
            'right': 39,
            'down': 40
        };

        // Handle hashchange events
        this.boundOnHashChange = this.onHashChange.bind(this)
        window.addEventListener('hashchange', this.boundOnHashChange, true);
    }

    init() {
        if (!this.tabContainer.classList.contains('js-initialised')) {
            this.tabList.setAttribute('role', 'tablist');
            this.tabHeaders.forEach((tabHeader, index) => this.initTab(tabHeader, index));

            // Set the active tab based on the URL's hash or the first tab
            let currentTabLink = this.getTab(window.location.hash) || this.tabHeaders[0].querySelector('.ds_tabs__tab-link');
            let currentTab = currentTabLink.parentElement;
            this.activateTab(currentTab);   

            // Mark as initialised for specific layout support
            this.tabContainer.classList.add('js-initialised');
        }
    }

    onHashChange() {
        let tabWithHashLink = this.getTab(window.location.hash);
        if (!tabWithHashLink) {
          return;
        }
        let tabWithHash = tabWithHashLink.parentElement;
      
        // Prevent changing the hash
        if (this.changingHash) {
          this.changingHash = false;
          return;
        }

        let currentTab = this.getCurrentTab();
        this.deactivateTab(currentTab);
        this.activateTab(tabWithHash);
        tabWithHash.querySelector('.ds_tabs__tab-link').focus();
    }

    createHistoryEntry(tab) {
        let tabId = this.getHref(tab);
        this.changingHash = true;
        window.location.hash = tabId;
    }

    initTab(tabHeader, index) {
        tabHeader.setAttribute('role', 'presentation');
        
        const tabLink = tabHeader.querySelector('.ds_tabs__tab-link');
        const tabContent = this.tabContents[index];
        const tabId = tabContent.getAttribute('id');

        tabLink.setAttribute('role', 'tab');
        tabLink.setAttribute('aria-controls', tabId);
        tabLink.setAttribute('aria-selected', 'false');
        tabLink.setAttribute('tabindex', '-1');

        tabContent.setAttribute('hidden', 'hidden');

        tabLink.addEventListener('click', () => {
            let currentTab = this.getCurrentTab();
            this.deactivateTab(currentTab);
            this.activateTab(tabHeader);
        });

        tabLink.addEventListener('keydown', (event) => {
            let tabNavKey = true;

            if (event.keyCode === this.keycodes.right) {
                this.activateNextTab(event);
            } else if (event.keyCode === this.keycodes.left) {
                this.activatePreviousTab(event);
            } else if (event.keyCode === this.keycodes.up) {
                this.activatePreviousTab(event);
            } else if (event.keyCode === this.keycodes.down) {
                this.activateNextTab(event);
            } else {
                tabNavKey = false;
            }

            if (tabNavKey) {
                event.preventDefault();
                event.stopPropagation();
            }
        });
    }

    activateNextTab() {
        let currentTab = this.getCurrentTab();
        let nextTab = currentTab.nextElementSibling;
        if (nextTab){
            this.deactivateTab(currentTab);
            this.activateTab(nextTab);
            this.createHistoryEntry(nextTab);
            nextTab.querySelector('.ds_tabs__tab-link').focus();
        }
    }

    activatePreviousTab() {
        let currentTab = this.getCurrentTab();
        let previousTab = currentTab.previousElementSibling;
        if (previousTab){
            this.deactivateTab(currentTab);
            this.activateTab(previousTab);
            this.createHistoryEntry(previousTab);
            previousTab.querySelector('.ds_tabs__tab-link').focus();
        }
    }

    activateTab(targetTab) {
        let targetTabLink = targetTab.querySelector('.ds_tabs__tab-link');
        let targetTabContent = this.getTabContent(targetTab);
        
        targetTab.classList.add('ds_current');
        targetTabLink.setAttribute('aria-selected', true);
        targetTabLink.setAttribute('tabindex', '0')

        // Show content for tab
        targetTabContent.removeAttribute('hidden');
    }

    deactivateTab(targetTab) {
        let targetTabLink = targetTab.querySelector('.ds_tabs__tab-link');
        let targetTabContent = this.getTabContent(targetTab);
        
        targetTab.classList.remove('ds_current');
        targetTabLink.setAttribute('aria-selected', false);
        targetTabLink.setAttribute('tabindex', '-1')

        // Hide content for tab
        targetTabContent.setAttribute('hidden', 'hidden');
    }

    getTab(hash) {
        return this.tabContainer.querySelector('.ds_tabs__tab-link[href="' + hash + '"]');
    }  

    getCurrentTab() {
        return this.tabList.querySelector('.ds_tabs__tab.ds_current')    
    }

    getHref(tab) {
        let tabLink = tab.querySelector('.ds_tabs__tab-link');
        let href = tabLink.getAttribute('href');
        return href.slice(href.indexOf('#'), href.length);
    }

    getTabContent(tab) {
        return this.tabContainer.querySelector(this.getHref(tab))
    }
}

export default Tabs;
