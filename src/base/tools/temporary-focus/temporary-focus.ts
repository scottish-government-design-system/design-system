'use strict';

/**
 * Temporarily focuses an element. Removes ability to focus element on blur.
 *
 * @param {Element} element - The element to focus temporarily
 * @returns {void}
 */
export default function (element: HTMLElement): void {
    element.tabIndex = -1;
    element.addEventListener('focusout', () => { element.removeAttribute('tabindex'); });
    element.focus();
}
