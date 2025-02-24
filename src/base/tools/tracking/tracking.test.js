const testObj = {};

jasmine.getFixtures().fixturesPath = 'base/src/';

import Tracking from './tracking';
import Accordion from '../../../components/accordion/accordion';
import Autocomplete from "../../../components/autocomplete/autocomplete";
import SideNavigation from '../../../components/side-navigation/side-navigation';

describe('tracking', () => {
    beforeEach(() => {
        loadFixtures('base/tools/tracking/tracking.html');
    });

    describe('clicks', () => {
        beforeEach(() => {
            Tracking.init();
            spyOn(Tracking, 'pushToDataLayer');
        });

        it('left mouse click should be recorded in the dataLayer', () => {
            const element = document.documentElement;

            const event = new MouseEvent( 'click', {
                bubbles: true
            });
            element.dispatchEvent(event);

            expect(Tracking.pushToDataLayer).toHaveBeenCalledWith({ method: 'primary click' });
        });

        it('left mouse click with CTRL should be recorded in the datalayer', () => {
            const element = document.documentElement;

            const event = new MouseEvent( 'click', {
                bubbles: true,
                ctrlKey: true
            });
            element.dispatchEvent(event);

            expect(Tracking.pushToDataLayer).toHaveBeenCalledWith({ method: 'ctrl click' });
        });

        it('left mouse click with COMMAND/WIN should be recorded in the datalayer', () => {
            const element = document.documentElement;

            const event = new MouseEvent( 'click', {
                bubbles: true,
                metaKey: true
            });
            element.dispatchEvent(event);

            expect(Tracking.pushToDataLayer).toHaveBeenCalledWith({ method: 'command/win click' });
        });

        it('left mouse click with SHIFT should be recorded in the datalayer', () => {
            const element = document.documentElement;

            const event = new MouseEvent( 'click', {
                bubbles: true,
                shiftKey: true
            });
            element.dispatchEvent(event);

            expect(Tracking.pushToDataLayer).toHaveBeenCalledWith({ method: 'shift click' });
        });

        it('middle mouse click should be recorded in the dataLayer', () => {
            const element = document.documentElement;

            const event = new MouseEvent('auxclick', {
                bubbles: true,
                button: 1
            });
            element.dispatchEvent(event);

            expect(Tracking.pushToDataLayer).toHaveBeenCalledWith({ method: 'middle click' });
        });

        it('middle mouse click should be recorded in the dataLayer (alternative method', () => {
            const element = document.documentElement;

            const event = new MouseEvent('auxclick', {
                bubbles: true,
                buttons: 4
            });
            element.dispatchEvent(event);

            expect(Tracking.pushToDataLayer).toHaveBeenCalledWith({ method: 'middle click' });
        });

        it('clicks on other mouse buttons should not be recorded', () => {
            const element = document.documentElement;

            const event = new MouseEvent('auxclick', {
                bubbles: true,
                buttons: 1
            });
            element.dispatchEvent(event);

            expect(Tracking.pushToDataLayer).not.toHaveBeenCalled();
        });

        it('right mouse click sshould be recorded in the dataLayer', () => {
            const element = document.documentElement;

            const event = new MouseEvent( 'contextmenu' , {
                bubbles: true
            });
            element.dispatchEvent(event);

            expect(Tracking.pushToDataLayer).toHaveBeenCalledWith({ method: 'secondary click' });
        });
    });

    describe('buttons', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('buttons');
        });

        it('should only set a generated data attribute on buttons without attributes already set', () => {
            const withoutAttribute = testObj.scope.querySelector('[data-unit="without-attribute"]');
            const withAttribute = testObj.scope.querySelector('[data-unit="with-attribute"]');
            Tracking.add.buttons();

            expect(withoutAttribute.getAttribute('data-button')).toEqual('button-without-attribute');
            expect(withAttribute.getAttribute('data-button')).toEqual('button-foo');
        });
    });

    describe('checkboxes', () => {
        describe('attributes', () => {
            beforeEach(() => {
                testObj.scope = document.getElementById('checkboxes');
            });

            it('should add a generated data attribute on checkboxes without attributes already set', () => {
                const checkbox = testObj.scope.querySelector('[data-unit="without-attribute"] .ds_checkbox__input');
                Tracking.add.checkboxes();

                expect(checkbox.getAttribute('data-form')).toEqual('checkbox-education');
            });

            it('should NOT add a generated data attribute on checkboxes with attributes already set', () => {
                const checkbox = testObj.scope.querySelector('[data-unit="with-attribute"] .ds_checkbox__input');
                Tracking.add.checkboxes();

                expect(checkbox.getAttribute('data-form')).toEqual('checkbox-foo');
            });

            it('should mark prechecked checkboxes as checked in the data attribute', () => {
                const checkbox = testObj.scope.querySelector('[data-unit="prechecked"] .ds_checkbox__input');
                Tracking.add.checkboxes();

                expect(checkbox.getAttribute('data-form')).toEqual('checkbox-transport-checked');
            });

            it('should mark prechecked checkboxes with data attributes already set as checked in the data attribute', () => {
                const checkbox = testObj.scope.querySelector('[data-unit="prechecked-with-attribute"] .ds_checkbox__input');
                Tracking.add.checkboxes();

                expect(checkbox.getAttribute('data-form')).toEqual('checkbox-bar-checked');
            });
        });

        describe('events', () => {
            beforeEach(() => {
                testObj.scope = document.getElementById('checkboxes');
                testObj.checkbox1 = testObj.scope.querySelector('[data-unit="without-attribute"] .ds_checkbox__input');
                testObj.label1 = testObj.scope.querySelector('[data-unit="without-attribute"] .ds_checkbox__label');

                testObj.checkbox2 = testObj.scope.querySelector('[data-unit="prechecked"] .ds_checkbox__input');
                testObj.label2 = testObj.scope.querySelector('[data-unit="prechecked"] .ds_checkbox__label');
            });

            it('should append "checked" or "unchecked" to checkbox data attributes when they change', () => {
                Tracking.add.checkboxes();

                let event = new Event('click');

                testObj.label1.dispatchEvent(event);
                expect(testObj.checkbox1.getAttribute('data-form')).toEqual('checkbox-education-checked');

                testObj.label2.dispatchEvent(event);
                expect(testObj.checkbox2.getAttribute('data-form')).toEqual('checkbox-transport-unchecked');
            });

            it('shouldn\'t bind checkbox tracking events multiple times', () => {
                spyOn(testObj.label1, 'addEventListener');

                Tracking.add.checkboxes();
                expect(testObj.label1.addEventListener.calls.count()).toEqual(1);

                Tracking.add.checkboxes();
                expect(testObj.label1.addEventListener.calls.count()).toEqual(1);
            });
        });
    });

    describe('radios', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('radios');
        });

        it('should add a generated data attribute on radio buttons without attributes already set', () => {
            const radio = testObj.scope.querySelector('[data-unit="without-attribute"] .ds_radio__input');
            Tracking.add.radios();

            expect(radio.getAttribute('data-form')).toEqual('radio-feedback-type-useful-yes');
        });

        it('should NOT add a generated data attribute on radio buttons with attributes already set', () => {
            const radio = testObj.scope.querySelector('[data-unit="with-attribute"] .ds_radio__input');
            Tracking.add.radios();

            expect(radio.getAttribute('data-form')).toEqual('radio-foo');
        });
    });

    describe('selects', () => {
        describe('attributes', () => {
            beforeEach(() => {
                testObj.scope = document.getElementById('selects');
            });

            it('should add a generated data attribute on select elements without attributes already set', () => {
                const select = testObj.scope.querySelector('[data-unit="without-attribute"]');
                Tracking.add.selects();

                expect(select.getAttribute('data-form')).toEqual('select-mushroom');
            });

            it('should NOT add a generated data attribute on select elements with attributes already set', () => {
                const select = testObj.scope.querySelector('[data-unit="with-attribute"]');
                Tracking.add.selects();

                expect(select.getAttribute('data-form')).toEqual('select-foo');
            });

            it('should add a generated data attribute to all options in select elements', () => {
                const select = testObj.scope.querySelector('[data-unit="without-attribute"]');
                const options = [].slice.call(select.querySelectorAll('option'));

                Tracking.add.selects();
                expect(options[0].getAttribute('data-form')).toEqual('select-mushroom-null');
                expect(options[1].getAttribute('data-form')).toEqual('select-mushroom-amanita');
                expect(options[2].getAttribute('data-form')).toEqual('select-mushroom-boletus');
                expect(options[3].getAttribute('data-form')).toEqual('select-mushroom-coprinopsis');
            });
        });

        describe('events', () => {
            beforeEach(() => {
                testObj.scope = document.getElementById('selects');
            });

            it('should append "checked" or "unchecked" to checkbox data attributes when they change', () => {
                const select = testObj.scope.querySelector('[data-unit="without-attribute"]');
                const options = [].slice.call(select.querySelectorAll('option'));
                window.dataLayer = window.dataLayer || [];

                spyOn(Tracking, 'pushToDataLayer');

                Tracking.add.selects();
                options[2].selected = true;

                let event = new Event('change');
                select.dispatchEvent(event);
                expect(Tracking.pushToDataLayer).toHaveBeenCalledWith({ "event": "select-mushroom-boletus" });
            });

            it('shouldn\'t bind select tracking events multiple times', () => {
                const select = testObj.scope.querySelector('[data-unit="without-attribute"]');
                spyOn(select, 'addEventListener');

                Tracking.add.selects();
                expect(select.addEventListener.calls.count()).toEqual(1);

                Tracking.add.selects();
                expect(select.addEventListener.calls.count()).toEqual(1);
            });
        });
    });

    describe('text inputs', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('text-inputs');
        });

        it('should add a generated data attribute on text inputs without attributes already set', () => {
            const input = testObj.scope.querySelector('[data-unit="without-attribute"]');
            Tracking.add.textInputs();

            expect(input.getAttribute('data-form')).toEqual('textinput-first-name');
        });

        it('should NOT add a generated data attribute on text inputs with attributes already set', () => {
            const input = testObj.scope.querySelector('[data-unit="with-attribute"]');
            Tracking.add.textInputs();

            expect(input.getAttribute('data-form')).toEqual('textinput-foo');
        });

        it('should use the input type in the data attribute value', () => {
            const input = testObj.scope.querySelector('[data-unit="number"]');
            Tracking.add.textInputs();

            expect(input.getAttribute('data-form')).toEqual('numberinput-age');
        });
    });

    describe('textareas', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('textareas');
        });

        it('should add a generated data attribute on textareas without attributes already set', () => {
            const textarea = testObj.scope.querySelector('[data-unit="without-attribute"]');
            Tracking.add.textareas();

            expect(textarea.getAttribute('data-form')).toEqual('textarea-description');
        });

        it('should NOT add a generated data attribute on textareas with attributes already set', () => {
            const textarea = testObj.scope.querySelector('[data-unit="with-attribute"]');
            Tracking.add.textareas();

            expect(textarea.getAttribute('data-form')).toEqual('textarea-foo');
        });
    });

    describe('accordions', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('accordions');
            testObj.accordionElement = testObj.scope.querySelector('.ds_accordion');
        });

        it('should not add data attributes if the accordion instance has not been initialised.', () => {
            Tracking.add.accordions();

            // todo assert
        });

        describe('attributes', () => {
            beforeEach(() => {
                testObj.scope = document.getElementById('accordions');
                testObj.accordionElement = testObj.scope.querySelector('#standard-accordion');
                testObj.accordionModule = new Accordion(testObj.accordionElement);
                testObj.accordionModule.init();
            });

            it('should add data attributes to accordion buttons', () => {
                const openAll = testObj.accordionElement.querySelector('.js-open-all');
                openAll.parentNode.removeChild(openAll);

                const buttons = [].slice.call(testObj.accordionElement.querySelectorAll('.ds_accordion-item__button'));

                Tracking.add.accordions();

                expect(buttons[0].getAttribute('data-accordion')).toEqual('accordion-open-1');
                // accordion item 2 is open on load and it should have a different attribute
                expect(buttons[1].getAttribute('data-accordion')).toEqual('accordion-close-2');
                expect(buttons[2].getAttribute('data-accordion')).toEqual('accordion-open-3');
            });

            it('should add a data attribute to the accordion "open all" button', () => {
                const openAll = testObj.accordionElement.querySelector('.js-open-all');

                Tracking.add.accordions();

                expect(openAll.getAttribute('data-accordion')).toEqual('accordion-open-all');
            });
        });

        describe('attributes for accordion with data-name attribute', () => {
            beforeEach(() => {
                testObj.scope = document.getElementById('accordions');
                testObj.accordionElement = testObj.scope.querySelector('#accordion-with-name');
                testObj.accordionModule = new Accordion(testObj.accordionElement);
                testObj.accordionModule.init();
            });

            it('should add data attributes, with name, to accordion buttons', () => {
                const openAll = testObj.accordionElement.querySelector('.js-open-all');
                openAll.parentNode.removeChild(openAll);

                const buttons = [].slice.call(testObj.accordionElement.querySelectorAll('.ds_accordion-item__button'));

                Tracking.add.accordions();

                expect(buttons[0].getAttribute('data-accordion')).toEqual('accordion-foo-open-1');
                // accordion item 2 is open on load and it should have a different attribute
                expect(buttons[1].getAttribute('data-accordion')).toEqual('accordion-foo-close-2');
                expect(buttons[2].getAttribute('data-accordion')).toEqual('accordion-foo-open-3');
            });

            it('should add a data attribute to the accordion "open all" button', () => {
                const openAll = testObj.accordionElement.querySelector('.js-open-all');

                Tracking.add.accordions();

                expect(openAll.getAttribute('data-accordion')).toEqual('accordion-foo-open-all');
            });
        });

        describe('events', () => {
            beforeEach(() => {
                testObj.scope = document.getElementById('accordions');
                testObj.accordionElement = testObj.scope.querySelector('.ds_accordion');
                testObj.accordionModule = new Accordion(testObj.accordionElement);
                testObj.accordionModule.init();
            });

            it('should toggle the attribute value on accordion item buttons when they open or close', () => {
                const items = [].slice.call(testObj.accordionElement.querySelectorAll('.ds_accordion-item'));
                const itemButton = items[0].querySelector('.ds_accordion-item__button');
                const itemControl = items[0].querySelector('.ds_accordion-item__control');

                Tracking.add.accordions();

                let event = new Event('click');
                itemControl.checked = true;
                itemButton.dispatchEvent(event);

                expect(itemButton.getAttribute('data-accordion')).toEqual('accordion-close-1');
            });

            it('should toggle the "open all" button to "close all" when all accordion items are open', () => {
                const items = [].slice.call(testObj.accordionElement.querySelectorAll('.ds_accordion-item'));
                const itemButton1 = items[0].querySelector('.ds_accordion-item__button');
                const itemControl1 = items[0].querySelector('.ds_accordion-item__control');
                const itemButton3 = items[2].querySelector('.ds_accordion-item__button');
                const itemControl3 = items[2].querySelector('.ds_accordion-item__control');
                const openAll = testObj.accordionElement.querySelector('.js-open-all');

                Tracking.add.accordions();

                // run through a number of open/close interactions
                let event = new Event('click');

                itemControl1.checked = true;
                itemButton1.dispatchEvent(event);
                expect(openAll.getAttribute('data-accordion')).toEqual('accordion-open-all');

                // second item is already open

                itemControl3.checked = true;
                itemButton3.dispatchEvent(event);
                expect(openAll.getAttribute('data-accordion')).toEqual('accordion-close-all');

                // and now back to open all
                itemControl1.checked = false;
                itemButton1.dispatchEvent(event);
                expect(openAll.getAttribute('data-accordion')).toEqual('accordion-open-all');
            });

            it('should modify all panels\' data-attributes on click of "open all"', () => {
                const openAll = testObj.accordionElement.querySelector('.js-open-all');
                const buttons = [].slice.call(testObj.accordionElement.querySelectorAll('.ds_accordion-item__button'));

                Tracking.add.accordions();

                let event = new Event('click');

                // open them all
                openAll.dispatchEvent(event);
                buttons.forEach((button, index) => {
                    expect(button.getAttribute('data-accordion')).toEqual(`accordion-close-${index + 1}`);
                });

                // and now close them all
                openAll.dispatchEvent(event);
                buttons.forEach((button, index) => {
                    expect(button.getAttribute('data-accordion')).toEqual(`accordion-open-${index + 1}`);
                });
            });
        });
    });

    describe('autocompletes', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('autocompletes');
            testObj.autocompleteElement = testObj.scope.querySelector('.ds_autocomplete');
            testObj.autocompleteModule = new Autocomplete(testObj.autocompleteElement, '#foo');
            testObj.autocompleteModule.init();

            window.dataLayer = window.dataLayer || [];

            Tracking.add.autocompletes();
        });

        xit('should set a datalayer value when an item is selected via keyboard', () => {
            // arrange
            const inputElement = testObj.autocompleteElement.querySelector('.js-autocomplete-input');
            inputElement.setAttribute('aria-activedescendant', 'suggestion-1');
            testObj.autocompleteModule.activeSuggestion = true;
            testObj.autocompleteModule.suggestions = [1,2,3];
            testObj.autocompleteModule.inputElement.dataset.autocompleteposition = 2;

            spyOn(Tracking, 'pushToDataLayer');

            // act
            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            inputElement.dispatchEvent(enterEvent);

            // assert
            expect(Tracking.pushtoDataLayer).toHaveBeenCalledWith({
                event: 'autocomplete',
                searchText: '',
                clickText: 'bar',
                resultsCount: 3,
                clickedResults: 'result 2 of 3'
            });
        });

        it('should NOT set a datalayer value when an item is NOT selected via keyboard', () => {
            // arrange
            const inputElement = testObj.autocompleteElement.querySelector('.js-autocomplete-input');

            spyOn(Tracking, 'pushToDataLayer');

            // act
            const event = new KeyboardEvent('keydown', { key: 'Enter' });
            inputElement.dispatchEvent(event);

            // assert
            expect(Tracking.pushToDataLayer).not.toHaveBeenCalled();
        });

        it('should set a datalayer value when an item is clicked', () => {
            // arrange
            const suggestion1 = testObj.autocompleteElement.querySelector('#suggestion-1');
            testObj.autocompleteModule.activeSuggestion = true;
            testObj.autocompleteModule.suggestions = [1,2,3];
            testObj.autocompleteModule.inputElement.dataset.autocompleteposition = 2;
            testObj.autocompleteModule.inputElement.dataset.autocompletetext = 'bar';
            testObj.autocompleteModule.inputElement.dataset.autocompletecount = 3;

            spyOn(Tracking, 'pushToDataLayer');

            // prevent problematic calls not relevant to this spec
            spyOn(testObj.autocompleteModule, 'selectSuggestion');
            spyOn(testObj.autocompleteModule, 'acceptSelectedSuggestion');

            // act
            const event = new Event('mousedown', {bubbles: true});
            suggestion1.dispatchEvent(event);

            // assert
            expect(Tracking.pushToDataLayer).toHaveBeenCalledWith({
                event: 'autocomplete',
                searchText: '',
                clickText: 'bar',
                resultsCount: 3,
                clickedResults: 'result 2 of 3'
            });
        });
    });

    describe('events for accordion with data-name attribute', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('accordions');
            testObj.accordionElement = testObj.scope.querySelector('#accordion-with-name');
            testObj.accordionModule = new Accordion(testObj.accordionElement);
            testObj.accordionModule.init();
        });

        it('should toggle the attribute value on accordion item buttons when they open or close', () => {
            const items = [].slice.call(testObj.accordionElement.querySelectorAll('.ds_accordion-item'));
            const itemButton = items[0].querySelector('.ds_accordion-item__button');
            const itemControl = items[0].querySelector('.ds_accordion-item__control');

            Tracking.add.accordions();

            let event = new Event('click');
            itemControl.checked = true;
            itemButton.dispatchEvent(event);

            expect(itemButton.getAttribute('data-accordion')).toEqual('accordion-foo-close-1');
        });

        it('should toggle the "open all" button to "close all" when all accordion items are open', () => {
            const items = [].slice.call(testObj.accordionElement.querySelectorAll('.ds_accordion-item'));
            const itemButton1 = items[0].querySelector('.ds_accordion-item__button');
            const itemControl1 = items[0].querySelector('.ds_accordion-item__control');
            const itemButton3 = items[2].querySelector('.ds_accordion-item__button');
            const itemControl3 = items[2].querySelector('.ds_accordion-item__control');
            const openAll = testObj.accordionElement.querySelector('.js-open-all');

            Tracking.add.accordions();

            // run through a number of open/close interactions
            let event = new Event('click');

            itemControl1.checked = true;
            itemButton1.dispatchEvent(event);
            expect(openAll.getAttribute('data-accordion')).toEqual('accordion-foo-open-all');

            // second item is already open

            itemControl3.checked = true;
            itemButton3.dispatchEvent(event);
            expect(openAll.getAttribute('data-accordion')).toEqual('accordion-foo-close-all');

            // and now back to open all
            itemControl1.checked = false;
            itemButton1.dispatchEvent(event);
            expect(openAll.getAttribute('data-accordion')).toEqual('accordion-foo-open-all');
        });

        it('should modify all panels\' data-attributes on click of "open all"', () => {
            const openAll = testObj.accordionElement.querySelector('.js-open-all');
            const buttons = [].slice.call(testObj.accordionElement.querySelectorAll('.ds_accordion-item__header-button'));

            Tracking.add.accordions();

            let event = new Event('click');

            // open them all
            openAll.dispatchEvent(event);
            buttons.forEach((button, index) => {
                expect(button.getAttribute('data-accordion')).toEqual(`accordion-foo-close-${index + 1}`);
            });

            // and now close them all
            openAll.dispatchEvent(event);
            buttons.forEach((button, index) => {
                expect(button.getAttribute('data-accordion')).toEqual(`accordion-foo-open-${index + 1}`);
            });
        });
    });

    describe('asides', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('asides');
        });

        it('should add a generated data attribute on links in asides without attributes already set', () => {
            const link = testObj.scope.querySelector('[data-unit="without-attribute"]');
            Tracking.add.asides();

            expect(link.getAttribute('data-navigation')).toEqual('link-related-1');
        });

        it('should NOT add a generated data attribute on links in asides with attributes already set', () => {
            const link = testObj.scope.querySelector('[data-unit="with-attribute"]');
            Tracking.add.asides();

            expect(link.getAttribute('data-navigation')).toEqual('link-related-foo');
        });
    });

    describe('back to top', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('back-to-top');
        });

        it('should add a data attribute on back to top links', () => {
            const link = testObj.scope.querySelector('.ds_back-to-top__button');
            Tracking.add.backToTop();

            expect(link.getAttribute('data-navigation')).toEqual('backtotop');
        });
    });

    describe('breadcrumbs', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('breadcrumbs');
        });

        it('should add data attributes to breadcrumb links, one-indexed', () => {
            const links = [].slice.call(testObj.scope.querySelectorAll('.ds_breadcrumbs__link'));
            Tracking.add.breadcrumbs();

            links.forEach((link, index) => {
                if (link.getAttribute('data-unit') === 'with-attribute') {
                    expect(link.getAttribute('data-navigation')).toEqual(`breadcrumb-foo`);
                } else {
                    expect(link.getAttribute('data-navigation')).toEqual(`breadcrumb-${index + 1}`);
                }
            });
        });
    });

    describe('cards', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('card');
        });

        it('should add data attributes to card links, one-indexed', () => {
            const links = [].slice.call(testObj.scope.querySelectorAll('.ds_card__link--cover'));
            Tracking.add.cards();

            links.forEach((link, index) => {
                if (link.getAttribute('data-unit') === 'with-attribute') {
                    expect(link.getAttribute('data-navigation')).toEqual(`card-foo`);
                } else {
                    expect(link.getAttribute('data-navigation')).toEqual(`card-${index + 1}`);
                }
            });
        });
    });

    describe('category lists', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('category-list');
        });

        it('should add data attributes to category item links, one-indexed', () => {
            const links = [].slice.call(testObj.scope.querySelectorAll('.ds_category-item__link'));
            Tracking.add.categoryLists();

            links.forEach((link, index) => {
                if (link.getAttribute('data-unit') === 'with-attribute') {
                    expect(link.getAttribute('data-navigation')).toEqual(`category-item-foo`);
                } else {
                    expect(link.getAttribute('data-navigation')).toEqual(`category-item-${index + 1}`);
                }
            });
        });
    });

    describe('confirmation messages', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('confirmation-message');
        });

        // links and buttons with and without attributes
        it('should add a data attribute on links in confirmation messages', () => {
            const links = [].slice.call(testObj.scope.querySelectorAll('a'));
            Tracking.add.confirmationMessages();

            expect(links[0].getAttribute('data-navigation')).toEqual('confirmation-link');
        });
    });

    describe('contact details', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('contact-details');
        });

        it('should add a generated data attribute on social media links without attributes already set', () => {
            const link = testObj.scope.querySelector('.ds_contact-details__social-link[data-unit="without-attribute"]');
            Tracking.add.contactDetails();

            expect(link.getAttribute('data-navigation')).toEqual('contact-details-youtube');
        });

        it('should NOT add a generated data attribute on social media links with attributes already set', () => {
            const link = testObj.scope.querySelector('.ds_contact-details__social-link[data-unit="with-attribute"]');
            Tracking.add.contactDetails();

            expect(link.getAttribute('data-navigation')).toEqual('contact-details-foo');
        });

        it('should add a generated data attribute on email links without attributes already set', () => {
            const link = testObj.scope.querySelector('a[href^="mailto"][data-unit="without-attribute"]');
            Tracking.add.contactDetails();

            expect(link.getAttribute('data-navigation')).toEqual('contact-details-email');
        });

        it('should NOT add a generated data attribute on email links with attributes already set', () => {
            const link = testObj.scope.querySelector('a[href^="mailto"][data-unit="with-attribute"]');
            Tracking.add.contactDetails();

            expect(link.getAttribute('data-navigation')).toEqual('contact-details-foo');
        });
    });

    describe('content navs', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('contents-nav');
        });

        it('should add a generated data attribute on contents nav links without attributes already set', () => {
            const link = testObj.scope.querySelector('.ds_contents-nav__link[data-unit="without-attribute"]');
            Tracking.add.contentNavs();

            // this is the second item in the list, hence the 2
            expect(link.getAttribute('data-navigation')).toEqual('contentsnav-2');
        });

        it('should NOT add a generated data attribute on contents nav links with attributes already set', () => {
            const link = testObj.scope.querySelector('.ds_contents-nav__link[data-unit="with-attribute"]');
            Tracking.add.contentNavs();

            expect(link.getAttribute('data-navigation')).toEqual('contentsnav-foo');
        });
    });

    describe('details', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('details');
        });

        it('should set a data-accordion of "detail-open" if a details element starts closed', () => {
            const details = testObj.scope.querySelector('details');
            const summary = details.querySelector('summary');
            Tracking.add.details();

            expect(summary.getAttribute('data-accordion')).toEqual('detail-open');
        });

        it('should set a data-accordion of "detail-close" if a details element starts open', () => {
            const details = testObj.scope.querySelector('details');
            const summary = details.querySelector('summary');
            details.setAttribute('open', 'open');
            Tracking.add.details();

            expect(summary.getAttribute('data-accordion')).toEqual('detail-close');
        });

        it('should set a toggle the data-accordion attribute between "open" and "close" when the details component is opened or closed', () => {
            const details = testObj.scope.querySelector('details');
            const summary = details.querySelector('summary');
            Tracking.add.details();

            let event = new Event('click');

            summary.dispatchEvent(event);
            expect(summary.getAttribute('data-accordion')).toEqual('detail-close');
        });

        it('should set a toggle the data-accordion attribute between "open" and "close" when the details component is opened or closed', () => {
            const details = testObj.scope.querySelector('details');
            const summary = details.querySelector('summary');
            details.setAttribute('open', 'open');
            Tracking.add.details();

            let event = new Event('click');

            summary.dispatchEvent(event);
            expect(summary.getAttribute('data-accordion')).toEqual('detail-open');
        });
    });

    describe('error messages', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('error-messages');
        });

        it('(RADIOS) should add a generated data attribute on error messages that uses the radio group name', () => {
            const radiosEl = testObj.scope.querySelector('[data-unit="radio"]');
            const messageEl = radiosEl.querySelector('.ds_question__error-message');
            Tracking.add.errorMessages();

            expect(messageEl.getAttribute('data-form')).toEqual('error-resolve');
        });

        it('(FIELD GROUPS) should add a generated data attribute on error messages that uses the field group name', () => {
            const fieldGroupEl = testObj.scope.querySelector('[data-unit="field-group"]');
            const messageEl = fieldGroupEl.querySelector('.ds_question__error-message');
            Tracking.add.errorMessages();

            expect(messageEl.getAttribute('data-form')).toEqual('error-cats-or-dogs-reason');
        });

        it('(DEFAULT) should add a generated data attribute on error messages that uses the input\'s name', () => {
            const defaultEl = testObj.scope.querySelector('[data-unit="default"]');
            const messageEl = defaultEl.querySelector('.ds_question__error-message');
            Tracking.add.errorMessages(defaultEl);

            expect(messageEl.getAttribute('data-form')).toEqual('error-more-detail');
        });

        it('should use a generated, one-indexed, attribute if the related field/group cannot be determined', () => {
            const defaultEl = testObj.scope.querySelector('[data-unit="default"]');
            const messageEl = defaultEl.querySelector('.ds_question__error-message');

            const input = defaultEl.querySelector('.ds_input');
            input.parentNode.removeChild(input);

            Tracking.add.errorMessages(defaultEl);

            expect(messageEl.getAttribute('data-form')).toEqual('error-1');
        });

        it('should NOT add a generated data attribute on error messages that already have one set', () => {
            const defaultEl = testObj.scope.querySelector('[data-unit="default"]');
            const messageEl = defaultEl.querySelector('.ds_question__error-message');
            messageEl.setAttribute('data-form', 'error-foo');
            Tracking.add.errorMessages(defaultEl);

            expect(messageEl.getAttribute('data-form')).toEqual('error-foo');
        });

        it('should NOT add a data attribute if there is no "ds_question" element (we do not know what the scope of the field is)', () => {
            const noQuestionEl = testObj.scope.querySelector('[data-unit="no-question"]');
            const messageEl = noQuestionEl.querySelector('.ds_question__error-message');
            Tracking.add.errorMessages(noQuestionEl);

            expect(messageEl.getAttribute('data-form')).toBeNull();
        });
    });

    describe('error summaries', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('error-summaries');
        });

        it('should add a generated data attribute on error summary links without attributes already set', () => {
            const link = testObj.scope.querySelector('a[data-unit="without-attribute"]');
            Tracking.add.errorSummaries();

            expect(link.getAttribute('data-form')).toEqual('error-topics');
        });

        it('should NOT add a generated data attribute on error summary links with attributes already set', () => {
            const link = testObj.scope.querySelector('a[data-unit="with-attribute"]');
            Tracking.add.errorSummaries();

            expect(link.getAttribute('data-form')).toEqual('error-foo');
        });
    });

    describe('external links', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('external-links');
        });

        it('should not add a data attribute to relative internal links', () => {
            const link = testObj.scope.querySelector('#internal-relative');
            Tracking.add.externalLinks(testObj.scope , testObj._window);
            expect(link.getAttribute('data-navigation')).not.toEqual('link-external');
        });

        it('should not add a data attribute to absolute internal links', () => {
            const link = testObj.scope.querySelector('#internal-absolute');
            Tracking.add.externalLinks(testObj.scope , testObj._window);
            expect(link.getAttribute('data-navigation')).not.toEqual('link-external');
        });

        it('should not add a data attribute to hash internal links (same page)', () => {
            const link = testObj.scope.querySelector('#internal-hash-same-page');
            Tracking.add.externalLinks(testObj.scope , testObj._window);
            expect(link.getAttribute('data-navigation')).not.toEqual('link-external');
        });

        it('should not add a data attribute to hash internal links (different page)', () => {
            const link = testObj.scope.querySelector('#internal-hash-new-page');
            Tracking.add.externalLinks(testObj.scope , testObj._window);
            expect(link.getAttribute('data-navigation')).not.toEqual('link-external');
        });

        it('should not add a data attribute to "tel:" links', () => {
            const link = testObj.scope.querySelector('#tel');
            Tracking.add.externalLinks(testObj.scope , testObj._window);
            expect(link.getAttribute('data-navigation')).not.toEqual('link-external');
        });

        it('should not add a data attribute to "mailto:" links', () => {
            const link = testObj.scope.querySelector('#mailto');
            Tracking.add.externalLinks(testObj.scope , testObj._window);
            expect(link.getAttribute('data-navigation')).not.toEqual('link-external');
        });

        it('should add a data attribute to links on other domains', () => {
            const link = testObj.scope.querySelector('#external');
            Tracking.add.externalLinks(testObj.scope , testObj._window);
            expect(link.getAttribute('data-navigation')).toEqual('link-external');
        });

        it('should add a data attribute to links on other subdomains', () => {
            const link = testObj.scope.querySelector('#external-subdomain');
            Tracking.add.externalLinks(testObj.scope , testObj._window);
            expect(link.getAttribute('data-navigation')).toEqual('link-external');
        });

    });

    describe('hide this page', () => {
        beforeEach(() => {
            testObj.tempHasPermission = window.storage.hasPermission;
            testObj.scope = document.getElementById('hide-this-page');
        });

        afterEach(() => {
            window.storage.hasPermission = testObj.tempHasPermission;
        });

        it('should add a data attribute on hide this page links', () => {
            const link = testObj.scope.querySelector('.ds_hide-page__button');
            Tracking.add.hideThisPage();

            expect(link.getAttribute('data-navigation')).toEqual('hide-this-page');
        });

        it('should push to the data layer when hide this page is triggered via keyboard ESC', () => {
            // mock storage object
            window.storage.hasPermission = function () {
                return true;
            }

            window.dataLayer = window.dataLayer || [];

            Tracking.add.hideThisPage();

            const event = document.createEvent('Event');
            event.keyCode = 27;
            event.initEvent('keyup');
            document.dispatchEvent(event);
            let dataLayerLength = window.dataLayer.length;
            expect(window.dataLayer[window.dataLayer.length - 1]).toEqual({ 'event': 'hide-this-page-keyboard' });

            event.keyCode = 28;
            event.initEvent('keyup');
            document.dispatchEvent(event);
            expect(window.dataLayer.length).toEqual(dataLayerLength);
            expect(window.dataLayer[window.dataLayer.length - 1]).toEqual({ 'event': 'hide-this-page-keyboard' });
        });
    });

    describe('inset texts', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('inset-text');
        });

        // links and buttons with and without attributes
        it('should add a data attribute on links in inset texts', () => {
            const links = [].slice.call(testObj.scope.querySelectorAll('a'));
            Tracking.add.insetTexts();

            expect(links[0].getAttribute('data-navigation')).toEqual('inset-link');
        });
    });

    describe('links', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('links');
        });

        it('should add a "data-section" attribute whose value is the text of the nearest preceding heading', () => {
            Tracking.add.links();

            const link4 = testObj.scope.querySelector('[data-unit="link-4"]');
            const link5 = testObj.scope.querySelector('[data-unit="link-5"]');

            expect(link4.dataset.section).toEqual('Section 3');

            // link 4 is nested inside a list
            expect(link5.dataset.section).toEqual('Section 3');
        });

        it('should not add a "data-section" attribute if no suitable section heading can be found', () => {
            Tracking.add.links();

            const link1 = testObj.scope.querySelector('[data-unit="link-1"]');

            expect(link1.dataset.section).toBeUndefined();
        });

        it('should look inside header-wrapping elements for section headings and add a "data-section" attribute if one is found', () => {
            Tracking.add.links();

            const link2 = testObj.scope.querySelector('[data-unit="link-2"]');
            expect(link2.dataset.section).toEqual('Section 1');
        });

        it('should look inside header-wrapping elements for section headings and NOT add a "data-section" attribute if one NOT is found', () => {
            Tracking.add.links();

            const link3 = testObj.scope.querySelector('[data-unit="link-3"]');

            // this should continue up the DOM tree to the next heading, i.e. section 1 in the fixture
            expect(link3.dataset.section).toEqual('Section 1');
        });
    });

    describe('metadata items', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('metadata');
        });

        it('should add a generated data attribute to links in metadata values', () => {
            const metadataItem = testObj.scope.querySelector('[data-unit="basic"]');
            Tracking.add.metadataItems(testObj.scope);

            const link1 = metadataItem.querySelector('[data-unit="link-1"]');
            const link2 = metadataItem.querySelector('[data-unit="link-2"]');

            expect(link1.getAttribute('data-navigation')).toEqual('foo-1');
            expect(link2.getAttribute('data-navigation')).toEqual('foo-2');
        });

        it('should fall back to a generated key for the data attribute if no key is present', () => {
            const metadataItem = testObj.scope.querySelector('[data-unit="no-key"]');
            Tracking.add.metadataItems(testObj.scope);

            const link1 = metadataItem.querySelector('[data-unit="link-1"]');
            const link2 = metadataItem.querySelector('[data-unit="link-2"]');

            expect(link1.getAttribute('data-navigation')).toEqual('metadata-1-1');
            expect(link2.getAttribute('data-navigation')).toEqual('metadata-1-2');
        });

        it('should NOT add a generated data attribute on metadata links with attributes already set', () => {
            const metadataItem = testObj.scope.querySelector('[data-unit="with-attribute"]');
            Tracking.add.metadataItems(testObj.scope);

            const link1 = metadataItem.querySelector('[data-unit="link-1"]');
            const link2 = metadataItem.querySelector('[data-unit="link-2"]');

            expect(link1.getAttribute('data-navigation')).toEqual('custom-attribute-1');
            expect(link2.getAttribute('data-navigation')).toEqual('custom-attribute-2');
        });
    });

    describe('notifications', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('notifications');
        });

        // links and buttons with and without attributes
        it('should add a generated data attribute on banner links without attributes already set', () => {
            const link = testObj.scope.querySelector('a[data-unit="without-attribute"]');
            Tracking.add.notifications();

            expect(link.getAttribute('data-banner')).toEqual('banner-mybanner-link');
        });

        it('should NOT add a generated data attribute on banner links with attributes already set', () => {
            const link = testObj.scope.querySelector('a[data-unit="with-attribute"]');
            Tracking.add.notifications();

            expect(link.getAttribute('data-banner')).toEqual('banner-foo');
        });

        it('should add a generated data attribute on banner buttons without attributes already set', () => {
            const button = testObj.scope.querySelector('.ds_button[data-unit="without-attribute"]');
            Tracking.add.notifications();

            expect(button.getAttribute('data-banner')).toEqual('banner-mybanner-auto-attribute');
        });

        it('should NOT add a generated data attribute on banner buttons with attributes already set', () => {
            const button = testObj.scope.querySelector('.ds_button[data-unit="with-attribute"]');
            Tracking.add.notifications();

            expect(button.getAttribute('data-banner')).toEqual('banner-preset');
        });

        it('should add a generated data attribute on banner close buttons without attributes already set', () => {
            const link = testObj.scope.querySelector('.ds_notification__close[data-unit="without-attribute"]');
            Tracking.add.notifications();

            expect(link.getAttribute('data-banner')).toEqual('banner-mybanner-close');
        });

        it('should NOT add a generated data attribute on banner close buttons with attributes already set', () => {
            const link = testObj.scope.querySelector('.ds_notification__close[data-unit="with-attribute"]');
            Tracking.add.notifications();

            expect(link.getAttribute('data-banner')).toEqual('banner-bar');
        });

        // banners with and without IDs
        it('should use the banner ID in data attributes if the banner has an ID', () => {
            const link = testObj.scope.querySelector('.ds_notification[data-unit="with-id"] a');
            Tracking.add.notifications();

            expect(link.getAttribute('data-banner')).toEqual('banner-mybanner-link');
        });

        it('should use the banner index (one-indexed) in data attributes if the banner does not have an ID', () => {
            const link = testObj.scope.querySelector('.ds_notification[data-unit="without-id"] a');
            Tracking.add.notifications();

            expect(link.getAttribute('data-banner')).toEqual('banner-2-link');
        });
    });

    describe('pagination', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('pagination');
        });

        it('should add a generated data attribute on pagination page links without attributes already set', () => {
            const link = testObj.scope.querySelector('a.ds_pagination__link[data-unit="without-attribute"]');
            Tracking.add.pagination();

            expect(link.getAttribute('data-search')).toEqual('pagination-11');
        });

        it('should NOT add a generated data attribute on pagination page links with attributes already set', () => {
            const link = testObj.scope.querySelector('a.ds_pagination__link[data-unit="with-attribute"]');
            Tracking.add.pagination();

            expect(link.getAttribute('data-search')).toEqual('pagination-foo');
        });

        it('should add a data attribute on pagination "load more" button without attribute already set', () => {
            const button = testObj.scope.querySelector('.ds_pagination__load-more button');
            Tracking.add.pagination();

            expect(button.getAttribute('data-search')).toEqual('pagination-more');
        });

        it('should NOT add a data attribute on pagination "load more" button with attribute already set', () => {
            const button = testObj.scope.querySelector('.ds_pagination__load-more button');
            button.setAttribute('data-search', 'pagination-bar');
            Tracking.add.pagination();

            expect(button.getAttribute('data-search')).toEqual('pagination-bar');
        });
    });

    describe('phase banners', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('phase-banners');
        });

        it('should add a generated data attribute on phase banner links without attributes already set', () => {
            const link = testObj.scope.querySelector('a[data-unit="without-attribute"]');
            Tracking.add.phaseBanners();

            expect(link.getAttribute('data-banner')).toEqual('banner-alpha-link');
        });

        it('should NOT add a generated data attribute on phase banner links with attributes already set', () => {
            const link = testObj.scope.querySelector('a[data-unit="with-attribute"]');
            Tracking.add.phaseBanners();

            expect(link.getAttribute('data-banner')).toEqual('banner-foo');
        });

        it('should use the phase banner\'s tag to identify the banner if present', () => {
            const link = testObj.scope.querySelector('a[data-unit="without-attribute"]');
            const tag = testObj.scope.querySelector('.ds_phase-banner__tag');
            tag.innerText = 'myphase';
            Tracking.add.phaseBanners();

            expect(link.getAttribute('data-banner')).toEqual('banner-myphase-link');
        });

        it('should use the "phase" to identify the banner if no tag is present', () => {
            const link = testObj.scope.querySelector('a[data-unit="without-attribute"]');
            const tag = testObj.scope.querySelector('.ds_phase-banner__tag');
            tag.parentNode.removeChild(tag);
            Tracking.add.phaseBanners();

            expect(link.getAttribute('data-banner')).toEqual('banner-phase-link');
        });
    });

    describe('search facets', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('search-facets');
        });

        it('should set a data attribute on facet links/buttons', () => {
            const link = testObj.scope.querySelector('a[data-unit="facet"]');
            Tracking.add.searchFacets();

            expect(link.getAttribute('data-button')).toEqual('button-filter-arts-culture-and-sport-remove');
        });
    });

    describe('search results', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('search-results');
            testObj.promoted = [].slice.call(testObj.scope.querySelectorAll('.ds_search-result--promoted'));
            testObj.notPromoted = [].slice.call(testObj.scope.querySelectorAll('.ds_search-result:not(.ds_search-result--promoted)'));
        });

        it('should set a generated data attribute on each PROMOTED result with the result`s position in the PROMOTED results, one-indexed', () => {
            Tracking.add.searchResults();

            testObj.promoted.forEach((item, index) => {
                const link = item.querySelector('.ds_search-result__link');
                expect(link.getAttribute('data-search')).toEqual(`search-promoted-${index+1}/${testObj.promoted.length}`);
            });
        });

        it('should set a generated data attribute on each NOT PROMOTED result with the result`s position in the NOT PROMOTED results, one-indexed', () => {
            Tracking.add.searchResults();

            testObj.notPromoted.forEach((item, index) => {
                const link = item.querySelector('.ds_search-result__link');
                expect(link.getAttribute('data-search')).toEqual(`search-result-${index+1}`);
            });
        });

        it('should include the total number of results from the data attribute if known', () => {
            const list = testObj.scope.querySelector('.ds_search-results__list');
            const count = 68;

            list.setAttribute('data-total', count);
            Tracking.add.searchResults();

            testObj.notPromoted.forEach((item, index) => {
                const link = item.querySelector('.ds_search-result__link');
                expect(link.getAttribute('data-search')).toEqual(`search-result-${index+1}/${count}`);
            });
        });

        it('should base the number of the search result on the start point of the list, if given', () => {
            const list = testObj.scope.querySelector('.ds_search-results__list');

            list.setAttribute('start', 11);
            Tracking.add.searchResults();

            testObj.notPromoted.forEach((item, index) => {
                const link = item.querySelector('.ds_search-result__link');
                expect(link.getAttribute('data-search')).toEqual(`search-result-${index+1+10}`);
            });
        });

        it('should not have syntax errors if there is no list of results', () => {
            const list = testObj.scope.querySelector('.ds_search-results__list');
            list.parentNode.removeChild(list);

            Tracking.add.searchResults();

            // note: no assertion, test success can be inferred from there being no execution errorsss
        });
    });

    describe('search suggestions', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('search-suggestions');
        });

        it('should set a generated data attribute on each suggestion with the suggestion`s position in the suggestions, one-indexed', () => {
            const links = [].slice.call(testObj.scope.querySelectorAll('a'));
            Tracking.add.searchSuggestions();

            expect(links[0].getAttribute('data-search')).toEqual('suggestion-result-1/2');
            expect(links[1].getAttribute('data-search')).toEqual('suggestion-result-2/2');
            // etc if more suggestions
        });
    });

    describe('search related', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('search-related');
        });

        it('should set a generated data attribute on each related item with the suggestion`s position in the list, one-indexed', () => {
            const links = [].slice.call(testObj.scope.querySelectorAll('a'));
            Tracking.add.searchRelated();

            expect(links[0].getAttribute('data-search')).toEqual('search-related-1/2');
            expect(links[1].getAttribute('data-search')).toEqual('search-related-2/2');
            // etc if more suggestions
        });
    });

    describe('sequential navs', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('sequential-navs');
        });

        it('should add a data attribute on sequential nav links without attributes already set', () => {
            const prev = testObj.scope.querySelector('.ds_sequential-nav__item--prev > .ds_sequential-nav__button');
            const next = testObj.scope.querySelector('.ds_sequential-nav__item--next > .ds_sequential-nav__button');
            Tracking.add.sequentialNavs();

            expect(prev.getAttribute('data-navigation')).toEqual('sequential-previous');
            expect(next.getAttribute('data-navigation')).toEqual('sequential-next');
        });

        it('should NOT add a data attribute on sequential nav links with attributes already set', () => {
            const prev = testObj.scope.querySelector('.ds_sequential-nav__item--prev > .ds_sequential-nav__button');
            const next = testObj.scope.querySelector('.ds_sequential-nav__item--next > .ds_sequential-nav__button');
            prev.setAttribute('data-navigation', 'sequential-foo');
            next.setAttribute('data-navigation', 'sequential-bar');
            Tracking.add.sequentialNavs();

            expect(prev.getAttribute('data-navigation')).toEqual('sequential-foo');
            expect(next.getAttribute('data-navigation')).toEqual('sequential-bar');
        });
    });

    describe('side navs', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('side-navigation');
        });

        it('should add a generated data attribute on side nav links indicating their position and depth', () => {
            testObj.sideNavModule = new SideNavigation(testObj.scope.querySelector('.ds_side-navigation'));
            testObj.sideNavModule.init();

            Tracking.add.sideNavs();

            // clumsy looping to test the fixture
            const topItemLinks = [].slice.call(document.querySelectorAll('[data-unit="depth-1"] > .ds_side-navigation__item > .ds_side-navigation__link'));

            topItemLinks.forEach((topLink, topIndex) => {
                expect(topLink.getAttribute('data-navigation')).toEqual(`sidenav-${topIndex + 1}`);

                if (topLink.parentNode.querySelector('[data-unit="depth-2"]')) {
                    const subItemLinks = [].slice.call(topLink.parentNode.querySelectorAll('[data-unit="depth-2"] > .ds_side-navigation__item > .ds_side-navigation__link'));

                    subItemLinks.forEach((subItemLink, subIndex) => {
                        expect(subItemLink.getAttribute('data-navigation')).toEqual(`sidenav-${topIndex + 1}-${subIndex + 1}`);

                        if (subItemLink.parentNode.querySelector('[data-unit="depth-3"]')) {
                            const subSubItemLinks = [].slice.call(subItemLink.parentNode.querySelectorAll('[data-unit="depth-3"] > .ds_side-navigation__item > .ds_side-navigation__link'));

                            subSubItemLinks.forEach((subSubItemLink, subSubIndex) => {
                                expect(subSubItemLink.getAttribute('data-navigation')).toEqual(`sidenav-${topIndex + 1}-${subIndex + 1}-${subSubIndex + 1}`);
                            });
                        }
                    });
                }
            });
        });

        it('should set an open/close attribute on the mobile nav open/close button', () => {
            testObj.sideNavModule = new SideNavigation(testObj.scope.querySelector('.ds_side-navigation'));
            testObj.sideNavModule.init();

            const expand = testObj.scope.querySelector('button.ds_side-navigation__expand');

            Tracking.add.sideNavs();

            expect(expand.getAttribute('data-navigation')).toEqual('navigation-open');
        });

        it('should NOT try to add attributes to the open/close button if there is no open/close button', () => {
            testObj.sideNavModule = new SideNavigation(testObj.scope.querySelector('.ds_side-navigation'));
            testObj.sideNavModule.init();

            const expand = testObj.scope.querySelector('button.ds_side-navigation__expand');
            expand.parentNode.removeChild(expand);

            Tracking.add.sideNavs();

            // note: no assertion, test success can be inferred from there being no execution errors
        });

        it('should alter the open/close attribute on the mobile nav open/close button when toggled', () => {
            testObj.sideNavModule = new SideNavigation(testObj.scope.querySelector('.ds_side-navigation'));
            testObj.sideNavModule.init();

            const button = testObj.scope.querySelector('.js-side-navigation-button');

            Tracking.add.sideNavs();

            expect(button.getAttribute('data-navigation')).toEqual('navigation-open');

            let event = new Event('click');

            button.dispatchEvent(event);

            expect(button.getAttribute('data-navigation')).toEqual('navigation-close');
        });
    });

    describe('site branding', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('site-branding');
        });

        it('should add a data attribute to the logo', () => {
            const logo = testObj.scope.querySelector('.ds_site-branding__logo');
            Tracking.add.siteBranding();

            expect(logo.getAttribute('data-header')).toEqual('header-logo');
        });

        it('should NOT add a data attribute to a logo with attributes already set', () => {
            const logo = testObj.scope.querySelector('.ds_site-branding__logo');
            logo.setAttribute('data-header', 'header-foo');
            Tracking.add.siteBranding();

            expect(logo.getAttribute('data-header')).toEqual('header-foo');
        });

        it('should NOT add a data attribute to the logo if one is not present', () => {
            const logo = testObj.scope.querySelector('.ds_site-branding__logo');
            logo.parentNode.removeChild(logo);
            Tracking.add.siteBranding();

            // note: no assertion, test success can be inferred from there being no execution errors
        });

        it('should add a data attribute to the title', () => {
            const title = testObj.scope.querySelector('.ds_site-branding__title');
            Tracking.add.siteBranding();

            expect(title.getAttribute('data-header')).toEqual('header-title');
        });

        it('should NOT add a data attribute to a title with attributes already set', () => {
            const title = testObj.scope.querySelector('.ds_site-branding__title');
            title.setAttribute('data-header', 'header-bar');
            Tracking.add.siteBranding();

            expect(title.getAttribute('data-header')).toEqual('header-bar');
        });

        it('should NOT add a data attribute to the title if one is not present', () => {
            const title = testObj.scope.querySelector('.ds_site-branding__title');
            title.parentNode.removeChild(title);
            Tracking.add.siteBranding();

            // note: no assertion, test success can be inferred from there being no execution errors
        });
    });

    describe('site footer', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('site-footer');
        });

        it('should add a data attribute to the org logo', () => {
            const logo = testObj.scope.querySelector('.ds_site-footer__org-link');
            Tracking.add.siteFooter();

            expect(logo.getAttribute('data-footer')).toEqual('footer-logo');
        });

        it('should NOT add a data attribute to an org logo with attributes already set', () => {
            const logo = testObj.scope.querySelector('.ds_site-footer__org-link');
            logo.setAttribute('data-footer', 'footer-foo');
            Tracking.add.siteFooter();

            expect(logo.getAttribute('data-footer')).toEqual('footer-foo');
        });

        it('should add a data attribute to the copyright links', () => {
            const link1 = testObj.scope.querySelector('.ds_site-footer__copyright a.ds_site-footer__copyright-logo');
            const link2 = testObj.scope.querySelector('.ds_site-footer__copyright a:not(.ds_site-footer__copyright-logo)');
            Tracking.add.siteFooter();

            expect(link1.getAttribute('data-footer')).toEqual('footer-copyright');
            expect(link2.getAttribute('data-footer')).toEqual('footer-copyright');
        });

        it('should NOT add a data attribute to a copyright links with attributes already set', () => {
            const link1 = testObj.scope.querySelector('.ds_site-footer__copyright a.ds_site-footer__copyright-logo');
            const link2 = testObj.scope.querySelector('.ds_site-footer__copyright a:not(.ds_site-footer__copyright-logo)');
            link1.setAttribute('data-footer', 'footer-bar');
            link2.setAttribute('data-footer', 'footer-baz');
            Tracking.add.siteFooter();

            expect(link1.getAttribute('data-footer')).toEqual('footer-bar');
            expect(link2.getAttribute('data-footer')).toEqual('footer-baz');
        });

        it('should add a generated data attribute to links in footer nav lists (one-indexed)', () => {
            const links = [].slice.call(testObj.scope.querySelectorAll('.ds_site-footer__site-items a'));
            Tracking.add.siteFooter();

            expect(links[0].getAttribute('data-footer')).toEqual('footer-link-1');
            expect(links[1].getAttribute('data-footer')).toEqual('footer-link-2');
        });

        it('should NOT add a generated data attribute to links in footer nav lists with attribute already set', () => {
            const links = [].slice.call(testObj.scope.querySelectorAll('.ds_site-footer__site-items a'));
            links[0].setAttribute('data-footer', 'footer-foo');
            links[1].setAttribute('data-footer', 'footer-bar');
            Tracking.add.siteFooter();

            expect(links[0].getAttribute('data-footer')).toEqual('footer-foo');
            expect(links[1].getAttribute('data-footer')).toEqual('footer-bar');
        });
    });

    describe('site navigation', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('site-navigation');
        });

        describe('mobile nav', () => {
            beforeEach(() => {
                testObj.nav = testObj.scope.querySelector('.ds_site-navigation--mobile');
            });

            it('should add a generated data attribute to mobile navigation links (one-indexed)', () => {
                const links = [].slice.call(testObj.nav.querySelectorAll('.ds_site-navigation__link'));

                Tracking.add.siteNavigation();

                expect(links[0].getAttribute('data-header')).toEqual('header-link-1');
                expect(links[1].getAttribute('data-header')).toEqual('header-link-2');
                expect(links[2].getAttribute('data-header')).toEqual('header-link-3');
                expect(links[3].getAttribute('data-header')).toEqual('header-link-4');
            });

            it('should NOT add a generated data attribute to mobile navigation links with attributes already set', () => {
                const links = [].slice.call(testObj.nav.querySelectorAll('.ds_site-navigation__link'));
                links[0].setAttribute('data-header', 'header-foo');

                Tracking.add.siteNavigation();

                expect(links[0].getAttribute('data-header')).toEqual('header-foo');
            });

            it('should add a device data attribute to mobile navigation links', () => {
                const links = [].slice.call(testObj.nav.querySelectorAll('.ds_site-navigation__link'));

                Tracking.add.siteNavigation();

                expect(links[0].getAttribute('data-device')).toEqual('mobile');
            });

            it('should NOT add a device data attribute to mobile navigation links with attributes already set', () => {
                const links = [].slice.call(testObj.nav.querySelectorAll('.ds_site-navigation__link'));
                links[0].setAttribute('data-device', 'foo');

                Tracking.add.siteNavigation();

                expect(links[0].getAttribute('data-device')).toEqual('foo');
            });

            it('should add a data attribute to the mobile nav\'s toggle button if present', () => {
                Tracking.add.siteNavigation();
                const toggle = testObj.scope.querySelector('.js-toggle-menu');

                expect(toggle.getAttribute('data-header')).toEqual('header-menu-toggle');
            });

            it('should NOT a data attribute to the mobile nav\'s toggle button if NOT present', () => {
                const toggle = testObj.scope.querySelector('.js-toggle-menu');
                toggle.parentNode.removeChild(toggle);

                Tracking.add.siteNavigation();

                // note: no assertion, test success can be inferred from there being no execution errors
            });
        });

        describe('desktop nav', () => {
            beforeEach(() => {
                testObj.nav = testObj.scope.querySelector('.ds_site-navigation:not(.ds_site-navigation--mobile)');
            });

            it ('should add a generated data attribute to site navigation links (one-indexed)', () => {
                const links = [].slice.call(testObj.nav.querySelectorAll('.ds_site-navigation__link'));

                Tracking.add.siteNavigation();

                expect(links[0].getAttribute('data-header')).toEqual('header-link-1');
                expect(links[1].getAttribute('data-header')).toEqual('header-link-2');
                expect(links[2].getAttribute('data-header')).toEqual('header-link-3');
                expect(links[3].getAttribute('data-header')).toEqual('header-link-4');
            });

            it ('should NOT add a generated data attribute to site navigation links with attributes already set', () => {
                const links = [].slice.call(testObj.nav.querySelectorAll('.ds_site-navigation__link'));
                links[0].setAttribute('data-header', 'header-bar');

                Tracking.add.siteNavigation();

                expect(links[0].getAttribute('data-header')).toEqual('header-bar');
            });

            it('should add a device data attribute to site navigation links', () => {
                const links = [].slice.call(testObj.nav.querySelectorAll('.ds_site-navigation__link'));

                Tracking.add.siteNavigation();

                expect(links[0].getAttribute('data-device')).toEqual('desktop');
            });

            it('should NOT add a device data attribute to site navigation links with attributes already set', () => {
                const links = [].slice.call(testObj.nav.querySelectorAll('.ds_site-navigation__link'));
                links[0].setAttribute('data-device', 'bar');

                Tracking.add.siteNavigation();

                expect(links[0].getAttribute('data-device')).toEqual('bar');
            });
        });
    });

    describe('skip links', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('skip-links');
        });

        it('should add a generated data attribute on skip links without attributes already set', () => {
            const link = testObj.scope.querySelector('.ds_skip-links__link[data-unit="without-attribute"]');
            Tracking.add.skipLinks();

            // this is the second item in the list, hence the 2
            expect(link.getAttribute('data-navigation')).toEqual('skip-link-1');
        });

        it('should NOT add a generated data attribute on skip links links with attributes already set', () => {
            const link = testObj.scope.querySelector('.ds_skip-links__link[data-unit="with-attribute"]');
            Tracking.add.skipLinks();

            expect(link.getAttribute('data-navigation')).toEqual('skip-link-foo');
        });
    });

    describe('step navigation', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('step-navigation');
        });

        it('should set data attributes on each link in a "part of" top bar', () => {
            const links = [].slice.call(testObj.scope.querySelectorAll('.ds_step-navigation-top a'));
            Tracking.add.stepNavigation();

            expect(links[0].getAttribute('data-navigation')).toEqual('partof-header');
            expect(links[1].getAttribute('data-navigation')).toEqual('partof-header');
        });

        it('should set a data attribute the sidebar "part of" link', () => {
            const link = testObj.scope.querySelector('.ds_step-navigation__title-link');
            Tracking.add.stepNavigation();

            expect(link.getAttribute('data-navigation')).toEqual('partof-sidebar');
        });
    });

    describe('summary card and summary list', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('summary-card');
        });

        it('should set data attributes on each action button or link in the summary card header', () => {
            const links = [].slice.call(testObj.scope.querySelectorAll('.ds_summary-card__actions-list-item a, .ds_summary-card__actions-list-item button'));
            Tracking.add.summaryCard();

            expect(links[0].getAttribute('data-navigation')).toEqual('navigation-change-1');
            expect(links[1].getAttribute('data-button')).toEqual('button-delete-1');
        });

        it('should set data attributes on each action button or link in the summary list', () => {
            const links = [].slice.call(testObj.scope.querySelectorAll('.ds_summary-list__actions a, .ds_summary-list__actions button'));
            Tracking.add.summaryList();

            expect(links[0].getAttribute('data-navigation')).toEqual('navigation-change-have-you-had-the-grant-3-times-or-more-since-1-may-2022');
            expect(links[1].getAttribute('data-navigation')).toEqual('navigation-change-which-council-area-do-you-live-in');
            expect(links[2].getAttribute('data-navigation')).toEqual('navigation-view-which-council-area-do-you-live-in');
            expect(links[3].getAttribute('data-button')).toEqual('button-change-do-you-work');
            expect(links[4].getAttribute('data-button')).toEqual('button-change-will-you-lose-earnings-because-you-need-to-self-isolate');
            expect(links[5].getAttribute('data-button')).toEqual('button-remove-will-you-lose-earnings-because-you-need-to-self-isolate');
        });

        it('should remove redundant data attributes on each action button in the summary card header', () => {
            const links = [].slice.call(testObj.scope.querySelectorAll('.ds_summary-card__actions-list-item button'));
            Tracking.add.summaryCard();

            expect(links[0].getAttribute('data-button')).toBeUndefined;
        });

        it('should remove redundant data attributes on each action button in the summary list', () => {
            const links = [].slice.call(testObj.scope.querySelectorAll('.ds_summary-list__actions button'));
            Tracking.add.summaryList();

            expect(links[0].getAttribute('data-button')).toBeUndefined;
            expect(links[1].getAttribute('data-button')).toBeUndefined;
            expect(links[2].getAttribute('data-button')).toBeUndefined;
        });

    });

    describe('tabs', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('tab');
        });

        it('should add a data attribute on tabs', () => {
            const links = [].slice.call(testObj.scope.querySelectorAll('.ds_tabs__tab-link'));
            Tracking.add.tabs();

            expect(links[0].getAttribute('data-navigation')).toEqual('tab-link-1-1');
            expect(links[1].getAttribute('data-navigation')).toEqual('tab-link-1-2');
            expect(links[2].getAttribute('data-navigation')).toEqual('tab-link-1-3');
            expect(links[3].getAttribute('data-navigation')).toEqual('tab-link-1-4');
        });

        it('should NOT add a generated data attribute on tabs with attributes already set', () => {
            Tracking.add.tabs();
            // Select the first tab link
            const link = testObj.scope.querySelector('.ds_tabs__tab-link[data-navigation="tab-link-1-1"]');
            // Change attribute and call tracking function again
            link.setAttribute('data-navigation',"tab-link-foo");
            Tracking.add.tabs();
            // Check attribute has not changed
            expect(link.getAttribute('data-navigation')).toEqual('tab-link-foo');
        });
    });

    describe('tabNavigation', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('tab-navigation');
        });

        it('should add a data attribute on tabs', () => {
            const links = [].slice.call(testObj.scope.querySelectorAll('.ds_tabs__tab-link'));
            Tracking.add.tabs();

            expect(links[0].getAttribute('data-navigation')).toEqual('tab-link-2-1');
            expect(links[1].getAttribute('data-navigation')).toEqual('tab-link-2-2');
            expect(links[2].getAttribute('data-navigation')).toEqual('tab-link-2-3');
        });

        it('should NOT add a generated data attribute on tabs with attributes already set', () => {
            Tracking.add.tabs();
            // Select the first tab link
            const link = testObj.scope.querySelector('.ds_tabs__tab-link[data-navigation="tab-link-2-1"]');
            // Change attribute and call tracking function again
            link.setAttribute('data-navigation',"tab-link-foo");
            Tracking.add.tabs();
            // Check attribute has not changed
            expect(link.getAttribute('data-navigation')).toEqual('tab-link-foo');
        });
    });

    describe('task list', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('tasklist');
        });

        it('should add a generated data attribute on task links without attributes already set', () => {
            const link = testObj.scope.querySelector('.ds_task-list__task-link[data-unit="without-attribute"]');
            Tracking.add.taskList();

            expect(link.getAttribute('data-navigation')).toEqual('tasklist');
        });

        it('should NOT add a generated data attribute on task links with attributes already set', () => {
            const link = testObj.scope.querySelector('.ds_task-list__task-link[data-unit="with-attribute"]');
            Tracking.add.taskList();

            expect(link.getAttribute('data-navigation')).toEqual('task-link-foo');
        });

        it('should add a generated data attribute on task list "skip" links without attributes already set', () => {
            const link = testObj.scope.querySelector('.js-task-list-skip-link');
            link.removeAttribute('data-navigation');

            Tracking.add.taskList();

            expect(link.getAttribute('data-navigation')).toEqual('tasklist-skip');
        });

        it('should NOT add a generated data attribute on task list "skip" links with attributes already set', () => {
            const link = testObj.scope.querySelector('.js-task-list-skip-link');
            Tracking.add.taskList();

            expect(link.getAttribute('data-navigation')).toEqual('task-skip-link-foo');
        });
    });


    describe('warning texts', () => {
        beforeEach(() => {
            testObj.scope = document.getElementById('warning-text');
        });

        // links and buttons with and without attributes
        it('should add a data attribute on links in warning texts', () => {
            const links = [].slice.call(testObj.scope.querySelectorAll('a'));
            Tracking.add.warningTexts();

            expect(links[0].getAttribute('data-navigation')).toEqual('warning-link');
        });
    });

    // causes mouse click tracking tests to fail intermittently
    xdescribe('init all', () => {
        it('should set up tracking on every defined component', () => {
            for (const [key] of Object.entries(Tracking.add)) {
                spyOn(Tracking.add, key);
            }

            Tracking.init();

            for (const [key] of Object.entries(Tracking.add)) {
                expect(Tracking.add[key]).toHaveBeenCalled();
            }
        });

        it('should act on the whole document by default', () => {
            // spot checking with just one component
            spyOn(Tracking.add, 'accordions');

            Tracking.init();

            expect(Tracking.add.accordions).toHaveBeenCalledWith(document);
        });

        it('should act on only a container element if specified', () => {
            // spot checking with just one component
            spyOn(Tracking.add, 'accordions');
            const accordionEl = document.querySelector('#accordions');

            Tracking.init(accordionEl);

            expect(Tracking.add.accordions).toHaveBeenCalledWith(accordionEl);
        });
    });

    describe('include parent', () => {
        it('should include the scope element itself if it is relevant', () => {
            testObj.scope = document.getElementById('include-parent');

            const elements = Tracking.gatherElements('ds_accordion', testObj.scope);

            expect(elements.length).toEqual(2);
        });
    });

    describe('push to data layer', () => {
        beforeEach(() => {
            testObj.tempHasPermission = window.storage.hasPermission;
            window.dataLayer = [];
        });

        afterEach(() => {
            window.storage.hasPermission = testObj.tempHasPermission;
        });

        it('should push items to the data layer if analytics/statistics cookies are enabled', () => {
            // mock storage object
            window.storage.hasPermission = function () {
                return true;
            }

            const trackingObject = { foo: 'bar' };

            Tracking.pushToDataLayer(trackingObject);

            expect(window.dataLayer).toEqual([trackingObject]);
        });

        it('should NOT push items to the deta layer if analytics/statistics cookies are disabled', () => {
            window.storage.hasPermission = function () {
                return false;
            }

            Tracking.pushToDataLayer({ foo: 'bar' });
            expect(window.dataLayer).toEqual([]);
        });
    })
});
