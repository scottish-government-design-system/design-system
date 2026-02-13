'use strict';

import temporaryFocus from "../../base/tools/temporary-focus/temporary-focus";

/**
 * Skip links component
 */
const skipLinks = {
    /**
     * Initialise skip links
     * - adds click event to skip links to focus target element
     *
     * @returns {void}
     */
    init(): void {
        [].slice.call(document.querySelectorAll('.ds_skip-links__link')).forEach((link: HTMLLinkElement) => {
            link.addEventListener('click', () => {
                const linkTarget = document.querySelector(link.getAttribute('href') as string);
                if (linkTarget) {
                    temporaryFocus(linkTarget as HTMLElement);
                }
            });
        });
    }
};

export default skipLinks;
