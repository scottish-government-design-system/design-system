'use strict';

const accordionComponent = {
    init: function () {
        const accordions = document.querySelectorAll('.ds_accordion');

        accordions.forEach(function (accordion) {
            accordion.classList.add('js-initialised');

            const accordionItems = accordion.querySelectorAll('.ds_accordion-item');
            const openAllButton = accordion.querySelector('.ds_accordion__open-all');

            accordionComponent.initOpenAll(accordion, openAllButton);

            accordionItems.forEach(function (accordionItem) {
                accordionComponent.initAccordionItem(accordionItem, accordion, openAllButton);
            });
        });
    },

    initAccordionItem(item, accordion, button) {
        const checkbox = item.querySelector('.ds_accordion-item__control');
        const body = item.querySelector('.ds_accordion-item__body');

        checkbox.setAttribute('aria-expanded', checkbox.checked);

        if (checkbox.checked) {
            body.style.display = 'block';
            body.style.maxHeight = body.scrollHeight + 21 + 28 + 'px';
        }

        checkbox.addEventListener('change', function (event) {

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

            accordionComponent.checkAllOpen(accordion, button);

            checkbox.setAttribute('aria-expanded', event.target.checked);

            // tracking
            let accordionNumber = 0;
            if (checkbox.getAttribute('data-accordion')) {
                accordionNumber = checkbox.getAttribute('data-accordion').split('-').reverse()[0];
            }
            checkbox.setAttribute('data-accordion', `accordion-${event.target.checked ? 'close' : 'open'}-${accordionNumber}`);
        });
    },

    initOpenAll: function (accordion, button) {
        if (!button) {
            return;
        }

        button.addEventListener('click', function () {
            const opening = !accordionComponent.checkAllOpen(accordion, button);

            const allPanelCheckboxes = accordion.querySelectorAll('.ds_accordion-item__control');

            allPanelCheckboxes.forEach(function (checkbox) {
                checkbox.checked = opening;

                const event = document.createEvent('HTMLEvents');
                event.initEvent('change', true, false);
                checkbox.dispatchEvent(event);
            });
        });
    },

    checkAllOpen: function (accordion, button) {
        if (!button) {
            return;
        }

        const accordionItems = accordion.querySelectorAll('.ds_accordion-item');
        const openItems = accordion.querySelectorAll('.ds_accordion-item__control:checked');
        let allOpen;

        if (accordionItems.length === openItems.length) {
            // everything is open
            button.innerHTML = 'Close all <span class="visually-hidden">sections</span>';
            button.setAttribute('data-accordion', 'accordion-close-all');
            allOpen = true;
        } else {
            // not everything is open
            button.innerHTML = 'Expand all <span class="visually-hidden">sections</span>';
            button.setAttribute('data-accordion', 'accordion-open-all');
            allOpen = false;
        }

        return allOpen;
    },
};

// self-initialize
accordionComponent.init();

export {accordionComponent};
