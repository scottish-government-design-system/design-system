'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
/**
 * Temporarily focuses an element. Removes ability to focus element on blur.
 *
 * @param {Element} element - The element to focus temporarily
 * @returns {void}
 */
function default_1(element) {
    element.tabIndex = -1;
    element.addEventListener('focusout', () => { element.removeAttribute('tabindex'); });
    element.focus();
}
