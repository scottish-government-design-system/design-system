const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, './accordion.html'), 'utf-8');
const testObj = {};

import Accordion from './accordion';

describe('accordion', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
        testObj.accordionElement = document.querySelector('[data-module="ds-accordion"]');
        testObj.accordionModule = new Accordion(testObj.accordionElement);
    });

    it('should set a class of "js-initialised" on init', () => {
        // grab the first accordion
        expect(testObj.accordionElement.classList.contains('js-initialised')).toBe(false);
        testObj.accordionModule.init();
        expect(testObj.accordionElement.classList.contains('js-initialised')).toBe(true);
    });

    describe('accordion items', () => {
        it ('should switch to the "open" view if selected on init', () => {
            const firstAccordionItem = testObj.accordionElement.querySelector('.ds_accordion-item');

            testObj.accordionModule.init();
            expect(firstAccordionItem.classList.contains('ds_accordion-item--open')).toEqual(true);
        });

        it ('should set aria-expanded appropriately on each content item depending on open/closed state', () => {
            testObj.accordionModule.init();

            const accordionItems = testObj.accordionElement.querySelectorAll('.ds_accordion-item');

            // in fixture, first item is checked, others are not
            const states = [true, false, false];
            for (let i = 0, il = accordionItems.length; i < il; i++) {
                const accordionItem = accordionItems[i];
                expect(accordionItem.getAttribute('aria-expanded')).toEqual(states[i].toString());
            }
        });

        it ('should open on click of its header if currently closed (and vice versa)', () => {
            testObj.accordionModule.init();

            const firstAccordionItem = testObj.accordionElement.querySelector('.ds_accordion-item:nth-of-type(2)');
            const accordionItemBody = firstAccordionItem.querySelector('.ds_accordion-item__body');
            const accordionItemButton = firstAccordionItem.querySelector('.ds_accordion-item__header-button');

            let event = new Event('click');
            accordionItemButton.dispatchEvent(event);
            expect(accordionItemBody.style.display).toEqual('block');

            event = new Event('click');
            accordionItemButton.dispatchEvent(event);
            expect(parseInt(accordionItemBody.style.maxHeight, 10)).toEqual(0);
        });
    });

    describe('open all', () => {
        it ('"open all" button should open all panels when clicked', () => {
            testObj.accordionModule.init();

            const button = testObj.accordionElement.querySelector('.js-open-all');
            const accordionItems = testObj.accordionElement.querySelectorAll('.ds_accordion-item');
            const states = [true, true, true];

            const event = new Event('click');
            button.dispatchEvent(event);

            for (let i = 0, il = accordionItems.length; i < il; i++) {
                const accordionItem = accordionItems[i];
                expect(accordionItem.getAttribute('aria-expanded')).toEqual(states[i].toString());
                expect(accordionItem.classList.contains('ds_accordion-item--open')).toEqual(true);
            }
        });

        it ('"open all" button should change to "close all" if no panels left to open', () => {
            const button = testObj.accordionElement.querySelector('.ds_accordion__open-all');
            const secondCheckbox = testObj.accordionElement.querySelector('.ds_accordion-item:nth-of-type(2) .ds_accordion-item__control');
            secondCheckbox.setAttribute('checked', true);

            testObj.accordionModule.init();

            const accordionItemButton = testObj.accordionElement.querySelector('.ds_accordion-item:nth-of-type(3) .ds_accordion-item__header-button');

            const event = new Event('click');
            accordionItemButton.dispatchEvent(event);

            expect(button.getAttribute('data-accordion')).toEqual('accordion-close-all');
        });

        it ('"close all" button should close all panels when clicked', () => {
            const accordionItems = testObj.accordionElement.querySelectorAll('.ds_accordion-item');
            const button = testObj.accordionElement.querySelector('.ds_accordion__open-all');
            const secondCheckbox = testObj.accordionElement.querySelector('.ds_accordion-item:nth-of-type(2) .ds_accordion-item__control');
            secondCheckbox.setAttribute('checked', true);

            const thirdCheckbox = testObj.accordionElement.querySelector('.ds_accordion-item:nth-of-type(3) .ds_accordion-item__control');
            thirdCheckbox.setAttribute('checked', true);

            testObj.accordionModule.init();

            const states = [false, false, false];

            const event = new Event('click');
            button.dispatchEvent(event);

            for (let i = 0, il = accordionItems.length; i < il; i++) {
                const accordionItem = accordionItems[i];
                expect(accordionItem.getAttribute('aria-expanded')).toEqual(states[i].toString());
                expect(accordionItem.classList.contains('ds_accordion-item--open')).toEqual(false);
            }
        });
    });
});
