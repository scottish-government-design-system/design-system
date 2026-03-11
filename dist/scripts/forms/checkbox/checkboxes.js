'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = __importDefault(require("../../base/component/component"));
/**
 * Checkboxes component
 *
 * @class Checkboxes
 * @extends DSComponent
 * @property {HTMLInputElement} checkboxes - checkbox elements in the checkbox group
 */
class Checkboxes extends component_1.default {
    checkboxes;
    /**
     * Creates a checkboxes component
     *
     * @param {HTMLElement} checkboxes - the tab container element
     */
    constructor(checkboxes) {
        super(checkboxes);
        this.checkboxes = [].slice.call(checkboxes.querySelectorAll('.ds_checkbox__input'));
    }
    /**
     * Initialises a checkbox group
     * Adds an event listener to handle 'exclusive' checkbox behaviour
     * - unchecks all other checkboxes when an exclusive checkbox is checked
     * - unchecks the exclusive checkbox if any other checkbox is checked
     *
     * @returns {void}
     */
    init() {
        this.checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                switch (checkbox.dataset.behaviour) {
                    case 'exclusive':
                        this.checkboxes.filter(item => item !== checkbox).forEach(item => item.checked = false);
                        break;
                    default:
                        this.checkboxes.filter(item => item.dataset.behaviour === 'exclusive').forEach(item => item.checked = false);
                        break;
                }
            });
        });
        this.isInitialised = true;
    }
}
exports.default = Checkboxes;
