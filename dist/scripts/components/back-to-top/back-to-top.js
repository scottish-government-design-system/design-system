'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = __importDefault(require("../../base/component/component"));
/**
 * Back to top component
 *
 * @class BackToTop
 * @extends DSComponent
 * @property {HTMLElement} backToTopElement - the back to top element
 * @property {HTMLElement} footerEl - the footer element
 * @property {Window} window - the window object
 */
class BackToTop extends component_1.default {
    backToTopElement;
    backToTopOffset;
    footerEl;
    window;
    /**
     * Creates a back to top component
     *
     * @param {HTMLElement} element - the back to top element
     * @param {Window} _window - the window object
     * @param {BTTOptionsArgs} options - the back to top options
     */
    constructor(element, _window = window, options = {}) {
        super(element);
        // a fake element used for height calculations
        const fallbackFooterEl = document.createElement('div');
        if (options.footerElSelector) {
            this.footerEl = document.querySelector(options.footerElSelector);
        }
        else {
            this.footerEl = document.querySelector('.ds_site-footer') || fallbackFooterEl;
        }
        this.backToTopElement = element;
        this.window = _window;
    }
    /**
     * Initialise the back to top component
     * - check whether to show or hide the back to top button
     * - adjust the position of the back to top button based on the footer height
     *
     * @returns {void}
     */
    init() {
        if (!this.backToTopElement) {
            return;
        }
        const backToTopButton = this.backToTopElement.querySelector('.ds_back-to-top__button');
        if (backToTopButton) {
            this.backToTopOffset = backToTopButton.offsetHeight + 8;
        }
        this.checkDisplay();
        this.window.addEventListener('resize', () => this.checkDisplay());
        const resizeObserver = new ResizeObserver(() => {
            this.checkDisplay();
        });
        resizeObserver.observe(document.body);
        this.isInitialised = true;
    }
    /**
     * Check whether to show or hide the back to top button based on the height of the page content
     *
     * @returns {void}
     */
    checkDisplay() {
        if (document.body.offsetHeight - this.footerEl.offsetHeight - this.backToTopOffset < this.window.innerHeight) {
            this.backToTopElement.classList.add('visually-hidden');
        }
        else {
            this.backToTopElement.classList.remove('ds_back-to-top--clamped');
        }
        if (document.body.offsetHeight - this.footerEl.offsetHeight <= this.window.innerHeight) {
            this.backToTopElement.classList.add('ds_back-to-top--hidden');
        }
        else {
            this.backToTopElement.classList.remove('ds_back-to-top--hidden');
        }
        this.checkPosition();
    }
    /**
     * Adjust the position of the back to top button based on the footer height
     *
     * @returns {void}
     */
    checkPosition() {
        const footerOffset = this.footerEl.offsetHeight + 8;
        const backToTopSpacingUnits = Math.ceil(footerOffset / 8);
        this.backToTopElement.classList.forEach(className => {
            if (className.match(/ds_!_off-b-/)) {
                this.backToTopElement.classList.remove(className);
            }
        });
        this.backToTopElement.classList.add(`ds_!_off-b-${backToTopSpacingUnits}`);
    }
}
exports.default = BackToTop;
