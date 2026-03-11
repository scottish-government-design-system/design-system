'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = __importDefault(require("../../base/component/component"));
/**
 * Step navigation component
 *
 * @class StepNavigation
 * @extends DSComponent
 * @property {HTMLElement} container - the step navigation container element
 * @property {Window} window - the window object
 */
class StepNavigation extends component_1.default {
    container;
    window;
    /**
     * Creates a step navigation component
     *
     * @param {HTMLElement} container - the step navigation container element
     * @param _window - the window object
     */
    constructor(container, _window = window) {
        super(container);
        this.container = container;
        this.window = _window;
    }
    /**
     * Initialise step navigation
     * - adds current link class to link matching current URL
     *
     * @returns {void}
     */
    init() {
        const links = this.container.querySelectorAll('.ds_accordion-item__body a');
        links.forEach((link) => {
            if (link.href === this.window.location.origin + this.window.location.pathname) {
                link.classList.add('ds_step-navigation__current-link');
            }
        });
        this.isInitialised = true;
    }
}
exports.default = StepNavigation;
