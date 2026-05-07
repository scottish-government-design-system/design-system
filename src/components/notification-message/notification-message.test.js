import { beforeEach, describe, expect, it } from 'vitest';
import loadHtml from '../../../loadHtml';
import NotificationMessage from './notification-message';

const testObj = {};

describe('notification messages', () => {
    beforeEach(async () => {
        await loadHtml('src/components/notification-message/notification-message.html');
    });

    it('should remove a notification message on click of its "close" button', () => {
        testObj.notificationElement = document.querySelector('#withclose');
        testObj.notificationModule = new NotificationMessage(testObj.notificationElement);

        testObj.notificationModule.init();

        const notificationCloseButton = testObj.notificationElement.querySelector('.js-close-notification-message');

        const event = new Event('click');
        notificationCloseButton.dispatchEvent(event);

        expect(document.querySelector('#withclose')).toBeNull();
    });

    it('should not remove a notification nessage on click of its "close" button if it doesn\'t have one (?)', () => {
        testObj.notificationElement = document.querySelector('#withoutclose');
        testObj.notificationModule = new NotificationMessage(testObj.notificationElement);

        testObj.notificationModule.init();

        const notificationCloseButton = testObj.notificationElement.querySelector('.js-close-notification-message');

        expect(notificationCloseButton).toBeNull();
        expect(document.querySelector('#withclose')).not.toBeNull();
    });
});
