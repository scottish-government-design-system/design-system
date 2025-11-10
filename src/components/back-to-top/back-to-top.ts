'use strict';

import DSComponent from "../../base/component/component";

type BTTOptions = {
    footerElSelector?: string
}

class BackToTop extends DSComponent {
    private backToTopElement: HTMLElement;
    private footerEl: HTMLElement;
    private window: Window;

    constructor(
        element: HTMLElement,
        _window = window,
        options: BTTOptions = {}
    ) {
        super(element);

        if (options.footerElSelector) {
            this.footerEl = document.querySelector(options.footerElSelector);
        } else {
            this.footerEl = document.querySelector('.ds_site-footer');
        }
        this.backToTopElement = element;
        this.window = _window;
    }

    init() {
        if (!this.backToTopElement || !this.footerEl) {
            return;
        }

        this.checkDisplay();

        this.window.addEventListener('resize', () => this.checkDisplay());

        const resizeObserver = new ResizeObserver(() => {
            this.checkDisplay();
        });

        resizeObserver.observe(document.body);

        this.isInitialised = true;
    }

    private checkDisplay() {
        if (document.body.offsetHeight - this.footerEl.offsetHeight < this.window.innerHeight) {
            this.backToTopElement.classList.add('visually-hidden');
        } else {
            this.backToTopElement.classList.remove('visually-hidden');
        }

        this.checkPosition();
    }

    private checkPosition() {
        const backToTopOffset = this.footerEl.offsetHeight + 8 + 'px';
        document.documentElement.style.setProperty('--ds-back-to-top-offset', backToTopOffset);
    }
}

export default BackToTop;
