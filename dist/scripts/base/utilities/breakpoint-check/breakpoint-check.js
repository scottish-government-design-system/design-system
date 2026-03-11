"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
/**
 * Checks whether a given breakpoint is visible at the current viewport size
 *
 * @param {BreakpointSize} size
 * @returns {boolean}
 */
function default_1(size) {
    const breakElement = document.createElement('div');
    breakElement.classList.add('ds_breakpoint-check');
    breakElement.classList.add('ds_breakpoint-check--' + size);
    document.body.appendChild(breakElement);
    const breakpointIsVisible = window.getComputedStyle(breakElement, null).display === 'block';
    breakElement.parentNode?.removeChild(breakElement);
    return breakpointIsVisible;
}
