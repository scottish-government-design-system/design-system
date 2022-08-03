const testObj = {};

jasmine.getFixtures().fixturesPath = 'base/src/';

import AspectBox from './aspect-box-fallback';

// mock window
const documentObj = {
    documentElement: {
        style: {}
    },
    querySelectorAll: document.querySelectorAll.bind(document)
};

describe('aspect box fallback', () => {
    beforeEach(() => {
        loadFixtures('components/aspect-box/aspect-box.html');

        testObj.aspectBox = document.querySelector('.ds_aspect-box');
        testObj.aspectBoxInner = testObj.aspectBox.querySelector('.ds_aspect-box__inner');
    });

    it('should exit without doing anything if object-fit is supported', () => {
        const html = document.innerHTML;
        const aspectBox = new AspectBox(testObj.aspectBox);
        aspectBox.init();
        expect(document.innerHTML).toEqual(html);
    });

    it('should "move" the image to the background if object-fit not supported', () => {
        const aspectBox = new AspectBox(testObj.aspectBox, documentObj);
        aspectBox.init();
        expect(testObj.aspectBox.style.backgroundImage).toEqual(`url("${testObj.aspectBoxInner.src}")`);
        expect(testObj.aspectBox.classList.contains('ds_aspect-box--fallback')).toBeTruthy();
    });

    it('should do nothing if object-fit not supported but there is no image', () => {
        testObj.aspectBox.removeChild(testObj.aspectBoxInner);
        const html = document.innerHTML;
        const aspectBox = new AspectBox(testObj.aspectBox, documentObj);
        aspectBox.init();
        expect(document.innerHTML).toEqual(html);
    });

    it('should clone alt attributes into sensible alternative locations', () => {
        testObj.aspectBox.querySelector('img').setAttribute('alt', 'my alt text');
        const aspectBox = new AspectBox(testObj.aspectBox, documentObj);
        aspectBox.init();

        expect(testObj.aspectBox.getAttribute('role')).toEqual('img');
        expect(testObj.aspectBox.getAttribute('aria-label')).toEqual('my alt text');
    });
});
