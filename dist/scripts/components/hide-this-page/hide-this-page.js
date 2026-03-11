'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = __importDefault(require("../../base/component/component"));
/**
 * Hide this page component
 *
 * @class HidePage
 * @extends DSComponent
 * @property {string} altlink - the alternative link to navigate to
 * @property {HTMLAnchorElement} button - the hide page button element
 * @property {Window} window - the window object
 */
class HidePage extends component_1.default {
    altlink;
    button;
    window;
    /**
     * Creates a hide page component
     *
     * @param {HTMLElement} element - the hide page element
     * @param {Window} _window - the window object
     */
    constructor(element, _window = window) {
        const button = element.querySelector('.js-hide-page');
        super(button);
        this.button = button;
        this.window = _window;
        this.altlink = this.button?.dataset.altlink || 'https://www.google.com';
    }
    /**
     * Attach event listeners to the hide page button
     *
     * @returns {void}
     */
    init() {
        if (!this.button) {
            return;
        }
        this.attachKeyboardEvents();
        this.attachMouseEvents();
        this.isInitialised = true;
    }
    /**
     * Add keyboard events
     * - hide page on 'esc'
     *
     * @returns {void}
     */
    attachKeyboardEvents() {
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
    attachMouseEvents() {
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
    doHidePage(event) {
        event.preventDefault();
        document.body.innerHTML = '';
        document.title = '.';
        this.window.open(this.button.href, '_newtab');
        this.window.location.replace(this.altlink);
    }
}
exports.default = HidePage;
