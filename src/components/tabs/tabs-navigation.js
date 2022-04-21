/* global document, window */

'use strict';

import breakpointCheck from '../../base/utilities/breakpoint-check/breakpoint-check';

class TabsNavigation {
    constructor(tabContainer) {
        this.resizeTimer = null;
        this.eventsEnabled = false;

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
        window.addEventListener('resize', this.boundOnResize, true);
    }

    // Setup tab navigation dropdown
    set() {
        if (!this.tabNavigation.classList.contains('js-initialised')) {

            // Swap title to button
            const navButton = document.createElement('button');
            const tabListId = this.tabList.getAttribute('id');
            navButton.classList.add('ds_link');
            navButton.setAttribute('aria-expanded', false);
            navButton.innerHTML = this.tabTitle.innerHTML;
            navButton.setAttribute('aria-controls', tabListId);
            this.tabTitle.parentNode.removeChild(this.tabTitle);
            this.tabNavigation.insertBefore(navButton, this.tabList);
            // Hide navigation menu
            // Event listener for button toggle

            // Mark as initialised for specific layout support
            this.tabNavigation.classList.add('js-initialised');
        }
    }

    // Initialise tab navigation if smaller than medium size
    init() {
        if (breakpointCheck('medium')) {
            // do nothing
        } else {
            this.set();
            this.eventsEnabled = true;
        }
    }

    // Reset tabs to original 
    reset() {
        if (this.tabNavigation.classList.contains('js-initialised')) {
            this.tabNavigation.classList.remove('js-initialised');   

        
 
        }
    }

    // Runs when the browser is resized - includes debounce to prevent multiple calls in quick succession
    onResize() {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => { 
            if (breakpointCheck('medium')) {
                this.reset();
            } else {
                this.set();
            }
        }, 150);
    }

}

export default TabsNavigation;
