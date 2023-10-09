/* global document, window */
import elementIdModifier from '../../base/tools/id-modifier/id-modifier';

'use strict';

class Accordion {
    constructor(accordion) {
        this.accordion = accordion;
        this.items = [].slice.call(accordion.querySelectorAll('.ds_accordion-item'));
        this.openAllButton = accordion.querySelector('.js-open-all');
    }

    init() {
        if (!this.accordion.classList.contains('js-initialised')) {
            this.items.forEach((item, index) => this.initAccordionItem(item, index));
            if (this.openAllButton) {
                this.initOpenAll();
            }
            this.accordion.classList.add('js-initialised');
        }
    }

    initAccordionItem(item,) {
        // transform markup to button-driven version
        const itemBody = item.querySelector('.ds_accordion-item__body');
        const itemControl = item.querySelector('.ds_accordion-item__control');
        const itemHeader = item.querySelector('.ds_accordion-item__header');
        const itemIndicator = item.querySelector('.ds_accordion-item__indicator');
        const itemLabelContent = item.querySelector('.ds_accordion-item__label span');
        const itemTitle = itemHeader.querySelector('.ds_accordion-item__title');

        // check for hash to open an accordion with
        let accordionHasLocationHashInIt = false;
        if (window.location.hash) {
            try {
                item.querySelector(window.location.hash);
                accordionHasLocationHashInIt = true;
                itemControl.checked = true;
            } catch {
                // hash is not a valid selector
            }
        }

        const startsOpen = itemControl.checked;

        const itemButton = document.createElement('button');

        itemTitle.classList.add('ds_accordion-item__title--button');
        itemButton.classList.add('ds_accordion-item__button');
        itemButton.classList.add('js-accordion-button');
        itemButton.id = itemTitle.id;
        itemButton.type = 'button';

        // we keep the control present but make it unavailable in the tab order or to screen readers
        itemControl.classList.remove('visually-hidden');
        itemControl.classList.add('fully-hidden');

        itemButton.innerHTML = itemTitle.innerHTML;

        itemTitle.innerHTML = '';
        itemTitle.prepend(itemButton);
        itemButton.append(itemIndicator);
        itemLabelContent.classList.add('fully-hidden');

        itemBody.id = itemBody.id || `accordion-item-${elementIdModifier()}`;
        itemButton.setAttribute('aria-controls', itemBody.id);

        if (startsOpen) {
            item.classList.add('ds_accordion-item--open');
            itemBody.style.maxHeight = itemBody.scrollHeight + 21 + 28 + 'px';
            if (this.openAllButton) {
                this.setOpenAllButton(this.checkAllOpen());
            }
            if (accordionHasLocationHashInIt) {
                item.scrollIntoView();
            }
        }

        itemButton.setAttribute('aria-expanded', startsOpen);
        itemButton.setAttribute('aria-controls', itemBody.id);

        // events
        itemButton.addEventListener('click', event => {
            event.preventDefault();
            this.toggleAccordionItem(item);
        });
    }

    initOpenAll() {
        this.openAllButton.addEventListener('click', () => {
            function getAccordionItemForButton(button) {
                return button.closest('.ds_accordion-item');
            }

            // if we're opening, open all unopened panels
            // if we're closing, close all opened panels
            const opening = !this.checkAllOpen();
            const allPanelButtons = [].slice.call(this.accordion.querySelectorAll('.js-accordion-button'));

            let panelsToToggle;
            if (opening) {
                panelsToToggle = allPanelButtons.filter(button => !getAccordionItemForButton(button).classList.contains('ds_accordion-item--open'));
            } else {
                panelsToToggle = allPanelButtons.filter(button => getAccordionItemForButton(button).classList.contains('ds_accordion-item--open'));
            }

            panelsToToggle.forEach(button => {
                this.toggleAccordionItem(getAccordionItemForButton(button));
            });

            this.setOpenAllButton(opening);
        });
    }

    toggleAccordionItem(item) {
        const itemButton = item.querySelector('.js-accordion-button');
        const itemControl = item.querySelector('.ds_accordion-item__control');
        const itemBody = item.querySelector('.ds_accordion-item__body');
        const isOpen = item.classList.contains('ds_accordion-item--open');

        if (!isOpen) {
            item.classList.add('ds_accordion-item--open');
            itemBody.style.display = 'block';
            // 24px and 32px are the top and bottom padding of the body content
            itemBody.style.maxHeight = itemBody.scrollHeight + 24 + 32 + 'px';

            window.setTimeout(function () {
                itemBody.style.removeProperty('max-height');
            }, 200);
        } else {
            itemBody.style.maxHeight = 0;
            item.classList.remove('ds_accordion-item--open');

            window.setTimeout(function () {
                itemBody.style.removeProperty('display');
            }, 200);
        }

        itemButton.setAttribute('aria-expanded', !isOpen);
        itemControl.checked = !isOpen;

        if (this.openAllButton) {
            this.setOpenAllButton(this.checkAllOpen());
        }
    }

    setOpenAllButton(open) {
        if (open) {
            this.openAllButton.innerHTML = 'Close all <span class="visually-hidden">sections</span>';
        } else {
            this.openAllButton.innerHTML = 'Open all <span class="visually-hidden">sections</span>';
        }
    }

    checkAllOpen() {
        const openItemsCount = this.accordion.querySelectorAll('.ds_accordion-item--open').length;

        return (this.items.length === openItemsCount);
    }
}

export default Accordion;
