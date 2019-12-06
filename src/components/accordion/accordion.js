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
        const checkbox = item.querySelector('.ds_accordion-item__control');
        const body = item.querySelector('.ds_accordion-item__body');

        checkbox.setAttribute('aria-expanded', checkbox.checked);

        if (checkbox.checked) {
            body.style.display = 'block';
            body.style.maxHeight = body.scrollHeight + 21 + 28 + 'px';
        }

        checkbox.addEventListener('change', event => {

            if (event.target.checked) {
                // 21px and 28px are the top and bottom padding of the body content
                body.style.display = 'block';
                body.style.maxHeight = body.scrollHeight + 21 + 28 + 'px';
            } else {
                body.style.maxHeight = 0;
                window.setTimeout(function () {
                    body.style.display = 'none';
                }, 200);
            }

            this.checkAllOpen();

            checkbox.setAttribute('aria-expanded', event.target.checked);

            // tracking
            let accordionNumber = 0;
            if (checkbox.getAttribute('data-accordion')) {
                accordionNumber = checkbox.getAttribute('data-accordion').split('-').reverse()[0];
            }
            checkbox.setAttribute('data-accordion', `accordion-${event.target.checked ? 'close' : 'open'}-${accordionNumber}`);
        });
    }

    initOpenAll() {
        if (!this.openAllButton) {
            return;
        }

        this.openAllButton.addEventListener('click', () => {
            const opening = !this.checkAllOpen();

            const allPanelCheckboxes = [].slice.call(this.accordion.querySelectorAll('.ds_accordion-item__control'));

            allPanelCheckboxes.forEach(function (checkbox) {
                checkbox.checked = opening;

                const event = document.createEvent('HTMLEvents');
                event.initEvent('change', true, false);
                checkbox.dispatchEvent(event);
            });
        });
    }

    checkAllOpen() {
        if (!this.openAllButton) {
            return;
        }

        const openItemsCount = this.accordion.querySelectorAll('.ds_accordion-item__control:checked').length;
        let allOpen;

        if (this.items.length === openItemsCount) {
            // everything is open
            this.openAllButton.innerHTML = 'Close all <span class="visually-hidden">sections</span>';
            this.openAllButton.setAttribute('data-accordion', 'accordion-close-all');
            allOpen = true;
        } else {
            // not everything is open
            this.openAllButton.innerHTML = 'Open all <span class="visually-hidden">sections</span>';
            this.openAllButton.setAttribute('data-accordion', 'accordion-open-all');
            allOpen = false;
        }

        return allOpen;
    }
}

export default Accordion;
