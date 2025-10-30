import { vi } from 'vitest';
import { page } from 'vitest/browser';
import loadHtml from '../../../loadHtml';
import BackToTop from './back-to-top';

const testObj = {};

describe('back to top', () => {
    beforeEach(async () => {
        await loadHtml('src/components/back-to-top/back-to-top.html');
        await page.viewport(800, 600)
    });

    it('should exit init without doing anything if no element supplied', () => {
        testObj.backToTopModule = new BackToTop();

        vi.spyOn(testObj.backToTopModule, 'checkDisplay');
        testObj.backToTopModule.init();

        expect(testObj.backToTopModule.checkDisplay).not.toHaveBeenCalled();
    });

    it('should exit init without doing anything if no footer element defined', () => {
        const footer = document.querySelector('.ds_site-footer');
        footer.parentNode.removeChild(footer);

        testObj.backToTopElement = document.querySelector('.ds_back-to-top');
        testObj.backToTopModule = new BackToTop(testObj.backToTopElement);

        vi.spyOn(testObj.backToTopModule, 'checkDisplay');
        testObj.backToTopModule.init();

        expect(testObj.backToTopModule.checkDisplay).not.toHaveBeenCalled();
    });

    it('should check display on init if an element is supplied', () => {
        testObj.backToTopElement = document.querySelector('.ds_back-to-top');
        testObj.backToTopModule = new BackToTop(testObj.backToTopElement);

        vi.spyOn(testObj.backToTopModule, 'checkDisplay');
        testObj.backToTopModule.init();

        expect(testObj.backToTopModule.checkDisplay).toHaveBeenCalled();
    });

    it('should not display if the page is taller than the viewport', () => {
        testObj.backToTopElement = document.querySelector('.ds_back-to-top');
        testObj.backToTopModule = new BackToTop(testObj.backToTopElement);

        testObj.backToTopModule.init();
        expect(testObj.backToTopElement.classList.contains('visually-hidden')).toBe(true);
    });

    it('should display if the page is taller than the viewport', async () => {
        testObj.backToTopElement = document.querySelector('.ds_back-to-top');

        await page.viewport(800, 0);

        testObj.backToTopModule = new BackToTop(testObj.backToTopElement);

        testObj.backToTopModule.init();
        expect(testObj.backToTopElement.classList.contains('visually-hidden')).toBe(false);
    });

    it('should check positioning on resize', () => {
        testObj.backToTopElement = document.querySelector('.ds_back-to-top');
        testObj.backToTopModule = new BackToTop(testObj.backToTopElement);

        testObj.backToTopModule.init();

        vi.spyOn(testObj.backToTopModule, 'checkPosition');

        const event = new Event('resize');
        window.dispatchEvent(event);

        expect(testObj.backToTopModule.checkPosition).toHaveBeenCalled();
    });

    it('should use design system ds_footer as default footer element', () => {
        testObj.backToTopElement = document.querySelector('.ds_back-to-top');
        testObj.backToTopModule = new BackToTop(testObj.backToTopElement);

        testObj.backToTopModule.init();

        const defaultFooterEl = document.querySelector('.ds_site-footer');

        expect(testObj.backToTopModule.footerEl).toEqual(defaultFooterEl);
    });

    it('should allow a custom footer element', () => {
        testObj.backToTopElement = document.querySelector('.ds_back-to-top');
        testObj.backToTopModule = new BackToTop(testObj.backToTopElement, window, { footerElSelector: '.my_site-footer' });

        testObj.backToTopModule.init();

        const customFooterEl = document.querySelector('.my_site-footer');

        expect(testObj.backToTopModule.footerEl).toEqual(customFooterEl);
    });
});
