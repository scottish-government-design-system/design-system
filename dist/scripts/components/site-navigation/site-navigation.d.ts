import DSComponent from "../../base/component/component";
/**
 * Mobile menu component
 *
 * @class MobileMenu
 * @extends DSComponent
 * @property {HTMLElement} mobileMenu - the mobile menu element
 * @property {HTMLButtonElement} newMenuButton - the new mobile menu button
 */
declare class MobileMenu extends DSComponent {
    private mobileMenu;
    private newMenuButton;
    /**
     * Creates a mobile menu component
     *
     * @param {HTMLElement} mobileMenu - the mobile menu element
     */
    constructor(mobileMenu: HTMLElement);
    /**
     * Set up the mobile menu if one has been provided to the constructor
     *
     * @returns {void}
     */
    init(): void;
    /**
     * Perform DOM transformation on the mobile nav
     * - add aria attributes to new markup
     * - add event listener to new markup
     *
     * @returns {void}
     */
    private setupMobileNavigation;
    /**
     * Open the site nav menu
     *
     * @returns {void}
     */
    private openMenu;
    /**
     * Close the site nav menu
     *
     * @returns {void}
     */
    private closeMenu;
}
export default MobileMenu;
