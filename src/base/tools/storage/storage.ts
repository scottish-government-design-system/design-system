'use strict';

//@ts-ignore
import isBase64 from './isBase64';

interface Categories {
    necessary?: boolean;
    preferences?: boolean;
    statistics?: boolean;
    campaigns?: boolean;
    marketing?: boolean;
}

type Category = 'necessary' | 'preferences' | 'statistics' | 'campaigns' | 'marketing';

type Storage = {
    categories: any,
    types: any,

    hasPermission: Function;
    getIsJsonString: Function;
    get: Function;
    remove: Function;
    set: Function;

    getCookie: Function;
    getLocalStorage: Function;
    getSessionStorage: Function;
    removeCookie: Function;
    removeLocalStorage: Function;
    removeSessionStorage: Function;
    setCookie: Function;
    setLocalStorage: Function;
    setSessionStorage: Function;

    cookie: {
        get: Function;
        remove: Function;
        set: Function;
    }
}

type CookieData = {
    name: string,
    value: string,
    expires?: string
}

declare global {
    interface Window { storage: Storage; }
}

const storage: Storage = {
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
    set: function (obj: {type: string, name: string, value: string, expiresDays: number, category: string}) {
        if (storage.hasPermission(obj.category)) {
            if (obj.type === storage.types.cookie) {
                return storage.cookie.set(obj.name, obj.value, obj.expiresDays);
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
    get: function (obj: {type: string, name: string}) {
        let value: string;

        if (obj.type === storage.types.cookie) {
            value = storage.cookie.get(obj.name);
        } else if (obj.type === storage.types.localStorage) {
            value = localStorage.getItem(obj.name);
        } else if (obj.type === storage.types.sessionStorage) {
            value = sessionStorage.getItem(obj.name);
        }

        return value;
    },

    /**
     * removes a storage item (local, session, or cookie)
     *
     * Usage example:
     * storage.remove({type: 'cookie', name: 'somethinganalyticsy'}})
     *
     * @param {object} obj
     *   - {string} type (accepted values: 'cookie', 'local', 'session')
     *   - {string} name
     */
    remove: function (obj: {type: string, name: string}) {
        if (obj.type === storage.types.cookie) {
            storage.cookie.remove(obj.name);
        } else if (obj.type === storage.types.localStorage) {
            localStorage.removeItem(obj.name);
        } else if (obj.type === storage.types.sessionStorage) {
            sessionStorage.removeItem(obj.name);
        }
    },

    // more direct method than set({type: cookies, category: 'aaa', name: 'bbb', value: 'ccc', expires: ddd})
    setCookie: function (category: string, name: string, value: string, expiresDays: number) {
        if (storage.hasPermission(category)) {
            storage.cookie.set(name, value, expiresDays);
        }
    },

    // more direct method than set({type: localStorage, category: 'aaa', name: 'bbb', value: 'ccc'})
    setLocalStorage: function (category: string, name: string, value: string) {
        if (storage.hasPermission(category)) {
            localStorage.setItem(name, value);
        }
    },

    // more direct method than set({type: sessionStorage, category: 'aaa', name: 'bbb', value: 'ccc'})
    setSessionStorage: function (category: string, name: string, value: string) {
        if (storage.hasPermission(category)) {
            sessionStorage.setItem(name, value);
        }
    },

    // more direct method than get({type: cookies, name: foo}
    getCookie: function (name: string) {
        return storage.cookie.get(name);
    },

    // more direct method than get({type: localStorage, name: foo}
    getLocalStorage: function (name: string) {
        return localStorage.getItem(name);
    },

    // more direct method than get({type: sessionStorage, name: foo}
    getSessionStorage: function (name: string) {
        return sessionStorage.getItem(name);
    },

    // more direct method than remove({type: cookies, name: foo}
    removeCookie: function (name: string) {
        return storage.cookie.remove(name);
    },

    // more direct method than remove({type: localStorage, name: foo}
    removeLocalStorage: function (name: string) {
        return localStorage.removeItem(name);
    },

    // more direct method than remove({type: sessionStorage, name: foo}
    removeSessionStorage: function (name: string) {
        return sessionStorage.removeItem(name);
    },

    cookie: {
        set: function (name: string, value: string, expiresDays: number) {
            value = window.btoa(value);

            const cookieData: CookieData = {
                name: name,
                value: value
            };

            if (expiresDays) {
                const date = new Date();
                date.setTime(date.getTime() + (expiresDays * 24 * 60 * 60 * 1000));

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

        get: function (name: string) {
            const nameEQ = name + '=',
                cookiesArray = document.cookie.split(';');

            // find a matching cookie
            for (let i = 0, il = cookiesArray.length; i < il; i++) {
                let cookie = cookiesArray[i];

                while (cookie.charAt(0) === ' ') {
                    cookie = cookie.substring(1, cookie.length);
                }

                if (cookie.indexOf(nameEQ) === 0) {
                    const string = cookie.substring(nameEQ.length, cookie.length);

                    if (isBase64(string)) {
                        return window.atob(string);
                    } else {
                        return string;
                    }
                }
            }

            // return null if no matching cookie found
            return null;
        },

        // indiscriminately hit no domain, domain, and .domain
        remove: function (name: string) {
            const hostparts = window.location.host.split('.');
            let domain;

            document.cookie = `${name}=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`;

            while (hostparts.length > 1) {
                domain = hostparts.join('.');

                document.cookie = `${name}=;path=/;domain=${domain};expires=Thu, 01 Jan 1970 00:00:01 GMT`;
                document.cookie = `${name}=;path=/;domain=.${domain};expires=Thu, 01 Jan 1970 00:00:01 GMT`;

                hostparts.shift();
            }
        }
    },

    hasPermission(category: Category) {
        const cookiePermissionsString = storage.get({
            type: storage.types.cookie,
            name: 'cookiePermissions'
        }) || '';

        let cookiePermissions: Categories = {};

        if (storage.getIsJsonString(cookiePermissionsString)) {
            cookiePermissions = JSON.parse(cookiePermissionsString);
        }

        return category === storage.categories.necessary || cookiePermissions[category] === true;
    },

    getIsJsonString: function (string: string) {
        try {
            JSON.parse(string);
        } catch (e) {
            return false;
        }
        return true;
    }
};

window.storage = storage;

export default storage;
