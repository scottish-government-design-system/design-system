import { beforeEach, describe, expect, it } from 'vitest';
import loadHtml from '../../../test/load-html';
import Details from './details';

const testObj = {};

describe('details', () => {
    beforeEach(async () => {
        await loadHtml('src/components/details/details.html');
    });

    describe('native details element', () => {
        it('should just work', () => {
            testObj.detailsElement = document.getElementById('native');
            testObj.detailsModule = new Details(testObj.detailsElement);
            testObj.detailsModule.init();

            // nothing to do but say it's init-ed
            expect(testObj.detailsModule.isInitialised).toBeTruthy();
        });
    });

    describe('fake details element', () => {
        let detailsAttributesList, summaryAttributesList, contentElements;

        beforeEach(() => {
            testObj.detailsElement = document.getElementById('fake');
            detailsAttributesList = testObj.detailsElement.attributes;
            summaryAttributesList = testObj.detailsElement.querySelector('.ds_details__summary').attributes;
            contentElements = {
                foo: testObj.detailsElement.querySelector('#foo'),
                bar: testObj.detailsElement.querySelector('#bar')
            };

            testObj.detailsModule = new Details(testObj.detailsElement);
        });

        describe('markup transforms', () => {
            it('should use a native DETAILS for the container element', () => {
                const newDetailsElement = testObj.detailsModule.details;
                expect(newDetailsElement.nodeName).toEqual('DETAILS');
            });

            it('should clone attributes from the original container element to the replacement element', () => {
                const newDetailsElement = testObj.detailsModule.details;

                Array.from(detailsAttributesList).forEach(attribute => {
                    expect(newDetailsElement.getAttribute(attribute.name)).toBeDefined();
                    expect(newDetailsElement.getAttribute(attribute.name)).toEqual(attribute.value);
                });

                // and a specific check
                expect(newDetailsElement.getAttribute('data-foo')).toEqual('foo');
            });

            it('should use a native SUMMARY element for \'ds_details__summary\'', () => {
                const newDetailsElement = testObj.detailsModule.details;
                const newSummaryElement = newDetailsElement.querySelector('.ds_details__summary');
                expect(newSummaryElement.nodeName).toEqual('SUMMARY');
            });

            it('should clone attributes from the original summary element to the replacement element', () => {
                const newDetailsElement = testObj.detailsModule.details;
                const newSummaryElement = newDetailsElement.querySelector('.ds_details__summary');

                Array.from(summaryAttributesList).forEach(attribute => {
                    expect(newSummaryElement.getAttribute(attribute.name)).toBeDefined();
                    expect(newSummaryElement.getAttribute(attribute.name)).toEqual(attribute.value);
                });

                // and a specific check
                expect(newSummaryElement.getAttribute('data-bar')).toEqual('bar');
            });

            it('should copy all non-summary children to the new element', () => {
                const newDetailsElement = testObj.detailsModule.details;

                expect(newDetailsElement.querySelector('#foo').outerHTML).toEqual(contentElements.foo.outerHTML)
                expect(newDetailsElement.querySelector('#bar').outerHTML).toEqual(contentElements.bar.outerHTML)
            });
        });
    });

    describe('exceptions', () => {
        it('the fallback should specifically NOT clone a \'for\' attribute to the summary element', () => {
            testObj.detailsElement = document.getElementById('toggle');
            const newDetailsElement = testObj.detailsModule.details;
            const newSummaryElement = newDetailsElement.querySelector('.ds_details__summary');

            testObj.detailsModule = new Details(testObj.detailsElement);

            expect(newSummaryElement.getAttribute('for')).toBeNull();
        });

        it('the fallback should specifically NOT copy a `ds_details__toggle` checkbox to the new element', () => {
            testObj.detailsElement = document.getElementById('toggle');
            testObj.detailsModule = new Details(testObj.detailsElement);

            expect(testObj.detailsElement.querySelector('.ds_details__toggle')).toBeDefined();
            expect(testObj.detailsModule.details.querySelector('.ds_details__toggle')).toBeNull();
        });
    });
});
