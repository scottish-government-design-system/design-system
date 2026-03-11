'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = __importDefault(require("../../base/component/component"));
/**
 * Mobile menu component
 *
 * @class MobileMenu
 * @extends DSComponent
 * @property {HTMLElement} mobileMenu - the mobile menu element
 * @property {HTMLButtonElement} newMenuButton - the new mobile menu button
 */
class MobileMenu extends component_1.default {
    mobileMenu;
    newMenuButton;
    /**
     * Creates a mobile menu component
     *
     * @param {HTMLElement} mobileMenu - the mobile menu element
     */
    constructor(mobileMenu) {
        super(mobileMenu);
        this.mobileMenu = mobileMenu;
        this.newMenuButton = document.createElement('button');
    }
    /**
     * Set up the mobile menu if one has been provided to the constructor
     *
     * @returns {void}
     */
    init() {
        if (this.mobileMenu) {
            this.setupMobileNavigation();
            this.isInitialised = true;
        }
    }
    /**
     * Perform DOM transformation on the mobile nav
     * - add aria attributes to new markup
     * - add event listener to new markup
     *
     * @returns {void}
     */
    setupMobileNavigation() {
        // dom transform:
        const oldMenuButton = document.querySelector('.js-toggle-menu');
        this.newMenuButton.innerHTML = oldMenuButton.innerHTML;
        this.newMenuButton.setAttribute('class', oldMenuButton.getAttribute('class'));
        this.newMenuButton.classList.add('ds_link');
        this.newMenuButton.setAttribute('aria-controls', oldMenuButton.getAttribute('aria-controls'));
        this.newMenuButton.setAttribute('aria-expanded', false.toString());
        oldMenuButton.parentNode?.appendChild(this.newMenuButton);
        oldMenuButton.classList.add('fully-hidden');
        // events
        this.newMenuButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.mobileMenu = document.getElementById(this.newMenuButton.getAttribute('aria-controls'));
            if (this.mobileMenu.classList.contains('ds_site-navigation--open')) {
                this.closeMenu();
            }
            else {
                this.openMenu();
            }
        });
    }
    /**
     * Open the site nav menu
     *
     * @returns {void}
     */
    openMenu() {
        this.mobileMenu.classList.add('ds_site-navigation--open');
        this.newMenuButton.classList.add('ds_site-header__control--active');
        this.newMenuButton.setAttribute('aria-expanded', true.toString());
    }
    /**
     * Close the site nav menu
     *
     * @returns {void}
     */
    closeMenu() {
        this.mobileMenu.classList.remove('ds_site-navigation--open');
        this.newMenuButton.classList.remove('ds_site-header__control--active');
        this.newMenuButton.setAttribute('aria-expanded', false.toString());
    }
}
exports.default = MobileMenu;
