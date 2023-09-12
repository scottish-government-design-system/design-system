jasmine.getFixtures().fixturesPath = 'base/src/';

import storage from './storage';

describe('storage', () => {
    describe('set', () => {
        it('should do nothing with requests in disallowed categories', () => {
            spyOn(storage.cookie, 'set');

            storage.set({
                type: 'cookie',
                category: 'foo',
                name: 'disalloweditem',
                value: 'badvalue'
            });

            expect(storage.cookie.set).not.toHaveBeenCalled();
        });

        it('should do nothing with requests in unknown storage types', () => {
            spyOn(storage.cookie, 'set');
            spyOn(localStorage, 'setItem');
            spyOn(sessionStorage, 'setItem');

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
            spyOn(storage.cookie, 'set');
            spyOn(localStorage, 'setItem');
            spyOn(sessionStorage, 'setItem');

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
            spyOn(storage.cookie, 'get');
            storage.get({ type: 'cookie', name: 'name' });
            expect(storage.cookie.get).toHaveBeenCalledWith('name');
        });

        it('should get from localStorage if requested', () => {
            spyOn(localStorage, 'getItem');
            storage.get({ type: 'local', name: 'name' });
            expect(localStorage.getItem).toHaveBeenCalledWith('name');
        });

        it('should get from sessionStorage if requested', () => {
            spyOn(sessionStorage, 'getItem');
            storage.get({ type: 'session', name: 'name' });
            expect(sessionStorage.getItem).toHaveBeenCalledWith('name');
        });

        it('should not get from unknown storage', () => {
            spyOn(storage.cookie, 'get');
            spyOn(localStorage, 'getItem');
            spyOn(sessionStorage, 'getItem');
            storage.get({ type: 'foo', name: 'name' });
            expect(storage.cookie.get).not.toHaveBeenCalled();
            expect(localStorage.getItem).not.toHaveBeenCalled();
            expect(sessionStorage.getItem).not.toHaveBeenCalled();
        });
    });

    describe('remove', () => {
        it('should remove from cookies', () => {
            spyOn(storage.cookie, 'remove');
            storage.remove({
                type: 'cookie',
                name: 'foo'
            });

            expect(storage.cookie.remove).toHaveBeenCalledWith('foo');
        });

        it ('should remove from localStorage', () => {
            spyOn(localStorage, 'removeItem');
            storage.remove({
                type: 'local',
                name: 'foo'
            });

            expect(localStorage.removeItem).toHaveBeenCalledWith('foo');
        });

        it ('should remove from sessionStorage', () => {
            spyOn(sessionStorage, 'removeItem');
            storage.remove({
                type: 'session',
                name: 'foo'
            });

            expect(sessionStorage.removeItem).toHaveBeenCalledWith('foo');
        });

        it('should do nothing if the storage type is not recognised', () => {
            spyOn(storage.cookie, 'remove');
            spyOn(localStorage, 'removeItem');
            spyOn(sessionStorage, 'removeItem');

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
            spyOn(storage.cookie, 'set');
            storage.setCookie('necessary', 'name', 'value', 1);
            expect(storage.cookie.set).toHaveBeenCalledWith('name', 'value', 1);
        });

        it('should not set if not allowed', () => {
            spyOn(storage.cookie, 'set');
            storage.setCookie('foo', 'name', 'value', 1);
            expect(storage.cookie.set).not.toHaveBeenCalled();
        });

        it('should get', () => {
            spyOn(storage.cookie, 'get');
            storage.getCookie('name');
            expect(storage.cookie.get).toHaveBeenCalledWith('name');
        });

        it('should remove', () => {
            spyOn(storage.cookie, 'remove');
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

        it ('remove actual cookie', () => {
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
            spyOn(localStorage, 'setItem');
            storage.setLocalStorage('necessary', 'name', 'value');
            expect(localStorage.setItem).toHaveBeenCalledWith('name', 'value');
        });

        it('should not set if not allowed', () => {
            spyOn(localStorage, 'setItem');
            storage.setLocalStorage('foo', 'name', 'value');
            expect(localStorage.setItem).not.toHaveBeenCalled();
        });

        it('should get', () => {
            spyOn(localStorage, 'getItem');
            storage.getLocalStorage('name');
            expect(localStorage.getItem).toHaveBeenCalledWith('name');
        });

        it('should remove', () => {
            spyOn(localStorage, 'removeItem');
            storage.removeLocalStorage('name');
            expect(localStorage.removeItem).toHaveBeenCalledWith('name');
        });
    });

    describe('sessionStorage', () => {
        it('should set if allowed', () => {
            spyOn(sessionStorage, 'setItem');
            storage.setSessionStorage('necessary', 'name', 'value');
            expect(sessionStorage.setItem).toHaveBeenCalledWith('name', 'value');
        });

        it('should not set if not allowed', () => {
            spyOn(sessionStorage, 'setItem');
            storage.setSessionStorage('foo', 'name', 'value');
            expect(sessionStorage.setItem).not.toHaveBeenCalled();
        });

        it('should get', () => {
            spyOn(sessionStorage, 'getItem');
            storage.getSessionStorage('name');
            expect(sessionStorage.getItem).toHaveBeenCalledWith('name');
        });

        it('should remove', () => {
            spyOn(sessionStorage, 'removeItem');
            storage.removeSessionStorage('name');
            expect(sessionStorage.removeItem).toHaveBeenCalledWith('name');
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

            expect(storage.hasPermission('preferences')).toBeTrue();
            expect(storage.hasPermission('foo')).toBeFalse();
        });
    });
});
