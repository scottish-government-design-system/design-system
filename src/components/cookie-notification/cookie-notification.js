'use strict';

import _storage from '../../base/_tools/storage/storage';

class CookieNotification {
    constructor(el, storage = _storage) {
        this.storage = storage;

        this.cookieNoticeElement = el;
        this.cookieNoticeSuccessElement = document.getElementById('cookie-confirm');
        this.cookieAcceptAllButton = this.cookieNoticeElement.querySelector('.js-accept-all-cookies');
        this.cookieAcceptEssentialButton = this.cookieNoticeElement.querySelector('.js-accept-essential-cookies');
    }

    init() {
        // check whether we need to display the cookie notice
        if (!this.storage.get({type: this.storage.types.cookie, name: 'cookie-notification-acknowledged'})) {
            this.cookieNoticeElement.classList.remove('fully-hidden');
        }

        // bind a click handler to the accept all button
        this.cookieAcceptAllButton.addEventListener('click', (event) => {
            event.preventDefault();

            this.setAllOptionalPermissions(true);

            this.cookieNoticeElement.classList.add('fully-hidden');
            this.cookieNoticeSuccessElement.classList.remove('fully-hidden');
        });

        // bind a click handler to the essential only button
        this.cookieAcceptEssentialButton.addEventListener('click', (event) => {
            event.preventDefault();

            this.setAllOptionalPermissions(false);

            this.cookieNoticeElement.classList.add('fully-hidden');
            this.cookieNoticeSuccessElement.classList.remove('fully-hidden');
        });
    }

    setAllOptionalPermissions(allow) {
        const cookiePermissions = JSON.parse(JSON.stringify(this.storage.categories));
        for (const key in cookiePermissions) {
            if (key === this.storage.categories.necessary) {
                // always allow necessary
                cookiePermissions[key] = true;
            } else {
                cookiePermissions[key] = allow;
            }
        }

        this.storage.setCookie(
            this.storage.categories.necessary,
            'cookiePermissions',
            JSON.stringify(cookiePermissions),
            365
        );

        this.storage.setCookie(
            this.storage.categories.necessary,
            'cookie-notification-acknowledged',
            'yes',
            365
        );
    }
}

export default CookieNotification;
