'use strict';

import DSComponent from "../../base/component/component";

type BTTOptionsArgs = {
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
    private backToTopOffset: number;
    private footerEl: HTMLElement;
    private window: Window;

    /**
     * Creates a back to top component
     *
     * @param {HTMLElement} element - the back to top element
     * @param {Window} _window - the window object
     * @param {BTTOptionsArgs} options - the back to top options
     */
    constructor(
        element: HTMLElement,
        _window: Window = window,
        options: BTTOptionsArgs = {}
    ) {
        super(element);

        // a fake element used for height calculations
        const fallbackFooterEl = document.createElement('div');

        if (options.footerElSelector) {
            this.footerEl = document.querySelector(options.footerElSelector) as HTMLElement;
        } else {
            this.footerEl = document.querySelector('.ds_site-footer') || fallbackFooterEl;
        }

        // a fake element used for height calculations
        if (!this.footerEl) {
            this.footerEl = document.createElement('div');
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
        if (!this.backToTopElement) {
            return;
        }

        this.backToTopOffset = (this.backToTopElement.querySelector('.ds_back-to-top__button') as HTMLElement).offsetHeight + 8;

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
        if (document.body.offsetHeight - this.footerEl.offsetHeight - this.backToTopOffset < this.window.innerHeight) {
            this.backToTopElement.classList.add('visually-hidden');
        } else {
            this.backToTopElement.classList.remove('ds_back-to-top--clamped');
        }

        if (document.body.offsetHeight - this.footerEl.offsetHeight <= this.window.innerHeight) {
            this.backToTopElement.classList.add('ds_back-to-top--hidden');
        } else {
            this.backToTopElement.classList.remove('ds_back-to-top--hidden');
        }

        this.checkPosition();
    }

    /**
     * Adjust the position of the back to top button based on the footer height
     *
     * @returns {void}
     */
    checkPosition(): void {
        const footerOffset = this.footerEl.offsetHeight + 8;

        const backToTopSpacingUnits = Math.ceil(footerOffset / 8);
        this.backToTopElement.classList.forEach(className => {
            if (className.match(/ds_!_off-b-/)) {
                this.backToTopElement.classList.remove(className);
            }
        });
        this.backToTopElement.classList.add(`ds_!_off-b-${backToTopSpacingUnits}`);
    }
}

export default BackToTop;
