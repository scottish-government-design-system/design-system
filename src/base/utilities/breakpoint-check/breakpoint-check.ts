type BreakpointSize = 'small' | 'medium' | 'large' | 'xlarge';

export default function (size: BreakpointSize) {
    const breakElement = document.createElement('div');
    breakElement.classList.add('ds_breakpoint-check');
    breakElement.classList.add('ds_breakpoint-check--' + size);
    document.body.appendChild(breakElement);

    const breakpointIsVisible = window.getComputedStyle(breakElement, null).display === 'block';
    breakElement.parentNode.removeChild(breakElement);

    return breakpointIsVisible;
}
