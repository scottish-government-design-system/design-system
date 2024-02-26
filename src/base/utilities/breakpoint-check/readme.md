# Breakpoint check

'Breakpoint check' is a utility that provides a simple way of checking the current viewport size/active breakpoint.

It works by:
1. creating an empty element that will be visible at the supplied breakpoint
1. checking that element's visibility in the current viewport
1. removing that element again

## How to use it

Import the `breakpoint-check` script from the Design System. The script exports a function that accepts one parameter, the name of the viewport to be checked, and returns true or false for whether the current viewport matches that breakpoint.

```
import breakpointCheck from
    '../path/to/design-system/src/base/utilities/breakpoint-check/breakpoint-check';

...

myElement.addEventListener('click', function (event) {
    if (breakpointCheck('medium')) {
        // tablet and above behaviour
    } else {
        // other behaviour
    }
});
```

The available breakpoint names are:
- small (min-width: 480px)
- medium (min-width: 768px)
- large (min-width: 992px)
- xlarge (min-width: 1200px)

These are a subset of the breakpoints used by the Design System and that are defined in `src/base/settings/breakpoints/_breakpoints.scss`.
