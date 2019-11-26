const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, './site-search.html'), 'utf-8');
const testObj = {};

window.ds_patterns = window.ds_patterns || {};

import CollapsibleSearchBox from './site-search';

xdescribe('collapsible seach box (site search)', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
        testObj.searchElement = document.querySelector('.ds_site-search--collapsible');
        testObj.searchModule = new CollapsibleSearchBox(testObj.searchElement);
    });

    describe('on small devices', () => {
        beforeEach(() => {
            // force breakpoint check to return false
            window.ds_patterns.breakpoint = function() {
                return false;
            };

            testObj.searchModule.init();
        });

        it ('should toggle display of the site search on click of the search button', () => {
            const searchButton = testObj.searchElement.querySelector('.js-site-search-button');
            const event = new Event('click');

            searchButton.dispatchEvent(event);
            expect (testObj.searchElement.classList.contains('ds_site-search--expanded')).toEqual(true);

            searchButton.dispatchEvent(event);
            expect (testObj.searchElement.classList.contains('ds_site-search--expanded')).toEqual(false);
        });

        it ('should submit, not collapse, the form if data is entered in the search input', () => {
            const searchButton = testObj.searchElement.querySelector('.js-site-search-button');
            const searchInput = testObj.searchElement.querySelector('.ds_site-search__input');
            const event = new Event('click');

            // open search
            searchButton.dispatchEvent(event);
            expect(document.activeElement).toEqual(searchInput);

            // add data
            searchInput.value = 'foo';

            // click button
            searchButton.dispatchEvent(event);
            expect (testObj.searchElement.classList.contains('ds_site-search--expanded')).toEqual(true);
        });
    });

    describe('on large devices', () => {
        // disabled because it tries to do a form submit
        // jsdom can't handle that
        it ('should carry out a normal form submission', () => {
            // force breakpoint check to return true
            window.ds_patterns.breakpoint = function() {
                return true;
            };

            const searchButton = testObj.searchElement.querySelector('.js-site-search-button');

            const event = new Event('click');
            searchButton.dispatchEvent(event);
            expect (testObj.searchElement.classList.contains('ds_site-search--expanded')).toEqual(false);
        });
    });
});
