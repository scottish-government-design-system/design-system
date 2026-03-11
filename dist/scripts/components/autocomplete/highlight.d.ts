type HighlightOptionsArgs = {
    className?: string;
};
/**
 * Highlight matching text in an element
 *
 * @param {HTMLElement} element - the element to highlight
 * @param {string} pattern - the pattern to match
 * @param {HighlightOptionsArgs} options - the highlight options
 * @returns {void}
 */
declare function highlight(element: HTMLElement, pattern: string, options: HighlightOptionsArgs): void;
export default highlight;
