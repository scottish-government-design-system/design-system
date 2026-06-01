'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = __importDefault(require("../../base/component/component"));
/**
 * Notification message component
 *
 * @class NotificationMessage
 * @extends DSComponent
 * @property {HTMLElement} notificationMessage - the notification message element
 * @property {HTMLElement} notificationMessageClose - the notification message close button element
 */
class NotificationMessage extends component_1.default {
    notificationMessage;
    notificationMessageClose;
    /**
     * Creates a notification component
     *
     * @param {HTMLElement} notificationMessage - the notification element
     */
    constructor(notificationMessage) {
        super(notificationMessage);
        this.notificationMessage = notificationMessage;
        this.notificationMessageClose = notificationMessage.querySelector('.js-close-notification-message');
    }
    /**
     * Add event listener to the close button
     *
     * @returns {void}
     */
    init() {
        if (this.notificationMessageClose) {
            this.notificationMessageClose.addEventListener('click', () => {
                this.notificationMessage.parentNode?.removeChild(this.notificationMessage);
            });
        }
        this.isInitialised = true;
    }
}
exports.default = NotificationMessage;
