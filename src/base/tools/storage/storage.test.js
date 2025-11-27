import { vi, afterEach, beforeEach, describe, expect, it } from 'vitest';
import storage from './storage';

// mock window
const windowObj = {
    location: {
        host: ''
    }
};

describe('storage', () => {
    describe('set', () => {
        it('should do nothing with requests in disallowed categories', () => {
            vi.spyOn(storage.cookie, 'set').mockImplementation();

            storage.set({
                type: 'cookie',
                category: 'foo',
                name: 'disalloweditem',
                value: 'badvalue'
            });

            expect(storage.cookie.set).not.toHaveBeenCalled();
        });

        it('should do nothing with requests in unknown storage types', () => {
            vi.spyOn(storage.cookie, 'set').mockImplementation();
            vi.spyOn(Storage.prototype, 'setItem').mockImplementation();
            vi.spyOn(Storage.prototype, 'setItem').mockImplementation();

            storage.set({
                type: 'foo',
                category: 'necessary',
                name: 'disalloweditem',
                value: 'badvalue'
            });

            expect(storage.cookie.set).not.toHaveBeenCalled();
            expect(localStorage.setItem).not.toHaveBeenCalled();
            expect(sessionStorage.setItem).not.toHaveBeenCalled();
        });

        it('should set the relevant storage type if allowed', () => {
            vi.spyOn(storage.cookie, 'set').mockImplementation();
            vi.spyOn(Storage.prototype, 'setItem').mockImplementation();
            vi.spyOn(Storage.prototype, 'setItem').mockImplementation();

            storage.set({
                type: 'cookie',
                category: 'necessary',
                name: 'alloweditem',
                value: 'value'
            });

            storage.set({
                type: 'session',
                category: 'necessary',
                name: 'alloweditem',
                value: 'value'
            });

            storage.set({
                type: 'local',
                category: 'necessary',
                name: 'alloweditem',
                value: 'value'
            });

            expect(storage.cookie.set).toHaveBeenCalled();
            expect(localStorage.setItem).toHaveBeenCalled();
            expect(sessionStorage.setItem).toHaveBeenCalled();
        });
    });

    // todo: spec disabled because it causes intermittent failures. needs investigation.
    describe('get', () => {
        it('should get from cookies if requested', () => {
            vi.spyOn(storage.cookie, 'get').mockImplementation();
            storage.get({ type: 'cookie', name: 'name' });
            expect(storage.cookie.get).toHaveBeenCalledWith('name');
        });

        it('should get from localStorage if requested', () => {
            vi.spyOn(Storage.prototype, 'getItem').mockImplementation();
            storage.get({ type: 'local', name: 'name' });
            expect(localStorage.getItem).toHaveBeenCalledWith('name');
        });

        it('should get from sessionStorage if requested', () => {
            vi.spyOn(Storage.prototype, 'getItem').mockImplementation();
            storage.get({ type: 'session', name: 'name' });
            expect(sessionStorage.getItem).toHaveBeenCalledWith('name');
        });

        it('should not get from unknown storage', () => {
            vi.spyOn(storage.cookie, 'get').mockImplementation();
            vi.spyOn(Storage.prototype, 'getItem').mockImplementation();
            storage.get({ type: 'foo', name: 'name' });
            expect(storage.cookie.get).not.toHaveBeenCalled();
            expect(localStorage.getItem).not.toHaveBeenCalled();
            expect(sessionStorage.getItem).not.toHaveBeenCalled();
        });
    });

    describe('remove', () => {
        it('should remove from cookies', () => {
            vi.spyOn(storage.cookie, 'remove').mockImplementation();
            storage.remove({
                type: 'cookie',
                name: 'foo'
            });

            expect(storage.cookie.remove).toHaveBeenCalledWith('foo');
        });

        it('should remove from cookies NOW WITH DOMAIN', () => {
            windowObj.location.host = 'www.example.com';

            vi.spyOn(storage, 'unsetCookieWithDomain').mockImplementation();
            storage.cookie.remove('foo', windowObj);

            expect(storage.unsetCookieWithDomain).toHaveBeenCalledWith('foo');
            expect(storage.unsetCookieWithDomain).toHaveBeenCalledWith('foo', 'www.example.com');
            expect(storage.unsetCookieWithDomain).toHaveBeenCalledWith('foo', '.example.com');
            expect(storage.unsetCookieWithDomain).toHaveBeenCalledWith('foo', 'example.com');
        });

        it('should remove from localStorage', () => {
            vi.spyOn(Storage.prototype, 'removeItem').mockImplementation();
            storage.remove({
                type: 'local',
                name: 'foo'
            });

            expect(localStorage.removeItem).toHaveBeenCalledWith('foo');
        });

        it('should remove from sessionStorage', () => {
            vi.spyOn(Storage.prototype, 'removeItem').mockImplementation();
            storage.remove({
                type: 'session',
                name: 'foo'
            });

            expect(sessionStorage.removeItem).toHaveBeenCalledWith('foo');
        });

        it('should do nothing if the storage type is not recognised', () => {
            vi.spyOn(storage.cookie, 'remove').mockImplementation();
            vi.spyOn(Storage.prototype, 'removeItem').mockImplementation();

            storage.remove({
                type: 'bananas',
                name: 'foo'
            });

            expect(storage.cookie.remove).not.toHaveBeenCalled();
            expect(localStorage.removeItem).not.toHaveBeenCalled();
            expect(sessionStorage.removeItem).not.toHaveBeenCalled();
        });
    });

    describe('cookie', () => {
        it('should set if allowed', () => {
            vi.spyOn(storage.cookie, 'set').mockImplementation();
            storage.setCookie('necessary', 'name', 'value', 1);
            expect(storage.cookie.set).toHaveBeenCalledWith('name', 'value', 1);
        });

        it('should not set if not allowed', () => {
            vi.spyOn(storage.cookie, 'set').mockImplementation();
            storage.setCookie('foo', 'name', 'value', 1);
            expect(storage.cookie.set).not.toHaveBeenCalled();
        });

        it('should get', () => {
            vi.spyOn(storage.cookie, 'get').mockImplementation();
            storage.getCookie('name');
            expect(storage.cookie.get).toHaveBeenCalledWith('name');
        });

        it('should remove', () => {
            vi.spyOn(storage.cookie, 'remove').mockImplementation();
            storage.removeCookie('name');
            expect(storage.cookie.remove).toHaveBeenCalledWith('name');
        });

        it('get actual cookie', () => {
            // set a temp cookie
            document.cookie = 'one=foo';
            document.cookie = 'two=bar';
            document.cookie = 'three=baz';

            expect(storage.cookie.get('one')).toEqual('foo');
            expect(storage.cookie.get('two')).toEqual('bar');
            expect(storage.cookie.get('three')).toEqual('baz');
            expect(storage.cookie.get('four')).toBeNull();
        });

        it('set actual cookie, with expiry', () => {
            // set a temp cookie
            const date = new Date();
            const newDate = new Date(date.setDate(date.getDate() + 1));
            const cookieData = storage.cookie.set('foo', 'bar', 1);

            expect(cookieData.name).toEqual('foo');
            expect(cookieData.value).toEqual(window.btoa('bar'));
            expect(cookieData.expires).toEqual(newDate.toUTCString());
        });

        it('set actual cookie, no expiry', () => {
            // set a temp cookie
            const cookieData = storage.cookie.set('foo', 'bar');

            expect(cookieData.name).toEqual('foo');
            expect(cookieData.value).toEqual(window.btoa('bar'));
            expect(cookieData.expires).toBeUndefined();
        });

        it('remove actual cookie', () => {
            // set a cookie
            document.cookie = `foo=bar;path=/;`;

            // just checking...
            expect(storage.cookie.get('foo')).toEqual('bar');

            storage.cookie.remove('foo');
            expect(storage.cookie.get('foo')).toBeNull();
        });
    });

    describe('localStorage', () => {
        it('should set if allowed', () => {
            vi.spyOn(Storage.prototype, 'setItem').mockImplementation();
            storage.setLocalStorage('necessary', 'name', 'value');
            expect(localStorage.setItem).toHaveBeenCalledWith('name', 'value');
        });

        it('should not set if not allowed', () => {
            vi.spyOn(Storage.prototype, 'setItem').mockImplementation();
            storage.setLocalStorage('foo', 'name', 'value');
            expect(localStorage.setItem).not.toHaveBeenCalled();
        });

        it('should get', () => {
            vi.spyOn(Storage.prototype, 'getItem').mockImplementation();
            storage.getLocalStorage('name');
            expect(localStorage.getItem).toHaveBeenCalledWith('name');
        });

        it('should remove', () => {
            vi.spyOn(Storage.prototype, 'removeItem').mockImplementation();
            storage.removeLocalStorage('name');
            expect(localStorage.removeItem).toHaveBeenCalledWith('name');
        });
    });

    describe('sessionStorage', () => {
        it('should set if allowed', () => {
            const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation();
            storage.setSessionStorage('necessary', 'name', 'value');
            expect(spy).toHaveBeenCalledWith('name', 'value');
        });

        it('should not set if not allowed', () => {
            const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation();
            storage.setSessionStorage('foo', 'name', 'value');
            expect(spy).not.toHaveBeenCalled();
        });

        it('should get', () => {
            const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation();
            storage.getSessionStorage('name');
            expect(spy).toHaveBeenCalledWith('name');
        });

        it('should remove', () => {
            const spy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation();
            storage.removeSessionStorage('name');
            expect(spy).toHaveBeenCalledWith('name');
        });
    });

    describe('permission', () => {
        let storedGet;

        beforeEach(function () {
            storedGet = storage.get;
        });

        afterEach(function () {
            storage.get = storedGet;
        });

        it('should check if a category is permitted', () => {
            storage.get = function () {
                return '{"necessary":true,"preferences":true,"statistics":true,"campaigns":true,"marketing":true}';
            };

            expect(storage.hasPermission('preferences')).toBe(true);
            expect(storage.hasPermission('foo')).toBe(false);
        });
    });
});
