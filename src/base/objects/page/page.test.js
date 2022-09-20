const testObj = {};

jasmine.getFixtures().fixturesPath = 'base/src/';

import page from './page';

describe('page', () => {
    beforeEach(() => {
        loadFixtures('base/objects/page/page.html');

        testObj.pageMiddleElement = document.querySelector('.ds_page__middle');
    });

    it('should add the JS classname to ds_page__middle if there is a pre-footer-background child of ds_page__middle in browsers that do not support the relational selector', () => {
        spyOn(window.CSS, 'supports').and.returnValue(false);

        page.init();

        expect(testObj.pageMiddleElement.classList.contains('js-pre-footer-background')).toBeTrue();
    });

    it('should NOT add the fallback class if the re is no relevant element', () => {
        // manipulate the DOM to remove the relevant element
        const deleteEl = testObj.pageMiddleElement.querySelector('.ds_pre-footer-background');
        deleteEl.parentNode.removeChild(deleteEl);

        spyOn(window.CSS, 'supports').and.returnValue(false);

        page.init();

        expect(testObj.pageMiddleElement.classList.contains('js-pre-footer-background')).toBeFalse();
    });

    it('should NOT add the fallback class if the relational selector is supported by the browser', () => {
        spyOn(window.CSS, 'supports').and.returnValue(true);

        page.init();

        expect(testObj.pageMiddleElement.classList.contains('js-pre-footer-background')).toBeFalse();
    });
});
