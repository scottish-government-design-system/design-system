'use strict';

import DSComponent from '../../base/component/component';

/**
 * Details component
 *
 * @class Details
 * @extends DSComponent
 * @property {HTMLDetailsElement} details - the details element
 */
class Details extends DSComponent {
    private details: HTMLDetailsElement;

    /**
     * Creates a details component
     * Converts legacy non-details markup to native DETAILS elements
     *
     * @param {HTMLDetailsElement} element - the details element
     */
    constructor(element: HTMLDetailsElement) {
        super(element);
        this.details = element;

        if (this.details.nodeName !== 'DETAILS') {
            this.doFallback();
        }
    }

    /**
     * @returns {void}
     */
    init(): void {
        this.isInitialised = true;
    }

    /**
     * Fallback for old markup
     * - convert non-details markup to native DETAILS elements
     *
     * @returns {void}
     */
    private doFallback(): void {
        const children = this.details.children;
        const summary = this.details.querySelector('.ds_details__summary') as HTMLElement;
        const newDetails = document.createElement('details');
        const newSummary = document.createElement('summary');

        function cloneAttributes(fromElement: HTMLElement, toElement: HTMLElement): void {
            Array.from(fromElement.attributes).forEach(attribute => {
                toElement.setAttribute(attribute.name, attribute.value);
            });
        }

        cloneAttributes(this.details, newDetails);
        cloneAttributes(summary, newSummary);
        newSummary.removeAttribute('for');

        for (const child of children) {
            if (child.classList.contains('ds_details__toggle')) {
                // do nothing -- we don't want to recreate this element
            } else if (child.classList.contains('ds_details__summary')) {
                newSummary.innerHTML = child.innerHTML;
                newDetails.appendChild(newSummary);
            } else {
                newDetails.appendChild(child.cloneNode(true));
            }
        }

        Array.from(this.details.attributes).forEach(attribute => {
            newDetails.setAttribute(attribute.name, attribute.value);
        });

        this.details.replaceWith(newDetails);
        this.details = newDetails
    }
}

export default Details;
