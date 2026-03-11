import DSComponent from '../../base/component/component';
/**
 * Accordion component
 *
 * @class Accordion
 * @extends DSComponent
 * @property {HTMLElement} accordion - the accordion element
 * @property {HTMLElement[]} items - the accordion items
 * @property {HTMLButtonElement} openAllButton - the open all button
 */
declare class Accordion extends DSComponent {
    private accordion;
    private items;
    private openAllButton;
    /**
     * Creates an accordion component
     *
     * @param {HTMLElement} accordion - the accordion element
     */
    constructor(accordion: HTMLElement);
    /**
     * Initialize the accordion
     * - initialize each accordion item
     * - initialize the open all button if present
     *
     * @returns {void}
     */
    init(): void;
    /**
     * Initialize an accordion item
     * - transform markup to button-driven version
     * - attach event listener
     * - set aria attributes
     *
     * @param {HTMLElement} item - the accordion item to initialize
     * @returns {void}
     */
    private initAccordionItem;
    /**
     * Initialize the open all button
     * - attach event listener
     * - set aria attributes
     *
     * @returns {void}
     */
    private initOpenAll;
    /**
     * Toggle an accordion item
     * - set aria attribute
     * - set 'open' attribute
     *
     * @param {HTMLElement} item - the accordion item to toggle
     * @returns {void}
     */
    private toggleAccordionItem;
    /**
     * Set the open all button text and aria-expanded attribute
     *
     * @param {boolean} isOpen - true if all items are open, false otherwise
     */
    private setOpenAllButton;
    /**
     * Check if all accordion items are open
     *
     * @returns {boolean} - true if all items are open, false otherwise
     */
    private checkAllOpen;
}
export default Accordion;
