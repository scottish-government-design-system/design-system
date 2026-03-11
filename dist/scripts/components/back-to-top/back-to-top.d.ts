import DSComponent from "../../base/component/component";
type BTTOptionsArgs = {
    footerElSelector?: string;
};
/**
 * Back to top component
 *
 * @class BackToTop
 * @extends DSComponent
 * @property {HTMLElement} backToTopElement - the back to top element
 * @property {HTMLElement} footerEl - the footer element
 * @property {Window} window - the window object
 */
declare class BackToTop extends DSComponent {
    private backToTopElement;
    private backToTopOffset;
    private footerEl;
    private window;
    /**
     * Creates a back to top component
     *
     * @param {HTMLElement} element - the back to top element
     * @param {Window} _window - the window object
     * @param {BTTOptionsArgs} options - the back to top options
     */
    constructor(element: HTMLElement, _window?: Window, options?: BTTOptionsArgs);
    /**
     * Initialise the back to top component
     * - check whether to show or hide the back to top button
     * - adjust the position of the back to top button based on the footer height
     *
     * @returns {void}
     */
    init(): void;
    /**
     * Check whether to show or hide the back to top button based on the height of the page content
     *
     * @returns {void}
     */
    private checkDisplay;
    /**
     * Adjust the position of the back to top button based on the footer height
     *
     * @returns {void}
     */
    checkPosition(): void;
}
export default BackToTop;
