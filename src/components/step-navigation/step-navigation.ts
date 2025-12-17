'use strict';

import DSComponent from "../../base/component/component";

/**
 * Step navigation component
 *
 * @class StepNavigation
 * @extends DSComponent
 * @property {HTMLElement} container - the step navigation container element
 * @property {Window} window - the window object
 */
class StepNavigation extends DSComponent {
    private container: HTMLElement;
    private window: Window;

    /**
     * Creates a step navigation component
     *
     * @param {HTMLElement} container - the step navigation container element
     * @param _window - the window object
     */
    constructor(container: HTMLElement, _window = window) {
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
    init(): void {
        const links = this.container.querySelectorAll('.ds_accordion-item__body a');

        links.forEach((link: HTMLAnchorElement) => {
            if (link.href === this.window.location.origin + this.window.location.pathname) {
                link.classList.add('ds_step-navigation__current-link');
            }
        });

        this.isInitialised = true;
    }
}

export default StepNavigation;
