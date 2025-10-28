/* global document, window */

'use strict';
type BTTOptions = {
    footerElSelector?: string
}

class BackToTop {
    backToTopElement: HTMLElement;
    footerEl: HTMLElement;
    window: Window;

    constructor(
        el: HTMLElement,
        _window = window,
        options: BTTOptions = {}
    ) {
        if (options.footerElSelector) {
            this.footerEl = document.querySelector(options.footerElSelector);
        } else {
            this.footerEl = document.querySelector('.ds_site-footer');
        }

        // a fake element used for height calculations
        if (!this.footerEl) {
            this.footerEl = document.createElement('div');
        }

        this.backToTopElement = el;
        this.window = _window;
    }

    init() {
        if (!this.backToTopElement) {
            return;
        }

        this.backToTopOffset = this.backToTopElement.querySelector('.ds_back-to-top__button').offsetHeight + 8;

        this.checkDisplay();

        this.window.addEventListener('resize', () => this.checkDisplay());

        const resizeObserver = new ResizeObserver(() => {
            this.checkDisplay();
        });

        resizeObserver.observe(document.body);
    }

    checkDisplay() {
        if (document.body.offsetHeight - this.footerEl.offsetHeight - this.backToTopOffset < this.window.innerHeight) {
            this.backToTopElement.classList.add('ds_back-to-top--clamped');
        } else {
            this.backToTopElement.classList.remove('ds_back-to-top--clamped');
        }

        if (document.body.offsetHeight - this.footerEl.offsetHeight <= this.window.innerHeight) {
            this.backToTopElement.classList.add('ds_back-to-top--hidden');
        } else {
            this.backToTopElement.classList.remove('ds_back-to-top--hidden');
        }

        this.checkPosition();
    }

    checkPosition() {
        const backToTopOffset = this.footerEl.offsetHeight + 8;

        const backToTopSpacingUnits = Math.ceil(backToTopOffset / 8);
        this.backToTopElement.classList.forEach(className => {
            if (className.match(/ds_!_off-b-/)) {
                this.backToTopElement.classList.remove(className);
            }
        });
        this.backToTopElement.classList.add(`ds_!_off-b-${backToTopSpacingUnits}`);
    }
}

export default BackToTop;
