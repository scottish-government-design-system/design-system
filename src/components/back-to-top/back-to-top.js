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
        if (!this.backToTopElement) {
            return;
        }
        this.checkDisplay();

        this.window.addEventListener('resize', () => this.checkDisplay());
    }

    checkDisplay() {
        if (document.body.offsetHeight > this.window.innerHeight) {
            this.backToTopElement.classList.remove('visually-hidden');
        } else {
            this.backToTopElement.classList.add('visually-hidden');
        }

        this.checkPosition();
    }

    checkPosition() {
        const backToTopOffset = this.footerEl.offsetHeight + 8 + 'px';
        document.documentElement.style.setProperty('--back-to-top-offset', backToTopOffset);
    }
}

export default BackToTop;
