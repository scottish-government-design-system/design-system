/* global window, document */

'use strict';

import highlight from './highlight';
import PromiseRequest from '../../base/tools/promise-request/promise-request';

type AutocompleteOptions = {
    minLength?: number;
    suggestionMappingFunction?: Function;
    throttleDelay?: number;
}

type Suggestion = {
    displayText: string;
    isActive: boolean;
}

class Autocomplete {
    activeSuggestion: Suggestion;
    endpointUrl: string;
    inputElement: HTMLInputElement;
    keypressTimeout: number;
    listBoxElement: HTMLElement;
    minLength: number;
    PromiseRequest: any;
    selectedSuggestion: number;
    statusElement: HTMLElement;
    statusTextCache: string;
    statusTimeout: number;
    suggestions: Suggestion[];
    suggestionMappingFunction: Function;
    tempToggleCharacter: string;
    throttleDelay: number;

    constructor(
        element: HTMLElement,
        endpointUrl: string,
        options: AutocompleteOptions = {}
    ) {
        this.inputElement = element.querySelector('.js-autocomplete-input');

        this.endpointUrl = endpointUrl;
        this.suggestionMappingFunction = options.suggestionMappingFunction || ((suggestions: Suggestion[]) => suggestions);
        this.throttleDelay = options.throttleDelay || 100;
        this.minLength = options.minLength || 3;
        this.tempToggleCharacter = '';

        this.PromiseRequest = PromiseRequest;

        this.statusElement = document.querySelector('#autocomplete-status');
    }

    init() {
        // abort if inputElement or endpointUrl not present
        if (!this.inputElement || !this.endpointUrl) {
            return false;
        }

        // abort if browser does not support Promise
        // TODO: polyfill promises for old browsers
        if (typeof Promise === 'undefined') {
            return false;
        }

        this.listBoxElement = document.getElementById(this.inputElement.getAttribute('aria-owns')).querySelector('.ds_autocomplete__suggestions-list');

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
                    this.fetchSuggestions(value).then((suggestions: Suggestion[]) => {
                        this.suggestions = suggestions;
                        this.showSuggestions(this.suggestions);

                        this.updateStatus(`There ${suggestions.length === 1 ? 'is' : 'are'} ${suggestions.length} ${suggestions.length === 1 ? 'option' : 'options'}`, 1500);
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

                    this.updateStatus(`There ${this.suggestions.length === 1 ? 'is' : 'are'} ${this.suggestions.length} ${this.suggestions.length === 1 ? 'option' : 'options'}`, 1500);
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
                const selectedIndex = Array.from(suggestionElement.parentNode.children).indexOf(suggestionElement);
                this.selectSuggestion(selectedIndex);
                this.acceptSelectedSuggestion();
            }
        });
    }

    acceptSelectedSuggestion() {
        const selectedItem = document.querySelector('#' + this.inputElement.getAttribute('aria-activedescendant'));
        this.inputElement.value = selectedItem.querySelector('.js-suggestion-text').textContent.trim();

        // required for tracking
        this.inputElement.dataset.autocompletetext = this.inputElement.value;
        this.inputElement.dataset.autocompletecount = this.suggestions.length.toString();
        this.inputElement.dataset.autocompleteposition = [].slice.call(this.listBoxElement.childNodes).filter((item: HTMLElement) => item.tagName === 'LI').indexOf(selectedItem) + 1;

        this.clearSuggestions();
    }

    buildSuggestionHtml(suggestionHtml: string) {
        let html = `<span aria-hidden="true" class="ds_autocomplete__suggestion__text  js-suggestion-text">${suggestionHtml}</span>
                <span class="visually-hidden">${suggestionHtml}</span>`;

        return html;
    }

    clearSearch () {
        this.inputElement.value = '';
        this.clearSuggestions();
    }

    clearSuggestions () {
        delete this.activeSuggestion;
        delete this.selectedSuggestion;
        this.listBoxElement.innerHTML = '';
        this.inputElement.removeAttribute('aria-activedescendant');
        this.inputElement.classList.remove('js-has-suggestions');
        this.statusTextCache = this.statusElement.innerHTML;
        this.statusElement.innerHTML = '';

        if (this.suggestions) {
            this.suggestions.filter(item => item.isActive).forEach(item => {item.isActive = false})
        }
    }

    fetchSuggestions(searchTerm: string) {
        return this.PromiseRequest(this.endpointUrl + encodeURIComponent(searchTerm))
            .then((result: any) => this.suggestionMappingFunction(result))
            .catch((result: any) => console.log('fetch failed', result));
    }

    selectSuggestion(selectionIndex: number) {
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

    showSuggestions(suggestions: Suggestion[]) {
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
                highlight(suggestionElement.querySelector('.js-suggestion-text'), this.inputElement.value, {});
                this.listBoxElement.appendChild(suggestionElement);
            }
            this.inputElement.classList.add('js-has-suggestions');

            // remove items that make the box too high for the viewport
            while (window.visualViewport.height < this.listBoxElement.parentElement.offsetHeight + this.inputElement.offsetHeight + 16) {
                let lastItem = this.listBoxElement.querySelector('li:last-child');
                lastItem.parentNode.removeChild(lastItem);

                suggestions = suggestions.splice(suggestions.length - 1);
            }
        } else {
            this.clearSuggestions();
        }
    }

    updateStatus(text: string, delay = 100) {
        if (this.statusElement) {
            // This full stop triggers browsers to think the string has changed, and read it. This is a hack, albeit a harmless one.
            if (this.tempToggleCharacter.length) {
                this.tempToggleCharacter = '';
            } else {
                this.tempToggleCharacter = '.';
            }

            if (this.statusTimeout) {
                window.clearTimeout(this.statusTimeout);
            }

            this.statusTimeout = window.setTimeout(() => {
                this.statusElement.textContent = text + this.tempToggleCharacter;
            }, delay);
        } else {
            console.log('autocomplete status element not present');
        }
    }

    modulo (a: number, b: number) {
        return ((a % b) + b) % b;
    }
}

export default Autocomplete;
