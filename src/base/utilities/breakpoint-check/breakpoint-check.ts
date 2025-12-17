type BreakpointSize = 'small' | 'medium' | 'large' | 'xlarge';

/**
 * Checks whether a given breakpoint is visible at the current viewport size
 *
 * @param {BreakpointSize} size
 * @returns {boolean}
 */
export default function (size: BreakpointSize): boolean {
    const breakElement = document.createElement('div');
    breakElement.classList.add('ds_breakpoint-check');
    breakElement.classList.add('ds_breakpoint-check--' + size);
    document.body.appendChild(breakElement);

    const breakpointIsVisible = window.getComputedStyle(breakElement, null).display === 'block';
    breakElement.parentNode.removeChild(breakElement);

    return breakpointIsVisible;
}
