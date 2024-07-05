Can be applied to ```<button>``` or ```<a>``` elements using the ```ds_button``` class.

## Modifiers
Add the following classes to the ```ds_button``` element.

### Style
- Default (Primary): no additional classes required
- Secondary: ```ds_button--secondary```
- Cancel: ```ds_button--cancel```

### Size
- Default: no additional classes required
- Small: ```ds_button--small```

### Width
- Fluid: no additional classes required
- Fixed: ```ds_button--fixed```
- Maximum: ```ds_button--max```

### Label with icon
- Icon before label: ```ds_button--has-icon ds_button--has-icon--left```
- Icon after label: ```ds_button--has-icon```

## Text link style buttons
Replace ```ds_button``` class with ```ds_link```.

## Disabled buttons
Add ```disabled="true"``` to the ```ds_button``` element.

## Icon only buttons
Icon only buttons do not require additional modifiers, but do require the label to be visually hidden.

## Button groups
Buttons are stacked on mobile sizes. On larger sizes they are arranged a row that will overflow.

### Modifiers
Add the following classes to the ```ds_button-group``` element.

#### Layout
- Default: no additional classes required
- Force buttons to remain on a single row: ```ds_button-group--inline```

#### Width
All buttons in a group, with the exception of a text button, must have the same width modifiers applied.