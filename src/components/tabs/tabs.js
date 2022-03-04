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
    }

    init() {
        if (!this.tabContainer.classList.contains('js-initialised')) {
            this.tabList.setAttribute('role', 'tablist');
            this.tabHeaders.forEach((tabHeader, index) => this.initTab(tabHeader, index));
            //this.updateTabIndexes(); 

            // Set the active tab based on the URL's hash or the first tab
            let currentTabLink = this.getTab(window.location.hash) || this.tabHeaders[0].querySelector('.ds_tabs__tab-link');
            let currentTab = currentTabLink.parentElement;
            this.activateTab(currentTab)    

            // Handle hashchange events
            //window.addEventListener('hashchange', this.onHashChange, true);

            // Mark as initialised for specific layout support
            this.tabContainer.classList.add('js-initialised');
            console.log('tabs activated');
        }
    }

    onHashChange() {
        let hash = window.location.hash;
        console.log('Hash',hash);
        console.log('getTab',this.getTab(window.location.hash));
        let tabWithHash = this.getTab(window.location.hash);
        if (!tabWithHash) {
          return
        }
        console.log('tabhas',tabWithHash);
      /*
        // Prevent changing the hash
        if (this.changingHash) {
          this.changingHash = false
          return
        }
      */
        // Show either the active tab according to the URL's hash or the first tab
        /*var $previousTab = this.getCurrentTab()
      
        this.hideTab($previousTab)
        this.showTab($tabWithHash)
        $tabWithHash.focus()*/
      }

    initTab(tabHeader, index) {
        tabHeader.setAttribute('role', 'presentation');
        
        const tabLink = tabHeader.querySelector('.ds_tabs__tab-link');
        const tabContent = this.tabContents[index];
        const tabId = tabContent.getAttribute('id');

        tabLink.setAttribute('role', 'tab')
        tabLink.setAttribute('aria-controls', tabId)
        tabLink.setAttribute('aria-selected', 'false')
        tabLink.setAttribute('tabindex', '-1')

        tabLink.addEventListener('click', () => {
            let currentTab = this.getCurrentTab();
            console.log('Current tab', currentTab);
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
       /* let active = 0;
        this.tabHeaders.forEach(function (tabHeader, index) {
            if (document.activeElement === tabHeader.querySelector('.ds_tabs__tab-link')) {
                active = index;
            }
        });
        this.tabHeaders[(active + 1) % this.tabHeaders.length].querySelector('.ds_tabs__tab-link').focus();
        */
    }

    activatePreviousTab() {
        /*
        let active = 0;

        this.tabHeaders.forEach(function (tabHeader, index) {
            if (document.activeElement === tabHeader.querySelector('.ds_tabs__tab-link')) {
                active = index;
            }
        });
        this.tabHeaders[(active + this.tabHeaders.length - 1) % this.tabHeaders.length].querySelector('.ds_tabs__tab-link').focus();
        */
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

    updateTabIndexes() {
        this.tabHeaders.forEach(tabHeader => {
            let tabIndex = -1;

            if (tabHeader.classList.contains('ds_current')) {
                tabIndex = 0;
            }
            /*
            if (breakpointCheck('medium')) {
                tabHeader.querySelector('.mg_tab__label').setAttribute('tabindex', tabIndex);
            }
            */
        });
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
