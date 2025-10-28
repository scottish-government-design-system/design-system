'use strict';

class StepNavigation {
    container: HTMLElement;
    window: Window;

    constructor(container: HTMLElement, _window = window) {
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
    }
}

export default StepNavigation;
