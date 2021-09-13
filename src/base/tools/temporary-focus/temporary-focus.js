export default function (element) {
    element.tabIndex = -1;
    element.addEventListener('focusout', () => { element.removeAttribute('tabindex'); });
    element.focus();
}
