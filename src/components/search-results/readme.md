## Displaying results over multiple pages

When using the pagination component, to split results over multiple pages, some additional behaviours should be implemented.

### On the first page of results 

- The number of results and the search term should be shown, for example ```87 results for search term```
- The attribute ```data-total``` applied to the ```ds_search-results__list``` list element contains the total number of results and is used to calculate the relative position of each result within the tracking attribute script

### On subsequent result pages

- The position within the set of results should should shown alongside the total number and search term, for example ```Showing 21 to 30 of 87 results for search term```
- The additional attribute ```start``` applied to the ```ds_search-results__list``` list element contains the starting position for the current displayed results within the set of results and is by the tracking attribute script