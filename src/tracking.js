const tracking = {
    init: function () {
        const checkboxes = [].slice.call(document.querySelectorAll('.ds_checkbox__input[type="checkbox"]'));
        checkboxes.forEach(checkbox => {
            const label = document.querySelector(`[for=${checkbox.id}]`);

            label.addEventListener('click', () => {
                checkbox.dataset.form = `checkbox-${checkbox.id}-${checkbox.checked ? 'unchecked' : 'checked'}`;
            });
        });
    }
};

export default tracking;
