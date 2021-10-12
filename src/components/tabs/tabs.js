/* global document, window */

'use strict';

import breakpointCheck from '../../base/utilities/breakpoint-check/breakpoint-check';

class Tabs {
    constructor(tabContainer) {
        this.tabContainer = tabContainer;
        this.tabHeaders = [].slice.call(tabContainer.querySelectorAll('.ds_tab__header'));

        this.keycodes = {
            'left': 37,
            'up': 38,
            'right': 39,
            'down': 40
        };
    }

    init() {
        // dom manipulation
        this.tabHeaders.forEach((tabHeader, index) => this.initTab(tabHeader, index));
        this.updateTabIndexes();
    }

    initTab(tabHeader, index) {
        const tabLabel = tabHeader.querySelector('.ds_tab__label');
        const tabContent = tabHeader.nextElementSibling;
        const tabInput = tabHeader.previousElementSibling;

        const tabID = tabLabel.getAttribute('for') + '-content';

        const button = document.createElement('button');
        button.setAttribute('class', tabLabel.getAttribute('class'));
        button.setAttribute('role', tabLabel.getAttribute('role'));
        if (tabLabel.getAttribute('data-navigation')) {
            button.setAttribute('data-navigation', tabLabel.getAttribute('data-navigation'));
        }
        button.setAttribute('aria-controls', tabLabel.getAttribute('aria-controls'));
        button.id = tabLabel.id;
        button.innerHTML = tabLabel.innerHTML + ' ';
        const span = document.createElement('span');
        span.classList.add('visually-hidden');
        span.innerText = `(item ${index + 1} of ${this.tabHeaders.length})`;
        button.appendChild(span);

        button.dataset.for = tabID;
        tabContent.id = tabID;

        if (tabInput.checked) {
            tabHeader.classList.add('ds_current');
            button.setAttribute('aria-selected', true);
            tabContent.removeAttribute('hidden');
        } else {
            button.setAttribute('aria-selected', false);
            tabContent.setAttribute('hidden', 'hidden');
        }

        tabHeader.appendChild(button);
        tabHeader.removeChild(tabLabel);
        tabHeader.parentNode.removeChild(tabInput);

        button.addEventListener('click', () => {
            this.activateTab(tabHeader);
        });

        button.addEventListener('keydown', (event) => {
            let tabNavKey = true;

            if (event.keyCode === this.keycodes.right) {
                this.focusNextTab(event);
            } else if (event.keyCode === this.keycodes.left) {
                this.focusPreviousTab(event);
            } else if (event.keyCode === this.keycodes.up) {
                this.focusPreviousTab(event);
            } else if (event.keyCode === this.keycodes.down) {
                this.focusNextTab(event);
            } else {
                tabNavKey = false;
            }

            if (tabNavKey) {
                event.preventDefault();
                event.stopPropagation();
            }
        });
    }

    focusNextTab() {
        let active = 0;
        this.tabHeaders.forEach(function (tabHeader, index) {
            if (document.activeElement === tabHeader.querySelector('button')) {
                active = index;
            }
        });
        this.tabHeaders[(active + 1) % this.tabHeaders.length].querySelector('button').focus();
    }

    focusPreviousTab() {
        let active = 0;

        this.tabHeaders.forEach(function (tabHeader, index) {
            if (document.activeElement === tabHeader.querySelector('button')) {
                active = index;
            }
        });
        this.tabHeaders[(active + this.tabHeaders.length - 1) % this.tabHeaders.length].querySelector('button').focus();
    }

    activateTab(targetTabHeader) {
        this.tabHeaders.forEach(tabHeader => {
            const tabContent = tabHeader.nextElementSibling;

            if (tabHeader === targetTabHeader) {
                tabHeader.classList.add('ds_current');
                tabHeader.querySelector('.ds_tab__label').setAttribute('aria-selected', true);
                tabContent.removeAttribute('hidden');
            } else {
                tabHeader.classList.remove('ds_current');
                tabHeader.querySelector('.ds_tab__label').setAttribute('aria-selected', false);
                tabContent.setAttribute('hidden', 'hidden');
            }
        });

        this.updateTabIndexes();
    }

    updateTabIndexes() {
        this.tabHeaders.forEach(tabHeader => {
            let tabIndex = -1;

            if (tabHeader.classList.contains('ds_current')) {
                tabIndex = 0;
            }

            if (breakpointCheck('medium')) {
                tabHeader.querySelector('.ds_tab__label').setAttribute('tabindex', tabIndex);
            }
        });
    }
}

export default Tabs;
