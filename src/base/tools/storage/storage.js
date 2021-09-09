'use strict';

const storage = {
    categories: {
        necessary: 'necessary',
        preferences: 'preferences',
        statistics: 'statistics',
        campaigns: 'campaigns',
        marketing: 'marketing'
    },

    types: {
        cookie: 'cookie',
        localStorage: 'local',
        sessionStorage: 'session'
    },

    /**
     * Sets a storage item (local, session, or cookie)
     *
     * Usage example:
     * storage.set({type: 'cookie', category: 'necessary', name: 'somethinganalyticsy', value: 1, expires: 7}})
     *
     * @param {object} obj
     *   - {string} type (accepted values: 'cookie', 'local', 'session')
     *   - {string} category - used to determine whether user has given permission to store this
     *   - {string} name
     *   - {string} value
     *   - {number} expires - days to remember a cookie for (only relevant to cookies)
     */
    set: function (obj) {
        if (storage.hasPermission(obj.category)) {
            if (obj.type === storage.types.cookie) {
                return storage.cookie.set(obj.name, obj.value, obj.expires);
            } else if (obj.type === storage.types.localStorage) {
                localStorage.setItem(obj.name, obj.value);
            } else if (obj.type === storage.types.sessionStorage) {
                sessionStorage.setItem(obj.name, obj.value);
            }
        }
    },

    /**
     * Gets a storage item (local, session, or cookie)
     *
     * Usage example:
     * storage.get({type: 'session', name: 'remembertabs'})
     *
     * @param {object} obj
     *   - {string} storage (accepted values: 'cookie', 'local', 'session')
     *   - {string} name
     *
     * @returns {string} value of the storage item
     */
    get: function (obj) {
        let value;

        if (obj.type === storage.types.cookie) {
            value = storage.cookie.get(obj.name);
        } else if (obj.type === storage.types.localStorage) {
            value = localStorage.getItem(obj.name);
        } else if (obj.type === storage.types.sessionStorage) {
            value = sessionStorage.getItem(obj.name);
        }

        return value;
    },

    // more direct method than set({type: cookies, category: 'aaa', name: 'bbb', value: 'ccc', expires: ddd})
    setCookie: function (category, name, value, expires) {
        if (storage.hasPermission(category)) {
            storage.cookie.set(name, value, expires);
        }
    },

    // more direct method than set({type: localStorage, category: 'aaa', name: 'bbb', value: 'ccc'})
    setLocalStorage: function (category, name, value) {
        if (storage.hasPermission(category)) {
            localStorage.setItem(name, value);
        }
    },

    // more direct method than set({type: sessionStorage, category: 'aaa', name: 'bbb', value: 'ccc'})
    setSessionStorage: function (category, name, value) {
        if (storage.hasPermission(category)) {
            sessionStorage.setItem(name, value);
        }
    },

    // more direct method than get({type: cookies, name: foo}
    getCookie: function (name) {
        return storage.cookie.get(name);
    },

    // more direct method than get({type: localStorage, name: foo}
    getLocalStorage: function (name) {
        return localStorage.getItem(name);
    },

    // more direct method than get({type: sessionStorage, name: foo}
    getSessionStorage: function (name) {
        return sessionStorage.getItem(name);
    },

    cookie: {
        set: function (name, value, expires) {
            const cookieData = {
                name: name,
                value: value
            };

            if (expires) {
                const date = new Date();
                date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000));

                cookieData.expires = date.toUTCString();
            }

            // build the string, as IE wants expires parameter omitted if no expires set
            let cookieString = name + '=' + value + '; ';
            if (cookieData.expires) {
                cookieString += 'expires=' + cookieData.expires + '; ';
            }
            cookieString += 'path=/';

            document.cookie = cookieString;

            // this variable is used in tests to verify that things are being set correctly
            return cookieData;
        },

        get: function (name) {
            const nameEQ = name + '=',
                cookiesArray = document.cookie.split(';');

            // find a matching cookie
            for (let i = 0, il = cookiesArray.length; i < il; i++) {
                let cookie = cookiesArray[i];

                while (cookie.charAt(0) === ' ') {
                    cookie = cookie.substring(1, cookie.length);
                }

                if (cookie.indexOf(nameEQ) === 0) {
                    return cookie.substring(nameEQ.length, cookie.length);
                }
            }

            // return null if no matching cookie found
            return null;
        }
    },

    hasPermission(category) {
        const cookiePermissionsString = storage.get({
            type: storage.types.cookie,
            name: 'cookiePermissions'
        }) || '';

        let cookiePermissions = {};

        if (storage.isJsonString(cookiePermissionsString)) {
            cookiePermissions = JSON.parse(cookiePermissionsString);
        }

        return category === storage.categories.necessary || cookiePermissions[category] === true;
    },

    isJsonString: function (str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
};

window.storage = storage;

export default storage;
