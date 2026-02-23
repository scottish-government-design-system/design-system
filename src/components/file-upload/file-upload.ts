'use strict';

/**
 * Heavily based on the GOVUK Design System file upload component
 * https://design-system.service.gov.uk/components/file-upload/
 */
import DSComponent from '../../base/component/component';
import humanFileSize from './file-size';

type TextArgs = {
    buttonText: string
    defaultInstructionText: string
    draggingInstructionText: string
    enteredDropzone: string
    filesListHeading: string
    leftDropzone: string
    remainingFileSizeString: string
}

type OptionsArgs = {
    text?: Partial<TextArgs>
}

export const defaultText = {
    buttonText: 'Choose file',
    buttonTextPlural: 'Choose files',
    defaultInstructionText: 'or drag and drop file here',
    defaultInstructionTextPlural: 'or drag and drop files here',
    draggingInstructionText: 'Drop file here',
    draggingInstructionTextPlural: 'Drop files here',
    enteredDropzone: 'Entered drop zone',
    filesListHeading: 'Files selected for upload',
    leftDropzone: 'Left drop zone',
    remainingFileSizeString: '$REMAINING of $MAXIMUM remaining'
};

/**
 * File upload component
 *
 * @class FileUpload
 * @extends DSComponent
 * @property {HTMLSpanElement} announcementsSpan
 * @property {HTMLButtonElement} dropzoneButton
 * @property {HTMLElement} element
 * @property {HTMLSpanElement} fileInputElement
 * @property {boolean} hasEnteredAnotherElement
 * @property {HTMLSpanElement} instructionSpan
 * @property {TextArgs} text
 */
class FileUpload extends DSComponent {
    private announcementsSpan: HTMLSpanElement;
    private dropzoneButton: HTMLButtonElement;
    private element: HTMLElement;
    private fileInputElement: HTMLInputElement;
    private fileListElement!: HTMLDivElement; // todo
    private hasEnteredAnotherElement: boolean;
    private instructionSpan: HTMLSpanElement;
    private text: TextArgs;

    static defaultText = defaultText;

    #instructionText: string;

    constructor(
        element: HTMLElement,
        options: OptionsArgs = {}
    ) {
        super(element);
        this.element = element;
        this.fileInputElement = this.element.querySelector('input[type="file"]') as HTMLInputElement;
        this.text = this.setText(options.text);
        this.#instructionText = this.text.defaultInstructionText;

        this.announcementsSpan = document.createElement('span');
        this.dropzoneButton = document.createElement('button');
        this.instructionSpan = document.createElement('span');

        this.hasEnteredAnotherElement = false;
    }

    init() {
        if (this.isInitialised) {
            return;
        }
        this.transformMarkup();
        this.addEventListeners();
        this.isInitialised = true;
    }

    /**
     * Adds events to mimic/duplicate the native file input behaviour where needed
     * @returns {void}
     */
    addEventListeners(): void {
        this.dropzoneButton.addEventListener('click', this.onClick.bind(this));
        this.dropzoneButton.addEventListener('dragover', event => { event.preventDefault() });
        this.dropzoneButton.addEventListener('drop', this.onDrop.bind(this));

        this.fileInputElement.addEventListener('change', this.onChange.bind(this));

        document.addEventListener('dragenter', this.updateDropzoneVisibility.bind(this));

        document.addEventListener('dragenter', () => {
            this.hasEnteredAnotherElement = true
        });

        document.addEventListener('dragleave', () => {
            if (!this.hasEnteredAnotherElement && !this.dropzoneButton.disabled) {
                this.hideDraggingState();
                this.announcementsSpan.textContent = this.text.leftDropzone;
            }
            this.hasEnteredAnotherElement = false;
        });

        this.element.addEventListener('click', (event) => {
            const targetElement = event.target as HTMLElement;

            if (targetElement.classList.contains('js-remove-file')) {
                const dummyDataTransfer = new DataTransfer();

                for (const file of this.fileInputElement.files as FileList) {
                    if (file.name !== targetElement.querySelector('span')?.textContent) {
                        dummyDataTransfer.items.add(file);
                    }
                }

                this.fileInputElement.files = dummyDataTransfer.files;
                this.updateFileListFromFileInputElement();
            }
        });
    }

    /**
     * Checks the selected files against the `accept` attribute of the file input element
     * @param {FileList} files
     * @returns {boolean}
     */
    canAccept(files: FileList): boolean {
        let canAccept = true;

        if (!this.fileInputElement.accept) {
            // no restrictions, just return true
            return true;
        }

        const canAcceptFile = (file: File): boolean => {
            let canAcceptFile = false;
            const accepts = this.fileInputElement.accept.replace(' ', '').split(',');
            accepts.forEach((accept: string) => {
                if (accept.match(/^\.\w+/)) { // file extension
                    const test = new RegExp(accept + '$');
                    if (file.name.match(test)) {
                        canAcceptFile = true;
                    }
                } else if (accept.match(/\w+\/\w.+/)) { // mime type (fairly weak string format check)
                    if (file.type === accept) {
                        canAcceptFile = true
                    }
                } else if (accept.match(/audio|image|video\/*/)) { // media wildcard
                    if (file.type.match(new RegExp(accept.replace('*', '.+')))) {
                        canAcceptFile = true;
                    }
                }
            });

            return canAcceptFile;
        }

        [].slice.call(files).forEach((file) => {
            if (!canAcceptFile(file)) {
                canAccept = false;
            }
        })

        return canAccept;
    }

    /**
     * Check whether the content of what is being dragged can be dropped onto the file input
     * @param {DataTransfer} dataTransfer
     * @returns {boolean}
     */
    canDrop(dataTransfer: DataTransfer): boolean {
        // if the browser gives a list of items, use that
        if (dataTransfer.items?.length) {
            return this.matchesInputCapacity(this.countFileItems(dataTransfer.items))
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
    canFillInput(dataTransfer: DataTransfer): boolean {
        return this.matchesInputCapacity(dataTransfer.files.length)
    }

    /**
     * Returns the number of DataTransferItems that have the "file" type/kind
     * @param {DataTransferItemList} list
     * @returns {number}
     */
    countFileItems(list: DataTransferItemList): number {
        return [].slice.call(list).filter((item: DataTransferItem) => item.kind === 'file').length;
    }

    // todo: comment
    // todo: header level? :scream:
    fileListTemplate(fileList: FileList) {
        const maximumSize = 5000000;
        let filesHTML = '';
        let currentSize = 0;

        for (const file of fileList) {
            filesHTML += `<div class="ds_summary-list__item">
                <dt class="ds_summary-list__key">${file.name}</dt>
                <dd class="ds_summary-list__value">Size: ${humanFileSize(file.size)}</dd>
                <dd class="ds_summary-list__actions">
                    <button type="button" class="ds_link  js-remove-file">Remove <span class="visually-hidden">${file.name}</span></button>
                </dd>
            </div>`;

            currentSize = currentSize + file.size;
        }


        let ppp;
        if (maximumSize) {
            ppp = this.text.remainingFileSizeString.replace('$REMAINING', humanFileSize(maximumSize - currentSize)).replace('$MAXIMUM', humanFileSize(maximumSize));
        }

        const fileListHtml = `<h3 class="ds_file-upload__file-list-title">${this.text.filesListHeading} (${fileList.length})</h3>
                ${maximumSize ? `<p class="ds_hint-text  ds_no-margin">${ppp}</p>` : ''}

                <dl class="ds_summary-list">
                    ${filesHTML}
                </dl>`;

        return fileListHtml;
    }

    /**
     * Unsets the dragging CSS class on the drop zone
     * @returns {void}
     */
    hideDraggingState(): void {
        this.dropzoneButton.classList.remove('ds_file-upload__dropzone--dragging');
    }

    /**
     * Check that the number of files to be added matches the number allowed
     * (i.e. a single file for a non-multple input, or more than one if it's a 'multiple' input)
     * @param {number} numberOfFiles
     * @returns {boolean}
     */
    matchesInputCapacity(numberOfFiles: number): boolean {
        if (this.fileInputElement.multiple) {
            return numberOfFiles > 0;
        }

        return numberOfFiles === 1;
    }

    /**
     * Update the instruction message with the current state of the file input
     * @returns {void}
     */
    onChange(): void {
        const fileList = this.fileInputElement.files as FileList;

        if (this.fileInputElement.multiple) {
            this.#instructionText = this.text.defaultInstructionText
            this.updateFileListFromFileInputElement();
        } else {
            if (fileList.length === 0) {
                this.#instructionText = this.text.defaultInstructionText
            } else if (fileList.length === 1) {
                this.#instructionText = fileList[0].name;
            } else {
                this.#instructionText = this.text.defaultInstructionText
            }
        }

        this.instructionSpan.textContent = this.#instructionText;
    }

    /**
     * A click on the button triggers a click on the actual (hidden) file input
     * @returns {void}
     */
    onClick(): void {
        this.fileInputElement.click();
    }

    /**
     * Put dragged files onto the file input element
     * Update component state
     * @param {DragEvent} event
     * @returns {void}
     */
    onDrop(event: DragEvent): void {
        event.preventDefault();

        if (event.dataTransfer
            && this.canAccept(event.dataTransfer.files)
            && this.canFillInput(event.dataTransfer)
        ) {
            this.fileInputElement.files = event.dataTransfer.files;
            this.fileInputElement.dispatchEvent(new CustomEvent('change'));
            this.hideDraggingState();
        } else {
            this.instructionSpan.textContent = this.#instructionText;
            this.hideDraggingState();
        }

        return;
    }

    /**
     * Sets the text used on parts of the file upload
     * - extends the default set of text with any alterations specified in component options
     * - sets pluralisation based on the file input's 'multiple' attribute
     * - freezes the resulting text to prevent further modification
     * @param extension
     * @returns {TextArgs}
     */
    private setText(extension = {}): TextArgs {
        const extendedText = Object.assign(FileUpload.defaultText, extension);

        return Object.freeze({
            buttonText: this.fileInputElement.multiple ? extendedText.buttonTextPlural : extendedText.buttonText,
            defaultInstructionText: this.fileInputElement.multiple ? extendedText.defaultInstructionTextPlural : extendedText.defaultInstructionText,
            draggingInstructionText: this.fileInputElement.multiple ? extendedText.draggingInstructionTextPlural : extendedText.draggingInstructionText,
            enteredDropzone: extendedText.enteredDropzone,
            filesListHeading: extendedText.filesListHeading,
            leftDropzone: extendedText.leftDropzone,
            remainingFileSizeString: extendedText.remainingFileSizeString
        });
    }

    /**
     * Sets the dragging CSS class on the drop zone
     * @returns {void}
     */
    showDraggingState(): void {
        this.dropzoneButton.classList.add('ds_file-upload__dropzone--dragging');
    }

    /**
     * Transforms the native file input element to aset of elements we have more control over
     * - adds a visually hidden span for screen reader status updates
     * - adds a visible span for instructional text so we're not using browser defaults
     * - adds a fake button with DS button styling for the "choose file" button
     *   with text that is not dependant on browser default
     * - hides the original file input but keeps it available for us to use its native
     *   behavior where needed
     * @returns {void}
     */
    transformMarkup(): void {
        // aria-live region to announce status updates to screen readers
        this.announcementsSpan.classList.add('visually-hidden');
        this.announcementsSpan.setAttribute('aria-live', 'assertive');

        // add ID to the label if there isn't one already
        const label = this.element.querySelector(`[for="${this.fileInputElement.id}"]`) as HTMLLabelElement;
        label.id = label.id || this.fileInputElement.id + '-label';

        // replacement button element
        this.dropzoneButton.classList.add('ds_file-upload__dropzone');
        this.dropzoneButton.type = 'button';

        if (this.fileInputElement.getAttribute('aria-describedby')) {
            this.dropzoneButton.setAttribute('aria-describedby', this.fileInputElement.getAttribute('aria-describedby') as string);
        }
        if (this.fileInputElement.getAttribute('aria-invalid')) {
            this.dropzoneButton.setAttribute('aria-invalid', this.fileInputElement.getAttribute('aria-invalid') as string);
        }
        if (this.fileInputElement.classList.contains('ds_file-upload__input--error')) {
            this.dropzoneButton.classList.add('ds_file-upload__dropzone--error');
        }

        // a span that looks like a regular DS button
        const pseudoButtonSpan = document.createElement('span');
        pseudoButtonSpan.classList.add('ds_file-upload__button');
        pseudoButtonSpan.textContent = this.text.buttonText;

        // a hidden span that just adds an audible pause when used in screen reader output
        const commaSpan = document.createElement('span')
        commaSpan.className = 'visually-hidden'
        commaSpan.textContent = ', ';
        commaSpan.id = `${this.fileInputElement.id}-comma`

        // a span that contains basic instruction text
        this.instructionSpan.classList.add('ds_file-upload__instruction')
        this.instructionSpan.textContent = this.text.defaultInstructionText;
        this.instructionSpan.id = `${this.fileInputElement.id}-instruction`;

        // hide the original file input
        this.fileInputElement.setAttribute('aria-hidden', 'true');
        this.fileInputElement.setAttribute('hidden', 'true');
        this.fileInputElement.setAttribute('tabindex', '-1');

        // putting the bits together
        this.element.insertAdjacentElement('afterend', this.announcementsSpan);
        this.dropzoneButton.appendChild(pseudoButtonSpan);
        this.dropzoneButton.appendChild(commaSpan);
        this.dropzoneButton.appendChild(this.instructionSpan);
        this.fileInputElement.insertAdjacentElement('beforebegin', this.dropzoneButton);

        this.dropzoneButton.setAttribute('aria-labelledby', `${label.id} ${commaSpan.id} ${this.instructionSpan.id}`);

        // synchronise some things
        // GDS syncs disabled
        // this.updateDisabledState()
        // this.observeDisabledState()






        /**
         *  if it's a multiple upload, add:
         * "no files chosen" / "X files chosen" container
         *   - aria describedby
         *
         * container for files
         */

        if (this.fileInputElement.multiple) {
            this.fileListElement = document.createElement('div');
            this.element.appendChild(this.fileListElement);
        }
    }

    /**
     * In response to drag events:
     *  - updates the content/display of the drop zone pseudo button
     *  - updates the text content of the visually hidden announcements span
     * @param {DragEvent} event
     * @returns {void}
     */
    updateDropzoneVisibility(event: DragEvent): void {
        if (this.dropzoneButton.disabled) {
            return;
        }

        if (this.element.contains(event.target as Node)) {
            if (event.dataTransfer
                && this.canDrop(event.dataTransfer)
                && !this.dropzoneButton.classList.contains('ds_file-upload__dropzone--dragging'))
            {
                this.showDraggingState();
                this.announcementsSpan.textContent = this.text.enteredDropzone;
                this.instructionSpan.textContent = this.text.draggingInstructionText;
            }
        } else {
            this.hideDraggingState();
            this.announcementsSpan.textContent = this.text.leftDropzone;
            this.instructionSpan.textContent = this.#instructionText;
        }
    }

    /**
     *
     */
    // todo: comment
    updateFileListFromFileInputElement() {
        if (this.fileInputElement.files?.length) {
            this.fileListElement.innerHTML = this.fileListTemplate(this.fileInputElement.files);
        } else {
            this.fileListElement.innerHTML = '';
        }
    }
};

export default FileUpload;
