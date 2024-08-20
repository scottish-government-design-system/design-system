'use strict';

class Notification {
    constructor (notification) {
        this.notification = notification;
        this.notificationClose = notification.querySelector('.js-close-notification');
    }

    init() {
        if (this.notificationClose) {
            this.notificationClose.addEventListener('click', () => {
                this.notification.parentNode.removeChild(this.notification);
            });
        }

        this.notification.classList.add('js-initialised');
    }
}

export default Notification;
