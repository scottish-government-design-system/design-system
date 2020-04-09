const testObj = {};

jasmine.getFixtures().fixturesPath = 'base/src/';

import CharacterCount from './character-count';

describe('character count', () => {
    beforeEach(() => {
        loadFixtures('forms/character-count/character-count.html');
    });

    describe('setup', () => {
        describe('missing information', () => {
            it ('should exit if no maxlength set', () => {
                testObj.characterCountElement = document.querySelector('#bad-no-maxlength');
                testObj.characterCountModule = new CharacterCount(testObj.characterCountElement);
                testObj.characterCountModule.init();
                const countElement = testObj.characterCountElement.querySelectorAll('.ds_input__message');
                expect(countElement.length).toEqual(0);
            });

            it ('should exit if no input element present', () => {
                testObj.characterCountElement = document.querySelector('#bad-no-input');
                testObj.characterCountModule = new CharacterCount(testObj.characterCountElement);
                testObj.characterCountModule.init();
                const countElement = testObj.characterCountElement.querySelectorAll('.ds_input__message');
                expect(countElement.length).toEqual(0);
            });
        });

        describe('progressively enhanced maxlength attribute', () => {
            beforeEach(() => {
                testObj.characterCountElement = document.querySelector('#maxlength');
                testObj.characterCountModule = new CharacterCount(testObj.characterCountElement);
            });

            it ('should set a max length correctly', () => {
                const expectedMaxLength = parseInt(document.querySelector('#textinput1-character-limit').getAttribute('maxlength'), 10);

                testObj.characterCountModule.init();
                expect(testObj.characterCountModule.maxLength).toEqual(expectedMaxLength);
            });

            it ('should remove the maxlength attribute', () => {
                testObj.characterCountModule.init();
                expect(document.querySelector('#textinput1-character-limit').getAttribute('maxlength')).toBeNull();
            });
        });

        describe('maxlength as data atribute', () => {
            beforeEach(() => {
                testObj.characterCountElement = document.querySelector('#data-maxlength');
                testObj.characterCountModule = new CharacterCount(testObj.characterCountElement);
            });

            it ('should set a max length correctly', () => {
                const expectedMaxLength = testObj.characterCountElement.dataset.maxlength;

                testObj.characterCountModule.init();
                expect(testObj.characterCountModule.maxLength).toEqual(expectedMaxLength);
            });
        });

        describe('count threshold', () => {
            beforeEach(() => {
                testObj.characterCountElement = document.querySelector('#data-threshold');
                testObj.characterCountModule = new CharacterCount(testObj.characterCountElement);
            });

            it ('on init, should hide the character count if necessary', () => {
                testObj.characterCountModule.init();

                const countElement = testObj.characterCountElement.querySelector('.ds_input__message');

                expect(countElement.classList.contains('fully-hidden')).toEqual(true);
            });

            it ('on init, should show the character count if the input is prepopulated and the input length is greater than the threshold', () => {
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
        });
    });

    describe ('updating character count', () => {
        beforeEach(() => {
            testObj.characterCountElement = document.querySelector('#maxlength');
            testObj.characterCountModule = new CharacterCount(testObj.characterCountElement);
        });

        it ('should decrement the character count as the user types', () => {
            testObj.characterCountModule.init();

            const inputElement = testObj.characterCountElement.querySelector('input');
            const countElement = testObj.characterCountElement.querySelector('.ds_input__message');

            // 6 characters. our max is 20.
            inputElement.value = '123456';
            const event = new Event('keyup');
            inputElement.dispatchEvent(event);

            expect(countElement.innerText.indexOf('14 characters')).toBeGreaterThan(-1);
        });

        it ('should nicely pluralise the message', () => {
            testObj.characterCountModule.init();

            const inputElement = testObj.characterCountElement.querySelector('input');
            const countElement = testObj.characterCountElement.querySelector('.ds_input__message');

            // 18 characters. our max is 20.
            inputElement.value = '123456789012345678';
            let event = new Event('keyup');
            inputElement.dispatchEvent(event);

            expect(countElement.innerText.indexOf('characters ')).toBeGreaterThan(-1);

            // 19 characters. our max is 20.
            inputElement.value = '1234567890123456789';
            event = new Event('keyup');
            inputElement.dispatchEvent(event);
            expect(countElement.innerText.indexOf('character ')).toBeGreaterThan(-1);
        });

        it ('should have error styling if the character limit is exceeded', () => {
            testObj.characterCountModule.init();

            const inputElement = testObj.characterCountElement.querySelector('input');

            // 21 characters. our max is 20.
            inputElement.value = '123456789012345678901';
            let event = new Event('keyup');
            inputElement.dispatchEvent(event);

            expect(inputElement.classList.contains('ds_input--error')).toBe(true);
        });

        it ('should show the character count if a threshold is set and the threshold is exceeded', () => {
            testObj.characterCountElement = document.querySelector('#data-threshold');
            testObj.characterCountModule = new CharacterCount(testObj.characterCountElement);
            testObj.characterCountModule.init();

            const inputElement = testObj.characterCountElement.querySelector('input');
            const countElement = testObj.characterCountElement.querySelector('.ds_input__message');

            // 9/20 characters -- under threshold (50%)
            inputElement.value = '123456789';
            let event = new Event('keyup');
            inputElement.dispatchEvent(event);
            expect(countElement.classList.contains('fully-hidden')).toEqual(true);

            // 11/20 characters -- over threshold
            inputElement.value = '12345678901';
            event = new Event('keyup');
            inputElement.dispatchEvent(event);

            expect(countElement.classList.contains('fully-hidden')).toEqual(false);
        });

        it('should revert to the initial count message if the field is empty', () => {
            testObj.characterCountModule.init();

            const inputElement = testObj.characterCountElement.querySelector('input');
            const countElement = testObj.characterCountElement.querySelector('.ds_input__message');

            // get initial value
            const initialValue = countElement.innerText;

            // 6 characters. our max is 20.
            inputElement.value = '123456';
            const event = new Event('keyup');
            inputElement.dispatchEvent(event);

            expect(countElement.innerText).not.toEqual(initialValue);

            inputElement.value = '';
            inputElement.dispatchEvent(event);

            expect(countElement.innerText).toEqual(initialValue);
        });
    });
});
