# Autocomplete

Set up an autocomplete by creating a new Autocomplete object. It takes three parameters:

* a DOM element to use for the autocomplete 
* the url for the search endpoint
* an optional object of customisation settings

The customisation settings can have the following properties:

* suggestionMappingFunction: a function to map the data returned from the endpoint to the format that the autocomplete will use to populate its options
* throttleDelay: amount of time to wait after a keypress before sending the request, to prevent sending many requests if someone is typing quickly (default is 100ms)
* minLength: number of character that need to be in the search input before requesting suggestions (default is 2)

## Example JavaScript

```
const autocomplete = new Autocomplete(
    document.getElementById('site-search-autocomplete'),
    'https://www.example.com/path/to/autocomplete?query=',
    {
        suggestionMappingFunction: function (suggestionsObj) {
            return suggestionsObj.map(suggestionsObj => ({
                key: suggestionsObj.key,
                displayText: suggestionsObj.disp,
                weight: suggestionsObj.wt,
                type: suggestionsObj.disp_t,
                category: suggestionsObj.cat
            }
        ));
    }
});

autocomplete.init();
```

## Example HTML

```
<div class="ds_site-search  ds_autocomplete" id="site-search-autocomplete">
    <form role="search" class="ds_site-search__form" method="GET" action="/path/to/search/">
        <label class="ds_label  visually-hidden" for="site-search" id="site-search-label">Search</label>

        <div class="ds_input__wrapper  ds_input__wrapper--has-icon">
            <input
                aria-autocomplete="list"
                aria-expanded="false"
                aria-owns="autocomplete-suggestions"
                autocomplete="off"
                class="ds_input  ds_site-search__input  js-autocomplete-input"
                haspopup="true"
                id="site-search"
                name="q"
                placeholder="Search"
                required=""
                type="search"
            />
            <input name="cat" value="sitesearch" hidden>

            <button type="submit" class="ds_button">
                <span class="visually-hidden">Search gov.scot</span>
                <svg class="ds_icon" aria-hidden="true" role="img"><use xlink:href="/path/to/icons.svg#search"></use></svg>
            </button>

            <div id="autocomplete-suggestions" class="ds_autocomplete__suggestions">
                <ol class="ds_autocomplete__suggestions-list" role="listbox" aria-labelledby="site-search-label"></ol>
            </div>
        </div>
    </form>
</div>
```
