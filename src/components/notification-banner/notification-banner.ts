'use strict';

import DSComponent from "../../base/component/component";

class Notification extends DSComponent {
    private notification: HTMLElement;
    private notificationClose: HTMLElement;

    constructor(notification: HTMLElement) {
        super(notification);
        this.notification = notification;
        this.notificationClose = notification.querySelector('.js-close-notification');
    }

    init() {
        if (this.notificationClose) {
            this.notificationClose.addEventListener('click', () => {
                this.notification.parentNode.removeChild(this.notification);
            });
        }

        this.isInitialised = true;
    }
}

export default Notification;
