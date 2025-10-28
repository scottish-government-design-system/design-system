export default function (element: HTMLElement) {
    element.tabIndex = -1;
    element.addEventListener('focusout', () => { element.removeAttribute('tabindex'); });
    element.focus();
}
