# ID modifier

'ID modifier' is a script that makes it easier to avoid duplicated IDs for elements the Design System creates or modifies with JavaScript.

It is not sophisticated. It works by:
- adding a number variable to the `window.DS` object
- incrementing that number every time it is called
- outputting a string of `ds[currentID]` to use in your scripts, e.g. `ds1`, `ds2`, `ds3` 

## How to use it

Import the `id-modifier` script from the Design System. The script exports a function that returns a string to use when setting your element's ID.

```
import elementIdModifier from
    '../path/to/design-system/src/base/tools/id-modifier/id-modifier';

...

const toggle = document.querySelector('.my-toggle');
const content = document.querySelector('.my-content');

content.id = content.id || `my-content-${elementIdModifier()}`;
toggle.setAttribute('aria-controls', content.id);
```

## Example use case

- the Design System uses ID modifier in a number of components to associate a toggle control with the element that it toggles, using the `aria-controls` attribute. For example, an accordion item's body content and the button that toggles its display (the accordion item's title).
