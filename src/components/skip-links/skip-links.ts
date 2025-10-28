/* global document, window */

'use strict';

import temporaryFocus from "../../base/tools/temporary-focus/temporary-focus";

const skipLinks = {
    init() {
        [].slice.call(document.querySelectorAll('.ds_skip-links__link')).forEach((link: HTMLLinkElement) => {
            link.addEventListener('click', () => {
                const linkTarget = document.querySelector(link.getAttribute('href'));
                if (linkTarget) {
                    temporaryFocus(linkTarget as HTMLElement);
                }
            });
        });
    }
};

export default skipLinks;
