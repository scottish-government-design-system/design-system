class BackToTop {
    constructor(el, options = {}) {
        this.el = el;
        if (options.footerElSelector) {
            this.footerEl = document.querySelector(options.footerElSelector)
        } else {
            this.footerEl = document.querySelector('.ds_site-footer');
        }
        this.backToTopElement = el;
    }

    init() {
        if (!this.el) {
            return;
        }
        this.checkDisplay();

        window.addEventListener('scroll', () => this.checkPosition());
    }

    checkDisplay() {
        if (document.body.offsetHeight > window.innerHeight) {
            this.backToTopElement.classList.remove('visually-hidden');
        } else {
            this.backToTopElement.classList.add('visually-hidden');
        }
    }

    checkPosition() {
        this.backToTopElement.style.bottom = this.footerEl.offsetHeight + 8 + 'px';
    }
}

export default BackToTop;
