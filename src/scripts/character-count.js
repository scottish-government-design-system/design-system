'use strict';

class CharacterCount {
    constructor(field) {
        this.field = field;
        this.inputElement = this.field.querySelector('input, textarea');
        this.messageElement = this.field.querySelector('.ds_input__message');
        this.maxLength = this.field.dataset.maxlength;
    }

    init() {
        if (!this.inputElement || !this.messageElement || !this.maxLength) {
            return;
        }
        this.inputElement.addEventListener('keyup', this.checkIfChanged.bind(this));
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
            this.messageElement.innerText = `You have ${Math.abs(count)} ${noun} too many`;
            this.messageElement.classList.remove('ds_hint-text');
        }
        else {
            this.inputElement.classList.remove('ds_input--error');
            this.messageElement.innerText = `You have ${count} ${noun} remaining`;
            this.messageElement.classList.add('ds_hint-text');
        }
    }
}

export default CharacterCount;




/**
  var $characterCounts = scope.querySelectorAll('[data-module="govuk-character-count"]')
  nodeListForEach($characterCounts, function ($characterCount) {
    new CharacterCount($characterCount).init()
  })
 */

const characterCountFields = [].slice.call(document.querySelectorAll('.js_character-count'));

characterCountFields.forEach(function (field) {
    const ppp = new CharacterCount(field);
    ppp.init();
});
