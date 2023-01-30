/* global document, window */

'use strict';

class Details {
    private content:HTMLElement;
    private details:HTMLDetailsElement;
    private summary:HTMLElement;

    private static keycodes = {
        'enter': 13,
        'space': 32
    }

    constructor(element) {
        this.details = element;
        this.summary = element.querySelector('.ds_details__summary');
        this.content = element.querySelector('.ds_details__text');
    }

    init() {
        if (typeof this.details.open === 'boolean') {
           return;
        } else {
            this.polyfillAttributes();
            this.polyfillEvents();
        }
    }

    closeDetails() {
        this.details.removeAttribute('open');
        this.summary.setAttribute('aria-expanded', 'false');
        this.content.style.display = 'none';
    }

    openDetails() {
        this.details.setAttribute('open', 'open');
        this.summary.setAttribute('aria-expanded', 'true');
        this.content.style.display = '';
    }

    polyfillAttributes() {
        this.content.id = this.content.id || `details-${Math.floor(Math.random() * 1000000)}`;
        this.details.setAttribute('role', 'group');
        this.summary.setAttribute('role', 'button');
        this.summary.setAttribute('aria-controls', this.content.id);
        this.summary.tabIndex = 0;

        // initial state
        const isOpen = this.details.hasAttribute('open');
        this.summary.setAttribute('aria-expanded', isOpen.toString());
        if (!isOpen) {
            this.content.style.display = 'none';
        }
    }

    polyfillEvents() {
        this.summary.addEventListener('click', () => { this.setState(); });
        this.summary.addEventListener('keypress', event => {
            if (event.keyCode === Details.keycodes.enter || event.keyCode === Details.keycodes.space) {
                event.preventDefault();
                this.setState();
            }
        });

        this.summary.addEventListener('keyup', event => {
            if (event.keyCode === Details.keycodes.space) {
                event.preventDefault();
            }
        });
    }

    setState() {
        if (this.details.hasAttribute('open')) {
            this.closeDetails();
        } else {
            this.openDetails();
        }
    }
}

export default Details;
