/* global document, window */
'use strict';

import elementIdModifier from '../../base/tools/id-modifier/id-modifier';

class Accordion {
    accordion: HTMLElement;
    items: HTMLElement[];
    openAllButton: HTMLButtonElement;

    constructor(accordion: HTMLElement) {
        this.accordion = accordion;
        this.items = [].slice.call(accordion.querySelectorAll('.ds_accordion-item'));
        this.openAllButton = accordion.querySelector('.js-open-all');
    }

    init() {
        if (!this.accordion.classList.contains('js-initialised')) {
            this.items.forEach((item) => this.initAccordionItem(item));
            if (this.openAllButton) {
                this.initOpenAll();
            }
            this.accordion.classList.add('js-initialised');
        }
    }

    initAccordionItem(item: HTMLElement) {
        // transform markup to button-driven version
        const itemBody: HTMLElement = item.querySelector('.ds_accordion-item__body');
        const itemControl: HTMLInputElement = item.querySelector('.ds_accordion-item__control');
        const itemHeader: HTMLElement = item.querySelector('.ds_accordion-item__header');
        const itemIndicator: HTMLElement = item.querySelector('.ds_accordion-item__indicator');
        const itemLabelContent: HTMLElement = item.querySelector('.ds_accordion-item__label span');
        const itemTitle: HTMLHeadingElement = itemHeader.querySelector('.ds_accordion-item__title');

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

    initOpenAll() {
        this.openAllButton.addEventListener('click', () => {
            function getAccordionItemForButton(button: HTMLButtonElement) {
                if (Element.prototype.closest) {
                    return button.closest('.ds_accordion-item') as HTMLElement;
                } else {
                    return button.parentElement.parentElement.parentElement;
                }
            }

            // if we're opening, open all unopened panels
            // if we're closing, close all opened panels
            const opening = !this.checkAllOpen();
            const allPanelButtons: HTMLButtonElement[] = [].slice.call(this.accordion.querySelectorAll('.js-accordion-button'));

            let panelsToToggle: HTMLElement[];
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

    toggleAccordionItem(item: HTMLElement) {
        const itemButton = item.querySelector('.js-accordion-button');
        const itemControl: HTMLInputElement = item.querySelector('.ds_accordion-item__control');
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

    setOpenAllButton(isOpen: boolean) {
        if (isOpen) {
            this.openAllButton.innerHTML = 'Close all <span class="visually-hidden">sections</span>';
        } else {
            this.openAllButton.innerHTML = 'Open all <span class="visually-hidden">sections</span>';
        }
        this.openAllButton.setAttribute('aria-expanded', isOpen.toString())
    }

    checkAllOpen() {
        const openItemsCount = this.accordion.querySelectorAll('.ds_accordion-item--open').length;

        return (this.items.length === openItemsCount);
    }
}

export default Accordion;
