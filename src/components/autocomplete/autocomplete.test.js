let testObj = {};

jasmine.getFixtures().fixturesPath = 'base/src/';

import Autocomplete from './autocomplete';

const testData = [
    {
        "key": "ZERO marine",
        "displayText": "ZERO marine",
        "type": "T",
        "weight": "421.753",
        "category": "",
        "cat_t": "",
        "action": "",
        "action_t": "S"
    },
    {
        "key": "ONE marine scotland science directory",
        "displayText": "ONE marine scotland science directory",
        "type": "T",
        "weight": "158",
        "category": "",
        "cat_t": "",
        "action": "",
        "action_t": "S"
    },
    {
        "key": "TWO marine plan - gov scot",
        "displayText": "TWO scotland's national marine plan - gov scot",
        "type": "T",
        "weight": "47",
        "category": "",
        "cat_t": "",
        "action": "",
        "action_t": "S"
    }
];

const mockPromiseRequest = function () {
    return Promise.resolve(testData);
};

describe('"autocomplete" component', () => {
    beforeEach(() => {
        loadFixtures('components/autocomplete/autocomplete.html');
        testObj.autocompleteElement = document.querySelector('#autocomplete');
    });

    describe('setting up', () => {
        it('should allow a custom endpoint URL to be provided', () => {
            const myEndpointUrl = '/my/endpoint/url';

            const autocompleteModule = new Autocomplete(testObj.autocompleteElement, myEndpointUrl);

            expect(autocompleteModule.endpointUrl).toEqual(myEndpointUrl);
        });

        it('should allow a custom mapping function to be provided', () => {
            const myMappingFunction = function (name) {return 'hello ' + name};

            const autocompleteModule = new Autocomplete(testObj.autocompleteElement, 'endpointUrl', {
                suggestionMappingFunction: myMappingFunction,
            });

            expect(autocompleteModule.suggestionMappingFunction('bob')).toEqual(myMappingFunction('bob'));
        });
    });

    describe('focus with content on the input element', () => {
        beforeEach(() => {
            testObj.autocompleteModule = new Autocomplete(testObj.autocompleteElement, 'endpointUrl');
        });

        it('should do nothing if the input element has no content', () => {
            spyOn(testObj.autocompleteModule, 'fetchSuggestions').and.returnValue(Promise.resolve(testData));
            spyOn(testObj.autocompleteModule, 'showSuggestions');
            testObj.autocompleteModule.init();

            let event = new Event('focus');
            testObj.autocompleteModule.inputElement.dispatchEvent(event);

            expect(testObj.autocompleteModule.fetchSuggestions).not.toHaveBeenCalled();
            expect(testObj.autocompleteModule.showSuggestions).not.toHaveBeenCalled();
        });

        it('should show a list of cached suggestions if one is in memory', () => {
            spyOn(testObj.autocompleteModule, 'showSuggestions');
            testObj.autocompleteModule.suggestions = testData;

            testObj.autocompleteModule.inputElement.value = 'foo';
            testObj.autocompleteModule.init();

            let event = new Event('focus');
            testObj.autocompleteModule.inputElement.dispatchEvent(event);

            expect(testObj.autocompleteModule.showSuggestions).toHaveBeenCalledWith(testObj.autocompleteModule.suggestions);
        });

        it('should fetch a list of suggestions if there are no cached suggestions', () => {
            spyOn(testObj.autocompleteModule, 'fetchSuggestions').and.returnValue(Promise.resolve(testData));

            testObj.autocompleteModule.inputElement.value = 'foo';
            testObj.autocompleteModule.init();

            let event = new Event('focus');
            testObj.autocompleteModule.inputElement.dispatchEvent(event);

            expect(testObj.autocompleteModule.fetchSuggestions).toHaveBeenCalled();
        });
    });

    describe('fetching suggestions', () => {
        it('should apply a mapping function to the returned data so the data can be transformed to an expected format', () => {
            testObj.autocompleteModule = new Autocomplete(testObj.autocompleteElement, 'endpointUrl', {
                suggestionMappingFunction: function(suggestions) {
                    return suggestions.map(suggestion => ({
                        key: suggestion.id,
                        displayText: suggestion.text,
                        weight: suggestion.score,
                        type: suggestion.type,
                        category: suggestion.cat
                    }));
                }
            });

            const sampleData = [{
                id: 'sugg1',
                text: 'Suggestion one',
                score: 0.489,
                type: 'T',
                cat: 'news'
            },
            {
                id: 'sugg2',
                text: 'Suggestion two',
                score: 0.312,
                type: 'T',
                cat: null
            }];

            const mockPromiseRequest2 = function () {
                return Promise.resolve(sampleData);
            };

            testObj.autocompleteModule.PromiseRequest = mockPromiseRequest2;

            testObj.autocompleteModule.fetchSuggestions().then((suggestions) => {
                const expectedSuggestion = {
                    key: 'sugg1',
                    displayText: 'Suggestion one',
                    weight: 0.489,
                    type: 'T',
                    category: 'news'
                };

                expect(suggestions[0]).toEqual(expectedSuggestion);
            });

            testObj.autocompleteModule.PromiseRequest = mockPromiseRequest;
        });
    });

    describe('navigating through suggestions', () => {
        describe('when a suggestion list is shown', () => {
            beforeEach(() => {
                testObj.autocompleteElement = document.querySelector('#autocomplete');
                testObj.autocompleteModule = new Autocomplete(testObj.autocompleteElement, 'endpointUrl');
            });

            it('should select the next suggestion in the list when the DOWN key is pressed', () => {
                testObj.autocompleteModule.suggestions = testData;
                testObj.autocompleteModule.inputElement.value = 'foo';
                testObj.autocompleteModule.init();
                let focusEvent = new Event('focus');
                testObj.autocompleteModule.inputElement.dispatchEvent(focusEvent);

                let event = new KeyboardEvent('keydown', { key: 'ArrowDown'});
                for (let i = 0, il = testObj.autocompleteModule.suggestions.length; i < il; i++) {
                    testObj.autocompleteModule.inputElement.dispatchEvent(event);
                    expect(testObj.autocompleteModule.suggestions[i].active).toBeTruthy();
                    expect(document.querySelector('.active').innerText).toEqual(testData[i].displayText);
                }
            });

            it('should select the previous suggestion in the list when the UP key is pressed', () => {
                testObj.autocompleteModule.suggestions = testData;
                testObj.autocompleteModule.inputElement.value = 'foo';
                testObj.autocompleteModule.selectedSuggestion = 0;
                testObj.autocompleteModule.init();
                let focusEvent = new Event('focus');
                testObj.autocompleteModule.inputElement.dispatchEvent(focusEvent);

                let event = new KeyboardEvent('keydown', { key: 'ArrowUp'});
                for (let i = testObj.autocompleteModule.suggestions.length - 1; i > -1; i--) {
                    testObj.autocompleteModule.inputElement.dispatchEvent(event);
                    expect(testObj.autocompleteModule.suggestions[i].active).toBeTruthy();
                    expect(document.querySelector('.active').innerText).toEqual(testData[i].displayText);
                }
            });

            it('should loop to the beginning of the list when the DOWN key is pressed while on the last item in the list', () => {
                testObj.autocompleteModule.suggestions = testData;
                testObj.autocompleteModule.inputElement.value = 'foo';
                testObj.autocompleteModule.selectedSuggestion = testData.length - 1;
                testObj.autocompleteModule.init();
                let focusEvent = new Event('focus');
                testObj.autocompleteModule.inputElement.dispatchEvent(focusEvent);

                let event = new KeyboardEvent('keydown', { key: 'ArrowDown'});
                testObj.autocompleteModule.inputElement.dispatchEvent(event);

                expect(testObj.autocompleteModule.suggestions[0].active).toBeTruthy();
                expect(document.querySelector('.active').innerText).toEqual(testData[0].displayText);
            });

            it('should loop to the beginning of the list when the UP key is pressed while on the first item in the list', () => {
                testObj.autocompleteModule.suggestions = testData;
                testObj.autocompleteModule.inputElement.value = 'foo';
                testObj.autocompleteModule.selectedSuggestion = 0;
                testObj.autocompleteModule.init();
                let focusEvent = new Event('focus');
                testObj.autocompleteModule.inputElement.dispatchEvent(focusEvent);

                let event = new KeyboardEvent('keydown', { key: 'ArrowUp'});
                testObj.autocompleteModule.inputElement.dispatchEvent(event);

                expect(testObj.autocompleteModule.suggestions[testData.length - 1].active).toBeTruthy();
                expect(document.querySelector('.active').innerText).toEqual(testData[testData.length - 1].displayText);
            });

            it('should update the input element and close the suggestion list when the ENTER key is pressed', () => {
                testObj.autocompleteModule.suggestions = testData;
                testObj.autocompleteModule.inputElement.value = 'foo';
                testObj.autocompleteModule.selectedSuggestion = -1;
                testObj.autocompleteModule.init();
                let focusEvent = new Event('focus');
                testObj.autocompleteModule.inputElement.dispatchEvent(focusEvent);

                let event = new KeyboardEvent('keydown', { key: 'ArrowDown'});
                testObj.autocompleteModule.inputElement.dispatchEvent(event);

                const selectedItemText = document.querySelector('.active').innerText;

                event = new KeyboardEvent('keydown', { key: 'Enter' });
                testObj.autocompleteModule.inputElement.dispatchEvent(event);

                expect(testObj.autocompleteModule.inputElement.value).toEqual(selectedItemText);
            });

            it('should close the suggestion list when the ESC key is pressed', () => {
                testObj.autocompleteModule.suggestions = testData;
                testObj.autocompleteModule.inputElement.value = 'foo';
                testObj.autocompleteModule.selectedSuggestion = testData.length - 1;
                testObj.autocompleteModule.init();
                let focusEvent = new Event('focus');
                testObj.autocompleteModule.inputElement.dispatchEvent(focusEvent);

                let event = new KeyboardEvent('keydown', { key: 'Escape'});
                testObj.autocompleteModule.inputElement.dispatchEvent(event);

                expect(testObj.autocompleteModule.listBoxElement.children.length).toEqual(0);
                expect(testObj.autocompleteModule.inputElement.value).toEqual('');
            });
        });
    });

    describe('typing into the autocomplete', () => {
        beforeEach(() => {
            testObj.autocompleteElement = document.querySelector('#autocomplete');
            testObj.autocompleteModule = new Autocomplete(testObj.autocompleteElement, 'endpointUrl');
            testObj.autocompleteModule.init();
            let focusEvent = new Event('focus');
            testObj.autocompleteModule.inputElement.dispatchEvent(focusEvent);
        });

        it('should fetch and display autocomplete suggestions', (done) => {
            spyOn(testObj.autocompleteModule, 'fetchSuggestions').and.callThrough();
            spyOn(testObj.autocompleteModule, 'showSuggestions').and.callThrough();

            testObj.autocompleteModule.PromiseRequest = mockPromiseRequest;

            let event = new KeyboardEvent('keydown', { key: 'KeyM'});
            testObj.autocompleteModule.inputElement.dispatchEvent(event);
            event = new KeyboardEvent('keydown', { key: 'KeyA'});
            testObj.autocompleteModule.inputElement.dispatchEvent(event);
            event = new KeyboardEvent('keydown', { key: 'KeyR'});
            testObj.autocompleteModule.inputElement.dispatchEvent(event);
            testObj.autocompleteModule.inputElement.value = 'mar';

            let event2 = new KeyboardEvent('input');
            testObj.autocompleteModule.inputElement.dispatchEvent(event2);

            window.setTimeout(() => {
                expect(testObj.autocompleteModule.fetchSuggestions).toHaveBeenCalled();
                expect(testObj.autocompleteModule.showSuggestions).toHaveBeenCalled();

                done();
            }, 100);
        });

        it('text matching what is in the input element should be highlighted', (done) => {
            testObj.autocompleteModule.PromiseRequest = mockPromiseRequest;

            let event = new KeyboardEvent('keydown', { key: 'KeyM'});
            testObj.autocompleteModule.inputElement.dispatchEvent(event);
            event = new KeyboardEvent('keydown', { key: 'KeyA'});
            testObj.autocompleteModule.inputElement.dispatchEvent(event);
            event = new KeyboardEvent('keydown', { key: 'KeyR'});
            testObj.autocompleteModule.inputElement.dispatchEvent(event);
            testObj.autocompleteModule.inputElement.value = 'mar';

            let event2 = new KeyboardEvent('input');
            testObj.autocompleteModule.inputElement.dispatchEvent(event2);

            window.setTimeout(() => {
                const firstResultHighlight = testObj.autocompleteModule.listBoxElement.querySelector('.ds_autocomplete__suggestion .ds_autocomplete__highlight');
                expect(firstResultHighlight.innerText).toEqual(testObj.autocompleteModule.inputElement.value);

                done();
            }, 100);
        });

        it('should clear the suggestions if the text field is empty', (done) => {
            testObj.autocompleteModule.inputElement.value = '';

            let event2 = new KeyboardEvent('input');
            testObj.autocompleteModule.inputElement.dispatchEvent(event2);

            window.setTimeout(() => {
                expect(testObj.autocompleteModule.activeSuggestion).toBeUndefined();
                expect(testObj.autocompleteModule.listBoxElement.innerHTML).toEqual('');
                expect(testObj.autocompleteModule.inputElement.getAttribute('aria-activedescendant')).toBeNull();
                expect(testObj.autocompleteModule.inputElement.getAttribute('aria-expanded')).toEqual('false');

                done();
            }, 100);
        });
    });

    describe('mouse events in the autocomplete', () => {
        beforeEach(() => {
            testObj.autocompleteElement = document.querySelector('#autocomplete');
            testObj.autocompleteModule = new Autocomplete(testObj.autocompleteElement, 'endpointUrl');
        });

        it('should update the input element and close the suggestion list when an item is clicked', () => {
            testObj.autocompleteModule.suggestions = testData;
            testObj.autocompleteModule.inputElement.value = 'foo';
            testObj.autocompleteModule.selectedSuggestion = -1;
            testObj.autocompleteModule.init();
            let focusEvent = new Event('focus');
            testObj.autocompleteModule.inputElement.dispatchEvent(focusEvent);

            let event = new MouseEvent('mousedown', {
                'bubbles': true
            });

            const elementToClick = testObj.autocompleteModule.listBoxElement.querySelector('.ds_autocomplete__suggestion:last-of-type');

            const selectedItemText = elementToClick.innerText;
            elementToClick.dispatchEvent(event);

            expect(testObj.autocompleteModule.inputElement.value).toEqual(selectedItemText);
        });

        it('should clear the suggestion list when the text input loses focus', () => {
            testObj.autocompleteElement = document.querySelector('#autocomplete');
            testObj.autocompleteModule = new Autocomplete(testObj.autocompleteElement, 'endpointUrl');
            testObj.autocompleteModule.init();
            let focusEvent = new Event('focus');
            testObj.autocompleteModule.inputElement.dispatchEvent(focusEvent);

            let event = new Event('blur');
            testObj.autocompleteModule.inputElement.dispatchEvent(event);

            expect(testObj.autocompleteModule.activeSuggestion).toBeUndefined();
            expect(testObj.autocompleteModule.listBoxElement.innerHTML).toEqual('');
            expect(testObj.autocompleteModule.inputElement.getAttribute('aria-activedescendant')).toBeNull();
            expect(testObj.autocompleteModule.inputElement.getAttribute('aria-expanded')).toEqual('false');
        });
    });

    describe('accessibility attributes', () => {
        beforeEach(() => {
            testObj.autocompleteElement = document.querySelector('#autocomplete');
            testObj.autocompleteModule = new Autocomplete(testObj.autocompleteElement, 'endpointUrl');
        });

        it('should set aria-activedescendant on the input element when a suggestion is selected (navigated to with keyboard)', () => {
            testObj.autocompleteModule.suggestions = testData;
            testObj.autocompleteModule.inputElement.value = 'foo';
            testObj.autocompleteModule.init();
            let focusEvent = new Event('focus');
            testObj.autocompleteModule.inputElement.dispatchEvent(focusEvent);

            let event = new KeyboardEvent('keydown', { key: 'ArrowDown'});
            for (let i = 0, il = testObj.autocompleteModule.suggestions.length; i < il; i++) {
                testObj.autocompleteModule.inputElement.dispatchEvent(event);
                expect(testObj.autocompleteModule.inputElement.getAttribute('aria-activedescendant')).toEqual('suggestion-' + i);
            }
        });

        it('should not have aria-activedescendant on the input element when no suggestions are selected', () => {
            testObj.autocompleteModule.suggestions = testData;
            testObj.autocompleteModule.inputElement.value = 'foo';
            testObj.autocompleteModule.init();
            let focusEvent = new Event('focus');
            testObj.autocompleteModule.inputElement.dispatchEvent(focusEvent);

            expect(testObj.autocompleteModule.inputElement.getAttribute('aria-activedescendant')).toBeNull();
        });

        it('should not have aria-activedescendant on the input element when a suggestion is chosen (enter/click)', () => {
            testObj.autocompleteModule.suggestions = testData;
            testObj.autocompleteModule.inputElement.value = 'foo';
            testObj.autocompleteModule.selectedSuggestion = -1;
            testObj.autocompleteModule.init();
            let focusEvent = new Event('focus');
            testObj.autocompleteModule.inputElement.dispatchEvent(focusEvent);

            let event = new KeyboardEvent('keydown', { key: 'ArrowDown'});
            testObj.autocompleteModule.inputElement.dispatchEvent(event);

            event = new KeyboardEvent('keydown', { key: 'Enter' });
            testObj.autocompleteModule.inputElement.dispatchEvent(event);

            expect(testObj.autocompleteModule.inputElement.getAttribute('aria-activedescendant')).toBeNull();
        });

        it('should set aria-expanded on the input element to match whether suggestions are shown or not', () => {
            testObj.autocompleteModule.suggestions = testData;
            testObj.autocompleteModule.inputElement.value = 'foo';
            testObj.autocompleteModule.selectedSuggestion = -1;
            testObj.autocompleteModule.init();

            expect(testObj.autocompleteModule.inputElement.getAttribute('aria-expanded')).toEqual('false');

            let focusEvent = new Event('focus');
            testObj.autocompleteModule.inputElement.dispatchEvent(focusEvent);

            expect(testObj.autocompleteModule.inputElement.getAttribute('aria-expanded')).toEqual('true');

            let event = new KeyboardEvent('keydown', { key: 'ArrowDown'});
            testObj.autocompleteModule.inputElement.dispatchEvent(event);

            event = new KeyboardEvent('keydown', { key: 'Enter' });
            testObj.autocompleteModule.inputElement.dispatchEvent(event);

            expect(testObj.autocompleteModule.inputElement.getAttribute('aria-expanded')).toEqual('false');
        });
    });

    describe('bad cases which are aborted', () => {
        it('will gracefully exit initialisation if there is no text input element', () => {
            const inputElement = testObj.autocompleteElement.querySelector('.js-autocomplete-input');
            inputElement.parentNode.removeChild(inputElement);

            testObj.autocompleteModule = new Autocomplete(testObj.autocompleteElement, 'endpointUrl');
            expect(testObj.autocompleteModule.init()).toBeFalsy();
        });

        it('will clear all suggestion-related info if there are no suggestions to display', () => {
            testObj.autocompleteModule = new Autocomplete(testObj.autocompleteElement, 'endpointUrl');
            testObj.autocompleteModule.init();

            spyOn(testObj.autocompleteModule, 'clearSuggestions');

            testObj.autocompleteModule.showSuggestions([]);

            expect(testObj.autocompleteModule.clearSuggestions).toHaveBeenCalled();
        });
    });
});
