'use strict';

class StepNavigation {
    constructor(container, _window = window) {
        this.container = container;
        this.window = _window;
    }

    init() {
        const links = this.container.querySelectorAll('.ds_accordion-item__body a');

        links.forEach(link => {
            if (link.href === this.window.location.origin + this.window.location.pathname) {
                link.classList.add('ds_step-navigation__current-link');
            }
        });
    }
}

export default StepNavigation;
