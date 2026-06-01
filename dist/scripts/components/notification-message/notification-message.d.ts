import DSComponent from "../../base/component/component";
/**
 * Notification message component
 *
 * @class NotificationMessage
 * @extends DSComponent
 * @property {HTMLElement} notificationMessage - the notification message element
 * @property {HTMLElement} notificationMessageClose - the notification message close button element
 */
declare class NotificationMessage extends DSComponent {
    private notificationMessage;
    private notificationMessageClose;
    /**
     * Creates a notification component
     *
     * @param {HTMLElement} notificationMessage - the notification element
     */
    constructor(notificationMessage: HTMLElement);
    /**
     * Add event listener to the close button
     *
     * @returns {void}
     */
    init(): void;
}
export default NotificationMessage;
