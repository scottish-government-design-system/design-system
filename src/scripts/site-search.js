'use strict';

const searchBoxComponent = {
    init: function () {
        const collapsibleSearchBoxes = document.querySelectorAll('.ds_site-search--collapsible');

        collapsibleSearchBoxes.forEach(function (searchBox) {
            const searchInput = searchBox.querySelector('.ds_site-search__input');
            const searchButton = searchBox.querySelector('.js-site-search-button');

            searchButton.addEventListener('click', function (event) {
                if (!searchInput.value && !window.ds_patterns.breakpoint('medium')) {
                    event.preventDefault();
                    searchBox.classList.toggle('ds_site-search--expanded');
                    searchInput.focus();

                    if (!searchBox.classList.contains('ds_site-search--expanded')) {
                        searchInput.blur();
                    }
                }
            });
        });
    }
};

// self-initialize
searchBoxComponent.init();

export {searchBoxComponent};
