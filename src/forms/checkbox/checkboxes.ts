'use strict';

import DSComponent from "../../base/component/component";

class Checkboxes extends DSComponent {
    #checkboxes: HTMLInputElement[];

    constructor(checkboxes: HTMLElement) {
        super(checkboxes);
        this.#checkboxes = [].slice.call(checkboxes.querySelectorAll('.ds_checkbox__input'));
    }

    init() {
        this.#checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                switch(checkbox.dataset.behaviour) {
                    case 'exclusive':
                        this.#checkboxes.filter(item => item !== checkbox).forEach(item => item.checked = false);
                        break;
                    default:
                        this.#checkboxes.filter(item => item.dataset.behaviour === 'exclusive').forEach(item => item.checked = false);
                        break;
                }
            });
        });

        this.isInitialised = true;
    }
}

export default Checkboxes;
