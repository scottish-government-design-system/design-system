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

describe('accordion without "open all" button', function () {
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
