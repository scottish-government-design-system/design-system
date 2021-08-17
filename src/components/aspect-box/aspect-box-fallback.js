/*
 * When browsers do not support object-fit: cover, this fallback replicates the desired effect
 */
export default function (_document = document) {
    if ('objectFit' in _document.documentElement.style === false) {
        const aspectBoxes = [].slice.call(_document.querySelectorAll('.ds_aspect-box:not(.ds_aspect-box--fallback)'));
        aspectBoxes.forEach(aspectBox => {
            const image = aspectBox.querySelector('img.ds_aspect-box__inner');

            if (image) {
                aspectBox.style.backgroundImage = `url(${image.src})`;
                aspectBox.classList.add('ds_aspect-box--fallback');
            }
        });
    }
}
