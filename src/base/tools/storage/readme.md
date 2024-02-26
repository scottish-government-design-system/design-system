## Storage

The Design Systems's 'storage' script is a tool you can use to set cookies, local storage items or session storage items, with a check for whether a user has given permission for them to be set.

The storage script adds the `storage` object to the global scope. The storage object contains methods and objects used by the script.

The script works by expecting a storage category to be provided when setting a cookie or other storage item, then checking that the user has opted into that category before allowing the item to be set.

There are five categories included as options by default:
- necessary
- preferences
- statistics
- campaigns
- marketing

These can be found on the `storage.categories` object. Other categories can be added to this object if they are required for your project.

## How to use it

### Setting a storage item

To set a storage item, call `storage.set()` with a storage type, a category, the name of the storage item, the value of the storage item and, optionally and only for cookies, the number of days until the cookie expires.

In the following example, the 'warningBannerDismissed' cookie would only be set if the user has opted in to the 'preferences' cookie category.

```
storage.set({
    type: storage.types.cookie,
    category: storage.categories.preferences,
    name: 'warningBannerDismissed',
    value: 'true',
    expires: 7
});
```

Shorthand methods for setting a cookie, local storage item or session storage item also exist. These are documented in code comments in storage.js.

### Getting or deleting a storage item

Similar methods exist for getting a storage item's value and deleting a storage item. To use these you only need to provide the type of storage item and the name of the storage item.

For example:

```
storage.remove({
    type: storage.types.cookie,
    name: 'warningBannerDismissed'
});
```

Shorthand methods for getting or deleting a cookie, local storage item or session storage item also exist. These are documented in code comments in storage.js.

## Checking cookie permissions

The cookie permissions check depends on a specific format for how cookie permissions are stored. It expects there to be a cookie called 'cookiePermissions', which should be created when a user’s cookie preferences are set. The value of that cookie is a base64-encoded JSON string representing an object with key/value pairs for the expected categories.

An example (decoded) cookie permissions object would be:

```
{
    "necessary": true,
    "preferences": true,
    "statistice": true,
    "marketing": false,
    "campaigns": false
}
```

### Checking for cookie permissions in your own scripts

The storage script exposes its cookie permission check for you to use in other scripts.

For example:

```
if (window.storage.hasPermission('preferences')) {
    // do something
}
```
