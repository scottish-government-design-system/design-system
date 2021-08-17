/* global document, window */

'use strict';

class HidePage {
    constructor(_window = window) {
        this.button = document.querySelector('.js-hide-page');
        this.window = _window;
    }

    init() {
        if (!this.button) {
            return;
        }
        this.attachKeyboardEvents();
        this.attachMouseEvents();

        this.altlink = this.button.dataset.altlink || 'https://www.google.co.uk';
    }

    attachKeyboardEvents() {
        document.addEventListener('keyup', (event) => {
            if (event.key === 'Escape' || event.keyCode === 27) {
                this.doHidePage(event);
            }
        });
    }

    attachMouseEvents() {
        this.button.addEventListener('click', (event) => {
            this.doHidePage(event);
        });
    }

    // clear page body
    // replace history item
    // navigate
    doHidePage(event) {
        event.preventDefault();
        document.body.innerHTML = '';
        document.title = '.';
        this.window.open(this.button.href, '_newtab');
        this.window.location.replace(this.altlink);
    }
}

export default HidePage;
