import DSComponent from "../../base/component/component";
/**
 * Checkboxes component
 *
 * @class Checkboxes
 * @extends DSComponent
 * @property {HTMLInputElement} checkboxes - checkbox elements in the checkbox group
 */
declare class Checkboxes extends DSComponent {
    private checkboxes;
    /**
     * Creates a checkboxes component
     *
     * @param {HTMLElement} checkboxes - the tab container element
     */
    constructor(checkboxes: HTMLElement);
    /**
     * Initialises a checkbox group
     * Adds an event listener to handle 'exclusive' checkbox behaviour
     * - unchecks all other checkboxes when an exclusive checkbox is checked
     * - unchecks the exclusive checkbox if any other checkbox is checked
     *
     * @returns {void}
     */
    init(): void;
}
export default Checkboxes;
