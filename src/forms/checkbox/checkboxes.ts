'use strict';

class Checkboxes {
    private checkboxes: HTMLInputElement[];

    constructor(checkboxes: HTMLElement) {
        this.checkboxes = [].slice.call(checkboxes.querySelectorAll('.ds_checkbox__input'));
    }

    init() {
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
    }
}

export default Checkboxes;
