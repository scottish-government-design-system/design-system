/* global document */

'use strict';

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
    }

    initTab(tabHeader) {
        const tabLabel = tabHeader.querySelector('.ds_tab__label');
        const tabContent = tabHeader.nextElementSibling;
        const tabInput = tabHeader.previousElementSibling;

        const tabID = tabLabel.getAttribute('for') + '-content';

        const button = document.createElement('button');
        button.setAttribute('class', tabLabel.getAttribute('class'));
        button.setAttribute('role', tabLabel.getAttribute('role'));
        button.innerHTML = tabLabel.innerHTML;

        button.dataset.for = tabID;
        tabContent.id = tabID;

        if (tabInput.checked) {
            tabHeader.classList.add('ds_current');
            button.setAttribute('aria-selected', true);
            tabContent.removeAttribute('hidden');
            button.setAttribute('tabindex', 0);
        } else {
            button.setAttribute('aria-selected', false);
            tabContent.setAttribute('hidden', 'hidden');
            button.setAttribute('tabindex', -1);
        }

        tabHeader.appendChild(button);
        tabHeader.removeChild(tabLabel);
        tabHeader.parentNode.removeChild(tabInput);

        button.addEventListener('click', () => {
            this.activateTab(tabHeader);
        });

        button.addEventListener('keyup', (event) => {
            if (event.keyCode === this.keycodes.right) {
                this.focusNextTab(event);
            } else if (event.keyCode === this.keycodes.left) {
                this.focusPreviousTab(event);
            } else if (event.keyCode === this.keycodes.up) {
                this.focusPreviousTab(event);
            } else if (event.keyCode === this.keycodes.down) {
                this.focusNextTab(event);
            }
        });
    }

    focusNextTab(event) {
        event.preventDefault();
        event.stopPropagation();
        let active = 0;
        this.tabHeaders.forEach(function (tabHeader, index) {
            if (document.activeElement === tabHeader.querySelector('button')) {
                active = index;
            }
        });
        this.tabHeaders[(active + 1) % this.tabHeaders.length].querySelector('button').focus();
    }

    focusPreviousTab(event) {
        event.preventDefault();
        event.stopPropagation();
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
                tabHeader.querySelector('.ds_tab__label').setAttribute('tabindex', 0);
                tabContent.removeAttribute('hidden');
            } else {
                tabHeader.classList.remove('ds_current');
                tabHeader.querySelector('.ds_tab__label').setAttribute('aria-selected', false);
                tabHeader.querySelector('.ds_tab__label').setAttribute('tabindex', -1);
                tabContent.setAttribute('hidden', 'hidden');
            }
        });
    }
}

export default Tabs;
