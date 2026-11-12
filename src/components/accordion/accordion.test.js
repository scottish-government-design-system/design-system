import { vi, beforeEach, describe, expect, it } from 'vitest';
import loadHtml from '../../../test/load-html';
import Accordion from './accordion';

const testObj = {};

describe('accordion', () => {
    beforeEach(async () => {
        await loadHtml('src/components/accordion/accordion.html');
        testObj.accordionElement = document.querySelector('#withopenall');
        testObj.accordionModule = new Accordion(testObj.accordionElement);
    });

    it('should set a class of "js-initialised" on init', () => {
        // grab the first accordion
        expect(testObj.accordionElement.classList.contains('js-initialised')).toBe(false);
        testObj.accordionModule.init();
        expect(testObj.accordionElement.classList.contains('js-initialised')).toBe(true);
    });

    it('should abandon attemts to call init() after it has been init-ed', () => {
        testObj.accordionModule.init();

        vi.spyOn(testObj.accordionModule.accordion.classList, 'add');
        testObj.accordionModule.init();
        expect(testObj.accordionModule.accordion.classList.add).not.toHaveBeenCalled();
    });

    describe('accordion items', () => {
        it('should be opened if window.location.hash matches an element inside the accordion', () => {
            const hashAccordionItem = testObj.accordionElement.querySelector('#hashAccordionItem');
            window.location.hash = 'foo';
            testObj.accordionModule.init();
            expect(hashAccordionItem).toHaveAttribute('open');
            window.location.hash = '';
        });
    });

    describe('open all', () => {
        it('"open all" button should open all panels when clicked', () => {
            testObj.accordionModule.init();

            const button = testObj.accordionElement.querySelector('.js-open-all');
            const accordionItems = testObj.accordionElement.querySelectorAll('.ds_accordion-item');

            const event = new Event('click');
            button.dispatchEvent(event);

            for (let i = 0, il = accordionItems.length; i < il; i++) {
                const accordionItem = accordionItems[i];
                expect(accordionItem).toHaveAttribute('open');
            }
        });

        it('"open all" button should change to "close all" if no panels left to open', () => {
            const secondItem = testObj.accordionElement.querySelector('.ds_accordion-item:nth-of-type(2)');
            const thirdItem = testObj.accordionElement.querySelector('.ds_accordion-item:nth-of-type(3)');
            secondItem.setAttribute('open', '');

            testObj.accordionModule.init();

            vi.spyOn(testObj.accordionModule, 'setOpenAllButton');

            const event = new Event('toggle');
            thirdItem.setAttribute('open', '');
            thirdItem.dispatchEvent(event);

            expect(testObj.accordionModule.setOpenAllButton).toHaveBeenCalledWith(true);
        });

        it('"close all" button should close all panels when clicked', () => {
            const accordionItems = testObj.accordionElement.querySelectorAll('.ds_accordion-item');
            const button = testObj.accordionElement.querySelector('.ds_accordion__open-all');
            const secondItem = testObj.accordionElement.querySelector('.ds_accordion-item:nth-of-type(2)');
            secondItem.setAttribute('open', '');

            const thirdItem = testObj.accordionElement.querySelector('.ds_accordion-item:nth-of-type(3)');
            thirdItem.setAttribute('open', '');

            testObj.accordionModule.init();

            const event = new Event('click');
            button.dispatchEvent(event);

            for (let i = 0, il = accordionItems.length; i < il; i++) {
                const accordionItem = accordionItems[i];
                expect(accordionItem.getAttribute('open')).toBeNull();
            }
        });
    });
});

describe('accordion without "open all" button', () => {
    beforeEach(async () => {
        await loadHtml('src/components/accordion/accordion.html');
        testObj.accordionElement = document.querySelector('#withoutopenall');
        testObj.accordionModule = new Accordion(testObj.accordionElement);
    });

    it('should not attempt to init the open all button', () => {
        vi.spyOn(testObj.accordionModule, 'initOpenAll');
        testObj.accordionModule.init();

        expect(testObj.accordionModule.initOpenAll).not.toHaveBeenCalled();
    });

    it('should not attempt to update the open all button when panels are toggled', () => {
        vi.spyOn(testObj.accordionModule, 'setOpenAllButton');
        testObj.accordionModule.init();

        const firstAccordionItem = testObj.accordionElement.querySelector('.ds_accordion-item:nth-of-type(2)');

        const event = new Event('toggle');
        firstAccordionItem.dispatchEvent(event);

        expect(testObj.accordionModule.setOpenAllButton).not.toHaveBeenCalled();
    });
});

describe('accordion with legacy markup', () => {
    beforeEach(async () => {
        await loadHtml('src/components/accordion/accordion.html');
        testObj.accordionElement = document.querySelector('#legacymarkup');

    });

    it('should transform the markup to the new DETAILS structure', () => {
        const firstAccordionItemTitleHTML = testObj.accordionElement.querySelector('.ds_accordion-item__title').innerHTML;
        const firstAccordionItemIndicatorHTML = testObj.accordionElement.querySelector('.ds_accordion-item__indicator').outerHTML;
        const firstAccordionItemBodyHTML = testObj.accordionElement.querySelector('.ds_accordion-item__body').innerHTML;

        testObj.accordionModule = new Accordion(testObj.accordionElement);

        const firstAccordionItem = testObj.accordionElement.querySelector('.ds_accordion-item');
        const secondAccordionItem = testObj.accordionElement.querySelector('.ds_accordion-item:nth-of-type(2)');
        const firstAccordionItemHeader = firstAccordionItem.querySelector('.ds_accordion-item__header');
        const firstAccordionItemBody = firstAccordionItem.querySelector('.ds_accordion-item__body');
        const control = firstAccordionItem.querySelector('.ds_accordion-item__control');
        const label = firstAccordionItem.querySelector('.ds_accordion-item__label');

        // accordion items are new DETAILS
        expect(firstAccordionItem.nodeName).toEqual('DETAILS');

        // accordion headers are now SUMMARY
        expect(firstAccordionItemHeader.nodeName).toEqual('SUMMARY');

        // accordion headers' content is old accordion-item__title content
        expect(firstAccordionItemHeader.innerHTML).toEqual(firstAccordionItemTitleHTML + firstAccordionItemIndicatorHTML);

        // accordion body content is old accordion-item__body content
        expect(firstAccordionItemBody.innerHTML).toEqual(firstAccordionItemBodyHTML);

        // accordion control is removed
        expect(control).toBeNull();

        // accordion label is removed
        expect(label).toBeNull();

        // open state is preserved
        expect(firstAccordionItem.open).toEqual(true);
        expect(secondAccordionItem.open).toEqual(false);
    });

    describe('invalid legacy markup should abort the fallback', () => {
        it('no body', () => {
            const firstBody = testObj.accordionElement.querySelector('.ds_accordion-item__body');

            firstBody.parentNode.removeChild(firstBody);
            testObj.accordionModule = new Accordion(testObj.accordionElement);
        });

        it('no title', () => {
            const firstTitle = testObj.accordionElement.querySelector('.ds_accordion-item__title');

            firstTitle.parentNode.removeChild(firstTitle);
            testObj.accordionModule = new Accordion(testObj.accordionElement);
        });

        it('no control', () => {
            const firstControl = testObj.accordionElement.querySelector('.ds_accordion-item__control');

            firstControl.parentNode.removeChild(firstControl);
            testObj.accordionModule = new Accordion(testObj.accordionElement);
        });
    });
});
