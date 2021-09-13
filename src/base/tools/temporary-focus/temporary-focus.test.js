const testObj = {};

jasmine.getFixtures().fixturesPath = 'base/src/';

import temporaryFocus from './temporary-focus';

describe('temporary focus', () => {

    beforeEach(function () {
        loadFixtures('base/tools/temporary-focus/temporary-focus.html');
    });

    describe('temporary focus', () => {
        it('elements should receive temporary focus when temporaryFocus is called', () => {
            const foo = document.querySelector('#foo');
            temporaryFocus(foo);

            expect(document.activeElement.id).toEqual('foo');
        });

        it('elements should not be refocusable by normal means after tempFocus is removed', () => {
            const foo = document.querySelector('#foo');
            temporaryFocus(foo);

            let event = new Event('focusout');
            foo.dispatchEvent(event);
            expect(document.activeElement.id).not.toEqual('foo');

            event = new Event('click');
            foo.dispatchEvent(event);
            expect(document.activeElement.id).not.toEqual('foo');

            event = new Event('focus');
            foo.dispatchEvent(event);
            expect(document.activeElement.id).not.toEqual('foo');
        });
    });
});
