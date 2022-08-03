/* global document */

'use strict';

class AspectBox {
    constructor(aspectBox, _document = document) {
        this.aspectBox = aspectBox;
        this.document = _document;
    }

    init() {
        /*
         * When browsers do not support object-fit: cover, this fallback replicates the desired effect
         */
        if ('objectFit' in this.document.documentElement.style === false) {
            const image = this.aspectBox.querySelector('img.ds_aspect-box__inner');
            // Add image as a background image
            if (image) {
                this.aspectBox.style.backgroundImage = `url(${image.src})`;
                this.aspectBox.classList.add('ds_aspect-box--fallback');
                // Add alt text support if required
                if (image.alt != "") {
                    this.aspectBox.setAttribute('role','img');
                    this.aspectBox.setAttribute('aria-label',image.alt);
                }
            }
        }
    }
}

export default AspectBox;
