import DSComponent from '../../base/component/component';
import { StorageArgs } from '../../base/tools/storage/storage';
/**
 * Cookie notification component
 *
 * @class CookieNotification
 * @extends DSComponent
 * @property {object} storage - the DS storage object
 * @property {string[]} categories - an array of cookie categories
 * @property {HTMLButtonElement} cookieAcceptAllButton - the accept all cookies button
 * @property {HTMLButtonElement} cookieAcceptEssentialButton - the accept essential cookies button
 * @property {HTMLElement} cookieNoticeElement - the cookie notice element
 * @property {HTMLElement} cookieNoticeSuccessElement - the cookie notice success message element
 */
declare class CookieNotification extends DSComponent {
    storage: StorageArgs;
    categories: string[];
    private cookieAcceptAllButton;
    private cookieAcceptEssentialButton;
    private cookieNoticeElement;
    private cookieNoticeSuccessElement;
    /**
     * Creates a cookie notification component
     *
     * @param {HTMLElement} element - the cookie notification element
     * @param {StorageArgs} storage - the DS storage object
     * @param {string[]} categories - an array of cookie categories
     */
    constructor(element: HTMLElement, storage?: StorageArgs, categories?: string[]);
    /**
     * Initialise the cookie notification component
     * - display the cookie notice if not yet acknowledged
     * - bind event listeners to the accept buttons
     * - manage setting cookie permissions based on user choice
     * - focus on success message after acceptance
     *
     * @returns {void}
     */
    init(): void;
    /**
     * Sets all optional cookie permissions
     * - necessary is always allowed
     * - preferences, statistics, campaigns, marketing are set based on the 'allow' parameter
     * - all cookies are set to expire in 365 days
     *
     * @param {boolean} allow - whether to allow optional cookies
     * @returns {void}
     */
    private setAllOptionalPermissions;
}
export default CookieNotification;
