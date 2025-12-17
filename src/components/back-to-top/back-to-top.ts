'use strict';

import DSComponent from "../../base/component/component";

type BTTOptions = {
    footerElSelector?: string
}

/**
 * Back to top component
 *
 * @class BackToTop
 * @extends DSComponent
 * @property {HTMLElement} backToTopElement - the back to top element
 * @property {HTMLElement} footerEl - the footer element
 * @property {Window} window - the window object
 */
class BackToTop extends DSComponent {
    private backToTopElement: HTMLElement;
    private footerEl: HTMLElement;
    private window: Window;

    /**
     * Creates a back to top component
     *
     * @param {HTMLElement} element - the back to top element
     * @param _window - the window object
     * @param options - the back to top options
     */
    constructor(
        element: HTMLElement,
        _window = window,
        options: BTTOptions = {}
    ) {
        super(element);

        if (options.footerElSelector) {
            this.footerEl = document.querySelector(options.footerElSelector);
        } else {
            this.footerEl = document.querySelector('.ds_site-footer');
        }
        this.backToTopElement = element;
        this.window = _window;
    }

    /**
     * Initialise the back to top component
     * - check whether to show or hide the back to top button
     * - adjust the position of the back to top button based on the footer height
     *
     * @returns {void}
     */
    init(): void {
        if (!this.backToTopElement || !this.footerEl) {
            return;
        }

        this.checkDisplay();

        this.window.addEventListener('resize', () => this.checkDisplay());

        const resizeObserver = new ResizeObserver(() => {
            this.checkDisplay();
        });

        resizeObserver.observe(document.body);

        this.isInitialised = true;
    }

    /**
     * Check whether to show or hide the back to top button based on the height of the page content
     *
     * @returns {void}
     */
    private checkDisplay(): void {
        if (document.body.offsetHeight - this.footerEl.offsetHeight < this.window.innerHeight) {
            this.backToTopElement.classList.add('visually-hidden');
        } else {
            this.backToTopElement.classList.remove('visually-hidden');
        }

        this.checkPosition();
    }

    /**
     * Adjust the position of the back to top button based on the footer height
     *
     * @returns {void}
     */
    checkPosition(): void {
        const backToTopOffset = this.footerEl.offsetHeight + 8;

        const backToTopSpacingUnits = Math.ceil(backToTopOffset / 8);
        this.backToTopElement.classList.forEach(className => {
            if (className.match(/ds_!_off-b-/)) {
                this.backToTopElement.classList.remove(className);
            }
        });
        this.backToTopElement.classList.add(`ds_!_off-b-${backToTopSpacingUnits}`);
    }
}

export default BackToTop;
