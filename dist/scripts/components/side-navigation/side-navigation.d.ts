import DSComponent from '../../base/component/component';
/**
 * Side navigation component
 *
 * @class SideNavigation
 * @extends DSComponent
 * @property {HTMLElement} sideNavigation - the side navigation element
 */
declare class SideNavigation extends DSComponent {
    private sideNavigation;
    /**
     * Creates a side navigation component
     *
     * @param {HTMLElement} sideNavigation - the side navigation element
     */
    constructor(sideNavigation: HTMLElement);
    /**
     * Set up the side nav if one has been provided to the constructor
     *
     * @returns {void}
     */
    init(): void;
    /**
     * Perform DOM transformation on the side nav
     * - add aria attributes to new markup
     * - add event listener to new markup
     *
     * @returns {void}
     */
    private setupSideNavigation;
}
export default SideNavigation;
