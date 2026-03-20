import DSComponent from '../../base/component/component';
/**
 * Character count component
 *
 * @class CharacterCount
 * @extends DSComponent
 * @private {string} emptyMessage
 * @private {HTMLElement} field
 * @private {string} idModifier
 * @private {CharacterCountInputElement} inputElement
 * @private {boolean} isInvalidInitialState
 * @private {number} maxLength
 * @private {HTMLElement} messageElement
 * @private {number} messageTimeout
 * @private {HTMLElement} screenReaderMessageElement
 * @private {number} threshold
 * @private {number} thresholdCharacters
 */
declare class CharacterCount extends DSComponent {
    private emptyMessage;
    private field;
    private idModifier;
    private inputElement;
    private isInvalidInitialState?;
    private maxLength;
    private messageElement;
    private messageTimeout;
    private screenReaderMessageElement;
    private threshold;
    private thresholdCharacters;
    /**
     * Create a character count instance
     *
     * @param {HTMLElement} field - the input field or textarea to apply a character count to
     */
    constructor(field: HTMLElement);
    /**
     * Initialise the character count
     * - create DOM elements used by the character count component
     * - check the current state & set the display accordingly
     * - setup event listener on the input element to watch for changes
     *
     * @returns {void}
     */
    init(): void;
    /**
     * Per GDS:
     * "Speech recognition software such as Dragon NaturallySpeaking will modify the
     * fields by directly changing its `value`. These changes don't trigger events
     * in JavaScript, so we need to poll to handle when and if they occur."
     *
     * @returns {void}
     */
    private checkIfChanged;
    /**
     * Get the component's "maxLength" based on either a supplied maxlength attribute or
     * data-maxlength attribute. Remove a maxlength attribute if it is present.
     *
     * @returns {number}
     */
    private getMaxLength;
    /**
     * Get the number of characters required to make the character count appear, calculated from
     * the maxlength and the supplied threshold
     *
     * @returns {number}
     */
    private getThresholdCharacters;
    /**
     * Updates the remaining character count message
     * - adds error message and aria invalid if the count is exceeded
     * - pluralises the message correctly
     * - hides the message if there is a count threshold that is not met
     * - updates the hidden screen reader message element after a short delay (the delay helps ensure the message is not unterrupted by the screen reader announcing the value of the field)
     *
     * @returns {void}
     */
    private updateCountMessage;
    /**
     * Updates the content of the hidden screen reader message
     *
     * @returns {void}
     */
    private updateScreenReaderMessage;
}
export default CharacterCount;
