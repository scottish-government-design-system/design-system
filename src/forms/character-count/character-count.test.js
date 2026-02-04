import { vi, beforeEach, describe, expect, it } from 'vitest';
import loadHtml from '../../../loadHtml';
import CharacterCount from './character-count';

const testObj = {};

describe('character count', () => {
    beforeEach(async () => {
        await loadHtml('src/forms/character-count/character-count.html');
    });

    describe('setup', () => {
        it('should abandon attemts to call init() after it has been init-ed', () => {
            testObj.characterCountElement = document.querySelector('#maxlength');
            testObj.characterCountModule = new CharacterCount(testObj.characterCountElement);
            testObj.characterCountModule.init();

            vi.spyOn(testObj.characterCountModule.field.classList, 'add').mockImplementation();
            testObj.characterCountModule.init();
            expect(testObj.characterCountModule.field.classList.add).not.toHaveBeenCalledWith('js-initialised');
        });

        describe('missing information', () => {
            it('should exit if no maxlength set', () => {
                testObj.characterCountElement = document.querySelector('#bad-no-maxlength');
                testObj.characterCountModule = new CharacterCount(testObj.characterCountElement);
                testObj.characterCountModule.init();
                const countElement = testObj.characterCountElement.querySelectorAll('.ds_input__message');
                expect(countElement.length).toEqual(0);
            });

            it('should exit if no input element present', () => {
                testObj.characterCountElement = document.querySelector('#bad-no-input');
                testObj.characterCountModule = new CharacterCount(testObj.characterCountElement);
                testObj.characterCountModule.init();
                const countElement = testObj.characterCountElement.querySelectorAll('.ds_input__message');
                expect(countElement.length).toEqual(0);
            });
        });

        describe('progressively enhanced maxlength attribute', () => {
            it('should set a max length correctly and remove the maxlength attribute', () => {
                testObj.characterCountElement = document.querySelector('#maxlength');
                const expectedMaxLength = parseInt(document.querySelector('#textinput1-character-limit').getAttribute('maxlength'), 10);

                testObj.characterCountModule = new CharacterCount(testObj.characterCountElement);
                testObj.characterCountModule.init();

                expect(testObj.characterCountModule.maxLength).toEqual(expectedMaxLength);
                expect(document.querySelector('#textinput1-character-limit').getAttribute('maxlength')).toBeNull();
            });

        });

        describe('maxlength as data atribute', () => {
            it('should set a max length correctly', () => {
                testObj.characterCountElement = document.querySelector('#data-maxlength');
                const expectedMaxLength = Number(testObj.characterCountElement.dataset.maxlength);

                testObj.characterCountModule = new CharacterCount(testObj.characterCountElement);
                testObj.characterCountModule.init();

                expect(testObj.characterCountModule.maxLength).toEqual(expectedMaxLength);
            });
        });

        describe('count threshold', () => {
            beforeEach(() => {
                testObj.characterCountElement = document.querySelector('#data-threshold');
                testObj.characterCountModule = new CharacterCount(testObj.characterCountElement);
            });

            it('on init, should hide the character count if necessary', () => {
                testObj.characterCountModule.init();

                const countElement = testObj.characterCountElement.querySelector('.ds_input__message');

                expect(countElement.classList.contains('fully-hidden')).toEqual(true);
            });

            it('on init, should show the character count if the input is prepopulated and the input length is greater than the threshold', () => {
                const inputElement = testObj.characterCountElement.querySelector('input');
                inputElement.value = '1234567890123456789';

                testObj.characterCountModule.init();

                const countElement = testObj.characterCountElement.querySelector('.ds_input__message');

                expect(countElement.classList.contains('fully-hidden')).toEqual(false);
            });
        });

        describe('common', () => {
            beforeEach(() => {
                testObj.characterCountElement = document.querySelector('#maxlength');
                testObj.characterCountModule = new CharacterCount(testObj.characterCountElement);
            });

            it('should create an element to display the character count in', () => {
                testObj.characterCountModule.init();

                expect(testObj.characterCountElement.querySelectorAll('.ds_input__message').length).toEqual(1);
            });

            it('should have an element containing the unmodified count in aria-describedby for the input element', () => {
                testObj.characterCountModule.init();

                const initialCountElement = testObj.characterCountElement.querySelector('.ds_character-count__initial');
                expect(initialCountElement.textContent).toEqual('You can enter up to 20 characters');
                expect(testObj.characterCountModule.inputElement.getAttribute('aria-describedby')).toContain(initialCountElement.id);
            });
        });
    });

    describe ('updating character count', () => {
        beforeEach(() => {
            testObj.characterCountElement = document.querySelector('#maxlength');
            testObj.characterCountModule = new CharacterCount(testObj.characterCountElement);
        });

        it('should decrement the character count as the user types', () => {
            testObj.characterCountModule.init();

            const inputElement = testObj.characterCountElement.querySelector('input');
            const countElement = testObj.characterCountElement.querySelector('.ds_input__message');

            // 6 characters. our max is 20.
            inputElement.value = '123456';
            const event = new Event('input');
            inputElement.dispatchEvent(event);

            expect(countElement.textContent.indexOf('14 characters')).toBeGreaterThan(-1);
        });

        it('should nicely pluralise the message', () => {
            testObj.characterCountModule.init();

            const inputElement = testObj.characterCountElement.querySelector('input');
            const countElement = testObj.characterCountElement.querySelector('.ds_input__message');

            // 18 characters. our max is 20.
            inputElement.value = '123456789012345678';
            let event = new Event('input');
            inputElement.dispatchEvent(event);

            expect(countElement.textContent.indexOf('characters ')).toBeGreaterThan(-1);

            // 19 characters. our max is 20.
            inputElement.value = '1234567890123456789';
            event = new Event('input');
            inputElement.dispatchEvent(event);
            expect(countElement.textContent.indexOf('character ')).toBeGreaterThan(-1);
        });

        it('should have error styling if the character limit is exceeded', () => {
            testObj.characterCountModule.init();

            const inputElement = testObj.characterCountElement.querySelector('input');

            // 21 characters. our max is 20.
            inputElement.value = '123456789012345678901';
            let event = new Event('input');
            inputElement.dispatchEvent(event);

            expect(inputElement.classList.contains('ds_input--error')).toBe(true);
        });

        it('should show the character count if a threshold is set and the threshold is exceeded', () => {
            testObj.characterCountElement = document.querySelector('#data-threshold');
            testObj.characterCountModule = new CharacterCount(testObj.characterCountElement);
            testObj.characterCountModule.init();

            const inputElement = testObj.characterCountElement.querySelector('input');
            const countElement = testObj.characterCountElement.querySelector('.ds_input__message');

            // 9/20 characters -- under threshold (50%)
            inputElement.value = '123456789';
            let event = new Event('input');
            inputElement.dispatchEvent(event);
            expect(countElement.classList.contains('fully-hidden')).toEqual(true);

            // 11/20 characters -- over threshold
            inputElement.value = '12345678901';
            event = new Event('input');
            inputElement.dispatchEvent(event);

            expect(countElement.classList.contains('fully-hidden')).toEqual(false);
        });

        it('should revert to the initial count message if the field is empty', () => {
            testObj.characterCountModule.init();

            const inputElement = testObj.characterCountElement.querySelector('input');
            const countElement = testObj.characterCountElement.querySelector('.ds_input__message');

            // get initial value
            const initialValue = countElement.textContent;

            // 6 characters. our max is 20.
            inputElement.value = '123456';
            const event = new Event('input');
            inputElement.dispatchEvent(event);

            expect(countElement.textContent).not.toEqual(initialValue);

            inputElement.value = '';
            inputElement.dispatchEvent(event);

            expect(countElement.textContent).toEqual(initialValue);
        });

        it('should show the current character count message if the field has been prepopulated with data', () => {
            const inputElement = testObj.characterCountElement.querySelector('input');
            inputElement.value = 'hello world';

            testObj.characterCountModule.init();

            const countElement = testObj.characterCountElement.querySelector('.ds_input__message');

            expect(countElement.textContent).toEqual('You have 9 characters remaining');
        });

        it('should only update the mesage if the value has changed', () => {
            const inputElement = testObj.characterCountModule.inputElement;
            testObj.characterCountModule.init();
            vi.spyOn(testObj.characterCountModule, 'updateCountMessage').mockImplementation();
            inputElement.oldValue = '123456';
            inputElement.value = '123456';
            const event = new Event('input');
            inputElement.dispatchEvent(event);

            expect(testObj.characterCountModule.updateCountMessage).not.toHaveBeenCalled();
        });

        it('should update an aria-live region after a short delay', () => {
            vi.useFakeTimers();

            testObj.characterCountModule.init();

            const inputElement = testObj.characterCountElement.querySelector('input');
            const ariaCountElement = testObj.characterCountElement.querySelector('.ds_input__message');

            // 6 characters. our max is 20.
            inputElement.value = '123456';
            const event = new Event('input');
            inputElement.dispatchEvent(event);

            vi.advanceTimersByTime(1000);

            expect(ariaCountElement.textContent.indexOf('14 characters')).toBeGreaterThan(-1);
        });

        it('should reset the aria-live update delay after a keypress', () => {
            vi.useFakeTimers();

            testObj.characterCountModule.init();

            const inputElement = testObj.characterCountElement.querySelector('input');

            const spy = vi.spyOn(testObj.characterCountModule, 'updateScreenReaderMessage').mockImplementation();

            // 6 characters. our max is 20.
            inputElement.value = '123456';
            let event = new Event('input');
            inputElement.dispatchEvent(event);

            vi.advanceTimersByTime(500);

            // modify the value within the 1000ms window
            inputElement.value = '1234567';
            event = new Event('input');
            inputElement.dispatchEvent(event);

            vi.advanceTimersByTime(1000);

            expect(spy.mock.calls.length).toEqual(1);
        });

        it('should update an aria-live region if a threshold is set and the threshold is exceeded', () => {
            vi.useFakeTimers();

            testObj.characterCountElement = document.querySelector('#data-threshold');
            testObj.characterCountModule = new CharacterCount(testObj.characterCountElement);
            testObj.characterCountModule.init();

            const inputElement = testObj.characterCountElement.querySelector('input');

            const spy = vi.spyOn(testObj.characterCountModule, 'updateScreenReaderMessage').mockImplementation();

            // 9/20 characters -- under threshold (50%)
            inputElement.value = '123456789';
            let event = new Event('input');
            inputElement.dispatchEvent(event);

            vi.advanceTimersByTime(1000);

            expect(spy.mock.calls.length).toEqual(0);

            // 11/20 characters -- over threshold
            inputElement.value = '12345678901';
            event = new Event('input');
            inputElement.dispatchEvent(event);

            vi.advanceTimersByTime(1000);

            expect(spy.mock.calls.length).toEqual(1);
        });
    });

    describe('character count with preexisting aria-invalid', () => {
        it('should keep the aria-invalid attribute after initialisation', () => {
            testObj.characterCountElement = document.querySelector('#aria-invalid');
            const inputElement = testObj.characterCountElement.querySelector('input');
            testObj.characterCountModule = new CharacterCount(testObj.characterCountElement);
            testObj.characterCountModule.init();

            expect(inputElement.getAttribute('aria-invalid')).toEqual('true');
        });

        it('should not remove an aria-invalid attribute when the count is exceeded and reduced', () => {
            testObj.characterCountElement = document.querySelector('#aria-invalid');
            const inputElement = testObj.characterCountElement.querySelector('input');
            inputElement.value = 'abcdefghijklmnopqrstuvwxyz';
            testObj.characterCountModule = new CharacterCount(testObj.characterCountElement);
            testObj.characterCountModule.init();

            expect(inputElement.getAttribute('aria-invalid')).toEqual('true');

            inputElement.value = 'abcdefghijklmnopqrs';
            const event = new Event('input');
            inputElement.dispatchEvent(event);

            expect(inputElement.getAttribute('aria-invalid')).toEqual('true');
        });

        it('should treat a "false" aria-invalid value as normal', () => {
            testObj.characterCountElement = document.querySelector('#aria-invalid-false');
            const inputElement = testObj.characterCountElement.querySelector('input');
            testObj.characterCountModule = new CharacterCount(testObj.characterCountElement);
            testObj.characterCountModule.init();

            expect(inputElement.getAttribute('aria-invalid')).toEqual('false');

            inputElement.value = 'abcdefghijklmnopqrstuvwxyz';
            let event = new Event('input');
            inputElement.dispatchEvent(event);
            expect(inputElement.getAttribute('aria-invalid')).toEqual('true');

            inputElement.value = 'abcdefghijklmnopqrs';
            event = new Event('input');
            inputElement.dispatchEvent(event);
            expect(inputElement.getAttribute('aria-invalid')).toEqual('false');
        });
    });

    describe('Github issue 172', () => {
        it('should show the count message at 950 characters out of 1000 when a threshold of "95" is set', () => {
            testObj.characterCountElement = document.querySelector('#github-172');
            testObj.characterCountModule = new CharacterCount(testObj.characterCountElement);
            testObj.characterCountModule.init();

            const countElement = testObj.characterCountElement.querySelector('.ds_input__message');
            const inputElement = testObj.characterCountModule.inputElement;
            const event = new Event('input');

            expect(countElement.classList.contains('fully-hidden')).toEqual(true);

            inputElement.value = inputElement.value + '1';
            inputElement.dispatchEvent(event);
            expect(countElement.classList.contains('fully-hidden')).toEqual(false);

            inputElement.value = inputElement.value + '1';
            inputElement.dispatchEvent(event);
            expect(countElement.classList.contains('fully-hidden')).toEqual(false);
        });
    })
});
