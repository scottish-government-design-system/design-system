/* global window, document */

'use strict';

import highlight from './highlight';
import PromiseRequest from './promise-request';

class Autocomplete {
    constructor(element, endpointUrl, options = {}) {
        this.inputElement = element.querySelector('.js-autocomplete-input');

        this.endpointUrl = endpointUrl;
        this.suggestionMappingFunction = options.suggestionMappingFunction || (suggestions => suggestions);
        this.throttleDelay = options.throttleDelay || 100;
        this.minLength = options.minLength || 2;

        this.PromiseRequest = PromiseRequest;

        this.keycodes = {
            'tab': 'Tab',
            'enter': 'Enter',
            'esc': 'Escape',
            'up': 'ArrowUp',
            'down': 'ArrowDown'
        };
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
            if (event.key === this.keycodes.down) {
                event.preventDefault();
                this.selectSuggestion(typeof this.selectedSuggestion === 'undefined' ? 0 : this.selectedSuggestion + 1);
            } else if (event.key === this.keycodes.up) {
                event.preventDefault();
                this.selectSuggestion(typeof this.selectedSuggestion === 'undefined' ? -1 : this.selectedSuggestion - 1);
            } else if (event.key === this.keycodes.esc) {
                this.clearSearch();
            } else if (event.key === this.keycodes.enter && this.activeSuggestion) {
                event.preventDefault();
                this.acceptSelectedSuggestion();
            }
        });

        this.inputElement.addEventListener('input', () => {
            window.clearTimeout(this.keypressTimeout);
            if (this.inputElement.value && this.inputElement.value.length >= this.minLength) {
                this.keypressTimeout = window.setTimeout(() => {
                    this.fetchSuggestions(this.inputElement.value).then(suggestions => {
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
                } else {
                    this.fetchSuggestions(this.inputElement.value);
                }
            }
        });

        this.inputElement.addEventListener('blur', () => {
            this.clearSuggestions();
        });

        this.listBoxElement.addEventListener('mousedown', event => {
            event.preventDefault();
            const suggestionElement = event.target.classList.contains('ds_autocomplete__suggestion') ? event.target : event.target.closest('.ds_autocomplete__suggestion');
            if (suggestionElement) {
                const selectedIndex = Array.from(suggestionElement.parentNode.children).indexOf(suggestionElement);
                this.selectSuggestion(selectedIndex);
                this.acceptSelectedSuggestion();
            }
        });
    }

    acceptSelectedSuggestion() {
        this.inputElement.value = document.querySelector('#' + this.inputElement.getAttribute('aria-activedescendant') + ' .js-suggestion-text').innerText;
        this.clearSuggestions();
    }

    buildSuggestionHtml(suggestionHtml) {
        let html = '<span class="ds_autocomplete__suggestion__text  js-suggestion-text">' + suggestionHtml + '</span>';

        return html;
    }

    clearSearch () {
        this.inputElement.value = '';
        this.clearSuggestions();
    }

    clearSuggestions () {
        this.suggestions = [];
        delete this.activeSuggestion;
        delete this.selectedSuggestion;
        this.listBoxElement.innerHTML = '';
        this.inputElement.removeAttribute('aria-activedescendant');
        this.inputElement.setAttribute('aria-expanded', false);
    }

    fetchSuggestions(searchTerm) {
        return this.PromiseRequest(this.endpointUrl + searchTerm)
            .then(result => this.suggestionMappingFunction(result))
            .catch(result => console.log('fetch failed', result));
    }

    selectSuggestion (selectionIndex) {
        this.selectedSuggestion = selectionIndex;

        this.suggestions.forEach((suggestion, index) => {
            if (index === this.modulo(selectionIndex, this.suggestions.length)) {
                suggestion.active = true;
                this.activeSuggestion = suggestion;
                this.inputElement.setAttribute('aria-activedescendant', 'suggestion-' + index);

                this.updateStatus(`${suggestion.displayText} (${index + 1} of ${this.suggestions.length} is selected)`);
            } else {
                delete suggestion.active;
            }
        });
        this.showSuggestions(this.suggestions);
    }

    showSuggestions(suggestions) {
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

                if (suggestion.active) {
                    suggestionElement.classList.add('active');
                }

                suggestionElement.innerHTML = this.buildSuggestionHtml(suggestion.displayText);
                highlight(suggestionElement.querySelector('.js-suggestion-text'), this.inputElement.value);
                this.listBoxElement.appendChild(suggestionElement);
            }
            this.inputElement.setAttribute('aria-expanded', true);

            // remove items that make the box too high for the viewport
            while (window.visualViewport.height < this.listBoxElement.parentNode.offsetHeight + this.inputElement.offsetHeight + 16) {
                let lastItem = this.listBoxElement.querySelector('li:last-child');
                lastItem.parentNode.removeChild(lastItem);

                suggestions = suggestions.splice(suggestions.length - 1);
            }

        } else {
            this.clearSuggestions();
        }
    }

    updateStatus(text, delay = 100) {
        if (this.statusTimeout) {
            window.clearTimeout(this.statusTimeout);
        }

        this.statusTimeout = window.setTimeout(() => {
            this.statusElement.innerText = text;
        }, delay);
    }

    modulo (a, b) {
        return ((a % b) + b) % b;
    }
}

export default Autocomplete;
