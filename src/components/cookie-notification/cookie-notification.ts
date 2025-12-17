'use strict';

import DSComponent from '../../base/component/component';
import _storage from '../../base/tools/storage/storage';
import temporaryFocus from "../../base/tools/temporary-focus/temporary-focus";

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
class CookieNotification extends DSComponent {
    storage: {
        get: (obj: { type: string, name: string }) => string;
        setCookie: (category: string, name: string, value: string, expiresDays: number) => void;
    };

    categories: string[];

    private cookieAcceptAllButton: HTMLButtonElement;
    private cookieAcceptEssentialButton: HTMLButtonElement;
    private cookieNoticeElement: HTMLElement;
    private cookieNoticeSuccessElement: HTMLElement;

    /**
     * Creates a cookie notification component
     *
     * @param {HTMLElement} element - the cookie notification element
     * @param storage - the DS storage object
     * @param categories - an array of cookie categories
     */
    constructor(element: HTMLElement, storage = _storage, categories?: string[]) {
        super(element);

        const defaultCategories = [
            'necessary',
            'preferences',
            'statistics',
            'campaigns',
            'marketing'
        ];

        this.storage = storage;
        this.categories = categories || defaultCategories;

        this.cookieNoticeElement = element;
        this.cookieNoticeSuccessElement = document.getElementById('cookie-confirm');
        this.cookieAcceptAllButton = this.cookieNoticeElement.querySelector('.js-accept-all-cookies');
        this.cookieAcceptEssentialButton = this.cookieNoticeElement.querySelector('.js-accept-essential-cookies');
    }

    /**
     * Initialise the cookie notification component
     * - display the cookie notice if not yet acknowledged
     * - bind event listeners to the accept buttons
     * - manage setting cookie permissions based on user choice
     * - focus on success message after acceptance
     *
     * @returns {void}
     */
    init(): void {
        // check whether we need to display the cookie notice
        if (!this.storage.get({type: 'cookie', name: 'cookie-notification-acknowledged'})) {
            this.cookieNoticeElement.classList.remove('fully-hidden');
        }

        // bind a click handler to the accept all button
        this.cookieAcceptAllButton.addEventListener('click', (event) => {
            event.preventDefault();

            this.setAllOptionalPermissions(true);

            this.cookieNoticeElement.classList.add('fully-hidden');
            this.cookieNoticeSuccessElement.classList.remove('fully-hidden');
            temporaryFocus(this.cookieNoticeSuccessElement);
        });

        // bind a click handler to the essential only button
        this.cookieAcceptEssentialButton.addEventListener('click', (event) => {
            event.preventDefault();

            this.setAllOptionalPermissions(false);

            this.cookieNoticeElement.classList.add('fully-hidden');
            this.cookieNoticeSuccessElement.classList.remove('fully-hidden');
            temporaryFocus(this.cookieNoticeSuccessElement);
        });

        this.isInitialised = true;
    }

    /**
     * Sets all optional cookie permissions
     * - necessary is always allowed
     * - preferences, statistics, campaigns, marketing are set based on the 'allow' parameter
     * - all cookies are set to expire in 365 days
     *
     * @param {boolean} allow - whether to allow optional cookies
     * @returns {void}
     */
    private setAllOptionalPermissions(allow: boolean): void {
        const cookiePermissions = Object.fromEntries(this.categories.map((category) => {
            return [category, category === 'necessary' ? true : allow];
        }));

        for (const key in cookiePermissions) {
            if (key === 'necessary') {
                // always allow necessary
                cookiePermissions[key] = true;
            } else {
                cookiePermissions[key] = allow;
            }
        }

        this.storage.setCookie(
            'necessary',
            'cookiePermissions',
            JSON.stringify(cookiePermissions),
            365
        );

        this.storage.setCookie(
            'necessary',
            'cookie-notification-acknowledged',
            'yes',
            365
        );
    }
}

export default CookieNotification;
