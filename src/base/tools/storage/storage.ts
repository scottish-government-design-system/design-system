'use strict';

interface Categories {
    necessary?: boolean
    preferences?: boolean
    statistics?: boolean
    campaigns?: boolean
    marketing?: boolean
}

type CategoryArgs = 'necessary' | 'preferences' | 'statistics' | 'campaigns' | 'marketing';

export type StorageArgs = {
    hasPermission: (category: CategoryArgs) => boolean
    getIsJsonString: (string: string) => boolean
    get: (obj: { type: string, name: string }) => string
    remove: (obj: { type: string, name: string }) => void
    set: (obj: { type: string, name: string, value: string, expiresDays?: number, category: CategoryArgs }) => void
    error?: unknown

    getCookie: (name: string) => void
    getLocalStorage: (name: string) => void
    getSessionStorage: (name: string) => void
    removeCookie: (name: string) => void
    removeLocalStorage: (name: string) => void
    removeSessionStorage: (name: string) => void
    setCookie: (category: CategoryArgs, name: string, value: string, expiresDays: number) => void
    setLocalStorage: (category: CategoryArgs, name: string, value: string) => void
    setSessionStorage: (category: CategoryArgs, name: string, value: string) => void
    unsetCookieWithDomain: (name: string, domain?: string) => void

    cookie: {
        get: (name: string) => string | null
        remove: (name: string, _window?: Window) => void
        set: (name: string, value: string, expiresDays?: number) => void
    }
}

type CookieDataArgs = {
    name: string
    value: string
    expires?: string
}

declare global {
    interface Window { storage: StorageArgs; }
}

const storage: StorageArgs = {
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
     * @returns {void}
     */
    set: function (obj: {type: string, name: string, value: string, expiresDays?: number, category: CategoryArgs}): void {
        if (storage.hasPermission(obj.category)) {
            if (obj.type === 'cookie') {
                return storage.cookie.set(obj.name, obj.value, obj.expiresDays);
            } else if (obj.type === 'local') {
                localStorage.setItem(obj.name, obj.value);
            } else if (obj.type === 'session') {
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
    get: function (obj: {type: string, name: string}): string {
        let value: string | null = '';

        if (obj.type === 'cookie') {
            value = storage.cookie.get(obj.name);
        } else if (obj.type === 'local') {
            value = localStorage.getItem(obj.name);
        } else if (obj.type === 'session') {
            value = sessionStorage.getItem(obj.name);
        }

        return value || '';
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
     * @returns {void}
     */
    remove: function (obj: {type: string, name: string}): void {
        if (obj.type === 'cookie') {
            storage.cookie.remove(obj.name);
        } else if (obj.type === 'local') {
            localStorage.removeItem(obj.name);
        } else if (obj.type === 'session') {
            sessionStorage.removeItem(obj.name);
        }
    },

    /**
     * Sets a cookie if permission for this category of storage is given
     * - more direct method than storage.set({})
     *
     * @param {string} category - the category of the cookie
     * @param {string} name - the name of the cookie
     * @param {string} value - the value of the cookie
     * @param {number} expiresDays - the number of days to expire the cookie after
     * @returns {void}
     */
    setCookie: function (category: CategoryArgs, name: string, value: string, expiresDays: number): void {
        if (storage.hasPermission(category)) {
            storage.cookie.set(name, value, expiresDays);
        }
    },

    /**
     * Sets a local storage item if permission for this category of storage is given
     * - more direct method than storage.set({})
     *
     * @param {CategoryArgs} category - the category of the cookie
     * @param {string} name - the name of the cookie
     * @param {string} value - the value of the cookie
     * @returns {void}
     */
    setLocalStorage: function (category: CategoryArgs, name: string, value: string): void {
        if (storage.hasPermission(category)) {
            localStorage.setItem(name, value);
        }
    },

    /**
     * Sets a session storage item if permission for this category of storage is given
     * - more direct method than storage.set({})
     *
     * @param {CategoryArgs} category - the category of the cookie
     * @param {string} name - the name of the cookie
     * @param {string} value - the value of the cookie
     * @returns {void}
     */
    setSessionStorage: function (category: CategoryArgs, name: string, value: string): void {
        if (storage.hasPermission(category)) {
            sessionStorage.setItem(name, value);
        }
    },

    /**
     * Get a cookie value
     * - more direct method than get({type: 'cookies', name: foo})
     *
     * @param {string} name - the name of the cookie
     * @returns {string | null}
     */
    getCookie: function (name: string): string | null {
        return storage.cookie.get(name);
    },

    /**
     * Get a localStorage value
     * - more direct method than get({type: 'localStorage', name: foo})
     *
     * @param {string} name - the name of the localStorage item
     * @returns {string | null}
     */
    getLocalStorage: function (name: string): string | null {
        return localStorage.getItem(name);
    },

    /**
     * Get a sessionStorage value
     * - more direct method than get({type: 'sessionStorage', name: foo})
     *
     * @param {string} name - the name of the sessionStorage item
     * @returns {string | null}
     */
    getSessionStorage: function (name: string): string | null {
        return sessionStorage.getItem(name);
    },

    /**
     * Remove a cookie
     * - more direct method than remove({type: 'cookies', name: foo}
     *
     * @param {string} name - the name of the cookie
     * @returns {void}
     */
    removeCookie: function (name: string): void {
        return storage.cookie.remove(name);
    },

    /**
     * Remove a localStorage item
     * - more direct method than remove({type: 'localStorage', name: foo}
     *
     * @param {string} name - the name of the localStorage item
     * @returns {void}
     */
    removeLocalStorage: function (name: string): void {
        return localStorage.removeItem(name);
    },

    /**
     * Remove a sessionStorage item
     * - more direct method than remove({type: 'sessionStorage', name: foo}
     *
     * @param {string} name - the name of the sessionStorage item
     * @returns {void}
     */
    removeSessionStorage: function (name: string): void {
        return sessionStorage.removeItem(name);
    },

    /**
     * Cookie handling methods
     */
    cookie: {
        /**
         * Set a cookie
         * - encodes value in base64
         *
         * @param {string} name - the name of the cookie
         * @param {string} value - the value of the cookie
         * @param {number} expiresDays - the number of days until expiration
         * @returns {CookieDataArgs}
         */
        set: function (name: string, value: string, expiresDays?: number): CookieDataArgs {
            value = window.btoa(value);

            const cookieData: CookieDataArgs = {
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

        /**
         * Get a cookie value
         * - searches document.cookie for a matching name
         * - decodes base64 encoded values
         *
         * @param {string} name - the name of the cookie
         * @returns {string | null} - the cookie value, or null if no matching cookie found
         */
        get: function (name: string): string | null {
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

                    const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

                    if (base64regex.test(string)) {
                        return window.atob(string);
                    } else {
                        return string;
                    }
                }
            }

            // return null if no matching cookie found
            return null;
        },

        /**
         * Remove a cookie
         * - indiscriminately hit no domain, domain, and .domain
         * - tries to cover all bases
         *
         * @param {string} name - the name of the cookie
         * @param {Window} _window - the window object to use
         * @returns {void}
         */
        remove: function (name: string, _window: Window = window): void {
            const hostparts = _window.location.host.split('.');
            let domain;

            storage.unsetCookieWithDomain(name);

            while (hostparts.length > 1) {
                domain = hostparts.join('.');

                storage.unsetCookieWithDomain(name, domain);
                storage.unsetCookieWithDomain(name, `.${domain}`);

                hostparts.shift();
            }
        }
    },

    /**
     * Check if permission has been given to set a storage item for a given category
     *
     * @param {CategoryArgs} category - the category to check
     * @returns {boolean}
     */
    hasPermission(category: CategoryArgs): boolean {
        const cookiePermissionsString = storage.get({
            type: 'cookie',
            name: 'cookiePermissions'
        }) || '';

        let cookiePermissions: Categories = {};

        if (storage.getIsJsonString(cookiePermissionsString)) {
            cookiePermissions = JSON.parse(cookiePermissionsString);
        }

        return category === 'necessary' || cookiePermissions[category] === true;
    },

    /**
     * Check if a string is valid JSON
     *
     * @param {string} string - the string to check
     * @returns {boolean}
     */
    getIsJsonString: function (string: string): boolean {
        try {
            JSON.parse(string);
        } catch (error: unknown) {
            this.error = error;
            return false;
        }
        return true;
    },

    /**
     * Unset a cookie for a given domain
     *
     * @param {string} name - the name of the cookie
     * @param {string} domain - the domain of the cookie
     * @returns {void}
     */
    unsetCookieWithDomain: function (name: string, domain?: string): void {
        const domainString = domain ? `domain=${domain};` : ''

        document.cookie = `${name}=;path=/;${domainString};expires=Thu, 01 Jan 1970 00:00:01 GMT`;
    }
};

window.storage = storage;

export default storage;
