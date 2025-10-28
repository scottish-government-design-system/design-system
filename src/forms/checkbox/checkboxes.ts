'use strict';

import DSComponent from "../../base/component/component";

/**
 * Checkboxes component
 *
 * @class Checkboxes
 * @extends DSComponent
 * @property {HTMLInputElement} checkboxes - checkbox elements in the checkbox group
 */
class Checkboxes extends DSComponent {
    private checkboxes: HTMLInputElement[];

    /**
     * Creates a checkboxes component
     *
     * @param {HTMLElement} checkboxes - the tab container element
     */
    constructor(checkboxes: HTMLElement) {
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
    init(): void {
        this.checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                switch(checkbox.dataset.behaviour) {
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

export default Checkboxes;
