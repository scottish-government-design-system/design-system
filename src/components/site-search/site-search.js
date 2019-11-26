'use strict';

class CollapsibleSearchBox {
    constructor (searchBox) {
        this.searchBox = searchBox;
    }

    init () {
        const searchInput = this.searchBox.querySelector('.ds_site-search__input');
        const searchButton = this.searchBox.querySelector('.js-site-search-button');

        searchButton.addEventListener('click', (event) => {
            if (!searchInput.value && !window.ds_patterns.breakpoint('medium')) {
                event.preventDefault();

                this.searchBox.classList.toggle('ds_site-search--expanded');
                searchInput.focus();

                if (!this.searchBox.classList.contains('ds_site-search--expanded')) {
                    searchInput.blur();
                }
            }
        });
    }
}

export default CollapsibleSearchBox;
