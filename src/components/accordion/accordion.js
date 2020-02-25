'use strict';

class Accordion {
    constructor(accordion) {
        this.accordion = accordion;
        this.items = [].slice.call(accordion.querySelectorAll('.ds_accordion-item'));
        this.openAllButton = accordion.querySelector('.js-open-all');
    }

    init() {
        this.items.forEach(item => this.initAccordionItem(item));

        this.initOpenAll();
        this.accordion.classList.add('js-initialised');
    }

    initAccordionItem(item) {
        // transform markup to button-driven version
        const itemControl = item.querySelector('.ds_accordion-item__control');
        const itemHeader = item.querySelector('.ds_accordion-item__header');
        const itemTitle = itemHeader.querySelector('.ds_accordion-item__title');
        const itemBody = item.querySelector('.ds_accordion-item__body');
        const idString = parseInt(Math.random() * 1000000, 10);

        const startsOpen = itemControl.checked;

        const itemButton = document.createElement('button');
        const itemIndicator = document.createElement('span');

        itemButton.classList.add('ds_accordion-item__header-button', 'js-accordion-button');
        itemIndicator.classList.add('ds_accordion-item__indicator');

        // we keep the control present but make it unavailable in the tab order or to screen readers
        itemControl.classList.remove('visually-hidden');
        itemControl.classList.add('fully-hidden');

        itemButton.innerHTML = itemTitle.innerHTML;
        itemButton.appendChild(itemIndicator);

        itemHeader.parentNode.removeChild(itemHeader);

        item.insertBefore(itemButton, itemBody);

        itemBody.id = itemBody.id || `accordion-item-${idString}`;
        itemButton.setAttribute('aria-controls', itemBody.id);

        if (startsOpen) {
            item.classList.add('ds_accordion-item--open');
            itemBody.style.maxHeight = itemBody.scrollHeight + 21 + 28 + 'px';
            this.setOpenAllButton(this.checkAllOpen());
        }

        itemButton.setAttribute('aria-expanded', startsOpen);
        itemBody.id = itemBody.id || `accordion-item-${parseInt(Math.random() * 1e8, 10)}`;
        itemButton.setAttribute('aria-controls', itemBody.id);

        // events
        itemButton.addEventListener('click', () => {
            const body = item.querySelector('.ds_accordion-item__body');
            const isOpen = item.classList.contains('ds_accordion-item--open');
            const that = this;

            if (!isOpen) {
                item.classList.add('ds_accordion-item--open');
                body.style.display = 'block';
                // 21px and 28px are the top and bottom padding of the body content
                body.style.maxHeight = body.scrollHeight + 21 + 28 + 'px';
                this.checkAllOpen();
            } else {
                body.style.maxHeight = 0;
                item.classList.remove('ds_accordion-item--open');
                that.checkAllOpen();

                window.setTimeout(function () {
                    body.style.display = 'none';
                }, 200);
            }

            itemButton.setAttribute('aria-expanded', !isOpen);
            itemControl.checked = !isOpen;

            // tracking
            let accordionNumber = 0;
            if (itemButton.getAttribute('data-accordion')) {
                accordionNumber = itemButton.getAttribute('data-accordion').split('-').reverse()[0];
            }
            itemButton.setAttribute('data-accordion', `accordion-${isOpen ? 'close' : 'open'}-${accordionNumber}`);

            this.setOpenAllButton(this.checkAllOpen());
        });
    }

    initOpenAll() {
        if (!this.openAllButton) {
            return;
        }

        this.openAllButton.addEventListener('click', () => {

            // if we're opening, open all unopened panels
            // if we're closing, close all opened panels
            const opening = !this.checkAllOpen();
            const allPanelButtons = [].slice.call(this.accordion.querySelectorAll('.ds_accordion-item__header-button'));

            let panelsToToggle;
            if (opening) {
                panelsToToggle = allPanelButtons.filter(button => !button.parentNode.classList.contains('ds_accordion-item--open'));
            } else {
                panelsToToggle = allPanelButtons.filter(button => button.parentNode.classList.contains('ds_accordion-item--open'));
            }

            panelsToToggle.forEach(function (button) {
                const event = document.createEvent('HTMLEvents');
                event.initEvent('click', true, false);
                button.dispatchEvent(event);
            });

            this.setOpenAllButton(opening);
        });
    }

    setOpenAllButton(open) {
        if (this.openAllButton) {
            if (open) {
                this.openAllButton.innerHTML = 'Close all <span class="visually-hidden">sections</span>';
                this.openAllButton.setAttribute('data-accordion', 'accordion-close-all');
            } else {
                this.openAllButton.innerHTML = 'Open all <span class="visually-hidden">sections</span>';
                this.openAllButton.setAttribute('data-accordion', 'accordion-open-all');
            }
        }
    }

    checkAllOpen() {
        if (!this.openAllButton) {
            return;
        }

        const openItemsCount = this.accordion.querySelectorAll('.ds_accordion-item--open').length;

        return (this.items.length === openItemsCount);
    }
}

export default Accordion;
