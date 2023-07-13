/* global document, window */
import elementIdModifier from '../../base/tools/id-modifier/id-modifier';

'use strict';

class Details {
    constructor(element) {
        this.details = element;
        this.summary = element.querySelector('.ds_details__summary');
        this.content = element.querySelector('.ds_details__text');

        this.keycodes = {
            'enter': 13,
            'space': 32
        };
    }

    init() {
        if (typeof (this.details.open === 'boolean')) {
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
        this.content.id = this.content.id || `details-${elementIdModifier()}`;
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
            if (event.keyCode === this.keycodes.enter || event.keyCode === this.keycodes.space) {
                event.preventDefault();
                this.setState();
            }
        });

        this.summary.addEventListener('kayup', event => {
            if (event.keyCode === this.keycodes.space) {
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
