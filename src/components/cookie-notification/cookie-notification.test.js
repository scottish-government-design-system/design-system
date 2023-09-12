const testObj = {};

jasmine.getFixtures().fixturesPath = 'base/src/';

import CookieNotification from './cookie-notification';
import storage from '../../base/tools/storage/storage';

describe('cookie notification banners', () => {
    beforeEach(() => {
        loadFixtures('components/cookie-notification/cookie-notification.html');
        testObj.cookieNotificationElement = document.getElementById('cookie-notice');
        testObj.cookieSuccessElement = document.getElementById('cookie-confirm');
    });

    it('should show the cookie notification if it has not already been dismissed', () => {
        const tempStorageGet = storage.get;
        storage.get = function () {
            return false;
        };
        testObj.cookieNotificationModule = new CookieNotification(testObj.cookieNotificationElement, storage);

        testObj.cookieNotificationModule.init();

        expect(testObj.cookieNotificationElement.classList.contains('fully-hidden')).toBeFalse();
        storage.get = tempStorageGet;
    });

    it('should not show the cookie notification if it has not already been dismissed', () => {
        const tempStorageGet = storage.get;
        storage.get = function () {
            return 'yes';
        };
        testObj.cookieNotificationModule = new CookieNotification(testObj.cookieNotificationElement, storage);

        testObj.cookieNotificationModule.init();

        expect(testObj.cookieNotificationElement.classList.contains('fully-hidden')).toBeTrue();

        storage.get = tempStorageGet;
    });

    it('should set all cookie options to "allowed" on click of the "accept all" button', () => {
        testObj.cookieNotificationModule = new CookieNotification(testObj.cookieNotificationElement, storage);
        testObj.cookieNotificationModule.init();

        storage.categories = {
            necessary: 'necessary',
            one: 'one',
            two: 'two'
        };

        spyOn(storage, 'setCookie');
        const allowedButton = testObj.cookieNotificationElement.querySelector('.js-accept-all-cookies');
        const event = new Event('click');
        allowedButton.dispatchEvent(event);
        expect(storage.setCookie.calls.argsFor(0)).toEqual(['necessary', 'cookiePermissions', '{"necessary":true,"one":true,"two":true}', 365]);
        expect(storage.setCookie.calls.argsFor(1)).toEqual(['necessary', 'cookie-notification-acknowledged', 'yes', 365]);
    });

    it('should set all cookie options to "not allowed" on click of the "essential only" button', () => {
        testObj.cookieNotificationModule = new CookieNotification(testObj.cookieNotificationElement, storage);
        testObj.cookieNotificationModule.init();

        storage.categories = {
            necessary: 'necessary',
            one: 'one',
            two: 'two'
        };

        spyOn(storage, 'setCookie');
        const allowedButton = testObj.cookieNotificationElement.querySelector('.js-accept-essential-cookies');
        const event = new Event('click');
        allowedButton.dispatchEvent(event);
        expect(storage.setCookie.calls.argsFor(0)).toEqual(['necessary', 'cookiePermissions', '{"necessary":true,"one":false,"two":false}', 365]);
        expect(storage.setCookie.calls.argsFor(1)).toEqual(['necessary', 'cookie-notification-acknowledged', 'yes', 365]);
    });

    it('should show a success notice when a positive action has been taken', () => {
        testObj.cookieNotificationModule = new CookieNotification(testObj.cookieNotificationElement, storage);
        testObj.cookieNotificationModule.init();

        const allowedButton = testObj.cookieNotificationElement.querySelector('.js-accept-essential-cookies');
        const event = new Event('click');

        allowedButton.dispatchEvent(event);
        expect(testObj.cookieNotificationElement.classList.contains('fully-hidden')).toBeTrue();
        expect(testObj.cookieSuccessElement.classList.contains('fully-hidden')).toBeFalse();
        expect(document.activeElement.id).toEqual(testObj.cookieSuccessElement.id);
    });

    it('should use the non-mock storage module by default', () => {
        testObj.cookieNotificationModule = new CookieNotification(testObj.cookieNotificationElement);
        testObj.cookieNotificationModule.init();
        expect(testObj.cookieNotificationModule.storage).toEqual(storage);
    });
});
