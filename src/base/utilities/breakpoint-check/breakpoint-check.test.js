// These are more of an implementation check than a unit test

jasmine.getFixtures().fixturesPath = 'base/src/';

import breakpointCheck from './breakpoint-check';

describe('breakpoint check', () => {
    beforeEach(function () {
        loadFixtures('base/utilities/breakpoint-check/breakpoint-check.html');
    });

    afterEach(function () {
        viewport.reset();
    });

    it('1. very small viewports under 480px', () => {
        viewport.set(320);
        expect(breakpointCheck('small')).toBeFalsy();
        expect(breakpointCheck('medium')).toBeFalsy();
        expect(breakpointCheck('large')).toBeFalsy();
        expect(breakpointCheck('xlarge')).toBeFalsy();
    });

    it('2. small viewports, 480px+', () => {
        viewport.set(600);
        expect(breakpointCheck('small')).toBeTruthy();
        expect(breakpointCheck('medium')).toBeFalsy();
        expect(breakpointCheck('large')).toBeFalsy();
        expect(breakpointCheck('xlarge')).toBeFalsy();
    });

    it('3. medium viewports, 768px+', () => {
        viewport.set(800);
        expect(breakpointCheck('small')).toBeTruthy();
        expect(breakpointCheck('medium')).toBeTruthy();
        expect(breakpointCheck('large')).toBeFalsy();
        expect(breakpointCheck('xlarge')).toBeFalsy();
    });

    it('4. large viewports, 992px+', () => {
        viewport.set(1000);
        expect(breakpointCheck('small')).toBeTruthy();
        expect(breakpointCheck('medium')).toBeTruthy();
        expect(breakpointCheck('large')).toBeTruthy();
        expect(breakpointCheck('xlarge')).toBeFalsy();
    });

    it('5. extra large viewports 1200px+', () => {
        viewport.set(1368);
        expect(breakpointCheck('small')).toBeTruthy();
        expect(breakpointCheck('medium')).toBeTruthy();
        expect(breakpointCheck('large')).toBeTruthy();
        expect(breakpointCheck('xlarge')).toBeTruthy();
    });
});
