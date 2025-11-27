import { beforeEach, describe, expect, it } from 'vitest';
import loadHtml from '../../../loadHtml';
import skipLinks from './skip-links';

describe('skip links', () => {

    beforeEach(async () => {
        await loadHtml('src/components/skip-links/skip-links.html');
        skipLinks.init();
    });

    describe('clicking on a skip link', () => {
        it('should focus on the link target', () => {
            const link = document.querySelector('.ds_skip-links__link');
            const event = new Event('click');
            link.dispatchEvent(event);

            expect(document.activeElement.id).toEqual(link.getAttribute('href').substring(1))
        });

        it('should not focus on a non-existent target', () => {
            const link = document.querySelector('.ds_skip-links__link');
            link.href = '#foo';
            const event = new Event('click');
            link.dispatchEvent(event);

            expect(document.activeElement).toEqual(document.body);
        });
    });
});
