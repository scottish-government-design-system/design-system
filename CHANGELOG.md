# Change log

All notable changes to the Digital Scotland Design System Pattern Library will be documented in this file.

Changes are grouped under the labels: `Added`, `Changed`, `Deprecated`, 
`Removed`, `Fixed`, and `Security`.

---
## [0.0.283] - 2022-08-12
### Removed
- remove node-sass as a dependency

## [0.0.282] - 2022-08-09
### Changed
- add 21:9 aspect ratio to "aspect box" options

## [0.0.281] - 2022-08-03
### Fixed
- typo in all.js

## [0.0.280] - 2022-08-03
### Fixed
- remove unecessary aspectBoxFallback call in all.js

## [0.0.279] - 2022-08-03
### Changed
- refactor the "aspect box" fallback to be a JS class

## [0.0.278] - 2022-08-01
### Changed
- improve accessibility of "file info" component

## [0.0.277] - 2022-07-26
### Changed
- task list component heading structure and use of hint text for summaries

## [0.0.276] - 2022-07-21
### Changed
- task list component style changes and support for multiple groups

## [0.0.275] - 2022-07-14
### Fixed
- aspect box fallback invalid CSS

## [0.0.273] - 2022-07-13
### Added
- task list component (experimental)

## [0.0.272] - 2022-07-07
### Fixed
- correction to tracking behaviour for autocomplete keyboard interactions

## [0.0.271] - 2022-07-07
### Changed
- adjustment to default number of characters required to for autocomplete requests

## [0.0.270] - 2022-07-05
### Changed
- reduce number of branches in tabs javascript

## [0.0.269] - 2022-07-05
### Added
- add tracking rules for autocomplete

## [0.0.268] - 2022-06-28
### Changed
- tighter spacing and sizing for pagination
- update "ellipsis" pagination example to the new correct number of links

## [0.0.267] - 2022-06-16
### Changed
- moved "promise request" script to base/tools

## [0.0.265] - 2022-06-16
### Changed
- search results examples in Fractal show new presentation of result totals when pagination is used
- search results status changed to prototype
- improved screen reader support for search results alternative search suggestions
### Fixed
- correction to tracking data attribute on search results examples in Fractal

## [0.0.264] - 2022-06-09
### Changed
- minor typography updates: alternate heading level classnames renamed, bottom margin explicitly set on h4 and h5

## [0.0.263] - 2022-06-06
### Changed
- children of pagination links have pointer-events: none
- autocomplete trims the search string before using it

## [0.0.262] - 2022-05-31
### Changed
- correction to dividing line at top of site footer

## [0.0.261] - 2022-05-31
### Changed
- improved spacing for site footer navigation items
- add dividing line at top of site footer

## [0.0.260] - 2022-05-31
### Changed
- improved spacing for site footer navigation items

## [0.0.259] - 2022-05-25
### Fixed
- correction to tracking data attribute for tabs

## [0.0.258] - 2022-05-18
### Changed
- heading 4 line height changes for typography scale
### Fixed
- icon size on contact details
- Sass changes to tabs to support deprecated compilers

## [0.0.257] - 2022-05-17
### Added
- tabs component
### Changed
- contents navigation minor style changes to match tabs component

## [0.0.255] - 2022-05-12
### Changed
- reverted package-lock.json back to npm-shrinkwrap.json
### Fixed
- alignment defect on category list items

## [0.0.254] - 2022-05-12
### Changed
- package now uses package-lock.json instead of npm-shrinkwrap.json
- npm module files restricted to licence, /dist, and /src

## [0.0.253] - 2022-04-29
### Changed
- Content label component no longer forces text to uppercase
- Autocomplete uses the "mark" element to highlight matched text
### Fixed
- Unit tests no longer output compoled scripts to the dist folder

## [0.0.252] - 2022-04-29
### Added
- Mixin for small font size which stays the same size over all breakpoints.
### Changed
- Font sizes now calculated relative to single base.
- Tag component font size change to match typography scale.

## [0.0.249] - 2022-04-13
### Fixed
- Icon position on back to top button
- Icon position on currency input field

## [0.0.248] - 2022-04-08
### Added
- Search result variant to include a sub heading
### Changed
- Search results spelling suggestions

## [0.0.246] - 2022-04-06
### Changed
- Autocomplete readme includes the aria status div 
- Autocomplete codes for the presence of the aria status div before trying to populate it
- Replace uses of "xlink:href" (deprecated) in SVG "use" elements with "href"
### Removed
- Fractal-related files no longer included in the npm package
- Prune some no longer needed items (e.g. jest config)

## [0.0.244] - 2022-03-31
### Changed
- Use webpack-cli v4.9.2

## [0.0.243] - 2022-03-31
### Changed
- Accessibility improvements on prototype autocomplete component
- Increase z-index of autocomplete suggestions

## [0.0.242] - 2022-03-28
### Added
- Unit tests for search results tracking (promoted, media, related)
### Changed
- Set pointer-events: none on children of notification close buttons

## [0.0.241] - 2022-03-25
### Changed
- Layout grid for search results

## [0.0.240] - 2022-03-22
### Changed
- Small styling changes to search result component
- Tracking attribute for images within search results
### Fixed
- Various typos in Fractal search result examples

## [0.0.239] - 2022-03-22
### Fixed
- Webpack build failing in development mode

## [0.0.238] - 2022-03-21
### Fixed
- Date picker open/close button now gets a data attribute added on init()

## [0.0.237] - 2022-03-16
### Changed
- Mark file info as "prototype"
### Security
- Updated package versions
### Removed
- "reversed" site footer variant from Fractal

## [0.0.236] - 2022-03-16
### Added
- Autocompolete component added to Fractal
- File info component added to Fractal
- File type icons added (CSV, Excel, "file", geodata, PDF, Powerpoint, RTF, TXT, Word, XML)
### Changed
- Remove reset styles for "search" input types

## [0.0.235] - 2022-03-14
### Added
- First draft of "file info" component
### Fixed
- Incorrect icon sizing on buttons in IE11
- Incorrect metadata colour on focused search results
- Use "none" instead of "unset" for side navigation and site navigation height on small viewports, to support IE11
- Wait until the end of the event loop to change side navigation height property when opening the side navigation on small devices

## [0.0.234] - 2022-03-11
### Added 
- Related searches within search results pattern.
- Support for 4px typography grid.
- Function for calculating root font size and line height.
### Changed
- Search result component has additional layout options and some styling changes.
- Search results pattern has minor styling changes. 
- Pagination ellipsis example now shows both directions.
### Fixed
- Support for mark tag in Windows high contrast mode.

## [0.0.233] - 2022-03-04
## Added
- Alpha "autocomplete" component

## [0.0.232] - 2022-03-04
## Fixed
- Regression introduced in Date Picker component

## [0.0.231] - 2022-03-03
## Changed
- Update site footer component with new grey colourway

## [0.0.230] - 2022-02-23
## Fixed
- Incorrect syntax on calc() expression

## [0.0.229] - 2022-02-23
## Changed
- Improve stability of Date Picker component

## [0.0.228] - 2022-02-22
### Changed
- Pagination "load more" button is now a variant of the component.
- Date picker component sets tracking on itself after initialisation.
- Responsive spacing mixins now have a default value for the "direction" property.
### Fixed
- Tracking attributes now set correctly on accordion "open all" buttons.

## [0.0.227] - 2022-02-21
### Changed
- Site branding text is a link only when not appearing alongside a linked logo. 
### Fixed
- Inconsistent width of site branding logo in Safari browser when SVG.

## [0.0.226] - 2022-02-18
### Added
- Mixin to help with focus states in Windows high contrast mode.

## [0.0.225] - 2022-02-17
### Added
- Prefilled value list within form components.

## [0.0.224] - 2022-02-13
### Added
- Responsive spacing helpers.
### Changed
- Fixed dimensions changed to use responsive spacing.

## [0.0.223] - 2022-02-07
### Added
- Inclusion of [Fractal](https://fractal.build/) now provides a way to browse components, and their variants, locally without requiring to add the pattern library to another project first.
- Dev set of build tasks.
- Placeholder images that are solely used for Fractal examples.
- Analytics tracking attributes added for "Skip links" component.
### Changed
- Readme now contains information on how to use the pattern library as well as contact information for the Design System team.
- JavaScript now transpiled to ES5 for IE11 support.
- DT elements are now bold by default.
- Reversed "secondary" buttons darken on hover.
### Fixed
- Removed duplicate JavaScript initialisation of the datepicker component.
- Fixed JavaScript error if footer tracking is invoked without an organisation link present in the footer.
- Aspect box component fallback now clones the alt attribute.
