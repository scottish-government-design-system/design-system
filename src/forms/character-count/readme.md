## A character limit can be set in two ways:

### Maxlength attribute

Use a maxlength attribute on the input element. This progresive enhancement is the most user-friendly way to do it because if for any reason the component is not initialised the character limit will still be imposed.

The maxlength attribute is removed when the component initialises to allow the user to overflow the input without losing any of their input data. They will instead be shown a warning that they have exceeded the character limit.

### data-maxlength attribute

Using a data-maxlength attribute to specify the character count behaves largely the same way as using a maxlength attribute, but without the fallback to using the native behaviour for an input field with a maxlength.