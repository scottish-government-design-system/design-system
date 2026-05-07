'use strict';

import DSComponent from "../../base/component/component";

/**
 * Notification message component
 *
 * @class NotificationMessage
 * @extends DSComponent
 * @property {HTMLElement} notificationMessage - the notification message element
 * @property {HTMLElement} notificationMessageClose - the notification message close button element
 */
class NotificationMessage extends DSComponent {
    private notificationMessage: HTMLElement;
    private notificationMessageClose: HTMLElement;

    /**
     * Creates a notification component
     *
     * @param {HTMLElement} notificationMessage - the notification element
     */
    constructor(notificationMessage: HTMLElement) {
        super(notificationMessage);
        this.notificationMessage = notificationMessage;
        this.notificationMessageClose = notificationMessage.querySelector('.js-close-notification-message') as HTMLElement;
    }

    /**
     * Add event listener to the close button
     *
     * @returns {void}
     */
    init(): void {
        if (this.notificationMessageClose) {
            this.notificationMessageClose.addEventListener('click', () => {
                this.notificationMessage.parentNode?.removeChild(this.notificationMessage);
            });
        }

        this.isInitialised = true;
    }
}

export default NotificationMessage;