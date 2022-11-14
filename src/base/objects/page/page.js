// Fallback behaviour for browsers lacking the :has relational selector

const Page = {
    init() {
        if (!CSS.supports('selector(html:has(body))')) {
            const pageMiddle = document.querySelector('.ds_page__middle');
            if (pageMiddle) {
                const preFooterBlock = pageMiddle.querySelector('.ds_pre-footer-background');

                if (preFooterBlock) {
                    pageMiddle.classList.add('js-pre-footer-background');
                }
            }
        }
    }
};

export default Page;
