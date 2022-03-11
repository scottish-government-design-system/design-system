# Change log

All notable changes to the Digital Scotland Design System Pattern Library will be documented in this file.

Changes are grouped under the labels: `Added`, `Changed`, `Deprecated`, 
`Removed`, `Fixed`, and `Security`.

---

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
