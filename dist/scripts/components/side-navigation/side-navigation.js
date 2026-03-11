'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = __importDefault(require("../../base/component/component"));
const id_modifier_1 = __importDefault(require("../../base/tools/id-modifier/id-modifier"));
/**
 * Side navigation component
 *
 * @class SideNavigation
 * @extends DSComponent
 * @property {HTMLElement} sideNavigation - the side navigation element
 */
class SideNavigation extends component_1.default {
    sideNavigation;
    /**
     * Creates a side navigation component
     *
     * @param {HTMLElement} sideNavigation - the side navigation element
     */
    constructor(sideNavigation) {
        super(sideNavigation);
        this.sideNavigation = sideNavigation;
    }
    /**
     * Set up the side nav if one has been provided to the constructor
     *
     * @returns {void}
     */
    init() {
        if (this.sideNavigation && !this.isInitialised) {
            this.setupSideNavigation();
            this.isInitialised = true;
        }
    }
    /**
     * Perform DOM transformation on the side nav
     * - add aria attributes to new markup
     * - add event listener to new markup
     *
     * @returns {void}
     */
    setupSideNavigation() {
        // transform markup to button-driven version
        const navControl = this.sideNavigation.querySelector('.js-toggle-side-navigation');
        const navLabel = this.sideNavigation.querySelector('.ds_side-navigation__expand');
        const navList = this.sideNavigation.querySelector('.ds_side-navigation__list');
        navList.id = navList.id || `side-navigation-${(0, id_modifier_1.default)()}`;
        navControl.checked = false;
        const navButton = document.createElement('button');
        navButton.classList.add('ds_side-navigation__expand');
        navButton.classList.add('ds_link');
        navButton.classList.add('js-side-navigation-button');
        navButton.setAttribute('aria-expanded', false.toString());
        navButton.innerHTML = navLabel.innerHTML;
        navButton.setAttribute('aria-expanded', false.toString());
        navButton.setAttribute('aria-controls', navList.id);
        navLabel.classList.add('fully-hidden');
        navControl.classList.add('fully-hidden');
        navControl.classList.remove('visually-hidden');
        this.sideNavigation.insertBefore(navButton, navList);
        navButton.setAttribute('aria-controls', navList.id);
        // events
        navButton.addEventListener('click', () => {
            const isOpen = navControl.checked;
            navButton.setAttribute('aria-expanded', (!isOpen).toString());
            navControl.checked = !isOpen;
        });
        window.addEventListener('scroll', () => {
            if (navButton.offsetTop >= 1) {
                navButton.classList.add('ds_side-navigation__expand--shadow');
            }
            else {
                navButton.classList.remove('ds_side-navigation__expand--shadow');
            }
        });
    }
}
exports.default = SideNavigation;
