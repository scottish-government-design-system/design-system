'use strict';

import DSComponent from '../../base/component/component';



class FileUpload extends DSComponent {
    private defaultInstructionTextContent: string;
    private dropzoneButton: HTMLButtonElement;
    private element: HTMLElement;
    private fileInputElement: HTMLInputElement;
    private instructionSpan: HTMLSpanElement;

    constructor(
        element: HTMLElement,
        options: any = {}
    ) {
        super(element);
        this.element = element;
        this.fileInputElement = this.element.querySelector('input[type="file"]');
        this.defaultInstructionTextContent = 'or drag and drop files here';
    }

    init() {
        this.transformMarkup();
        this.isInitialised = true;
    }

    hideDraggingState() {
        this.dropzoneButton.classList.remove('ds_file-upload__dropzone--dragging');
    }

    onChange() {
        const fileCount = this.fileInputElement.files.length;

        if (fileCount === 0) {
            // show default selection text
        } else if (fileCount === 1) {
            this.instructionSpan.textContent = this.fileInputElement.files[0].name;
        } else {
            this.instructionSpan.textContent = 'todo: multiple files chosen';
        }
    }

    onClick() {
        this.fileInputElement.click();
    }

    onDrop(event: DragEvent) {
        event.preventDefault();

        // todo: an if check
        if (event.dataTransfer) {
            this.fileInputElement.files = event.dataTransfer.files;

            this.fileInputElement.dispatchEvent(new CustomEvent('change'));

            this.hideDraggingState();
        }
    }

    showDraggingState() {
        this.dropzoneButton.classList.add('ds_file-upload__dropzone--dragging');
    }

    transformMarkup() {
        // aria-live region to announce status updates to screen readers
        const announcementsSpan = document.createElement('span');
        announcementsSpan.classList.add('visually-hidden');
        announcementsSpan.setAttribute('aria-live', 'assertive');

        // replacement button element
        this.dropzoneButton = document.createElement('button');
        this.dropzoneButton.classList.add('ds_file-upload__dropzone');
        this.dropzoneButton.setAttribute('type', 'button');
        // todo: clone describedby, error state, etc?

        // a span that looks like a regular DS button
        const pseudoButtonSpan = document.createElement('span');
        pseudoButtonSpan.classList.add('ds_file-upload__button');
        pseudoButtonSpan.textContent = 'Choose file';

        // a span that contains basic instruction text
        this.instructionSpan = document.createElement('span');
        this.instructionSpan.innerText = this.defaultInstructionTextContent;

        // hide the original file input
        this.fileInputElement.setAttribute('aria-hidden', 'true');
        this.fileInputElement.setAttribute('hidden', 'true');
        this.fileInputElement.setAttribute('tabindex', '-1');

        // putting the bits together
        this.element.insertAdjacentElement('afterend', announcementsSpan);
        this.dropzoneButton.appendChild(pseudoButtonSpan);
        this.dropzoneButton.appendChild(this.instructionSpan);
        this.fileInputElement.insertAdjacentElement('beforebegin', this.dropzoneButton);

        // events

        this.dropzoneButton.addEventListener('click', this.onClick.bind(this));
        this.dropzoneButton.addEventListener('dragover', event => { event.preventDefault() });
        this.dropzoneButton.addEventListener('drop', this.onDrop.bind(this));

        this.fileInputElement.addEventListener('change', this.onChange.bind(this));

        document.addEventListener('dragenter', this.updateDropzoneVisibility.bind(this));

        // synchronise some things
        // GDS syncs disabled
        // this.updateDisabledState()
        // this.observeDisabledState()
    }

    updateDropzoneVisibility(event: DragEvent) {
        if (event.target instanceof Node) {
            if (this.element.contains(event.target)) {
                this.showDraggingState();
                this.instructionSpan.textContent = 'Drop files here';
                // announce dropzone entry
            } else {
                this.hideDraggingState();
                this.instructionSpan.textContent = this.defaultInstructionTextContent;
                // anounce dropzone exit
            }
        }
    }
};

export default FileUpload;
