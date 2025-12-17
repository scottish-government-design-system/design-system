'use strict';

import DSComponent from "../../base/component/component";

/**
 * Hide this page component
 *
 * @class HidePage
 * @extends DSComponent
 * @property {string} altlink - the alternative link to navigate to
 * @property {HTMLAnchorElement} button - the hide page button element
 * @property {Window} window - the window object
 */
class HidePage extends DSComponent {
    private altlink: string;
    private button: HTMLAnchorElement;
    private window: Window;

    /**
     * Creates a hide page component
     *
     * @param {HTMLElement} element - the hide page element
     * @param _window - the window object
     */
    constructor(element: HTMLElement, _window = window) {
        const button = element.querySelector('.js-hide-page') as HTMLAnchorElement;
        super(button);
        this.button = button;
        this.window = _window;
    }

    /**
     * Attach event listeners to the hide page button
     *
     * @returns {void}
     */
    init(): void {
        if (!this.button) {
            return;
        }
        this.attachKeyboardEvents();
        this.attachMouseEvents();

        this.altlink = this.button.dataset.altlink || 'https://www.google.com';

        this.isInitialised = true;
    }

    /**
     * Add keyboard events
     * - hide page on 'esc'
     *
     * @returns {void}
     */
    private attachKeyboardEvents(): void {
        document.addEventListener('keyup', (event) => {
            if (event.key === 'Escape') {
                this.doHidePage(event);
            }
        });
    }

    /**
     * Add mouse events
     * - hide page on click
     *
     * @returns {void}
     */
    private attachMouseEvents(): void {
        this.button.addEventListener('click', (event) => {
            this.doHidePage(event);
        });
    }

    /**
     * Hide the current page and navigate to an alternative link
     * - clear page body
     * - navigate to alt link in current tab
     * - open primary link in new tab
     *
     * @param {Event} event
     * @returns {void}
     */
    doHidePage(event: Event): void {
        event.preventDefault();
        document.body.innerHTML = '';
        document.title = '.';
        this.window.open(this.button.href, '_newtab');
        this.window.location.replace(this.altlink);
    }
}

export default HidePage;
