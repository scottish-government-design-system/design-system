'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = __importDefault(require("../../base/component/component"));
/**
 * Notification banner component
 *
 * @class Notification
 * @extends DSComponent
 * @property {HTMLElement} notification - the notification element
 * @property {HTMLElement} notificationClose - the notification close button element
 */
class Notification extends component_1.default {
    notification;
    notificationClose;
    /**
     * Creates a notification component
     *
     * @param {HTMLElement} notification - the notification element
     */
    constructor(notification) {
        super(notification);
        this.notification = notification;
        this.notificationClose = notification.querySelector('.js-close-notification');
    }
    /**
     * Add event listener to the close button
     *
     * @returns {void}
     */
    init() {
        if (this.notificationClose) {
            this.notificationClose.addEventListener('click', () => {
                this.notification.parentNode?.removeChild(this.notification);
            });
        }
        this.isInitialised = true;
    }
}
exports.default = Notification;
