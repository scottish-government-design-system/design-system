const tracking = {
    init: function () {
        const checkboxes = [].slice.call(document.querySelectorAll('[type="checkbox"]'));
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (event) => {
                checkbox.dataset.form = `checkbox-${event.target.id}-${event.target.checked ? 'checked' : 'unchecked'}`;
            });
        });

        const selects = [].slice.call(document.querySelectorAll('select'));
        selects.forEach(select => {
            select.addEventListener('change', (event) => {
                select.dataset.form = `select-${event.target.id}-${event.target.value}`;
            });
        });
    }
};

export default tracking;
