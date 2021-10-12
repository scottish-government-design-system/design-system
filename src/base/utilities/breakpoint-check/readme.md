# Breakpoint check

"Breakpoint check" is a utility that provides a simple way of checking the current viewport size/active breakpoint.

When called, the script creates an empty element that will be visible at the supplied breakpoint, checks its visibility in the current viewport, and removes the element again.

Example use case: You want different JS behaviour on an element at different viewport sizes.

    @import breakpointCheck from 'path/to/breakpoint-check';

    ...

    myElement.addEventListener('click', function (event) {
        if (breakpointCheck('medium')) {
            // tablet and above behaviour
        } else {
            // other behaviour
        }
    });
