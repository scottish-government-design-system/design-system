## Date formats

Use an attribute of data-dateformat on the input element to specify one of the following. If none is provided it defaults to DMY.

- ```DMY``` - 14th March 2020 would be written as 14/03/2020
- ```MDY``` - 14th March 2020 would be written as 03/14/2020
- ```YMD``` - 14th March 2020 would be written as 2020/03/14

The placeholder text should match the chosen date format.

## Allowed date ranges

Use an attribute of data-mindate on the input element to specify an earliest possible date for the calendar. Dates before this date cannot be selected.

Use an attribute of data-maxdate on the input element to specify a latest possible date for the calendar. Dates after this date cannot be selected.

The date format used for both of these is whatever you specify in data-dateformat or the default, DMY.

## Options

The following options can be set when instantiating the component.

### Icon image

```js
myDatePicker = new DSDatePicker(myelement, {imagePath: '/my/image/path/'});
```