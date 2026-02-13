// These are more of an implementation check than a unit test
import { beforeEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import loadHtml from '../../../../loadHtml';
import breakpointCheck from './breakpoint-check';

describe('breakpoint check', () => {
    beforeEach(async () => {
        await loadHtml('src/base/utilities/breakpoint-check/breakpoint-check.html');
    });

    it('1. very small viewports under 480px', async () => {
        await page.viewport(320, 400);
        expect(breakpointCheck('small')).toBe(false);
        expect(breakpointCheck('medium')).toBe(false);
        expect(breakpointCheck('large')).toBe(false);
        expect(breakpointCheck('xlarge')).toBe(false);
    });

    it('2. small viewports, 480px+', async () => {
        await page.viewport(600, 400);
        expect(breakpointCheck('small')).toBe(true);
        expect(breakpointCheck('medium')).toBe(false);
        expect(breakpointCheck('large')).toBe(false);
        expect(breakpointCheck('xlarge')).toBe(false);
    });

    it('3. medium viewports, 768px+', async () => {
        await page.viewport(800, 400);
        expect(breakpointCheck('small')).toBe(true);
        expect(breakpointCheck('medium')).toBe(true);
        expect(breakpointCheck('large')).toBe(false);
        expect(breakpointCheck('xlarge')).toBe(false);
    });

    it('4. large viewports, 992px+', async () => {
        await page.viewport(1000, 400);
        expect(breakpointCheck('small')).toBe(true);
        expect(breakpointCheck('medium')).toBe(true);
        expect(breakpointCheck('large')).toBe(true);
        expect(breakpointCheck('xlarge')).toBe(false);
    });

    it('5. extra large viewports 1200px+', async () => {
        await page.viewport(1368, 400);
        expect(breakpointCheck('small')).toBe(true);
        expect(breakpointCheck('medium')).toBe(true);
        expect(breakpointCheck('large')).toBe(true);
        expect(breakpointCheck('xlarge')).toBe(true);
    });
});
