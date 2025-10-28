/* global document, window */

'use strict';

import breakpointCheck from '../../base/utilities/breakpoint-check/breakpoint-check';

class TabsNavigation {
    boundOnResize: Function;
    hasEventsEnabled: boolean;
    resizeTimer?: number;
    tabContainer: HTMLElement;
    tabHeaders: HTMLElement[];
    tabList: HTMLElement;
    tabNavigation: HTMLElement;
    tabTitle: HTMLElement;

    constructor(tabContainer: HTMLElement) {
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

    // Setup tab navigation dropdown
    set() {
        if (!this.tabNavigation.classList.contains('js-initialised')) {

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
            this.tabNavigation.classList.add('js-initialised');
        }
    }

    // Initialise tab navigation if smaller than medium size
    init() {
        if (breakpointCheck('medium')) {
            // do nothing
        } else {
            this.set();
            this.hasEventsEnabled = true;
        }
    }

    // Reset tabs to original
    reset() {
        if (this.tabNavigation.classList.contains('js-initialised')) {
            this.tabNavigation.classList.remove('js-initialised');

            // Remove button
            const navButton = this.tabContainer.querySelector('.ds_tabs__toggle');
            navButton.parentNode.removeChild(navButton);

            // Set aria-labelledby back to using the tab list heading
            this.tabNavigation.setAttribute('aria-labelledby','ds_tabs__title');
        }
    }

    // Runs when the browser is resized - includes debounce to prevent multiple calls in quick succession
    onResize() {
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
