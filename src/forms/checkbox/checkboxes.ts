'use strict';

class Checkboxes {
    private checkboxes: HTMLInputElement[];

    constructor(checkboxWrappers) {
        this.checkboxes = [].slice.call(checkboxWrappers.querySelectorAll('.ds_checkbox__input'));
    }

    init() {
        this.checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                if (checkbox.dataset.behaviour === 'exclusive') {
                    this.checkboxes.filter(item => item !== checkbox).forEach(item => item.checked = false);
                } else {
                    this.checkboxes.filter(item => item.dataset.behaviour === 'exclusive').forEach(item => item.checked = false);
                }
            });
        });
    }
}

export default Checkboxes;
