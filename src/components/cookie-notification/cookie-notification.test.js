import { vi, beforeEach, describe, expect, it } from 'vitest';
import loadHtml from '../../../loadHtml';
import CookieNotification from './cookie-notification';
import storage from '../../base/tools/storage/storage';

const testObj = {};

describe('cookie notification banners', () => {
    beforeEach(async () => {
        await loadHtml('src/components/cookie-notification/cookie-notification.html');
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

        expect(testObj.cookieNotificationElement.classList.contains('fully-hidden')).toBe(false);
        storage.get = tempStorageGet;
    });

    it('should not show the cookie notification if it has not already been dismissed', () => {
        const tempStorageGet = storage.get;
        storage.get = function () {
            return 'yes';
        };
        testObj.cookieNotificationModule = new CookieNotification(testObj.cookieNotificationElement, storage);

        testObj.cookieNotificationModule.init();

        expect(testObj.cookieNotificationElement.classList.contains('fully-hidden')).toBe(true);

        storage.get = tempStorageGet;
    });

    it('should set all cookie options to "allowed" on click of the "accept all" button', () => {
        testObj.cookieNotificationModule = new CookieNotification(testObj.cookieNotificationElement, storage);
        testObj.cookieNotificationModule.init();

        const spy = vi.spyOn(storage, 'setCookie');
        const allowedButton = testObj.cookieNotificationElement.querySelector('.js-accept-all-cookies');
        const event = new Event('click');
        allowedButton.dispatchEvent(event);
        expect(spy.mock.calls[0]).toEqual(['necessary', 'cookiePermissions', '{"necessary":true,"preferences":true,"statistics":true,"campaigns":true,"marketing":true}', 365]);
        expect(spy.mock.calls[1]).toEqual(['necessary', 'cookie-notification-acknowledged', 'yes', 365]);
    });

    it('should set all cookie options to "not allowed" on click of the "essential only" button', () => {
        testObj.cookieNotificationModule = new CookieNotification(testObj.cookieNotificationElement, storage);
        testObj.cookieNotificationModule.init();

        const spy = vi.spyOn(storage, 'setCookie');
        const allowedButton = testObj.cookieNotificationElement.querySelector('.js-accept-essential-cookies');
        const event = new Event('click');

        allowedButton.dispatchEvent(event);
        expect(spy.mock.calls[0]).toEqual(['necessary', 'cookiePermissions', '{"necessary":true,"preferences":false,"statistics":false,"campaigns":false,"marketing":false}', 365]);
        expect(spy.mock.calls[1]).toEqual(['necessary', 'cookie-notification-acknowledged', 'yes', 365]);
    });

    it('should show a success notice when a positive action has been taken', () => {
        testObj.cookieNotificationModule = new CookieNotification(testObj.cookieNotificationElement, storage);
        testObj.cookieNotificationModule.init();

        const allowedButton = testObj.cookieNotificationElement.querySelector('.js-accept-essential-cookies');
        const event = new Event('click');

        allowedButton.dispatchEvent(event);
        expect(testObj.cookieNotificationElement.classList.contains('fully-hidden')).toBe(true);
        expect(testObj.cookieSuccessElement.classList.contains('fully-hidden')).toBe(false);
        expect(document.activeElement.id).toEqual(testObj.cookieSuccessElement.id);
    });

    it('should use the non-mock storage module by default', () => {
        testObj.cookieNotificationModule = new CookieNotification(testObj.cookieNotificationElement);
        testObj.cookieNotificationModule.init();
        expect(testObj.cookieNotificationModule.storage).toEqual(storage);
    });
});
