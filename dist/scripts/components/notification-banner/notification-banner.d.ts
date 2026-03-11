import DSComponent from "../../base/component/component";
/**
 * Notification banner component
 *
 * @class Notification
 * @extends DSComponent
 * @property {HTMLElement} notification - the notification element
 * @property {HTMLElement} notificationClose - the notification close button element
 */
declare class Notification extends DSComponent {
    private notification;
    private notificationClose;
    /**
     * Creates a notification component
     *
     * @param {HTMLElement} notification - the notification element
     */
    constructor(notification: HTMLElement);
    /**
     * Add event listener to the close button
     *
     * @returns {void}
     */
    init(): void;
}
export default Notification;
