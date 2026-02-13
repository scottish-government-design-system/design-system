'use strict';

import DSComponent from '../../base/component/component';
import elementIdModifier from '../../base/tools/id-modifier/id-modifier';

/**
 * Details component
 *
 * @class Details
 * @extends DSComponent
 * @property {HTMLElement} content - the details content element
 * @property {HTMLDetailsElement} details - the details element
 * @property {HTMLElement} summary - the details summary element
 * @property {'open' | 'data-open'} openAttribute - the attribute used to indicate open state
 */
class Details extends DSComponent {
    private content: HTMLElement;
    private details: HTMLDetailsElement;
    private summary: HTMLElement;
    private openAttribute: 'open' | 'data-open';

    /**
     * Creates a details component
     *
     * @param {HTMLDetailsElement} element - the details element
     */
    constructor(element: HTMLDetailsElement) {
        super(element);
        this.details = element;
        this.summary = element.querySelector('.ds_details__summary') as HTMLElement;
        this.content = element.querySelector('.ds_details__text') as HTMLElement;

        if (this.summary.nodeName === 'SUMMARY') {
            this.openAttribute = 'open';
        } else {
            this.openAttribute = 'data-open';
        }
    }

    /**
     * Adds details-like open/close behaviour to non-native details components
     *
     * @returns {void}
     */
    init(): void {
        if (typeof (this.details.open) !== 'boolean') {
            this.polyfillAttributes();
            this.polyfillEvents();
        }

        this.isInitialised = true;
    }

    /**
     * Close the disclosure widget
     * - set aria attribute
     * - clear 'open' attribute
     *
     * @returns {void}
     */
    private closeDetails(): void {
        this.details.removeAttribute(this.openAttribute);
        this.summary.setAttribute('aria-expanded', 'false');
    }

    /**
     * Open the disclosure widget
     * - set aria attribute
     * - set 'open' attribute
     *
     * @returns {void}
     */
    private openDetails(): void {
        this.details.setAttribute(this.openAttribute, 'open');
        this.summary.setAttribute('aria-expanded', 'true');
    }

    /**
     * Add role and attributes to a non-native disclosure widget
     *
     * @returns {void}
     */
    private polyfillAttributes(): void {
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

    /**
     * Add mouse and keyboard events to trigger open/close of a non-native disclosure widget
     *
     * @returns {void}
     */
    private polyfillEvents(): void {
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

    /**
     * Open or close the disclosure widget based on the value of its 'open' attribute
     *
     * @returns {void}
     */
    private setState(): void {
        if (this.details.hasAttribute(this.openAttribute)) {
            this.closeDetails();
        } else {
            this.openDetails();
        }
    }
}

export default Details;
