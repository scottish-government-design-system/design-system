import { test, vi } from 'vitest';
import { page } from 'vitest/browser';
import loadHtml from '../../../loadHtml';
import Autocomplete from './autocomplete';

let testObj = {};

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

function waitForElement(selector) {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                resolve(element);
            }
        }, 100);
    });
}

function waitForTextChange(element) {
    const initialText = element.textContent;
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            if (element.textContent !== initialText) {
                clearInterval(interval);
                resolve(element.textContent);
            }
        }, 100);
    });
}

const mockPromiseRequest = function () {
    return Promise.resolve(testData);
};

describe('"autocomplete" component', () => {
    beforeEach(async () => {
        await loadHtml('src/components/autocomplete/autocomplete.html');
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

        it('should abort init() if no input element found', () => {
            const inputElement = testObj.autocompleteElement.querySelector('.js-autocomplete-input');
            inputElement.parentNode.removeChild(inputElement);
            const autocompleteModule = new Autocomplete(testObj.autocompleteElement);

            autocompleteModule.init()

            expect(testObj.autocompleteElement.classList.contains('js-initialised')).toBe(false);
        });

        it('should abort init() if no endpoint supplied', () => {
            const autocompleteModule = new Autocomplete(testObj.autocompleteElement);

            autocompleteModule.init()

            expect(testObj.autocompleteElement.classList.contains('js-initialised')).toBe(false);
        });
    });

    describe('focus with content on the input element', () => {
        beforeEach(() => {
            testObj.autocompleteModule = new Autocomplete(testObj.autocompleteElement, 'endpointUrl');
        });

        it('should do nothing if the input element has no content', () => {
            vi.spyOn(testObj.autocompleteModule, 'fetchSuggestions').mockReturnValue(Promise.resolve(testData));
            vi.spyOn(testObj.autocompleteModule, 'showSuggestions');
            testObj.autocompleteModule.init();

            let event = new Event('focus');
            testObj.autocompleteModule.inputElement.dispatchEvent(event);

            expect(testObj.autocompleteModule.fetchSuggestions).not.toHaveBeenCalled();
            expect(testObj.autocompleteModule.showSuggestions).not.toHaveBeenCalled();
        });

        it('should show a list of cached suggestions if one is in memory', () => {
            vi.spyOn(testObj.autocompleteModule, 'showSuggestions');
            testObj.autocompleteModule.suggestions = testData;

            testObj.autocompleteModule.inputElement.value = 'foo';
            testObj.autocompleteModule.init();

            let event = new Event('focus');
            testObj.autocompleteModule.inputElement.dispatchEvent(event);

            expect(testObj.autocompleteModule.showSuggestions).toHaveBeenCalledWith(testObj.autocompleteModule.suggestions);
        });

        it('should fetch a list of suggestions if there are no cached suggestions', () => {
            vi.spyOn(testObj.autocompleteModule, 'fetchSuggestions').mockReturnValue(Promise.resolve(testData));

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

        it('should throw if the request fails', () => {
            const mockPromiseRequest = function () {
                return Promise.reject(sampleData);
            };
            testObj.autocompleteModule.PromiseRequest = mockPromiseRequest;
            testObj.autocompleteModule = new Autocomplete(testObj.autocompleteElement, 'endpointUrl');

            vi.spyOn(testObj.autocompleteModule, 'fetchSuggestions');

            testObj.autocompleteModule.fetchSuggestions('ppp');

            expect(testObj.autocompleteModule.fetchSuggestions).toThrowError();
        });

        it('should only display as many suggestions as itcan fit in the viewport', async () => {
            testObj.autocompleteElement = document.querySelector('#autocomplete');
            testObj.autocompleteModule = new Autocomplete(testObj.autocompleteElement, 'endpointUrl');

            await page.viewport(800, 80);

            testObj.autocompleteModule.suggestions = testData;
            testObj.autocompleteModule.inputElement.value = 'foo';
            testObj.autocompleteModule.selectedSuggestion = -1;
            testObj.autocompleteModule.init();
            let focusEvent = new Event('focus');
            testObj.autocompleteModule.inputElement.dispatchEvent(focusEvent);

            expect(testObj.autocompleteModule.listBoxElement.children.length).toEqual(2);
        });
    });

    describe('keyboard navigating through suggestions', () => {
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
                    expect(testObj.autocompleteModule.suggestions[i].isActive).toBe(true);
                    expect(document.querySelector('.active .js-suggestion-text').textContent).toEqual(testData[i].displayText);

                }
            });

            it('should select the previous suggestion in the list when the UP key is pressed', () => {
                testObj.autocompleteModule.suggestions = testData;
                testObj.autocompleteModule.inputElement.value = 'foo';
                testObj.autocompleteModule.init();
                let focusEvent = new Event('focus');
                testObj.autocompleteModule.inputElement.dispatchEvent(focusEvent);

                let event = new KeyboardEvent('keydown', { key: 'ArrowUp'});
                for (let i = testObj.autocompleteModule.suggestions.length - 1; i > -1; i--) {
                    testObj.autocompleteModule.inputElement.dispatchEvent(event);
                    expect(testObj.autocompleteModule.suggestions[i].isActive).toBe(true);
                    expect(document.querySelector('.active .js-suggestion-text').textContent).toEqual(testData[i].displayText);
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

                expect(testObj.autocompleteModule.suggestions[0].isActive).toBe(true);
                expect(document.querySelector('.active .js-suggestion-text').textContent).toEqual(testData[0].displayText);
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

                expect(testObj.autocompleteModule.suggestions[testData.length - 1].isActive).toBe(true);
                expect(document.querySelector('.active .js-suggestion-text').textContent).toEqual(testData[testData.length - 1].displayText);
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

                const selectedItemText = document.querySelector('.active .js-suggestion-text').textContent;

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

                let event = new KeyboardEvent('keydown', { key: 'Esc'});
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

        it('should fetch and display autocomplete suggestions', async () => {
            const spy1 = vi.spyOn(testObj.autocompleteModule, 'fetchSuggestions');
            const spy2 = vi.spyOn(testObj.autocompleteModule, 'showSuggestions');

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
                expect(spy1).toHaveBeenCalled();
                expect(spy2).toHaveBeenCalled();
            }, 100);
        });

        it('should clear the suggestions if the text field is empty', async () => {
            testObj.autocompleteModule.inputElement.value = '';

            let event2 = new KeyboardEvent('input');
            testObj.autocompleteModule.inputElement.dispatchEvent(event2);

            window.setTimeout(() => {
                expect(testObj.autocompleteModule.activeSuggestion).toBeUndefined();
                expect(testObj.autocompleteModule.listBoxElement.innerHTML).toEqual('');
                expect(testObj.autocompleteModule.inputElement.getAttribute('aria-activedescendant')).toBeNull();
                expect(testObj.autocompleteModule.inputElement.classList.contains('js-has-suggestions')).toEqual(false);
            }, 100);
        });

        it('text matching what is in the input element should be highlighted', async() => {
            testObj.autocompleteModule.PromiseRequest = mockPromiseRequest;

            let event = new KeyboardEvent('keydown', { key: 'KeyM'});
            testObj.autocompleteModule.inputElement.dispatchEvent(event);
            event = new KeyboardEvent('keydown', { key: 'KeyA'});
            testObj.autocompleteModule.inputElement.dispatchEvent(event);
            event = new KeyboardEvent('keydown', { key: 'KeyR'});
            testObj.autocompleteModule.inputElement.dispatchEvent(event);
            testObj.autocompleteModule.inputElement.value = 'mar';

            let event2 = new Event('input');
            testObj.autocompleteModule.inputElement.dispatchEvent(event2);

            await waitForElement('.ds_autocomplete__suggestion mark').then((markElement) => {
                expect(markElement.textContent).toEqual(testObj.autocompleteModule.inputElement.value);
            });
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

            const selectedItemText = elementToClick.querySelector('.js-suggestion-text').textContent;
            elementToClick.dispatchEvent(event);

            expect(testObj.autocompleteModule.inputElement.value).toEqual(selectedItemText);
        });

        it('should do nothing if a mouseclick happens on something that is not a suggestion in the suggestion list', () => {
            // arrange
            testObj.autocompleteModule.suggestions = testData;
            testObj.autocompleteModule.init();

            const selectSuggestionSpy = vi.spyOn(testObj.autocompleteModule, 'selectSuggestion').mockImplementation(() => {});

            // act
            let event = new MouseEvent('mousedown', {
                'bubbles': true
            });
            const elementToClick = testObj.autocompleteModule.listBoxElement;
            elementToClick.dispatchEvent(event);

            // assert
            expect(selectSuggestionSpy).not.toHaveBeenCalled()
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
            expect(testObj.autocompleteModule.inputElement.classList.contains('js-has-suggestions')).toEqual(false);
        });
    });

    describe('accessibility attributes and behaviour', () => {
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

        it('should set a class on the input element to flag whether suggestions are shown or not', () => {
            testObj.autocompleteModule.suggestions = testData;
            testObj.autocompleteModule.inputElement.value = 'foo';
            testObj.autocompleteModule.selectedSuggestion = -1;
            testObj.autocompleteModule.init();

            expect(testObj.autocompleteModule.inputElement.classList.contains('js-has-suggestions')).toEqual(false);

            let focusEvent = new Event('focus');
            testObj.autocompleteModule.inputElement.dispatchEvent(focusEvent);

            expect(testObj.autocompleteModule.inputElement.classList.contains('js-has-suggestions')).toEqual(true);

            let event = new KeyboardEvent('keydown', { key: 'ArrowDown'});
            testObj.autocompleteModule.inputElement.dispatchEvent(event);

            event = new KeyboardEvent('keydown', { key: 'Enter' });
            testObj.autocompleteModule.inputElement.dispatchEvent(event);

            expect(testObj.autocompleteModule.inputElement.classList.contains('js-has-suggestions')).toEqual(false);
        });

        describe('status text', () => {
            beforeEach(() => {
                testObj.autocompleteModule.statusElement.textContent = '';
            });

            it('update the status text', async () => {
                // act
                testObj.autocompleteModule.updateStatus(1);
                await waitForTextChange(testObj.autocompleteModule.statusElement);

                // assert
                expect(testObj.autocompleteModule.statusElement.textContent).toEqual('There is 1 option.');
            });

            it('update the status text only with the latest update', async () => {
                // arrange
                const updateStatusTextSpy = vi.spyOn(testObj.autocompleteModule, 'updateStatusText');

                // act
                testObj.autocompleteModule.updateStatus(0);
                testObj.autocompleteModule.updateStatus(1);
                await waitForTextChange(testObj.autocompleteModule.statusElement);

                // assert
                expect(testObj.autocompleteModule.statusElement.textContent).toEqual('There is 1 option.');
                expect(updateStatusTextSpy.mock.calls.length).toEqual(1);
            });

            it('togglecharacter (forces a screen reader to announce status text because the content is changed, even when the number of suggestions is the same)', async () => {
                // act
                testObj.autocompleteModule.updateStatus(1);
                await waitForTextChange(testObj.autocompleteModule.statusElement);
                // assert
                expect(testObj.autocompleteModule.statusElement.textContent).toEqual('There is 1 option.');

                // act
                testObj.autocompleteModule.updateStatus(1);
                await waitForTextChange(testObj.autocompleteModule.statusElement);
                // assert
                expect(testObj.autocompleteModule.statusElement.textContent).toEqual('There is 1 option');

                // act
                testObj.autocompleteModule.updateStatus(1);
                await waitForTextChange(testObj.autocompleteModule.statusElement);
                // assert
                expect(testObj.autocompleteModule.statusElement.textContent).toEqual('There is 1 option.');
            });

            it('correct pluralisation: singular', async () => {
                // act
                testObj.autocompleteModule.updateStatus(1);
                await waitForTextChange(testObj.autocompleteModule.statusElement);

                // assert
                expect(testObj.autocompleteModule.statusElement.textContent).toEqual('There is 1 option.');
            });

            it('correct pluralisation: plural', async () => {
                // act
                testObj.autocompleteModule.updateStatus(10);
                await waitForTextChange(testObj.autocompleteModule.statusElement);

                // assert
                expect(testObj.autocompleteModule.statusElement.textContent).toEqual('There are 10 options.');
            });

            it('no status element to update :(', () => {
                // arrange
                delete testObj.autocompleteModule.statusElement;

                // act
                const updateStatusTextSpy = vi.spyOn(testObj.autocompleteModule, 'updateStatusText');
                testObj.autocompleteModule.updateStatus(1);

                // assert
                expect(updateStatusTextSpy).not.toHaveBeenCalled();
            });
        });
    });

    describe('bad cases which are aborted', () => {
        it('will gracefully exit initialisation if there is no text input element', () => {
            const inputElement = testObj.autocompleteElement.querySelector('.js-autocomplete-input');
            inputElement.parentNode.removeChild(inputElement);

            testObj.autocompleteModule = new Autocomplete(testObj.autocompleteElement, 'endpointUrl');
            expect(testObj.autocompleteModule.init()).toBe(false);
        });

        it('will clear all suggestion-related info if there are no suggestions to display', () => {
            testObj.autocompleteModule = new Autocomplete(testObj.autocompleteElement, 'endpointUrl');
            testObj.autocompleteModule.init();

            vi.spyOn(testObj.autocompleteModule, 'clearSuggestions');

            testObj.autocompleteModule.showSuggestions([]);

            expect(testObj.autocompleteModule.clearSuggestions).toHaveBeenCalled();
        });
    });
});
