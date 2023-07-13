# Change log

All notable changes to the Digital Scotland Design System Pattern Library will be documented in this file.

Changes are grouped under the labels: `Added`, `Changed`, `Deprecated`, 
`Removed`, `Fixed`, and `Security`.

---
## [0.0.356] - 2023-07-13
### Changed
- remove use of pseudorandom number generators to create unique IDs on accordion, details, side navigation and site navigation

## [0.0.355] - 2023-07-12
### Fixed
- minor correction to accordion change in 0.0.354

## [0.0.354] - 2023-07-12
### Fixed
- check for validity of using window.location.hash as css selector
- be less aggressive in transformation of legacy date picker code

## [0.0.353] - 2023-07-10
### Added
- new "notification message" component

## [0.0.352] - 2023-07-07
### Added
- "Summary card" variant to "Summary list" component.
### Changed
- "Summary list" component support for multiple action buttons.
### Fixed
- Improved browser support for borders on "Summary list" component.

## [0.0.351] - 2023-06-08
### Changed
- "Article aside" component spacing and sizing simplified to inherit more styling and use responsive scale.
### Fixed
- Top level list elements have standard block element bottom margin as default.

## [0.0.350] - 2023-06-06
### Changed
- "Contact details" component has some spacing changes, multiple column support and option of grouping social links by platform type.

## [0.0.349] - 2023-05-23
### Fixed
- fix failing test specs

## [0.0.348] - 2023-05-23
### Fixed
- labels missing from side nav and site nav open/close toggles after JS initialisation

## [0.0.347] - 2023-05-22
### Fixed
- use npm prepack instead of npm prepare

## [0.0.346] - 2023-05-19
### Fixed
- minor code organisation / cleanup for date picker
### Changed
- remove date picker keyboard action for 'esc' key (close dialog) because it conflicts with screen reader keyboard shortcuts

## [0.0.345] - 2023-05-12
### Fixed
- resolve regression introduced in 0.0.344 where the dist folder was not being created

## [0.0.344] - 2023-05-12
### Fixed
- resolve istanbul-instrumenter-loader peer dependency issue by replacing it with coverage-istanbul-loader

## [0.0.343] - 2023-05-05
### Changed
- accordion items will start opened if they contain an element matching window.location.hash

## [0.0.342] - 2023-05-05
### Changed
- nested list spacing improvements
- different levels of ordered list use different numbering types

## [0.0.341] - 2023-05-03
### Fixed
- script error on date picker

## [0.0.340] - 2023-05-03
### Fixed
- date picker date selection callback function uses a JS date object as its first argument

## [0.0.339] - 2023-05-03
### Added
- date picker now has support for disabled dates
- date picker fires an optional callback function when a date is selected
- date picker supports multiple date inputs for day/month/year
- date picker calendar dates now have aria labels with their full date
### Changed
- only animate transitions on accordion, details, side navigation and site navigation if 'prefers-reduced-motion: reduce' not set
### Fixed
- date picker calendar button screen reader content reverts to "choose date" when text inputs are modified

## [0.0.338] - 2023-04-24
### Added
- pattern-library npm package now includes both minified and unminified compiled CSS

## [0.0.337] - 2023-04-05
### Added
- new "break word" utility class

## [0.0.336] - 2023-03-21
### Security
- address vulnerabilities in npm packages

## [0.0.335] - 2023-03-21
### Changed
- reduce need for an additional class on the body element for correct display of "hide this page" (uses :has(), which is not fully supported in all target browsers. Recommend still using the body class where possible)

## [0.0.334] - 2023-03-01
### Changed
- add border to non-generic thumbnail images in "file download" to ensure suitable contrast with the component background

## [0.0.333] - 2023-02-08
### Changed
- reworked "file download" component with titles linking to the document and "download" button removed
- new file type icons for common file types
- site header text inputs restyled to have a grey border and lighter background
### Fixed
- autocomplete tracking no longer misreporting search term

## [0.0.332] - 2023-02-08
### Changed
- remove dark border from "site search" text fields
### Notes
- site search text inputs do not meet colour contrast requirements

## [0.0.331] - 2023-02-07
### Changed
- "site search" text fields now have a dark border, to help meet colour contrast requirements
### Added
- added tracking attributes for the "details" component

## [0.0.330] - 2023-01-31
### Fixed
- clicks on "Cancel" and "OK" buttons on date pickers no longer trigger form submission

## [0.0.329] - 2023-01-30
### Fixed
- revert regression to cookie notification colour scheme introduced in 0.0.237

## [0.0.328] - 2023-01-30
### Fixed
- external link tracking no longer added to internal anchor/hash links

## [0.0.327] - 2023-01-26
### Fixed
- reduce complexity of some CSS selectors
- fix placement of accordion chevron icon

## [0.0.326] - 2023-01-25
### Added
- add tracking attribute for external links

## [0.0.325] - 2023-01-12
### Fixed
- corrections to scripts in package.json

## [0.0.324] - 2023-01-12
### Removed
- no longer use del-cli in npm prepublish
### Changed
- use double ampersands for chained npm scripts for better cross-platform support

## [0.0.323] - 2023-01-12
### Changed
- spacing adjustments to site header and branding

## [0.0.322] - 2023-01-12
### Changed
- site header restyled for better display on small viewports
- make sass and webpack npm tasks use scripts from node_modules

## [0.0.321] - 2023-01-10
### Fixed
- regenerate package-lock.json with no nexus URLs

## [0.0.320] - 2023-01-10
### Fixed
- use encodeURIComponent on term sent to autocomplete

## [0.0.319] - 2023-01-06
### Added
- Tracking attribute for prototype "Card" component 

## [0.0.318] - 2022-11-29
### Changed
- Summary list refactored to allow action links ("change") to be omitted without creating misalignment issues in the list
- Summary list has a new "no border" variant

## [0.0.317] - 2022-11-29
### Removed
- Fractal removed from the Pattern Library. It is now available in a separate repository.

## [0.0.316] - 2022-11-24
### Fixed
- Sass compilation error for "Details" component

## [0.0.315] - 2022-11-23
### Fixed
- box sizing for "Details" component

## [0.0.314] - 2022-11-19
### Fixed
- windows high contrast mode fixes:
  - outline colour on tag and notification panel changed to match text colour
  - highlighted autocomplete suggestion text colour and border colour changed to the "highlight" keyword colour
  - card links have an outline on focus only

## [0.0.313] - 2022-11-18
### Changed 
- windows high contrast compatibility review:
  - tag component has outline
  - notification panels have outline
  - highlighted text is visible on autocomplete suggestions
  - highlight marker is visible on autocomplete suggestions
  - card links have an outline
  - details component "arrow" indicator renders correctly

## [0.0.312] - 2022-11-16
### Changed 
- style updates for details and summary list components

## [0.0.311] - 2022-11-15
### Added 
- add draft "Summary list" component

## [0.0.310] - 2022-11-14
### Added 
- add draft "Details" component
### Fixed
- script error in IE11 when expected elements for page footer are not present

## [0.0.309] - 2022-11-09
### Added 
- add tracking attributes to step navigation

## [0.0.308] - 2022-11-08
### Added 
- add "small" accordion variant
- add "small" step navigation variant
### Fixed
- use correct outline colour for checkbox/radio hover state
- adjust spacing of accordion so that it fits on the 8px grid correctly
### Changed
- move "last child no margin" to the correct part of callout
- minor spacing corrections to step navigation

## [0.0.307] - 2022-11-01
### Added 
- include draft "step navigation" component window.DS.components

## [0.0.306] - 2022-11-01
### Added 
- include draft "step navigation" component in all-components.scss and all.js

## [0.0.305] - 2022-11-01
### Added 
- add draft "step navigation" component

## [0.0.304] - 2022-10-19
### Fixed 
- alignment of small variant checkbox and radio button "checked" states on viewports under 768px

## [0.0.303] - 2022-10-11
### Fixed 
- buttons used for accordion open/close have type "button" so they don't interfere with form submissions

## [0.0.302] - 2022-10-07
### Changed
- social icons now part of link target area within contact component
### Fixed 
- ie grid support for feature header component

## [0.0.301] - 2022-10-05
### Added
- content blocks for local development use only
### Changed
- content blocks not published to npm
### Removed
- files property from package.json
- readme content for local development

## [0.0.300] - 2022-10-03
### Changed
- card component now uses responsive spacing

## [0.0.299] - 2022-09-30
### Fixed
- base64 encoding of cookie value not happening in the correct location
- incorrect margins for narrow card category grid variant

## [0.0.298] - 2022-09-30
### Added
- sass colour helpers for tint and shade
- grey background option for card
- link list component containing link item components
### Changed
- image is now left aligned on a card with small image option at mobile size
- metadata spacing to use relative values
### Deprecated
- category item no longer needed within a card
### Removed
- metadata content labels
### Fixed
- minor fixes to Fractal examples for search results and pagination

## [0.0.297] - 2022-09-23
### Fixed
- fix failing storage.js specs 
- improve the check for whether the cookie value is encoded 

## [0.0.296] - 2022-09-23
### Changed
- use base64 encoding for cookie values set via storage.js

## [0.0.295] - 2022-09-22
### Fixed
- improved width rules for "file download" thumbnail that won't clash with image width rules set on `.ds_layout__content img`

## [0.0.294] - 2022-09-21
### Added
- new "ds_checkboxes" wrapper element that bakes in a bottom margin equal to how much the last checkbox in a group overflows its parent
### Fixed
- vertical alignment of small variant of radios and checkboxes
- a minor typo in a comment in _page.scss

## [0.0.293] - 2022-09-20
### Fixed
- split the pre-footer-background's :has() and its fallback CSS into two declarations

## [0.0.292] - 2022-09-20
### Added
- new method of handling when there is a coloured background preceding the footer

## [0.0.291] - 2022-09-15
### Fixed
- hover & focus state now visible on file download thumbnail link

## [0.0.290] - 2022-09-12
### Added
- add first pass at "exclusive" checkboxes
### Changed
- use DS standard box shadow for highlighted file download blocks

## [0.0.287] - 2022-08-23
### Changed
- rename the "file info" component to "file download"
- improve alt text on aspect box Fractal examples

## [0.0.286] - 2022-08-19
### Changed
- increase margin on feature header

## [0.0.285] - 2022-08-19
### Removed
- remove "full image" variant of feature header
### Changed
- rename content/media containers in feature header to use more generic names

## [0.0.284] - 2022-08-18
### Added
- add "feature header" component, which replaces "category header"

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
