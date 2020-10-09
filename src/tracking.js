const tracking = {
    init: function () {
        const checkboxes = [].slice.call(document.querySelectorAll('.ds_checkbox__input[type="checkbox"]'));
        checkboxes.forEach(checkbox => {
            const label = document.querySelector(`[for=${checkbox.id}]`);

            label.addEventListener('click', () => {
                checkbox.dataset.form = `checkbox-${checkbox.id}-${checkbox.checked ? 'unchecked' : 'checked'}`;
            });
        });

        const selects = [].slice.call(document.querySelectorAll('.ds_select'));
        selects.forEach(select => {
            select.addEventListener('change', (e) => {
                window.dataLayer = window.dataLayer || {};
                window.dataLayer.push({ 'event': e.target.querySelector(':checked').dataset.form });
            });
        });
    }
};

export default tracking;
