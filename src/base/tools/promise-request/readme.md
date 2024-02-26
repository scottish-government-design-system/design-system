# Promise request

'Promise request' is a basic Promise wrapper that removes some of the boilerplate for a GET XMLHttpRequest.

## How to use it

Import the `promise-request` script from the Design System. The script exports a function that returns a new Promise object.

```
import PromiseRequest from
    '../path/to/design-system/src/base/tools/promise-request/promise-request';

...

PromiseRequest(myUrl)
    .then(result => successFunction(result))
    .catch(result => failFunction(result));
```
