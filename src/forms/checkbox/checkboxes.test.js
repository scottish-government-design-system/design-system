const testObj = {};

jasmine.getFixtures().fixturesPath = 'base/src/';

import Checkboxes from './checkboxes';

describe('checkboxes', () => {
    beforeEach(() => {
        loadFixtures('forms/checkbox/checkboxes.html');
        testObj.checkboxesElement = document.querySelector('[data-module="ds-checkboxes"]');
        testObj.checkboxesModule = new Checkboxes(testObj.checkboxesElement);
    });

    it('should uncheck any other checkboxes in its group when checked', () => {
        // ARRANGE
        // mark a couple of other checkboxes
        let checkbox1 = document.getElementById('step-did-you-receive-benefits-universal-credit');
        let checkbox2 = document.getElementById('step-did-you-receive-benefits-pension-credit');
        let exclusiveCheckbox = document.getElementById('step-did-you-receive-benefits-none');

        checkbox1.checked = true;
        checkbox2.checked = true;

        // ACT
        testObj.checkboxesModule.init();
        exclusiveCheckbox.checked = true;
        let event = new Event('change');
        exclusiveCheckbox.dispatchEvent(event);

        // ASSERT
        expect(checkbox1.checked).toBeFalse();
        expect(checkbox2.checked).toBeFalse();
    });

    it('should be unchecked when any other checkbox in its group is checked', () => {
        // ARRANGE
        // mark a couple of other checkboxes
        let checkbox1 = document.getElementById('step-did-you-receive-benefits-universal-credit');
        let exclusiveCheckbox = document.getElementById('step-did-you-receive-benefits-none');

        exclusiveCheckbox.checked = true;

        // ACT
        testObj.checkboxesModule.init();
        checkbox1.checked = true;
        let event = new Event('change');
        checkbox1.dispatchEvent(event);

        // ASSERT
        expect(checkbox1.checked).toBeTrue();
        expect(exclusiveCheckbox.checked).toBeFalse();
    });
});
