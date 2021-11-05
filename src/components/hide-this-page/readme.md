This ‘hide this page’ button code should be placed inside your main layout container (```.ds_layout)``` for correct placement of the button in the layout.

In browsers with support for CSS grid, it will be anchored to the upper right of the layout, and uses ```position: sticky``` to keep it in view.

In older browsers, ```position: fixed``` is used as a fallback, and the button is placed in the upper right of the viewport instead.

For correct display on mobile devices, you should add the class ```ds_has-hide-page``` to the body element.