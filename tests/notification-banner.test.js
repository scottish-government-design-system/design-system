const fs = require('fs');
const path = require('path');

const notificationBanner = require('../src/scripts/notification-banner');
const html = fs.readFileSync(path.resolve(__dirname, 'html/notification-banners.html'), 'utf-8');

describe('notification banners', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
    });

    it('should remove a notification banner on click of its "close" button', () =>{
        notificationBanner.notificationComponent.init();

        const notification = document.querySelector('.ds_notification');
        const notificationCloseButton = notification.querySelector('.js-close-notification');

        const event = new Event('click');
        notificationCloseButton.dispatchEvent(event);

        expect(document.querySelector('.ds_notification')).toBeNull();
    });
});
