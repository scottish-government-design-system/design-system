import { vi } from 'vitest';
import loadHtml from '../../../../loadHtml';
import page from './page';

const testObj = {};

describe('page', () => {
    beforeEach(async () => {
        await loadHtml('src/base/objects/page/page.html');

        testObj.pageMiddleElement = document.querySelector('.ds_page__middle');
    });

    it('should add the JS classname to ds_page__middle if there is a pre-footer-background child of ds_page__middle in browsers that do not support the relational selector', () => {
        vi.spyOn(window.CSS, 'supports').mockReturnValue(false);

        page.init();

        expect(testObj.pageMiddleElement.classList.contains('js-pre-footer-background')).toBe(true);
    });

    it('should NOT add the fallback class if the re is no relevant element', () => {
        // manipulate the DOM to remove the relevant element
        const deleteEl = testObj.pageMiddleElement.querySelector('.ds_pre-footer-background');
        deleteEl.parentElement.removeChild(deleteEl);

        vi.spyOn(window.CSS, 'supports').mockReturnValue(false);

        page.init();

        expect(testObj.pageMiddleElement.classList.contains('js-pre-footer-background')).toBe(false);
    });

    it('should NOT add the fallback class if the relational selector is supported by the browser', () => {
        vi.spyOn(window.CSS, 'supports').mockReturnValue(true);

        page.init();

        expect(testObj.pageMiddleElement.classList.contains('js-pre-footer-background')).toBe(false);
    });
});
