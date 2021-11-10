## Configuration options

The icons used in sequential navigation use the brand colours you have defined (or the default brand colours), but they can be explicitly specified.

The properties you can override are:

- ```$page-nav__icon-color``` - background colour of the icon
- ```$page-nav__icon-hover``` - background colour of the icon when hovering on the link
- ```$page-nav__icon-focus``` - background colour of the icon when focusing on the link
- ```$page-nav__prefix-color``` - colour of the prefix text (‘next’ and ‘previous’)

Your values for these should be included before you include the SCSS file. Note that any colours you specify will need to meet WCAG contrast rules.

```scss
$page-nav__icon-color: #f00;
$page-nav__icon-hover: #a00;
@import '/path/to/components/sequential-navigation/sequential-navigation';
```