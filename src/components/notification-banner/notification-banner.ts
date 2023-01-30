'use strict';

class Notification {
    private notification: HTMLDivElement;
    private notificationClose: HTMLButtonElement;

    constructor (notification:HTMLDivElement) {
        this.notification = notification;
        this.notificationClose = notification.querySelector('.js-close-notification');
    }

    init() {
        if (this.notificationClose) {
            this.notificationClose.addEventListener('click', () => {
                this.notification.parentNode.removeChild(this.notification);
            });
        }
    }
}

export default Notification;
