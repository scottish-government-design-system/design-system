const testObj = {};

jasmine.getFixtures().fixturesPath = 'base/src/';

import NotificationBanner from './notification-banner';

describe('notification banners', () => {
    beforeEach(() => {
        loadFixtures('components/notification-banner/notification-banner.html');

        testObj.notificationElement = document.querySelector('[data-module="ds-notification"]');
        testObj.notificationModule = new NotificationBanner(testObj.notificationElement);
    });

    it('should remove a notification banner on click of its "close" button', () =>{
        testObj.notificationModule.init();

        const notificationCloseButton = testObj.notificationElement.querySelector('.js-close-notification');

        const event = new Event('click');
        notificationCloseButton.dispatchEvent(event);

        expect(document.querySelector('.ds_notification')).toBeNull();
    });
});
