'use strict';

import DSComponent from '../../base/component/component';
import _storage from '../../base/tools/storage/storage';
import temporaryFocus from "../../base/tools/temporary-focus/temporary-focus";

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

    init() {
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

    private setAllOptionalPermissions(allow: boolean) {
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
