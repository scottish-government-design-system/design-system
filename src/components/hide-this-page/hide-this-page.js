'use strict';

class HidePage {
    constructor(_window = window) {
        this.button = document.querySelector('.js-hide-page');
        this.window = _window;
    }

    init() {
        this.attachKeyboardEvents();
        this.attachMouseEvents();
    }

    attachKeyboardEvents() {
        document.addEventListener('keyup', (event) => {
            if (event.keyCode === 27) {
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
        this.window.open(this.button.href, '_newtab');
        this.window.location.replace('https://www.google.co.uk');
    }
}

export default HidePage;
