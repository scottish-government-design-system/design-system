## Modifiers

### Background colour

Use the following modifier classes to alter the background colour of the notification banner:

- ```ds_notification--success``` for a green background

### Icon display style

Use the following modifier classes to alter the display of the icons in notification banners:

- ```ds_notification__icon--inverse``` places the icon on a circle with a solid background
- ```ds_notification__icon--colour``` makes the icon use a colour other than the current text colour. The default is yellow.

Both modifiers can be used together, which gives you a coloured disc for an inverted icon.

## Theming

### Icon colour

Icons using the ```ds_notification__icon--colour``` modifier use a colour defined in a ```$notification-banner__colour-icon-colour``` variable. You can override this.

Your value for this should be included before you include the SCSS file.

```scss
$notification-banner__colour-icon-colour: red;
@import '/path/to/components/notification-banner/notification-banner';
```

### Background colour

Icons using the ```ds_notification--success``` modifier use a colour defined in a ```$notification-banner__background-colour--success``` variable while the default background colour uses a ```$notification-banner__background-colour``` variable.

To override these settings the colour values for these should be included before you include the SCSS file.

```scss
$notification-banner__colour-icon-colour: grey;
$notification-banner__colour-icon-colour--success: purple;
@import '/path/to/components/notification-banner/notification-banner';
```