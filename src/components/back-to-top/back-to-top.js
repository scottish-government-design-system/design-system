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

        this.window.addEventListener('scroll', () => this.checkPosition());
    }

    checkDisplay() {
        if (document.body.offsetHeight > this.window.innerHeight) {
            this.backToTopElement.classList.remove('visually-hidden');
        } else {
            this.backToTopElement.classList.add('visually-hidden');
        }
    }

    checkPosition() {
        this.backToTopElement.style.bottom = this.footerEl.offsetHeight + 8 + 'px';
    }
}

export default BackToTop;
