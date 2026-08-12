'use strict';

import DSComponent from '../../base/component/component';
import elementIdModifier from '../../base/tools/id-modifier/id-modifier';

interface DSAccordionItemElement extends HTMLElement {
    open?: boolean
};

/**
 * Accordion component
 *
 * @class Accordion
 * @extends DSComponent
 * @property {HTMLElement} accordion - the accordion element
 * @property {HTMLElement[]} items - the accordion items
 * @property {HTMLButtonElement} openAllButton - the open all button
 */
class Accordion extends DSComponent {
    private accordion: HTMLElement;
    private items: HTMLElement[];
    private openAllButton: HTMLButtonElement;

    /**
     * Creates an accordion component
     *
     * @param {HTMLElement} accordion - the accordion element
     */
    constructor(accordion: HTMLElement) {
        super(accordion);

        this.accordion = accordion;
        this.items = [].slice.call(accordion.querySelectorAll('.ds_accordion-item'));
        this.openAllButton = accordion.querySelector('.js-open-all') as HTMLButtonElement;

        if (this.accordion.querySelector('div.ds_accordion-item')) {
            this.doFallback();
        }
    }

    /**
     * Initialize the accordion
     * - initialize each accordion item
     * - initialize the open all button if present
     *
     * @returns {void}
     */
    init(): void {
        if (!this.isInitialised) {
            this.items.forEach((item) => this.initAccordionItem(item));
            if (this.openAllButton) {
                this.initOpenAll();
            }
            this.isInitialised = true;
        }
    }

    /**
     * Fallback for old markup
     * - convert accordion panels to DETAILS elements
     * - redeclare this.items
     *
     * @returns {void}
     */
    private doFallback(): void {
        this.items.forEach(item => {
            const details = document.createElement('details');
            const summary = document.createElement('summary');

            const body = item.querySelector('.ds_accordion-item__body') || document.createElement('div');
            const title = item.querySelector('.ds_accordion-item__title') || document.createElement('div');
            const control = item.querySelector('.ds_accordion-item__control') as HTMLInputElement || document.createElement('input');

            summary.innerHTML = title.innerHTML + item.querySelector('.ds_accordion-item__indicator')?.outerHTML;

            details.classList.add('ds_accordion-item');
            summary.classList.add('ds_accordion-item__header');
            if (control.checked) details.setAttribute('open', '');

            details.appendChild(summary);
            details.appendChild(body);

            item.replaceWith(details);
        });

        this.items = [].slice.call(this.accordion.querySelectorAll('.ds_accordion-item'));
    }

    /**
     * Initialize an accordion item
     * - set IDs on accordion panels
     * - set initial state
     *
     * @param {HTMLElement} item - the accordion item to initialize
     * @returns {void}
     */
    private initAccordionItem(item: DSAccordionItemElement): void {
        const ID_MODIFIER = elementIdModifier();
        item.id = item.id || `accordion-item-${ID_MODIFIER}`;

        // check for hash to open an accordion with
        const startsOpen = item.hasAttribute('open');
        let accordionHasLocationHashInIt = false;

        if (window.location.hash) {
            try {
                if (item.querySelector(window.location.hash)) {
                    accordionHasLocationHashInIt = true;
                    item.setAttribute('open', '');
                }
            } catch {
                // hash is not a valid CSS selector or a selector for an item that is not found. ignore.
            }
        }

        if (startsOpen) {
            if (this.openAllButton) {
                this.setOpenAllButton(this.checkAllOpen());
            }
            if (accordionHasLocationHashInIt) {
                item.scrollIntoView();
            }
        }

        item.addEventListener('toggle', () => {
            if (this.openAllButton) {
                this.setOpenAllButton(this.checkAllOpen());
            }
        });
    }

    /**
     * Initialize the open all button
     * - set aria attributes
     * - attach event listener
     *
     * @returns {void}
     */
    private initOpenAll(): void {
        this.openAllButton.setAttribute('aria-controls', this.items.map(item => item.id).join(' '));
        this.openAllButton.setAttribute('aria-expanded', false.toString());

        this.openAllButton.addEventListener('click', () => {
            // if we're opening, open all unopened panels
            // if we're closing, close all opened panels
            const opening = !this.checkAllOpen();
            const allPanels: DSAccordionItemElement[] = [].slice.call(this.accordion.querySelectorAll('.ds_accordion-item'));

            allPanels.forEach(item => {
                if (opening) {
                    item.setAttribute('open', '');
                } else {
                    item.removeAttribute('open');
                }
            });

            this.setOpenAllButton(opening);
        });
    }

    /**
     * Set the open all button text and aria-expanded attribute
     *
     * @param {boolean} isOpen - true if all items are open, false otherwise
     * @returns {void}
     */
    private setOpenAllButton(isOpen: boolean): void {
        if (isOpen) {
            this.openAllButton.innerHTML = 'Close all <span class="visually-hidden">sections</span>';
        } else {
            this.openAllButton.innerHTML = 'Open all <span class="visually-hidden">sections</span>';
        }
        this.openAllButton.setAttribute('aria-expanded', isOpen.toString())
    }

    /**
     * Check if all accordion items are open
     *
     * @returns {boolean} - true if all items are open, false otherwise
     */
    private checkAllOpen(): boolean {
        const openItemsCount = this.accordion.querySelectorAll('.ds_accordion-item[open]').length;
        return (this.items.length === openItemsCount);
    }
}

export default Accordion;
