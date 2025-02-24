/* global document */
'use strict';

import TokenList from '../../base/tools/tokenlist/tokenlist';
import elementIdModifier from '../../base/tools/id-modifier/id-modifier';

class CharacterCount {
    constructor(field) {
        this.field = field;
        this.inputElement = this.field.querySelector('input, textarea');
        this.threshold = this.field.dataset.threshold ? this.field.dataset.threshold * 0.01 : 0;
    }

    init() {
        if (!this.inputElement) {
            return;
        }

        if (!this.field.classList.contains('js-initialised')) {
            this.setMaxLength();
            const idModifier = elementIdModifier();

            if (!this.maxLength) {
                return;
            }

            this.emptyMessage = `You can enter up to ${this.maxLength} characters`;
            this.emptyMessageElement = document.createElement('div');
            this.emptyMessageElement.classList.add('fully-hidden');
            this.emptyMessageElement.classList.add('ds_character-count__initial');
            this.emptyMessageElement.innerText = this.emptyMessage;
            this.emptyMessageElement.id = `character-count-empty-${idModifier}`;

            // dynamically create the visible message element
            // we update this "live"
            this.messageElement = document.createElement('div');
            this.messageElement.classList.add('ds_input__message');
            this.messageElement.classList.add('ds_hint-text');
            this.messageElement.setAttribute('aria-hidden', 'true');

            // dynamically create the screen reader message element
            // we update this with a delay so screen readers will announce the input value, then the character count
            this.screenReaderMessageElement = document.createElement('div');
            this.screenReaderMessageElement.classList.add('visually-hidden');
            this.screenReaderMessageElement.id = `character-count-remaining-${idModifier}`;

            this.describedByTokenList = new TokenList(this.inputElement.getAttribute('aria-describedby'));
            this.inputElement.setAttribute('aria-describedby', this.describedByTokenList.add([this.emptyMessageElement.id, this.screenReaderMessageElement.id]));

            if (this.inputElement.value.length < this.maxLength * this.threshold) {
                this.messageElement.classList.add('fully-hidden');
            }

            // address GitHub issue #136 https://github.com/scottish-government-design-system/design-system/issues/136
            this.initialInvalidState = (!!this.inputElement.getAttribute('aria-invalid') && this.inputElement.getAttribute('aria-invalid') !== 'false');

            this.field.appendChild(this.messageElement);
            this.field.appendChild(this.screenReaderMessageElement);
            this.field.appendChild(this.emptyMessageElement);

            this.updateCountMessage();

            this.inputElement.oldValue = this.inputElement.value;

            this.inputElement.addEventListener('input', this.checkIfChanged.bind(this));

            this.field.classList.add('js-initialised');
        }
    }

    setMaxLength() {
        if (this.inputElement.getAttribute('maxlength')) {
            this.maxLength = parseInt(this.inputElement.getAttribute('maxlength'), 10);
            this.inputElement.removeAttribute('maxlength');
            this.field.dataset.maxlength = this.maxLength;
        } else {
            this.maxLength = this.field.dataset.maxlength;
        }
    }

    /*
     * Per GDS:
     * "Speech recognition software such as Dragon NaturallySpeaking will modify the
     * fields by directly changing its `value`. These changes don't trigger events
     * in JavaScript, so we need to poll to handle when and if they occur."
     */
    checkIfChanged() {
        if (!this.inputElement.oldValue) {
            this.inputElement.oldValue = '';
        }

        if (this.inputElement.value !== this.inputElement.oldValue) {
            this.screenReaderMessageElement.setAttribute('aria-live', 'polite');
            this.inputElement.oldValue = this.inputElement.value;
            this.updateCountMessage.bind(this)();
        }
    }

    updateCountMessage() {
        const count = this.maxLength - this.inputElement.value.length;
        let noun = 'characters';
        if (Math.abs(count) === 1) {
            noun = 'character';
        }
        this.messageElement.innerText = `You have ${count} ${noun} remaining`;
        if (count < 0) {
            this.inputElement.classList.add('ds_input--error');
            this.inputElement.setAttribute('aria-invalid', true);
            this.messageElement.innerText = `You have ${Math.abs(count)} ${noun} too many`;
            this.messageElement.classList.add('ds_input__message--error');
        }
        else {
            if (!this.initialInvalidState) {
                this.inputElement.classList.remove('ds_input--error');
                this.inputElement.setAttribute('aria-invalid', false);
            }

            this.messageElement.classList.remove('ds_input__message--error');

            if (this.inputElement.value.length === 0) {
                this.messageElement.innerText = this.emptyMessage;
            } else {
                this.messageElement.innerText = `You have ${count} ${noun} remaining`;
            }

        }

        if (this.inputElement.value.length < this.maxLength * this.threshold) {
            this.messageElement.classList.add('fully-hidden');
        } else {
            this.messageElement.classList.remove('fully-hidden');
        }

        clearTimeout(this.messageTimeout);
        this.messageTimeout = setTimeout(() => {
            if (this.inputElement.value.length >= this.maxLength * this.threshold) {
                this.updateScreenReaderMessage();
            } else {
                this.screenReaderMessageElement.innerHTML = '&nbsp;';
            }
        }, 1000);
    }

    updateScreenReaderMessage() {
        this.screenReaderMessageElement.innerText = this.messageElement.innerText;
    }
}

export default CharacterCount;
