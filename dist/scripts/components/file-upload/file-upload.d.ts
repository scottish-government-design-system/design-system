/**
 * Heavily based on the GOVUK Design System file upload component
 * https://design-system.service.gov.uk/components/file-upload/
 */
import DSComponent from '../../base/component/component';
type TextArgs = {
    buttonText: string;
    defaultStatusText: string;
    enteredDropzone: string;
    filesAddedText: string;
    filesListHeading: string;
    instructionText: string;
    leftDropzone: string;
};
type OptionsArgs = {
    text?: Partial<TextArgs>;
};
export declare const defaultText: {
    buttonText: string;
    buttonTextPlural: string;
    defaultStatusText: string;
    defaultStatusTextPlural: string;
    enteredDropzone: string;
    filesAddedText: string;
    filesListHeading: string;
    instructionText: string;
    instructionTextPlural: string;
    leftDropzone: string;
};
/**
 * File upload component
 *
 * @class FileUpload
 * @extends DSComponent
 * @property {HTMLSpanElement} announcementsSpan
 * @property {HTMLButtonElement} dropzoneButton
 * @property {HTMLElement} element
 * @property {HTMLInputElement} fileInputElement
 * @property {HTMLSpanElement} statusSpan
 * @property {TextArgs} text
 */
declare class FileUpload extends DSComponent {
    #private;
    private announcementsSpan;
    private dropzoneButton;
    private element;
    private fileInputElement;
    private hasEnteredAnotherElement;
    private statusSpan;
    private text;
    static defaultText: {
        buttonText: string;
        buttonTextPlural: string;
        defaultStatusText: string;
        defaultStatusTextPlural: string;
        enteredDropzone: string;
        filesAddedText: string;
        filesListHeading: string;
        instructionText: string;
        instructionTextPlural: string;
        leftDropzone: string;
    };
    constructor(element: HTMLElement, options?: OptionsArgs);
    init(): void;
    /**
     * Adds events to mimic/duplicate the native file input behaviour where needed
     * @returns {void}
     */
    private addEventListeners;
    /**
     * Checks the selected files against the `accept` attribute of the file input element
     * @param {FileList} files
     * @returns {boolean}
     */
    private canAccept;
    /**
     * Check whether the content of what is being dragged can be dropped onto the file input
     * @param {DataTransfer} dataTransfer
     * @returns {boolean}
     */
    private canDrop;
    /**
     * Confirms that the provided dataTransfer can fill the input
     * e.g. reject multiple files in a non-multiple input
     * @param {DataTransfer} dataTransfer
     * @returns {boolean}
     */
    private canFillInput;
    /**
     * Returns the number of DataTransferItems that have the "file" type/kind
     * @param {DataTransferItemList} list
     * @returns {number}
     */
    private countFileItems;
    /**
     * Unsets the dragging CSS class on the drop zone
     * @returns {void}
     */
    private hideDraggingState;
    /**
     * Check that the number of files to be added matches the number allowed
     * (i.e. a single file for a non-multple input, or more than one if it's a 'multiple' input)
     * @param {number} numberOfFiles
     * @returns {boolean}
     */
    private matchesInputCapacity;
    /**
     * Watch for changes to the disabled state of the underlying input element.
     * Keep the replacement element's disabled state in sync.
     * @returns {void}
     */
    private observeDisabledState;
    /**
     * A click on the button triggers a click on the actual (hidden) file input
     * @returns {void}
     */
    private onClick;
    /**
     * Put dragged files onto the file input element
     * Update component state
     * @param {DragEvent} event
     * @returns {void}
     */
    private onDrop;
    /**
     * Update the component with the current state of the file input
     * - update instruction message
     * - update the status message
     * - update CSS class on root element
     * @returns {void}
     */
    private onInput;
    /**
     * Sets the files attribute on the file input element from a provided file list
     * Fires an 'input' event on the file input element
     * @param {FileList} files
     * @returns {void}
     */
    private setFilesOnFileInputElement;
    /**
     * Sets the text used on parts of the file upload
     * - extends the default set of text with any alterations specified in component options
     * - sets pluralisation based on the file input's 'multiple' attribute
     * - freezes the resulting text to prevent further modification
     * @param extension
     * @returns {TextArgs}
     */
    private setText;
    /**
     * Sets the dragging CSS class on the drop zone
     * @returns {void}
     */
    private showDraggingState;
    /**
     * Transforms the native file input element to aset of elements we have more control over
     * - adds a visually hidden span for screen reader status updates
     * - adds a visible span for status text
     * - adds a visible span for instructional text so we're not using browser defaults
     * - adds a fake button with DS button styling for the "choose file" button
     *     with text that is not dependant on browser default
     * - hides the original file input but keeps it available for us to use its native
     *     behavior where needed
     * @returns {void}
     */
    private transformMarkup;
    /**
     * Synchronise the `disabled` state between the input and replacement button.
     * @returns {void}
     */
    private updateDisabledState;
    /**
     * In response to drag events:
     *  - updates the content/display of the drop zone pseudo button
     *  - updates the text content of the visually hidden announcements span
     * @param {DragEvent} event
     * @returns {void}
     */
    private updateDropzoneVisibility;
}
export default FileUpload;
