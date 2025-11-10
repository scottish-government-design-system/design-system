'use strict';

import highlight from './highlight';
import PromiseRequest from '../../base/tools/promise-request/promise-request';
import DSComponent from '../../base/component/component';

type AutocompleteOptions = {
    minLength?: number;
    suggestionMappingFunction?: Function;
    throttleDelay?: number;
}

type Suggestion = {
    displayText: string;
    isActive: boolean;
}

class Autocomplete extends DSComponent {
    private activeSuggestion: Suggestion;
    private endpointUrl: string;
    private inputElement: HTMLInputElement;
    private keypressTimeout: number;
    private listBoxElement: HTMLElement;
    private minLength: number;
    private PromiseRequest: any;
    private selectedSuggestion: number;
    private statusElement: HTMLElement;
    private statusTimeout: number;
    private suggestions: Suggestion[];
    private suggestionMappingFunction: Function;
    private tempToggleCharacter: string;
    private throttleDelay: number;

    constructor(
        element: HTMLElement,
        endpointUrl: string,
        options: AutocompleteOptions = {}
    ) {
        super(element);

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
                const selectedIndex = Array.from(suggestionElement.parentNode.children).indexOf(suggestionElement);
                this.selectSuggestion(selectedIndex);
                this.acceptSelectedSuggestion();
            }
        });

        this.isInitialised = true;
    }

    private acceptSelectedSuggestion() {
        const selectedItem = document.querySelector('#' + this.inputElement.getAttribute('aria-activedescendant'));
        this.inputElement.value = selectedItem.querySelector('.js-suggestion-text').textContent.trim();

        // required for tracking
        this.inputElement.dataset.autocompletetext = this.inputElement.value;
        this.inputElement.dataset.autocompletecount = this.suggestions.length.toString();
        this.inputElement.dataset.autocompleteposition = [].slice.call(this.listBoxElement.childNodes).filter((item: HTMLElement) => item.tagName === 'LI').indexOf(selectedItem) + 1;

        this.clearSuggestions();
    }

    private buildSuggestionHtml(suggestionHtml: string) {
        let html = `<span aria-hidden="true" class="ds_autocomplete__suggestion__text  js-suggestion-text">${suggestionHtml}</span>
                <span class="visually-hidden">${suggestionHtml}</span>`;

        return html;
    }

    private clearSearch () {
        this.inputElement.value = '';
        this.clearSuggestions();
    }

    private clearSuggestions () {
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

    private fetchSuggestions(searchTerm: string) {
        return this.PromiseRequest(this.endpointUrl + encodeURIComponent(searchTerm))
            .then((result: any) => this.suggestionMappingFunction(result))
            .catch((result: any) => console.log('fetch failed', result));
    }

    private selectSuggestion(selectionIndex: number) {
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

    private showSuggestions(suggestions: Suggestion[]) {
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

    private updateStatus(suggestionCount: number, delay = 100) {
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

    private updateStatusText(text: string) {
        // This full stop triggers screen readers to think the element content has changed, and read it. This is a hack, albeit a harmless one.
        if (this.tempToggleCharacter.length) {
            this.tempToggleCharacter = '';
        } else {
            this.tempToggleCharacter = '.';
        }
        this.statusElement.textContent = text + this.tempToggleCharacter;
    }

    private modulo (a: number, b: number) {
        return ((a % b) + b) % b;
    }
}

export default Autocomplete;
