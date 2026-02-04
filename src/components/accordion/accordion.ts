'use strict';

import DSComponent from '../../base/component/component';
import elementIdModifier from '../../base/tools/id-modifier/id-modifier';

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
     * Initialize an accordion item
     * - transform markup to button-driven version
     * - attach event listener
     * - set aria attributes
     *
     * @param {HTMLElement} item - the accordion item to initialize
     * @returns {void}
     */
    private initAccordionItem(item: HTMLElement): void {
        // transform markup to button-driven version
        const itemBody = item.querySelector('.ds_accordion-item__body') as HTMLElement;
        const itemControl = item.querySelector('.ds_accordion-item__control') as HTMLInputElement;
        const itemHeader = item.querySelector('.ds_accordion-item__header') as HTMLElement;
        const itemIndicator = item.querySelector('.ds_accordion-item__indicator') as HTMLElement;
        const itemLabelContent = item.querySelector('.ds_accordion-item__label span') as HTMLElement;
        const itemTitle = itemHeader.querySelector('.ds_accordion-item__title') as HTMLHeadingElement;

        // check for hash to open an accordion with
        let accordionHasLocationHashInIt = false;

        if (window.location.hash) {
            try {
                if (item.querySelector(window.location.hash)) {
                    accordionHasLocationHashInIt = true;
                    itemControl.checked = true;
                }
            } catch {
                // hash is not a valid CSS selector or a selector for an item that is not found. ignore.
            }
        }

        const startsOpen = itemControl.checked;

        const itemButton = document.createElement('button');

        itemTitle.classList.add('ds_accordion-item__title--button');
        itemButton.classList.add('ds_accordion-item__button');
        itemButton.classList.add('js-accordion-button');
        itemButton.id = itemTitle.id + '-button';
        itemButton.type = 'button';

        // we keep the control present but make it unavailable in the tab order or to screen readers
        // browsers will generally remember the state of the checkbox on back/forward navigation
        itemControl.classList.remove('visually-hidden');
        itemControl.classList.add('fully-hidden');
        itemControl.setAttribute('tabindex', (-1).toString());

        itemButton.innerHTML = itemTitle.innerHTML;

        itemIndicator.setAttribute('aria-hidden', true.toString());

        itemTitle.innerHTML = '';
        itemTitle.insertBefore(itemButton, itemTitle.firstChild);
        itemButton.appendChild(itemIndicator);
        itemLabelContent.classList.add('fully-hidden');

        item.id = item.id || `accordion-item-${elementIdModifier()}`;
        itemBody.id = itemBody.id || `accordion-item-${elementIdModifier()}-body`;

        if (startsOpen) {
            item.classList.add('ds_accordion-item--open');
            if (this.openAllButton) {
                this.setOpenAllButton(this.checkAllOpen());
            }
            if (accordionHasLocationHashInIt) {
                item.scrollIntoView();
            }
        }

        itemButton.setAttribute('aria-expanded', startsOpen.toString());
        itemButton.setAttribute('aria-controls', itemBody.id);

        // events
        itemButton.addEventListener('click', event => {
            event.preventDefault();
            this.toggleAccordionItem(item);
        });
    }

    /**
     * Initialize the open all button
     * - attach event listener
     * - set aria attributes
     *
     * @returns {void}
     */
    private initOpenAll(): void {
        this.openAllButton.addEventListener('click', () => {
            function getAccordionItemForButton(button: HTMLButtonElement) {
                return button.closest('.ds_accordion-item') as HTMLElement;
            }

            // if we're opening, open all unopened panels
            // if we're closing, close all opened panels
            const opening = !this.checkAllOpen();
            const allPanelButtons: HTMLButtonElement[] = [].slice.call(this.accordion.querySelectorAll('.js-accordion-button'));

            let panelsToToggle: HTMLButtonElement[];
            if (opening) {
                panelsToToggle = allPanelButtons.filter(button => !getAccordionItemForButton(button).classList.contains('ds_accordion-item--open'));
            } else {
                panelsToToggle = allPanelButtons.filter(button => getAccordionItemForButton(button).classList.contains('ds_accordion-item--open'));
            }

            panelsToToggle.forEach((button: HTMLButtonElement) => {
                this.toggleAccordionItem(getAccordionItemForButton(button));
            });

            this.setOpenAllButton(opening);
        });

        this.openAllButton.setAttribute('aria-controls', this.items.map(item => item.id).join(' '));
        this.openAllButton.setAttribute('aria-expanded', false.toString());
    }

    /**
     * Toggle an accordion item
     * - set aria attribute
     * - set 'open' attribute
     *
     * @param {HTMLElement} item - the accordion item to toggle
     * @returns {void}
     */
    private toggleAccordionItem(item: HTMLElement): void {
        const itemButton = item.querySelector('.js-accordion-button') as HTMLButtonElement;
        const itemControl = item.querySelector('.ds_accordion-item__control') as HTMLInputElement;
        const isOpen = item.classList.contains('ds_accordion-item--open');

        if (!isOpen) {
            item.classList.add('ds_accordion-item--open');
        } else {
            item.classList.remove('ds_accordion-item--open');
        }

        itemButton.setAttribute('aria-expanded', (!isOpen).toString());
        itemControl.checked = !isOpen;

        if (this.openAllButton) {
            this.setOpenAllButton(this.checkAllOpen());
        }
    }

    /**
     * Set the open all button text and aria-expanded attribute
     *
     * @param {boolean} isOpen - true if all items are open, false otherwise
     */
    private setOpenAllButton(isOpen: boolean) {
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
        const openItemsCount = this.accordion.querySelectorAll('.ds_accordion-item--open').length;

        return (this.items.length === openItemsCount);
    }
}

export default Accordion;
