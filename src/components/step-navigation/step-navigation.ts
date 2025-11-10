'use strict';

import DSComponent from "../../base/component/component";

class StepNavigation extends DSComponent {
    private container: HTMLElement;
    private window: Window;

    constructor(container: HTMLElement, _window = window) {
        super(container);
        this.container = container;
        this.window = _window;
    }

    init() {
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
