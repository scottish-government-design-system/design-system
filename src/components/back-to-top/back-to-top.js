/* global document, window */

'use strict';

class BackToTop {
    constructor(el, _window = window, options = {}) {
        if (options.footerElSelector) {
            this.footerEl = document.querySelector(options.footerElSelector);
        } else {
            this.footerEl = document.querySelector('.ds_site-footer');
        }
        this.backToTopElement = el;
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
    }

    checkDisplay() {
        if (document.body.offsetHeight - this.footerEl.offsetHeight < this.window.innerHeight) {
            this.backToTopElement.classList.add('visually-hidden');
        } else {
            this.backToTopElement.classList.remove('visually-hidden');
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
