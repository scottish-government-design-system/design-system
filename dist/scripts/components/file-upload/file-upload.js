'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultText = void 0;
/**
 * Heavily based on the GOVUK Design System file upload component
 * https://design-system.service.gov.uk/components/file-upload/
 */
const component_1 = __importDefault(require("../../base/component/component"));
exports.defaultText = {
    buttonText: 'Choose file',
    buttonTextPlural: 'Choose files',
    defaultStatusText: 'No file chosen',
    defaultStatusTextPlural: 'No files chosen',
    enteredDropzone: 'Entered drop zone',
    filesAddedText: '$NUMBER files',
    filesListHeading: 'Files selected for upload',
    instructionText: 'or drag and drop file here',
    instructionTextPlural: 'or drag and drop files here',
    leftDropzone: 'Left drop zone'
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
class FileUpload extends component_1.default {
    announcementsSpan;
    dropzoneButton;
    element;
    fileInputElement;
    hasEnteredAnotherElement;
    statusSpan;
    text;
    static defaultText = exports.defaultText;
    #statusText;
    constructor(element, options = {}) {
        super(element);
        this.element = element;
        this.fileInputElement = this.element.querySelector('input[type="file"]');
        if (this.fileInputElement === null) {
            throw new Error('File upload: input element not found');
        }
        if (!this.fileInputElement.id) {
            throw new Error('File upload: input element missing id');
        }
        this.text = this.setText(options.text);
        this.transformMarkup();
        this.addEventListeners();
        // observe disabled state
        this.updateDisabledState();
        this.observeDisabledState();
    }
    init() {
        this.isInitialised = true;
    }
    /**
     * Adds events to mimic/duplicate the native file input behaviour where needed
     * @returns {void}
     */
    addEventListeners() {
        this.dropzoneButton.addEventListener('click', this.onClick.bind(this));
        this.dropzoneButton.addEventListener('dragover', event => {
            // prevent default to allow drop
            event.preventDefault();
        });
        // button will need to handle drop event
        this.dropzoneButton.addEventListener('drop', this.onDrop.bind(this));
        // bind input event to the underlying input
        // todo: govuk uses 'change'
        this.fileInputElement.addEventListener('input', this.onInput.bind(this));
        document.addEventListener('dragenter', this.updateDropzoneVisibility.bind(this));
        // To detect if we're outside the document, we can track whether a dragenter preceded a
        // dragleave. If there wasn't, we are outside the document.
        document.addEventListener('dragenter', () => {
            this.hasEnteredAnotherElement = true;
        });
        document.addEventListener('dragleave', () => {
            if (!this.hasEnteredAnotherElement && !this.dropzoneButton.disabled) {
                this.hideDraggingState();
                this.announcementsSpan.textContent = this.text.leftDropzone;
            }
            this.hasEnteredAnotherElement = false;
        });
    }
    /**
     * Checks the selected files against the `accept` attribute of the file input element
     * @param {FileList} files
     * @returns {boolean}
     */
    canAccept(files) {
        let canAccept = true;
        if (!this.fileInputElement.accept) {
            // no restrictions, just return true
            return true;
        }
        const canAcceptFile = (file) => {
            let canAcceptFile = false;
            const accepts = this.fileInputElement.accept.replace(' ', '').split(',');
            accepts.forEach((accept) => {
                if (accept.match(/^\.\w+/)) { // file extension
                    const test = new RegExp(accept + '$');
                    if (file.name.match(test)) {
                        canAcceptFile = true;
                    }
                }
                else if (accept.match(/\w+\/\w.+/)) { // mime type (fairly weak string format check)
                    if (file.type === accept) {
                        canAcceptFile = true;
                    }
                }
                else if (accept.match(/audio|image|video\/*/)) { // media wildcard
                    if (file.type.match(new RegExp(accept.replace('*', '.+')))) {
                        canAcceptFile = true;
                    }
                }
            });
            return canAcceptFile;
        };
        [].slice.call(files).forEach((file) => {
            if (!canAcceptFile(file)) {
                canAccept = false;
            }
        });
        return canAccept;
    }
    /**
     * Check whether the content of what is being dragged can be dropped onto the file input
     * @param {DataTransfer} dataTransfer
     * @returns {boolean}
     */
    canDrop(dataTransfer) {
        // if the browser gives a list of items, use that
        if (dataTransfer.items?.length) {
            return this.matchesInputCapacity(this.countFileItems(dataTransfer.items));
        }
        // or, if we have type information, use that
        if (dataTransfer.types?.length) {
            return dataTransfer.types.includes('Files');
        }
        // otherwise, assume all other cases OK at this point
        return true;
    }
    /**
     * Confirms that the provided dataTransfer can fill the input
     * e.g. reject multiple files in a non-multiple input
     * @param {DataTransfer} dataTransfer
     * @returns {boolean}
     */
    canFillInput(dataTransfer) {
        return this.matchesInputCapacity(dataTransfer.files.length);
    }
    /**
     * Returns the number of DataTransferItems that have the "file" type/kind
     * @param {DataTransferItemList} list
     * @returns {number}
     */
    countFileItems(list) {
        return [].slice.call(list).filter((item) => item.kind === 'file').length;
    }
    /**
     * Unsets the dragging CSS class on the drop zone
     * @returns {void}
     */
    hideDraggingState() {
        this.dropzoneButton.classList.remove('ds_file-upload__dropzone--dragging');
    }
    /**
     * Check that the number of files to be added matches the number allowed
     * (i.e. a single file for a non-multple input, or more than one if it's a 'multiple' input)
     * @param {number} numberOfFiles
     * @returns {boolean}
     */
    matchesInputCapacity(numberOfFiles) {
        if (this.fileInputElement.multiple) {
            return numberOfFiles > 0;
        }
        return numberOfFiles === 1;
    }
    /**
     * Watch for changes to the disabled state of the underlying input element.
     * Keep the replacement element's disabled state in sync.
     * @returns {void}
     */
    observeDisabledState() {
        // watch for change to the disabled state
        const observer = new MutationObserver(mutationList => {
            for (const mutation of mutationList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
                    this.updateDisabledState();
                }
            }
        });
        observer.observe(this.fileInputElement, {
            attributes: true,
        });
    }
    /**
     * A click on the button triggers a click on the actual (hidden) file input
     * @returns {void}
     */
    onClick() {
        this.fileInputElement.click();
    }
    /**
     * Put dragged files onto the file input element
     * Update component state
     * @param {DragEvent} event
     * @returns {void}
     */
    onDrop(event) {
        event.preventDefault();
        if (event.dataTransfer
            && this.canAccept(event.dataTransfer.files)
            && this.canFillInput(event.dataTransfer)) {
            this.setFilesOnFileInputElement(event.dataTransfer.files);
            this.hideDraggingState();
        }
        // clear the dropzone announcement
        this.announcementsSpan.textContent = '';
        if (event.dataTransfer) {
            const dropHappened = new CustomEvent('dropHappened', {
                bubbles: true,
                composed: true,
                detail: {
                    files: event.dataTransfer.files,
                    canAccept: this.canAccept(event.dataTransfer.files),
                    canFill: this.canFillInput(event.dataTransfer)
                }
            });
            this.element.dispatchEvent(dropHappened);
        }
        ;
        return;
    }
    /**
     * Update the component with the current state of the file input
     * - update instruction message
     * - update the status message
     * - update CSS class on root element
     * @returns {void}
     */
    onInput() {
        const fileList = this.fileInputElement.files;
        if (fileList.length === 0) {
            this.#statusText = this.text.defaultStatusText;
            this.element.classList.remove('ds_file-upload--has-files');
        }
        else {
            if (fileList.length === 1) {
                this.#statusText = fileList[0].name;
            }
            else {
                this.#statusText = this.text.filesAddedText.replace('$NUMBER', fileList.length.toString());
            }
            this.element.classList.add('ds_file-upload--has-files');
        }
        this.statusSpan.textContent = this.#statusText;
    }
    /**
     * Sets the files attribute on the file input element from a provided file list
     * Fires an 'input' event on the file input element
     * @param {FileList} files
     * @returns {void}
     */
    setFilesOnFileInputElement(files) {
        this.fileInputElement.files = files;
        this.fileInputElement.dispatchEvent(new CustomEvent('input'));
    }
    /**
     * Sets the text used on parts of the file upload
     * - extends the default set of text with any alterations specified in component options
     * - sets pluralisation based on the file input's 'multiple' attribute
     * - freezes the resulting text to prevent further modification
     * @param extension
     * @returns {TextArgs}
     */
    setText(extension = {}) {
        const extendedText = Object.assign(FileUpload.defaultText, extension);
        return Object.freeze({
            buttonText: this.fileInputElement.multiple ? extendedText.buttonTextPlural : extendedText.buttonText,
            defaultStatusText: this.fileInputElement.multiple ? extendedText.defaultStatusTextPlural : extendedText.defaultStatusText,
            enteredDropzone: extendedText.enteredDropzone,
            filesAddedText: extendedText.filesAddedText,
            filesListHeading: extendedText.filesListHeading,
            instructionText: this.fileInputElement.multiple ? extendedText.instructionTextPlural : extendedText.instructionText,
            leftDropzone: extendedText.leftDropzone
        });
    }
    /**
     * Sets the dragging CSS class on the drop zone
     * @returns {void}
     */
    showDraggingState() {
        this.dropzoneButton.classList.add('ds_file-upload__dropzone--dragging');
    }
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
    transformMarkup() {
        // add ID to the label if there isn't one already
        const label = this.element.querySelector(`[for="${this.fileInputElement.id}"]`);
        label.id = label.id || this.fileInputElement.id + '-label';
        // hide the original file input
        this.fileInputElement.setAttribute('aria-hidden', 'true');
        this.fileInputElement.setAttribute('hidden', 'true');
        this.fileInputElement.setAttribute('tabindex', '-1');
        // replacement button element
        this.dropzoneButton = document.createElement('button');
        this.dropzoneButton.classList.add('ds_file-upload__dropzone');
        this.dropzoneButton.type = 'button';
        this.dropzoneButton.id = this.fileInputElement.id + '-dropzone';
        if (this.fileInputElement.getAttribute('aria-describedby')) {
            this.dropzoneButton.setAttribute('aria-describedby', this.fileInputElement.getAttribute('aria-describedby'));
        }
        if (this.fileInputElement.getAttribute('aria-invalid')) {
            this.dropzoneButton.setAttribute('aria-invalid', this.fileInputElement.getAttribute('aria-invalid'));
        }
        if (this.fileInputElement.classList.contains('ds_file-upload__input--error')) {
            this.dropzoneButton.classList.add('ds_file-upload__dropzone--error');
        }
        // a span that contains file status text (filename, file count, or no file chosen)
        this.statusSpan = document.createElement('span');
        this.statusSpan.classList.add('ds_file-upload__status');
        this.statusSpan.textContent = this.text.defaultStatusText;
        this.statusSpan.id = `${this.fileInputElement.id}-status`;
        this.statusSpan.setAttribute('aria-live', 'polite');
        // a hidden span that just adds an audible pause when used in screen reader output
        const commaSpan = document.createElement('span');
        commaSpan.className = 'visually-hidden';
        commaSpan.textContent = ', ';
        commaSpan.id = `${this.fileInputElement.id}-comma`;
        // a container for the pseudo button and instructions
        const containerSpan = document.createElement('span');
        containerSpan.classList.add('ds_file-upload__button-container');
        // a span that looks like a regular DS button
        const pseudoButtonSpan = document.createElement('span');
        pseudoButtonSpan.classList.add('ds_file-upload__button');
        pseudoButtonSpan.textContent = this.text.buttonText;
        // a span that contains basic instruction text
        const instructionSpan = document.createElement('span');
        instructionSpan.classList.add('ds_file-upload__instruction');
        instructionSpan.textContent = this.text.instructionText;
        instructionSpan.id = `${this.fileInputElement.id}-instruction`;
        // aria-live region to announce status updates to screen readers
        this.announcementsSpan = document.createElement('span');
        this.announcementsSpan.classList.add('visually-hidden');
        this.announcementsSpan.setAttribute('aria-live', 'assertive');
        // putting the bits together
        containerSpan.appendChild(pseudoButtonSpan);
        // Add a space so the button and instruction read correctly when CSS is disabled
        containerSpan.insertAdjacentText('beforeend', ' ');
        containerSpan.appendChild(instructionSpan);
        this.dropzoneButton.appendChild(this.statusSpan);
        this.dropzoneButton.appendChild(commaSpan);
        this.dropzoneButton.appendChild(containerSpan);
        this.dropzoneButton.setAttribute('aria-labelledby', `${label.id} ${commaSpan.id} ${this.dropzoneButton.id}`);
        this.fileInputElement.insertAdjacentElement('beforebegin', this.dropzoneButton);
        this.element.insertAdjacentElement('afterend', this.announcementsSpan);
    }
    /**
     * Synchronise the `disabled` state between the input and replacement button.
     * @returns {void}
     */
    updateDisabledState() {
        this.dropzoneButton.disabled = this.fileInputElement.disabled;
    }
    /**
     * In response to drag events:
     *  - updates the content/display of the drop zone pseudo button
     *  - updates the text content of the visually hidden announcements span
     * @param {DragEvent} event
     * @returns {void}
     */
    updateDropzoneVisibility(event) {
        if (this.dropzoneButton.disabled) {
            return;
        }
        if (this.dropzoneButton.contains(event.target)) {
            if (event.dataTransfer
                && this.canDrop(event.dataTransfer)
                && !this.dropzoneButton.classList.contains('ds_file-upload__dropzone--dragging')) {
                this.showDraggingState();
                this.announcementsSpan.textContent = this.text.enteredDropzone;
            }
        }
        else {
            this.hideDraggingState();
            this.announcementsSpan.textContent = this.text.leftDropzone;
        }
    }
}
;
exports.default = FileUpload;
