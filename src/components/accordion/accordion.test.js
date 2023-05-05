const testObj = {};

jasmine.getFixtures().fixturesPath = 'base/src/';

import Accordion from './accordion';

describe('accordion', () => {
    beforeEach(() => {
        loadFixtures('components/accordion/accordion.html');

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

        spyOn(testObj.accordionModule.accordion.classList, 'add');
        testObj.accordionModule.init();
        expect(testObj.accordionModule.accordion.classList.add).not.toHaveBeenCalled();
    });

    describe('accordion items', () => {
        it ('should switch to the "open" view if selected on init', () => {
            const firstAccordionItem = testObj.accordionElement.querySelector('.ds_accordion-item');

            testObj.accordionModule.init();
            expect(firstAccordionItem.classList.contains('ds_accordion-item--open')).toEqual(true);
        });

        it('should be opened if window.location.hash matches an element inside the accordion', () => {
            const hashAccordionItem = testObj.accordionElement.querySelector('#hashAccordionItem');

            window.location.hash = 'foo';
            testObj.accordionModule.init();
            expect(hashAccordionItem.classList.contains('ds_accordion-item--open')).toEqual(true);
            window.location.hash = '';
        });

        it ('should set aria-expanded appropriately on each content item depending on open/closed state', () => {
            testObj.accordionModule.init();

            const accordionItems = testObj.accordionElement.querySelectorAll('.ds_accordion-item');


            // in fixture, first item is checked, others are not
            const states = [true, false, false];
            for (let i = 0, il = accordionItems.length; i < il; i++) {
                const accordionItemButton = accordionItems[i].querySelector('.js-accordion-button');
                expect(accordionItemButton.getAttribute('aria-expanded')).toEqual(states[i].toString());
            }
        });

        it ('should open on click of its header if currently closed (and vice versa)', () => {
            jasmine.clock().install();

            testObj.accordionModule.init();

            const firstAccordionItem = testObj.accordionElement.querySelector('.ds_accordion-item:nth-of-type(2)');
            const accordionItemBody = firstAccordionItem.querySelector('.ds_accordion-item__body');
            const accordionItemButton = firstAccordionItem.querySelector('.js-accordion-button');

            let event = new Event('click');
            accordionItemButton.dispatchEvent(event);
            expect(accordionItemBody.style.display).toEqual('block');

            event = new Event('click');
            accordionItemButton.dispatchEvent(event);
            jasmine.clock().tick(199);
            expect(parseInt(accordionItemBody.style.maxHeight, 10)).toEqual(0);
            jasmine.clock().tick(1);
            expect(accordionItemBody.style.maxHeight).toEqual('');
            expect(accordionItemBody.style.display).toEqual('');

            jasmine.clock().uninstall();
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
                const accordionItemButton = accordionItem.querySelector('.js-accordion-button');
                expect(accordionItemButton.getAttribute('aria-expanded')).toEqual(states[i].toString());
                expect(accordionItem.classList.contains('ds_accordion-item--open')).toEqual(true);
            }
        });

        it ('"open all" button should change to "close all" if no panels left to open', () => {
            const button = testObj.accordionElement.querySelector('.ds_accordion__open-all');
            const secondCheckbox = testObj.accordionElement.querySelector('.ds_accordion-item:nth-of-type(2) .ds_accordion-item__control');
            secondCheckbox.setAttribute('checked', true);

            testObj.accordionModule.init();

            const accordionItemButton = testObj.accordionElement.querySelector('.ds_accordion-item:nth-of-type(3) .js-accordion-button');

            const event = new Event('click');
            accordionItemButton.dispatchEvent(event);

            // note: no assertion, test success can be inferred from there being no execution errors
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
                const accordionItemButton = accordionItem.querySelector('.js-accordion-button');
                expect(accordionItemButton.getAttribute('aria-expanded')).toEqual(states[i].toString());
                expect(accordionItem.classList.contains('ds_accordion-item--open')).toEqual(false);
            }
        });
    });
});

describe('accordion without "open all" button', function () {
    beforeEach(() => {
        loadFixtures('components/accordion/accordion.html');

        testObj.accordionElement = document.querySelector('#withoutopenall');
        testObj.accordionModule = new Accordion(testObj.accordionElement);
    });

    it('should not attempt to init the open all button', () => {
        spyOn(testObj.accordionModule, 'initOpenAll');
        testObj.accordionModule.init();

        expect(testObj.accordionModule.initOpenAll).not.toHaveBeenCalled();
    });

    it('should not attempt to update the open all button when panels are toggled', () => {
        spyOn(testObj.accordionModule, 'setOpenAllButton');
        testObj.accordionModule.init();

        const firstAccordionItem = testObj.accordionElement.querySelector('.ds_accordion-item:nth-of-type(2)');

        testObj.accordionModule.toggleAccordionItem(firstAccordionItem);

        expect(testObj.accordionModule.setOpenAllButton).not.toHaveBeenCalled();
    });
});
