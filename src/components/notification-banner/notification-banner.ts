'use strict';

import DSComponent from "../../base/component/component";

/**
 * Notification banner component
 *
 * @class Notification
 * @extends DSComponent
 * @property {HTMLElement} notification - the notification element
 * @property {HTMLElement} notificationClose - the notification close button element
 */
class Notification extends DSComponent {
    private notification: HTMLElement;
    private notificationClose: HTMLElement;

    /**
     * Creates a notification component
     *
     * @param {HTMLElement} notification - the notification element
     */
    constructor(notification: HTMLElement) {
        super(notification);
        this.notification = notification;
        this.notificationClose = notification.querySelector('.js-close-notification');
    }

    /**
     * Add event listener to the close button
     *
     * @returns {void}
     */
    init(): void {
        if (this.notificationClose) {
            this.notificationClose.addEventListener('click', () => {
                this.notification.parentNode.removeChild(this.notification);
            });
        }

        this.isInitialised = true;
    }
}

export default Notification;
