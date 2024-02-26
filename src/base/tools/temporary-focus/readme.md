# Temporary focus

Use 'temporary focus' to give focus to any element ... temporarily!

It is useful for managing focus, especially in the context of accessibility with users of tools like screen readers.

It works by:
- assigning a tabindex to that element
- setting up an event listener to remove that tabindex when the element loses focus
- assigning focus to that element

In other words, temporary focus makes an element receive focus, but that element cannot be focused again unless it is another temporary focus. The element does not add clutter to the expected tabbable elements (interactive items such as links and form fields).

## How to use it

Import the `temporary-focus` script from the Design System. The script exports a function that accepts one parameter: the element to be focused.

```
import temporaryFocus from
    '../path/to/design-system/src/base/tools/temporary-focus/temporary-focus';

...

const elementToFocus = document.getElementById('my-element');
temporaryFocus(elementToFocus);
```

## Example use cases

### In the Design System

- the "skip links" component uses temporary focus to highlight the main content of the page when a user triggers the "skip to main content" link

- the "cookie notification" component uses temporary focus to move focus to a confirmation message after the user chooses to accept some or all cookies

### In projects consuming the Design System

- mygov.scot uses temporary focus in its implementation of the address lookup pattern to move focus through the stages of the address lookup flow. For example, once a postcode is submitted the focus is moved to the address selection section.

- mygov.scot uses temporary focus in its smart answers (an interactive decision tree) to control focus during transitions between questions in the decision tree.

- gov.scot uses temporary focus to manage focus on publication documents that are separated over multiple pages. When a new page is navigated to, the new page is loaded asynchronously and the DOM is updated with the new content. Temporary focus moves to the content at the beginning of the new page, so the user can continue reading from that point instead of navigating past common page elements such as the site header and navigation.
