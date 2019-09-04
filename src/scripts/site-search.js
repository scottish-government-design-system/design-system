'use strict';

const searchBoxComponent = {
    init: function () {
        const collapsibleSearchBoxes = document.querySelectorAll('.site-search--collapsible');

        collapsibleSearchBoxes.forEach(function (searchBox) {
            const searchInput = searchBox.querySelector('.site-search__input');
            const searchButton = searchBox.querySelector('.site-search__button');

            searchButton.addEventListener('click', function (event) {
                if (!searchInput.value && !window.ds_patterns.breakpoint('medium')) {
                    event.preventDefault();

                    searchBox.classList.toggle('site-search--expanded');
                    searchInput.focus();

                    if (!searchBox.classList.contains('site-search--expanded')) {
                        searchInput.blur();
                    }
                }
            });
        });
    }
};

// self-initialize
searchBoxComponent.init();

export default searchBoxComponent;
