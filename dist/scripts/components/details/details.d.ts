import DSComponent from '../../base/component/component';
/**
 * Details component
 *
 * @class Details
 * @extends DSComponent
 * @property {HTMLElement} content - the details content element
 * @property {HTMLDetailsElement} details - the details element
 * @property {HTMLElement} summary - the details summary element
 * @property {'open' | 'data-open'} openAttribute - the attribute used to indicate open state
 */
declare class Details extends DSComponent {
    private content;
    private details;
    private summary;
    private openAttribute;
    /**
     * Creates a details component
     *
     * @param {HTMLDetailsElement} element - the details element
     */
    constructor(element: HTMLDetailsElement);
    /**
     * Adds details-like open/close behaviour to non-native details components
     *
     * @returns {void}
     */
    init(): void;
    /**
     * Close the disclosure widget
     * - set aria attribute
     * - clear 'open' attribute
     *
     * @returns {void}
     */
    private closeDetails;
    /**
     * Open the disclosure widget
     * - set aria attribute
     * - set 'open' attribute
     *
     * @returns {void}
     */
    private openDetails;
    /**
     * Add role and attributes to a non-native disclosure widget
     *
     * @returns {void}
     */
    private polyfillAttributes;
    /**
     * Add mouse and keyboard events to trigger open/close of a non-native disclosure widget
     *
     * @returns {void}
     */
    private polyfillEvents;
    /**
     * Open or close the disclosure widget based on the value of its 'open' attribute
     *
     * @returns {void}
     */
    private setState;
}
export default Details;
