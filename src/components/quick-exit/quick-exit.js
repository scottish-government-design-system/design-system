'use strict';

class QuickExit {
    constructor(_window) {
        this.url = document.querySelector('.js-quick-exit').href;

        this.window = _window;
    }

    init() {
        this.attachKeyboardEvents();
        this.attachMouseEvents();
    }

    attachKeyboardEvents() {
        document.addEventListener('keyup', (event) => {
            if (event.keyCode === 27) {
                this.doQuickExit(event);
            }
        });
    }

    attachMouseEvents() {
        [].slice.call(document.querySelectorAll('.js-quick-exit')).forEach(quickExitButton => quickExitButton.addEventListener('click', (event) => {
            this.doQuickExit(event);
        }));
    }

    // clear page body
    // replace history item
    // navigate
    doQuickExit(event) {
        event.preventDefault();
        document.body.innerHTML = '';
        this.window.history.replaceState({},'','/');
        this.window.location.replace(this.url);
    }
}

export default QuickExit;
