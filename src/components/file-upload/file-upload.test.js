import { vi, beforeEach, describe, expect, it } from 'vitest';
import loadHtml from '../../../loadHtml';
import FileUpload from './file-upload';

let dataTransfer, fileUploadElement, fileUploadModule;

// this lets us mock the needed drag events
function fireCustomEvent(eventName, element, data) {
    data = data || {};

    let event = new Event(eventName, { cancelable: true, bubbles: true });
    event = Object.assign(event, data);

    element.dispatchEvent(event);
}

describe('file upload', () => {
    beforeEach(async () => {
        await loadHtml('src/components/file-upload/file-upload.html');
        fileUploadElement = document.querySelector('.ds_file-upload');
    });

    it('can only be initialised once', () => {
        fileUploadModule = new FileUpload(fileUploadElement);
        const transformSpy = vi.spyOn(fileUploadModule, 'transformMarkup');

        fileUploadModule.init();
        fileUploadModule.init();

        expect(transformSpy.mock.calls.length).toEqual(1);
    });

    describe('markup transformation', () => {
        beforeEach(() => {
            fileUploadModule = new FileUpload(fileUploadElement);
            fileUploadModule.init();
        });

        describe('original file input', () => {
            it('visually hides the file input element', () => {
                expect(fileUploadModule.fileInputElement).toHaveAttribute('hidden');
                expect(fileUploadModule.fileInputElement).toHaveAttribute('aria-hidden', 'true');
            });

            it('sets file input tabindex to -1', () => {
                expect(fileUploadModule.fileInputElement).toHaveAttribute('tabindex', '-1');
            });
        });

        describe('"choose file" button', () => {
            it('renders the pseudo button element', () => {
                const pseudoButton = fileUploadElement.querySelector('.ds_file-upload__button');

                expect(pseudoButton.tagName).toEqual('SPAN');
                expect(pseudoButton.textContent).toEqual('Choose file');
            });
        });

        describe('instruction span', () => {
            it('renders the instruction span', () => {
                expect(fileUploadModule.instructionSpan).toBeInTheDocument();
                expect(fileUploadModule.instructionSpan.tagName).toEqual('SPAN');
                expect(fileUploadModule.instructionSpan).toHaveClass('ds_file-upload__instruction');
                expect(fileUploadModule.instructionSpan.id).toEqual(fileUploadModule.fileInputElement.id + '-instruction');
                expect(fileUploadModule.instructionSpan.textContent).toEqual('or drag and drop file here');
            });
        });

        describe('announcement span', () => {
            it('renders the announcement span', () => {
                expect(fileUploadModule.announcementsSpan).toBeInTheDocument();
                expect(fileUploadModule.announcementsSpan.tagName).toEqual('SPAN');
                expect(fileUploadModule.announcementsSpan).toHaveClass('visually-hidden');
                expect(fileUploadModule.announcementsSpan).toHaveAttribute('aria-live', 'assertive');
            });
        });

        describe('label', () => {
            it('modifies the label element', () => {
                const label = fileUploadElement.querySelector('label');

                expect(label.id).toEqual(fileUploadModule.fileInputElement.id + '-label');
            });
        });
    });

    describe('markup transformation: dropzone element', () => {
        beforeEach(() => {
            fileUploadModule = new FileUpload(fileUploadElement);
        });

        it('renders the dropzone element', () => {
            fileUploadModule.init();

            expect(fileUploadModule.dropzoneButton).toBeInTheDocument();
            expect(fileUploadModule.dropzoneButton.tagName).toEqual('BUTTON');
            expect(fileUploadModule.dropzoneButton.type).toEqual('button');
            expect(fileUploadModule.dropzoneButton).toHaveClass('ds_file-upload__dropzone');
        });

        it('maps aria-describedby from the file input element if it is set', () => {
            const ARIA_DESCRIBEDBY = 'foo';
            fileUploadModule.fileInputElement.setAttribute('aria-describedby', ARIA_DESCRIBEDBY);

            fileUploadModule.init();

            expect(fileUploadModule.dropzoneButton).toHaveAttribute('aria-describedby', ARIA_DESCRIBEDBY);
        });

        it('maps aria-invalid from the file input element if it is set', () => {
            const ARIA_INVALID = 'true';
            fileUploadModule.fileInputElement.setAttribute('aria-invalid', ARIA_INVALID);

            fileUploadModule.init();

            expect(fileUploadModule.dropzoneButton).toHaveAttribute('aria-invalid', ARIA_INVALID);
        });

        it('adds an error class if one is set on the file input element', () => {
            fileUploadModule.fileInputElement.classList.add('ds_file-upload__input--error');

            fileUploadModule.init();

            expect(fileUploadModule.dropzoneButton).toHaveClass('ds_file-upload__dropzone--error');
        });
    });

    describe('dropzone events', () => {
        beforeEach(() => {
            fileUploadModule = new FileUpload(fileUploadElement);
            fileUploadModule.init();
        });

        it('clicking on the dropzone should trigger a click on the file upload', () => {
            const clickSpy = vi.spyOn(fileUploadModule.dropzoneButton, 'click');

            fileUploadModule.dropzoneButton.click();

            expect(clickSpy).toHaveBeenCalled();
        });

        describe('file dragging', () => {
            const INITIAL_MESSAGE = 'foo';

            beforeEach(() => {
                dataTransfer = new DataTransfer();
                fileUploadModule = new FileUpload(fileUploadElement);
                fileUploadModule.init();
                fileUploadModule.announcementsSpan.textContent = INITIAL_MESSAGE;
            });

            it('happy path: dragging a file onto an enabled dropzone', () => {
                /**
                 * Note: it's not possible to create a DataTransfer's files directly, as files is a
                 * read-only property. This is a workaround whereby we use a dummy DataTransfer,
                 * adding files via items.add().
                 */
                const file = new File(['My file'], 'myfile.txt', { type: 'text/plain' });
                dataTransfer.items.add(file);

                fireCustomEvent('dragenter', fileUploadModule.dropzoneButton, { dataTransfer: dataTransfer });

                expect(fileUploadModule.dropzoneButton).toHaveClass('ds_file-upload__dropzone--dragging');
                expect(fileUploadModule.announcementsSpan.textContent).toEqual('Entered drop zone');
                expect(fileUploadModule.instructionSpan.textContent).toEqual('Drop file here');
            });

            it('dragging without a payload', () => {
                fireCustomEvent('dragenter', fileUploadModule.dropzoneButton);

                // do nothing
                expect(fileUploadModule.dropzoneButton).not.toHaveClass('ds_file-upload__dropzone--dragging');
                expect(fileUploadModule.announcementsSpan.textContent).toEqual(INITIAL_MESSAGE);
                expect(fileUploadModule.instructionSpan.textContent).toEqual('or drag and drop file here');
            });

            it('dragging onto a disabled dropzone', () => {
                fileUploadModule.dropzoneButton.disabled = true;

                const file = new File(['My file'], 'myfile.txt', { type: 'text/plain' });
                dataTransfer.items.add(file);

                fireCustomEvent('dragenter', fileUploadModule.dropzoneButton, { dataTransfer: dataTransfer });

                // do nothing
                expect(fileUploadModule.dropzoneButton).not.toHaveClass('ds_file-upload__dropzone--dragging');
                expect(fileUploadModule.announcementsSpan.textContent).toEqual(INITIAL_MESSAGE);
                expect(fileUploadModule.instructionSpan.textContent).toEqual('or drag and drop file here');
            });

            it('exiting the dropzone', () => {
                fireCustomEvent('dragleave', fileUploadModule.dropzoneButton);

                expect(fileUploadModule.announcementsSpan.textContent).toEqual('Left drop zone');
            });

            it('should reset display if the event target isn\'t in the file upload markup', () => {
                const fakeElement = document.createElement('div');
                document.body.appendChild(fakeElement);

                fireCustomEvent('dragenter', fakeElement);

                expect(fileUploadModule.dropzoneButton).not.toHaveClass('ds_file-upload__dropzone--dragging');
                expect(fileUploadModule.announcementsSpan.textContent).toEqual('Left drop zone');
                expect(fileUploadModule.instructionSpan.textContent).toEqual('or drag and drop file here');
            });

            it('dragover does nothing', () => {
                fireCustomEvent('dragover', fileUploadModule.dropzoneButton);
                // todo: nothing to assert
            });
        });

        describe('"can drop" scenarios', () => {
            let file;

            beforeEach(() => {
                dataTransfer = new DataTransfer();
                file = new File(['My file'], 'myfile.txt', { type: 'text/plain' });
            });

            it('dragging a single file onto a single file upload', () => {
                fileUploadModule = new FileUpload(fileUploadElement);
                dataTransfer.items.add(file);

                const canDropResult = fileUploadModule.canDrop(dataTransfer);

                expect(canDropResult).toEqual(true);
            });

            it('dragging multiple files onto a single file upload', () => {
                fileUploadModule = new FileUpload(fileUploadElement);
                dataTransfer.items.add(file);
                dataTransfer.items.add(file);

                const canDropResult = fileUploadModule.canDrop(dataTransfer);

                expect(canDropResult).toEqual(false);
            });

            it('dragging files onto a multiple file upload', () => {
                fileUploadElement.querySelector('input[type="file"]').multiple = true;
                fileUploadModule = new FileUpload(fileUploadElement);
                dataTransfer.items.add(file);

                const canDropResult = fileUploadModule.canDrop(dataTransfer);

                expect(canDropResult).toEqual(true);
            });

            it('dragging no files, no types in dataTransfer', () => {
                fileUploadModule = new FileUpload(fileUploadElement);

                const canDropResult = fileUploadModule.canDrop(dataTransfer);

                expect(canDropResult).toEqual(true);
            });

            it('dragging no files, no wanted types in dataTransfer', () => {
                /**
                 * Note: we have to provide a mock DataTransfer here using data from our
                 * dataTransfer object and an additional types property
                 */
                fileUploadModule = new FileUpload(fileUploadElement);

                const canDropResult = fileUploadModule.canDrop({ files: dataTransfer.files, items: dataTransfer.items, types: ['foo', 'bar'] });

                expect(canDropResult).toEqual(false);
            });

            it('dragging no files, wanted types in dataTransfer', () => {
                /**
                 * Note: we have to provide a mock DataTransfer here using data from our
                 * dataTransfer object and an additional types property
                 */
                fileUploadModule = new FileUpload(fileUploadElement);

                const canDropResult = fileUploadModule.canDrop({ files: dataTransfer.files, items: dataTransfer.items, types: ['Files', 'bar'] });

                expect(canDropResult).toEqual(true);
            });
        });

        describe('file dropping', () => {
            beforeEach(() => {
                dataTransfer = new DataTransfer();
                fileUploadModule = new FileUpload(fileUploadElement);
                fileUploadModule.init();
            });

            it('happy path: a simple file upload', () => {
                const file = new File(['My file'], 'myfile.txt', { type: 'text/plain' });
                dataTransfer.items.add(file);

                fireCustomEvent('drop', fileUploadModule.dropzoneButton, { dataTransfer: dataTransfer });

                expect(fileUploadModule.instructionSpan.textContent).toEqual('myfile.txt');
            });

            it('no dataTransfer', () => {
                fireCustomEvent('drop', fileUploadModule.dropzoneButton);

                expect(fileUploadModule.instructionSpan.textContent).toEqual('or drag and drop file here');
            });

            it('not an accepted type', () => {
                const file = new File(['My file'], 'myfile.txt', { type: 'text/plain' });
                dataTransfer.items.add(file);
                fileUploadModule.fileInputElement.accept = 'image/jpg'

                fireCustomEvent('drop', fileUploadModule.dropzoneButton, { dataTransfer: dataTransfer });

                expect(fileUploadModule.instructionSpan.textContent).toEqual('or drag and drop file here');
            });

            it('not able to fill input', () => {
                const file = new File(['My file'], 'myfile.txt', { type: 'text/plain' });
                dataTransfer.items.add(file);
                dataTransfer.items.add(file);

                fireCustomEvent('drop', fileUploadModule.dropzoneButton, { dataTransfer: dataTransfer });

                expect(fileUploadModule.instructionSpan.textContent).toEqual('or drag and drop file here');
            });
        });

        describe('"can accept" scenarios', () => {
            beforeEach(() => {
                fileUploadModule = new FileUpload(fileUploadElement);
            });

            // no restrictions
            it('accept by default if there is no "accept" attribute', () => {
                const file = new File(['My file'], 'myfile.txt', { type: 'text/plain' });

                const canAcceptResult = fileUploadModule.canAccept([file]);

                expect(canAcceptResult).toEqual(true);
            });

            // file extension
            it('file with allowed file extension is accepted', () => {
                fileUploadModule.fileInputElement.accept = '.txt';
                const file = new File(['My file'], 'myfile.txt', { type: 'text/plain' });

                const canAcceptResult = fileUploadModule.canAccept([file]);

                expect(canAcceptResult).toEqual(true);
            });

            it('file without allowed file extension is NOT accepted', () => {
                fileUploadModule.fileInputElement.accept = '.txt';
                const file = new File(['My file'], 'myfile.js', { type: 'text/javascript' });

                const canAcceptResult = fileUploadModule.canAccept([file]);

                expect(canAcceptResult).toEqual(false);
            });

            // mime type
            it('file with allowed MIME type is accepted', () => {
                fileUploadModule.fileInputElement.accept = 'text/plain';
                const file = new File(['My file'], 'myfile.txt', { type: 'text/plain' });

                const canAcceptResult = fileUploadModule.canAccept([file]);

                expect(canAcceptResult).toEqual(true);
            });

            it('file without allowed MIME type is NOT accepted', () => {
                fileUploadModule.fileInputElement.accept = 'text/plain';
                const file = new File(['My file'], 'myfile.js', { type: 'text/javascript' });

                const canAcceptResult = fileUploadModule.canAccept([file]);

                expect(canAcceptResult).toEqual(false);
            });

            // media wildcard
            it('file with matching media type type is accepted', () => {
                fileUploadModule.fileInputElement.accept = 'image/*';
                const file = new File(['My file'], 'myfile.png', { type: 'image/png' });

                const canAcceptResult = fileUploadModule.canAccept([file]);

                expect(canAcceptResult).toEqual(true);
            });

            it('file without matching media type type is NOT accepted', () => {
                fileUploadModule.fileInputElement.accept = 'audio/*';
                const file = new File(['My file'], 'myfile.png', { type: 'image/png' });

                const canAcceptResult = fileUploadModule.canAccept([file]);

                expect(canAcceptResult).toEqual(false);
            });

            // invalid 'accept'
            it('file not accepted if "accept" attribute not a known format', () => {
                fileUploadModule.fileInputElement.accept = 'foobarbaz';
                const file = new File(['My file'], 'myfile.png', { type: 'image/png' });

                const canAcceptResult = fileUploadModule.canAccept([file]);

                expect(canAcceptResult).toEqual(false);
            });

            // if one file doesn't match, all are rejected
            it('all files not accepted if one file not accepted', () => {
                fileUploadModule.fileInputElement.accept = '.txt';
                const file1 = new File(['My first file'], 'myfile1.txt', { type: 'text/plain' });
                const file2 = new File(['My second file'], 'myfile2.doc', { type: 'application/msword' });
                const file3 = new File(['My third file'], 'myfile3.png', { type: 'image/png' });

                const canAcceptResult = fileUploadModule.canAccept([file1, file2, file3]);

                expect(canAcceptResult).toEqual(false);
            });

            it('multiple accept items', () => {
                fileUploadModule.fileInputElement.accept = '.txt,image/*,application/msword';
                const file1 = new File(['My first file'], 'myfile1.txt', { type: 'text/plain' });
                const file2 = new File(['My second file'], 'myfile2.doc', { type: 'application/msword' });
                const file3 = new File(['My third file'], 'myfile3.png', { type: 'image/png' });

                const canAcceptResult = fileUploadModule.canAccept([file1, file2, file3]);

                expect(canAcceptResult).toEqual(true);
            });
        });

        describe('file input "onchange" scenarios', () => {
            beforeEach(() => {
                dataTransfer = new DataTransfer();
            });

            it('should show the default instruction text if no files are added', () => {
                /**
                 * Note: we cannot create or manipulate a FileList directly. Instead, we use a dummy
                 * DataTransfer we we have for the drag event specs elsewhere in this suite.
                 */
                fileUploadModule.fileInputElement.files = dataTransfer.files;
                fileUploadModule.fileInputElement.dispatchEvent(new Event('change'));

                expect(fileUploadModule.instructionSpan.textContent).toEqual('or drag and drop file here');
            });

            it('should show the selected filename if one file is added', () => {
                const FILENAME = 'myfile.txt';

                // create a FileList using DataTransfer
                const file = new File(['My file'], FILENAME, { type: 'text/plain' });
                dataTransfer.items.add(file);

                fileUploadModule.fileInputElement.files = dataTransfer.files;
                fileUploadModule.fileInputElement.dispatchEvent(new Event('change'));

                expect(fileUploadModule.instructionSpan.textContent).toEqual(FILENAME);
            });

            it('should do something else if multiple files are added', () => {
                // create a FileList using DataTransfer
                const file = new File(['My file'], 'myfile.txt', { type: 'text/plain' });
                dataTransfer.items.add(file);
                dataTransfer.items.add(file);

                fileUploadModule.fileInputElement.files = dataTransfer.files;
                fileUploadModule.fileInputElement.dispatchEvent(new Event('change'));

                // todo: assert correctly when scenario known
                expect(fileUploadModule.instructionSpan.textContent).toEqual('or drag and drop file here');
            });
        });
    });

    describe('things that are different in a multiple file upload', () => {
        it('uses plural text', () => {
            fileUploadElement.querySelector('input[type="file"]').multiple = true;

            fileUploadModule = new FileUpload(fileUploadElement);

            expect(fileUploadModule.text.buttonText).toEqual('Choose files');
            expect(fileUploadModule.text.defaultInstructionText).toEqual('or drag and drop files here');
            expect(fileUploadModule.text.draggingInstructionText).toEqual('Drop files here');

            fileUploadModule.init();

            expect(fileUploadModule.dropzoneButton.textContent).toEqual('Choose files, or drag and drop files here');
        });
    });

    describe('using custom text in the file upload', () => {
        const customText = {
            buttonText: 'AAA',
            buttonTextPlural: 'AAA plural',
            defaultInstructionText: 'BBB',
            defaultInstructionTextPlural: 'BBB plural',
            draggingInstructionText: 'CCC',
            draggingInstructionTextPlural: 'CCC plural',
            enteredDropzone: 'DDD',
            leftDropzone: 'EEE',
        };

        it('single file upload', () => {
            fileUploadModule = new FileUpload(fileUploadElement, { text: customText });

            expect(fileUploadModule.text.buttonText).toEqual('AAA');
            expect(fileUploadModule.text.defaultInstructionText).toEqual('BBB');
            expect(fileUploadModule.text.draggingInstructionText).toEqual('CCC');
            expect(fileUploadModule.text.enteredDropzone).toEqual('DDD');
            expect(fileUploadModule.text.leftDropzone).toEqual('EEE');
        });

        it('multiple file upload', () => {
            fileUploadElement.querySelector('input[type="file"]').multiple = true;

            fileUploadModule = new FileUpload(fileUploadElement, { text: customText });

            expect(fileUploadModule.text.buttonText).toEqual('AAA plural');
            expect(fileUploadModule.text.defaultInstructionText).toEqual('BBB plural');
            expect(fileUploadModule.text.draggingInstructionText).toEqual('CCC plural');
            expect(fileUploadModule.text.enteredDropzone).toEqual('DDD');
            expect(fileUploadModule.text.leftDropzone).toEqual('EEE');
        });
    });
});
