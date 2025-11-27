'use strict';

import DSComponent from "../../base/component/component";

class HidePage extends DSComponent {
    private altlink: string;
    private button: HTMLAnchorElement;
    private window: Window;

    constructor(element: HTMLElement, _window = window) {
        const button = element.querySelector('.js-hide-page') as HTMLAnchorElement;
        super(button);
        this.button = button;
        this.window = _window;
    }

    init() {
        if (!this.button) {
            return;
        }
        this.attachKeyboardEvents();
        this.attachMouseEvents();

        this.altlink = this.button.dataset.altlink || 'https://www.google.com';

        this.isInitialised = true;
    }

    private attachKeyboardEvents() {
        document.addEventListener('keyup', (event) => {
            if (event.key === 'Escape') {
                this.doHidePage(event);
            }
        });
    }

    private attachMouseEvents() {
        this.button.addEventListener('click', (event) => {
            this.doHidePage(event);
        });
    }

    // clear page body
    // replace history item
    // navigate
    doHidePage(event: Event) {
        event.preventDefault();
        document.body.innerHTML = '';
        document.title = '.';
        this.window.open(this.button.href, '_newtab');
        this.window.location.replace(this.altlink);
    }
}

export default HidePage;
