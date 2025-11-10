'use strict';

import DSComponent from '../../base/component/component';
import elementIdModifier from '../../base/tools/id-modifier/id-modifier';

class Details extends DSComponent {
    private content: HTMLElement;
    private details: HTMLDetailsElement;
    private summary: HTMLElement;
    private openAttribute: 'open' | 'data-open';

    constructor(element: HTMLDetailsElement) {
        super(element);
        this.details = element;
        this.summary = element.querySelector('.ds_details__summary');
        this.content = element.querySelector('.ds_details__text');

        if (this.summary.nodeName === 'SUMMARY') {
            this.openAttribute = 'open';
        } else {
            this.openAttribute = 'data-open';
        }
    }

    init() {
        if (typeof (this.details.open) !== 'boolean') {
            this.polyfillAttributes();
            this.polyfillEvents();
        }

        this.isInitialised = true;
    }

    private closeDetails() {
        this.details.removeAttribute(this.openAttribute);
        this.summary.setAttribute('aria-expanded', 'false');
    }

    private openDetails() {
        this.details.setAttribute(this.openAttribute, 'open');
        this.summary.setAttribute('aria-expanded', 'true');
    }

    private polyfillAttributes() {
        this.content.id = this.content.id || `details-${elementIdModifier()}`;
        this.details.setAttribute('role', 'group');
        this.summary.setAttribute('role', 'button');
        this.summary.setAttribute('aria-controls', this.content.id);

        if (this.summary.nodeName === 'SUMMARY') {
            this.summary.tabIndex = 0;
        }

        // initial state
        const isOpen = this.details.hasAttribute(this.openAttribute);
        this.summary.setAttribute('aria-expanded', isOpen.toString());
    }

    private polyfillEvents() {
        this.summary.addEventListener('click', () => { this.setState(); });
        this.summary.addEventListener('keypress', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.setState();
            }
        });

        this.summary.addEventListener('keyup', event => {
            if (event.key === ' ') {
                event.preventDefault();
            }
        });
    }

    private setState() {
        if (this.details.hasAttribute(this.openAttribute)) {
            this.closeDetails();

        } else {
            this.openDetails();
        }
    }
}

export default Details;
