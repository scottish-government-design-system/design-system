const fs = require('fs');
const path = require('path');

const siteSearch = require('../src/scripts/site-search');
const html = fs.readFileSync(path.resolve(__dirname, 'html/site-search.html'), 'utf-8');

window.HTMLFormElement.prototype.submit = jest.fn();

window.ds_patterns = window.ds_patterns || {};

let searchBox, searchButton, searchInput;

describe('site search', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
        siteSearch.searchBoxComponent.init();

        searchBox = document.querySelector('.ds_site-search--collapsible');
        searchButton = searchBox.querySelector('.js-site-search-button');
        searchInput = document.querySelector('.ds_site-search__input');
    });

    describe ('collapsible site search', () => {
        describe ('on small devices', () => {
            beforeEach(() => {
                // force breakpoint check to return false
                window.ds_patterns.breakpoint = function() {
                    return false;
                };
            });

            it ('should toggle display of the site search on click of the search button', () => {
                const event = new Event('click');

                searchButton.dispatchEvent(event);
                expect (searchBox.classList.contains('ds_site-search--expanded')).toEqual(true);

                searchButton.dispatchEvent(event);
                expect (searchBox.classList.contains('ds_site-search--expanded')).toEqual(false);
            });

            it ('should submit, not collapse, the form if data is entered in the search input', () => {
                const event = new Event('click');

                // open search
                searchButton.dispatchEvent(event);
                expect(document.activeElement).toEqual(searchInput);

                // add data
                searchInput.value = 'foo';

                // click button
                searchButton.dispatchEvent(event);
                expect (searchBox.classList.contains('ds_site-search--expanded')).toEqual(true);
            });
        });

        describe ('on medium and larger devices', () => {
            it ('should carry out a normal form submission', () => {
                // force breakpoint check to return true
                window.ds_patterns.breakpoint = function() {
                    return true;
                };

                searchBox = document.querySelector('.ds_site-search--collapsible');
                searchButton = searchBox.querySelector('.js-site-search-button');

                const event = new Event('click');
                searchButton.dispatchEvent(event);
                expect (searchBox.classList.contains('ds_site-search--expanded')).toEqual(false);
            });
        });
    });
});
