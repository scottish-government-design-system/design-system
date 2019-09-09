const fs = require('fs');
const path = require('path');

const accordion = require('./accordion');
const html = fs.readFileSync(path.resolve(__dirname, 'accordion.html'), 'utf-8');

describe('accordion', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
    });

    it ('should set a class of "js-initialised" on init', () => {
        // grab the first accordion
        const firstAccordion = document.querySelector('.ds_accordion');
        expect(firstAccordion.classList.contains('js-initialised')).toBe(false);
        accordion.accordionComponent.init();
        expect(firstAccordion.classList.contains('js-initialised')).toBe(true);
    });

    describe('open all', () => {
        it ('"open all" button should open all panels when clicked', () => {
            accordion.accordionComponent.init();

            const firstAccordion = document.querySelector('.ds_accordion');
            const button = firstAccordion.querySelector('.ds_accordion__open-all');
            const accordionItems = firstAccordion.querySelectorAll('.ds_accordion-item');
            const states = [true, true, true];

            const event = new Event('click');
            button.dispatchEvent(event);

            for (let i = 0, il = accordionItems.length; i < il; i++) {
                const accordionItem = accordionItems[i];
                const accordionItemCheckbox = accordionItem.querySelector('.ds_accordion-item__control');
                expect(accordionItemCheckbox.getAttribute('aria-expanded')).toEqual(states[i].toString());
            }
        });

        it ('"open all" button should change to "close all" if no panels left to open', () => {
            const firstAccordion = document.querySelector('.ds_accordion');
            const button = firstAccordion.querySelector('.ds_accordion__open-all');
            const secondCheckbox = firstAccordion.querySelector('.ds_accordion-item:nth-of-type(2) .ds_accordion-item__control');
            secondCheckbox.setAttribute('checked', true);

            accordion.accordionComponent.init();

            const accordionItemLabel = firstAccordion.querySelector('.ds_accordion-item:nth-of-type(3) .ds_accordion-item__label');

            const event = new Event('click');
            accordionItemLabel.dispatchEvent(event);

            expect(button.getAttribute('data-accordion')).toEqual('accordion-close-all');
        });

        it ('"close all" button should close all panels when clicked', () => {
            const firstAccordion = document.querySelector('.ds_accordion');
            const accordionItems = firstAccordion.querySelectorAll('.ds_accordion-item');
            const button = firstAccordion.querySelector('.ds_accordion__open-all');
            const secondCheckbox = firstAccordion.querySelector('.ds_accordion-item:nth-of-type(2) .ds_accordion-item__control');
            secondCheckbox.setAttribute('checked', true);

            const thirdCheckbox = firstAccordion.querySelector('.ds_accordion-item:nth-of-type(3) .ds_accordion-item__control');
            thirdCheckbox.setAttribute('checked', true);

            accordion.accordionComponent.init();

            const states = [false, false, false];

            const event = new Event('click');
            button.dispatchEvent(event);

            for (let i = 0, il = accordionItems.length; i < il; i++) {
                const accordionItem = accordionItems[i];
                const accordionItemCheckbox = accordionItem.querySelector('.ds_accordion-item__control');
                expect(accordionItemCheckbox.getAttribute('aria-expanded')).toEqual(states[i].toString());
            }
        });
    });

    describe ('accordion items', () => {
        it ('should switch to the "open" view if selected on init', () => {
            const firstAccordion = document.querySelector('.ds_accordion');
            const firstAccordionItem = firstAccordion.querySelector('.ds_accordion-item');
            const accordionItemBody = firstAccordionItem.querySelector('.ds_accordion-item__body');

            accordion.accordionComponent.init();
            expect(accordionItemBody.style.display).toEqual('block');
        });

        it ('should set aria-expanded appropriately on each content item depending on open/closed state', () => {
            accordion.accordionComponent.init();

            const firstAccordion = document.querySelector('.ds_accordion');
            const accordionItems = firstAccordion.querySelectorAll('.ds_accordion-item');

            // in fixture, first item is checked, others are not
            const states = [true, false, false];
            for (let i = 0, il = accordionItems.length; i < il; i++) {
                const accordionItem = accordionItems[i];
                const accordionItemCheckbox = accordionItem.querySelector('.ds_accordion-item__control');
                expect(accordionItemCheckbox.getAttribute('aria-expanded')).toEqual(states[i].toString());
            }
        });

        it ('should open on click of its header if currently closed', () => {
            accordion.accordionComponent.init();

            const firstAccordion = document.querySelector('.ds_accordion');
            const firstAccordionItem = firstAccordion.querySelector('.ds_accordion-item:nth-of-type(2)');
            const accordionItemBody = firstAccordionItem.querySelector('.ds_accordion-item__body');
            const accordionItemLabel = firstAccordionItem.querySelector('.ds_accordion-item__label');

            const event = new Event('click');
            accordionItemLabel.dispatchEvent(event);
            expect(accordionItemBody.style.display).toEqual('block');
        });

        it ('should close on click of its header if currently open', () => {
            accordion.accordionComponent.init();

            const firstAccordion = document.querySelector('.ds_accordion');
            const firstAccordionItem = firstAccordion.querySelector('.ds_accordion-item');
            const accordionItemBody = firstAccordionItem.querySelector('.ds_accordion-item__body');
            const accordionItemLabel = firstAccordionItem.querySelector('.ds_accordion-item__label');

            const event = new Event('click');
            accordionItemLabel.dispatchEvent(event);
            expect(parseInt(accordionItemBody.style.maxHeight, 10)).toEqual(0);
        });
    });
});
