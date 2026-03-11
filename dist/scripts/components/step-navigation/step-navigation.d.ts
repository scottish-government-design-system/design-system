import DSComponent from "../../base/component/component";
/**
 * Step navigation component
 *
 * @class StepNavigation
 * @extends DSComponent
 * @property {HTMLElement} container - the step navigation container element
 * @property {Window} window - the window object
 */
declare class StepNavigation extends DSComponent {
    private container;
    private window;
    /**
     * Creates a step navigation component
     *
     * @param {HTMLElement} container - the step navigation container element
     * @param _window - the window object
     */
    constructor(container: HTMLElement, _window?: Window & typeof globalThis);
    /**
     * Initialise step navigation
     * - adds current link class to link matching current URL
     *
     * @returns {void}
     */
    init(): void;
}
export default StepNavigation;
