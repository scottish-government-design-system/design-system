class BackToTop {
    constructor(el, options = {}) {
        if (!el) {
            return;
        }
        if (options.footerElSelector) {
            this.footerEl = document.querySelector(options.footerElSelector)
        } else {
            this.footerEl = document.querySelector('.ds_site-footer');
        }
        this.backToTopElement = el;
    }

    init() {
        this.checkDisplay();

        window.addEventListener('scroll', () => this.checkDisplay());
    }

    checkDisplay() {
        document.body.offsetHeight > window.innerHeight ? this.backToTopElement.classList.remove('visually-hidden') : this.backToTopElement.classList.add('visually-hidden');

        if (this.footerEl) {
            this.backToTopElement.style.bottom = this.footerEl.offsetHeight + 8 + 'px';
        }
    }
}

export default BackToTop;
