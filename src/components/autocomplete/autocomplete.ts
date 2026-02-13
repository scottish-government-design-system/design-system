'use strict';

import highlight from './highlight';
import PromiseRequest from '../../base/tools/promise-request/promise-request';
import DSComponent from '../../base/component/component';

type AutocompleteOptionsArgs = {
    minLength?: number
    suggestionMappingFunction?: (suggestions: object[]) => SuggestionArgs[]
    throttleDelay?: number
}

type SuggestionArgs = {
    displayText: string
    isActive?: boolean
}

/**
 * Autocomplete component
 *
 * @class Autocomplete
 * @extends DSComponent
 * @property {SuggestionArgs} activeSuggestion - the currently active suggestion
 * @property {string} endpointUrl - the URL of the autocomplete suggestions endpoint
 * @property {HTMLInputElement} inputElement - the input element for autocomplete
 * @property {number} keypressTimeout - the timeout ID for keypress throttling
 * @property {HTMLElement} listBoxElement - the list box element containing suggestions
 * @property {number} minLength - the minimum length of input to trigger suggestions
 * @property {Function} PromiseRequest - the function to make promise-based requests
 * @property {number} selectedSuggestion - the index of the currently selected suggestion
 * @property {HTMLElement} statusElement - the status element for screen reader updates
 * @property {number} statusTimeout - the timeout ID for status updates
 * @property {SuggestionArgs[]} suggestions - the array of current suggestions
 * @property {Function} suggestionMappingFunction - the function to map raw suggestions to Suggestion objects
 * @property {string} tempToggleCharacter - a temporary character to toggle status updates
 * @property {number} throttleDelay - the delay in milliseconds for throttling input
 */
class Autocomplete extends DSComponent {
    private activeSuggestion?: SuggestionArgs;
    private endpointUrl: string;
    private inputElement: HTMLInputElement;
    private keypressTimeout!: number;
    private listBoxElement!: HTMLElement;
    private minLength: number;
    private PromiseRequest: (url: string, method?: 'GET' | 'POST') => Promise<unknown>;
    private selectedSuggestion?: number;
    private statusElement: HTMLElement;
    private statusTimeout!: number;
    private suggestions!: SuggestionArgs[];
    private suggestionMappingFunction: (suggestions: object[]) => SuggestionArgs[]
    private tempToggleCharacter: string;
    private throttleDelay: number;

    /**
     * Creates an autocomplete component
     *
     * @param {HTMLElement} element - the autocomplete element
     * @param {string} endpointUrl - the URL of the autocomplete suggestions endpoint
     * @param {AutocompleteOptionsArgs} options - the autocomplete options
     */
    constructor(
        element: HTMLElement,
        endpointUrl: string,
        options: AutocompleteOptionsArgs = {}
    ) {
        super(element);

        this.inputElement = element.querySelector('.js-autocomplete-input') as HTMLInputElement;

        this.endpointUrl = endpointUrl;
        this.suggestionMappingFunction = options.suggestionMappingFunction || ((suggestions: object[]) => suggestions as SuggestionArgs[]);
        this.throttleDelay = options.throttleDelay || 100;
        this.minLength = options.minLength || 3;
        this.tempToggleCharacter = '';

        this.PromiseRequest = PromiseRequest;

        this.statusElement = document.querySelector('#autocomplete-status') as HTMLElement;
    }

    /**
     * Initialise the autocomplete component
     * - bind event listeners to the input element
     * - fetch and display suggestions
     * - manage selection and acceptance of suggestions
     * - update status for screen readers
     * - handle keyboard and mouse interactions
     *
     * @returns {void}
     */
    init(): void {
        // abort if inputElement or endpointUrl not present
        if (!this.inputElement || !this.endpointUrl) {
            return;
        }

        this.listBoxElement = (document.getElementById(this.inputElement.getAttribute('aria-owns') as string) as HTMLElement).querySelector('.ds_autocomplete__suggestions-list') as HTMLElement;

        this.inputElement.addEventListener('keydown', event => {
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                this.selectSuggestion(typeof this.selectedSuggestion === 'undefined' ? 0 : this.selectedSuggestion + 1);
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                this.selectSuggestion(typeof this.selectedSuggestion === 'undefined' ? -1 : this.selectedSuggestion - 1);
            } else if (event.key === 'Esc') {
                this.clearSearch();
            } else if (event.key === 'Enter' && this.activeSuggestion) {
                event.preventDefault();
                this.acceptSelectedSuggestion();
            }
        });

        this.inputElement.addEventListener('input', () => {
            window.clearTimeout(this.keypressTimeout);
            const value = this.inputElement.value.trim();
            if (value.length >= this.minLength) {
                this.keypressTimeout = window.setTimeout(() => {
                    this.fetchSuggestions(value).then((suggestions: object[]) => {
                        this.suggestions = suggestions as SuggestionArgs[];
                        this.showSuggestions(this.suggestions);

                        this.updateStatus(this.suggestions.length, 1500);
                    });
                }, this.throttleDelay);
            } else {
                this.clearSuggestions();
            }
        });

        this.inputElement.addEventListener('focus', () => {
            if (this.inputElement.value) {
                if (this.suggestions) {
                    this.showSuggestions(this.suggestions);

                    this.updateStatus(this.suggestions.length, 1500);
                } else {
                    this.fetchSuggestions(this.inputElement.value.trim());
                }
            }
        });

        this.inputElement.addEventListener('blur', () => {
            this.clearSuggestions();
        });

        this.listBoxElement.addEventListener('mousedown', event => {
            event.preventDefault();

            const target = event.target as HTMLElement;

            const suggestionElement = target.classList.contains('ds_autocomplete__suggestion') ? target : target.closest('.ds_autocomplete__suggestion');
            if (suggestionElement) {
                const suggestionElementParent = suggestionElement.parentElement as HTMLElement;
                const selectedIndex = Array.from(suggestionElementParent.children).indexOf(suggestionElement);
                this.selectSuggestion(selectedIndex);
                this.acceptSelectedSuggestion();
            }
        });

        this.isInitialised = true;
    }

    /**
     * Accept the selected suggestion
     * - updates the input element value
     * - sets data attributes for tracking
     * - clears the suggestions
     *
     * @returns {void}
     */
    private acceptSelectedSuggestion(): void {
        const selectedItem = document.querySelector('#' + this.inputElement.getAttribute('aria-activedescendant')) as HTMLLIElement;
        this.inputElement.value = (selectedItem.querySelector('.js-suggestion-text') as HTMLSpanElement).textContent.trim();

        // required for tracking
        this.inputElement.dataset.autocompletetext = this.inputElement.value;
        this.inputElement.dataset.autocompletecount = this.suggestions.length.toString();
        this.inputElement.dataset.autocompleteposition = String([].slice.call(this.listBoxElement.querySelectorAll('li')).indexOf(selectedItem as never) + 1);

        this.clearSuggestions();
    }

    /**
     * Build the HTML for a suggestion
     * - creates a span element with the suggestion text
     *
     * @param {string} suggestionHtml - the HTML content for the suggestion
     * @returns {string} - the HTML string for the suggestion
     */
    private buildSuggestionHtml(suggestionHtml: string): string {
        const html = `<span aria-hidden="true" class="ds_autocomplete__suggestion__text  js-suggestion-text">${suggestionHtml}</span>
                <span class="visually-hidden">${suggestionHtml}</span>`;

        return html;
    }

    /**
     * Clear the search input
     * - clears the suggestions
     *
     * @returns {void}
     */
    private clearSearch (): void {
        this.inputElement.value = '';
        this.clearSuggestions();
    }

    /**
     * Clear the suggestions
     * - removes all suggestions from the list box
     * - resets the input element state
     * - updates the status element
     * - clears the active suggestion
     *
     * @returns {void}
     */
    private clearSuggestions (): void {
        delete this.activeSuggestion;
        delete this.selectedSuggestion;
        this.listBoxElement.innerHTML = '';
        this.inputElement.removeAttribute('aria-activedescendant');
        this.inputElement.classList.remove('js-has-suggestions');
        this.statusElement.innerHTML = '';

        if (this.suggestions) {
            this.suggestions.filter(item => item.isActive).forEach(item => {item.isActive = false})
        }
    }

    /**
     * Fetch suggestions from the endpoint
     * - sends a request to the endpoint with the search term
     * - maps the results using the suggestion mapping function
     *
     * @param {string}searchTerm - the term to search for
     * @returns {Promise<void | SuggestionArgs[]>} - a promise that resolves to an array of suggestions
     */
    private fetchSuggestions(searchTerm: string): Promise<SuggestionArgs[]> {
        return this.PromiseRequest(this.endpointUrl + encodeURIComponent(searchTerm))
            .then((result) => this.suggestionMappingFunction(result as object[]))
            .catch((result: object) => {
                console.log('fetch failed', result);
                return this.suggestionMappingFunction([] as object[])
            });
    }

    /**
     * Select a suggestion
     * - highlights the suggestion at the given index
     * - updates the input element state
     * - updates the active suggestion
     *
     * @param {number} selectionIndex - the index of the suggestion to select
     * @returns {void}
     */
    private selectSuggestion(selectionIndex: number): void {
        this.selectedSuggestion = selectionIndex;

        this.suggestions.forEach((suggestion, index) => {
            if (index === this.modulo(selectionIndex, this.suggestions.length)) {
                suggestion.isActive = true;
                this.activeSuggestion = suggestion;
                this.inputElement.setAttribute('aria-activedescendant', 'suggestion-' + index);
            } else {
                delete suggestion.isActive;
            }
        });
        this.showSuggestions(this.suggestions);
    }

    /**
     * Show the suggestions
     * - renders the suggestions into the list box
     * - highlights matching text
     * - updates the input element state
     *
     * @param {SuggestionArgs[]} suggestions - the suggestions to show
     * @returns {void}
     */
    private showSuggestions(suggestions: SuggestionArgs[]): void {
        this.listBoxElement.innerHTML = '';
        if (suggestions.length) {
            for (let i = 0, il = suggestions.length; i < il; i++) {
                const suggestion = suggestions[i];

                const suggestionElement = document.createElement('li');
                suggestionElement.id = 'suggestion-' + i;
                suggestionElement.classList.add('ds_autocomplete__suggestion');
                suggestionElement.setAttribute('role', 'option');

                const suggestionText = document.createElement('span');
                suggestionText.classList.add('js-suggestion-text');

                if (suggestion.isActive) {
                    suggestionElement.classList.add('active');
                }

                suggestionElement.innerHTML = this.buildSuggestionHtml(suggestion.displayText);
                const suggestionTextElement = suggestionElement.querySelector('.js-suggestion-text') as HTMLElement;
                highlight(suggestionTextElement, this.inputElement.value, {});
                this.listBoxElement.appendChild(suggestionElement);
            }
            this.inputElement.classList.add('js-has-suggestions');

            // remove items that make the box too high for the viewport
            const lastItem = this.listBoxElement.querySelector('li:last-child') as HTMLLIElement;
            const listboxParentElement = this.listBoxElement.parentElement as HTMLElement;
            const visualViewport = window.visualViewport as VisualViewport;
            while (visualViewport.height < listboxParentElement.offsetHeight + this.inputElement.offsetHeight + 16) {
                lastItem.parentNode?.removeChild(lastItem);
                suggestions = suggestions.splice(suggestions.length - 1);
            }
        } else {
            this.clearSuggestions();
        }
    }

    /**
     * Update the status
     * - Throttle updates to avoid overwhelming screen readers
     *
     * @param {number} suggestionCount - the number of suggestions
     * @param {number} delay - the delay in milliseconds
     * @returns {void}
     */
    private updateStatus(suggestionCount: number, delay: number = 100): void {
        if (this.statusElement) {
            if (this.statusTimeout) {
                window.clearTimeout(this.statusTimeout);
            }

            const text = `There ${suggestionCount === 1 ? 'is' : 'are'} ${suggestionCount} ${suggestionCount === 1 ? 'option' : 'options'}`;

            this.statusTimeout = window.setTimeout(() => {
                this.updateStatusText(text);
            }, delay);
        }
    }

    /**
     * Update the status text
     *
     * @param {string} text - the text to update the status with
     * @returns {void}
     */
    private updateStatusText(text: string): void {
        // This full stop triggers screen readers to think the element content has changed, and read it. This is a hack, albeit a harmless one.
        if (this.tempToggleCharacter.length) {
            this.tempToggleCharacter = '';
        } else {
            this.tempToggleCharacter = '.';
        }
        this.statusElement.textContent = text + this.tempToggleCharacter;
    }

    /**
     * Simple modulo function that handles negative numbers correctly
     *
     * @param {number} a - the dividend
     * @param {number} b - the divisor
     * @returns {number} - the result of a mod b
     */
    private modulo (a: number, b: number): number {
        return ((a % b) + b) % b;
    }
}

export default Autocomplete;
