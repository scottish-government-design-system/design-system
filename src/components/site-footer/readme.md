## Configuration options

The background colour of the site footer can be overridden.

```$site-footer__background```

### Use of light background colour

If you are using a light colour for the footer background colour you should remove the ds_reversed class from the site footer element to meet WCAG contrast rules.

Your value for this should be included before you include the SCSS file.

```scss
$site-footer__background: red;
@import '/path/to/components/site-footer/site-footer';
```