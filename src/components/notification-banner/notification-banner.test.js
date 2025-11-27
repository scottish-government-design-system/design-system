import { beforeEach, describe, expect, it } from 'vitest';
import loadHtml from '../../../loadHtml';
import NotificationBanner from './notification-banner';

const testObj = {};

describe('notification banners', () => {
    beforeEach(async () => {
        await loadHtml('src/components/notification-banner/notification-banner.html');
    });

    it('should remove a notification banner on click of its "close" button', () => {
        testObj.notificationElement = document.querySelector('#withclose');
        testObj.notificationModule = new NotificationBanner(testObj.notificationElement);

        testObj.notificationModule.init();

        const notificationCloseButton = testObj.notificationElement.querySelector('.js-close-notification');

        const event = new Event('click');
        notificationCloseButton.dispatchEvent(event);

        expect(document.querySelector('#withclose')).toBeNull();
    });

    it('should not remove a notification banner on click of its "close" button if it doesn\'t have one (?)', () => {
        testObj.notificationElement = document.querySelector('#withoutclose');
        testObj.notificationModule = new NotificationBanner(testObj.notificationElement);

        testObj.notificationModule.init();

        const notificationCloseButton = testObj.notificationElement.querySelector('.js-close-notification');

        expect(notificationCloseButton).toBeNull();
        expect(document.querySelector('#withclose')).not.toBeNull();
    });
});
