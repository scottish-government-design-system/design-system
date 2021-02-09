function slugify(string) {

    string = String(string);

    return string
        // Make lower-case
        .toLowerCase()
        // Remove misc punctuation
        .replace(/['"’‘”“`]/g, '')
        // Replace non-word characters with dashes
        .replace(/[\W|_]+/g, '-')
        // Remove starting and trailing dashes
        .replace(/^-+|-+$/g, '');
}

const tracking = {
    init: function (scope = document) {
        for (const [key, value] of Object.entries(tracking.add)) {
            value(scope);
        }
    },

    gatherElements: function (scope, className) {
        const elements = [].slice.call(scope.querySelectorAll(`.${className}`));

        if (scope.classList && scope.classList.contains(className)) {
            elements.push(scope);
        }

        return elements;
    },

    add: {
        accordions: function (scope = document) {
            const accordions = tracking.gatherElements(scope, 'ds_accordion');
            accordions.forEach(accordion => {
                if (!accordion.classList.contains('js-initialised')) {
                    return;
                }

                const openAll = accordion.querySelector('.js-open-all');
                const items = [].slice.call(accordion.querySelectorAll('.ds_accordion-item'));

                function checkOpenAll() {
                    const openItemsCount = accordion.querySelectorAll('.ds_accordion-item--open').length;
                    return (items.length === openItemsCount);
                }

                function setOpenAll(openAll) {
                    if (openAll) {
                        const open = checkOpenAll(openAll);

                        if (open) {
                            openAll.setAttribute('data-accordion', 'accordion-close-all');
                        } else {
                            openAll.setAttribute('data-accordion', 'accordion-open-all');
                        }
                    }
                }

                function setAccordionItem(item, index) {
                    const itemButton = item.querySelector('.ds_accordion-item__header-button');
                    const itemControl = item.querySelector('.ds_accordion-item__control');
                    itemButton.setAttribute('data-accordion', `accordion-${itemControl.checked ? 'close' : 'open'}-${index + 1}`);
                }

                setOpenAll(openAll);

                items.forEach((item, index) => {
                    setAccordionItem(item, index);
                });

                // events
                if (openAll) {
                    openAll.addEventListener('click', () => {
                        items.forEach((item, index) => {
                            setAccordionItem(item, index);
                        });
                    });
                }

                items.forEach((item, index) => {
                    const itemButton = item.querySelector('.ds_accordion-item__header-button');
                    const itemControl = item.querySelector('.ds_accordion-item__control');
                    itemButton.addEventListener('click', () => {
                        itemButton.setAttribute('data-accordion', `accordion-${itemControl.checked ? 'close' : 'open'}-${index + 1}`);
                        setOpenAll(openAll);
                    });
                });
            });
        },

        asides: function (scope = document) {
            const asides = tracking.gatherElements(scope, 'ds_article-aside');
            asides.forEach(aside => {
                const links = [].slice.call(aside.querySelectorAll('a:not(.ds_button)'));

                links.forEach((link, index) => {
                    if (!link.getAttribute('data-navigation')) {
                        link.setAttribute('data-navigation', `link-related-${index + 1}`);
                    }
                });
            });
        },

        backToTop: function (scope = document) {
            const backToTops = tracking.gatherElements(scope, 'ds_back-to-top__button');
            backToTops.forEach(backToTop => {
                backToTop.setAttribute('data-navigation', 'backtotop');
            });
        },

        breadcrumbs: function (scope = document) {
            const breadcrumbLists = tracking.gatherElements(scope, 'ds_breadcrumbs');
            breadcrumbLists.forEach(breadcrumbList => {
                const links = [].slice.call(breadcrumbList.querySelectorAll('.ds_breadcrumbs__link'));

                links.forEach((link, index) => {
                    if (!link.getAttribute('data-navigation')) {
                        link.setAttribute('data-navigation', `breadcrumb-${index + 1}`);
                    }
                });
            });
        },

        buttons: function (scope = document) {
            const buttons = [].slice.call(scope.querySelectorAll('.ds_button, input[type="button"], input[type="submit"], button'));
            buttons.forEach(button => {
                if (!button.getAttribute('data-button')) {
                    button.setAttribute('data-button', `button-${slugify(button.innerText)}`);
                }
            });
        },

        categoryLists: function (scope = document) {
            const categoryLists = tracking.gatherElements(scope, 'ds_category-list');
            categoryLists.forEach(categoryList => {
                const links = [].slice.call(categoryList.querySelectorAll('.ds_category-item__link'));

                links.forEach((link, index) => {
                    if (!link.getAttribute('data-navigation')) {
                        link.setAttribute('data-navigation', `category-item-${index + 1}`);
                    }
                });
            });
        },

        checkboxes: function (scope = document) {
            const checkboxes = tracking.gatherElements(scope, 'ds_checkbox__input');
            checkboxes.forEach(checkbox => {

                // data attributes
                let attributeValue = checkbox.getAttribute('data-form');

                if (!checkbox.getAttribute('data-form') && checkbox.id) {
                    attributeValue = `checkbox-${checkbox.id}`;
                }

                if (checkbox.checked) {
                    attributeValue = attributeValue + '-checked';
                }

                checkbox.setAttribute('data-form', attributeValue);

                // events
                const label = scope.querySelector(`[for=${checkbox.id}]`);
                if (label && !checkbox.classList.contains('js-has-tracking-event')) {
                    label.addEventListener('click', () => {
                        checkbox.dataset.form = `checkbox-${checkbox.id}-${checkbox.checked ? 'unchecked' : 'checked'}`;
                    });
                    checkbox.classList.add('js-has-tracking-event');
                }
            });
        },
/*
A more general query: the buttons would be given both data-button and data-banner. Will giving things multiple attributes create any problems for reporting?
*/
        contactDetails: function (scope = document) {
            const contactDetailsBlocks = tracking.gatherElements(scope, 'ds_contact-details');
            contactDetailsBlocks.forEach(contactDetails => {
                const socialLinks = [].slice.call(contactDetails.querySelectorAll('.ds_contact-details__social-link'));
                socialLinks.forEach(link => {
                    if (!link.getAttribute('data-navigation')) {
                        link.setAttribute('data-navigation', `contact-details-${slugify(link.innerText)}`);
                    }
                });

                const emailLinks = [].slice.call(contactDetails.querySelectorAll('a[href^="mailto"]'));
                emailLinks.forEach(link => {
                    if (!link.getAttribute('data-navigation')) {
                        link.setAttribute('data-navigation', 'contact-details-email');
                    }
                });
            });
        },

        contentNavs: function (scope = document) {
            const contentsNavs = tracking.gatherElements(scope, 'ds_contents-nav');
            contentsNavs.forEach(contentsNav => {
                const links = [].slice.call(contentsNav.querySelectorAll('.ds_contents-nav__link'));

                links.forEach((link, index) => {
                    if (!link.getAttribute('data-navigation')) {
                        link.setAttribute('data-navigation', `contentsnav-${index + 1}`);
                    }
                });
            });
        },

        errorMessages: function (scope = document) {
            const errorMessages = tracking.gatherElements(scope, 'ds_question__error-message');
            errorMessages.forEach((errorMessage, index) => {
                const question = errorMessage.closest('.ds_question');
                const target = question.querySelector('.js-validation-group, .ds_input, .ds_select, .ds_checkbox__input, .ds_radio__input');
                let targetName = index + 1;

                if (target) {
                    if (target.classList.contains('js-validation-group')) {
                        const unique = function (value, index, self) {
                            return self.indexOf(value) === index;
                        };

                        const inputs = [].slice.call(target.querySelectorAll('.ds_input, .ds_select, .ds_checkbox__input, .ds_radio__input'));
                        targetName = inputs.map(input => {
                            if (input.type === 'radio') {
                                return input.name;
                            } else {
                                return input.id;
                            }
                        }).filter(unique).join('-');
                    } else if (target.type === 'radio') {
                        targetName = target.name;
                    } else {
                        targetName = target.id;
                    }
                }

                if (!errorMessage.getAttribute('data-form')) {
                    errorMessage.setAttribute('data-form', `error-${targetName}`);
                }
            });
        },

        errorSummaries: function (scope = document) {
            const errorSummaries = tracking.gatherElements(scope, 'ds_error-summary');
            errorSummaries.forEach(errorSummary => {
                const errorSummaryLinks = [].slice.call(errorSummary.querySelectorAll('.ds_error-summary__list a'));
                errorSummaryLinks.forEach(link => {
                    if (!link.getAttribute('data-form') && link.href) {
                        link.setAttribute('data-form', `error-${link.href.substring(link.href.lastIndexOf('#') + 1)}`);
                    }
                });
            });
        },

        hideThisPage: function (scope = document) {
            const hideThisPageElements = tracking.gatherElements(scope, 'ds_hide-page');
            hideThisPageElements.forEach(hideThisPageElement => {
                const hideThisPageButtons = [].slice.call(hideThisPageElement.querySelectorAll('.ds_hide-page__button'));

                hideThisPageButtons.forEach(hideThisPageButton => {
                    // attribute
                    hideThisPageButton.setAttribute('data-navigation', 'hide-this-page');

                    // event
                    document.addEventListener('keyup', (event) => {
                        if (event.key === 'Escape' || event.keyCode === 27) {
                            window.dataLayer.push({ 'event': 'hide-this-page-keyboard' });
                        }
                    });
                });
            });
        },

        insetTexts: function (scope = document) {
            const insetTexts = tracking.gatherElements(scope, 'ds_inset-text');
            insetTexts.forEach(insetText => {

                const links = [].slice.call(insetText.querySelectorAll('.ds_inset-text__text a:not(.ds_button)'));
                links.forEach(link => {
                    link.setAttribute('data-navigation', 'inset-link');
                });
            });
        },

        notifications: function (scope = document) {
            const notificationBanners = tracking.gatherElements(scope, 'ds_notification');
            notificationBanners.forEach((banner, index) => {
                const bannername = banner.id || index+1;

                const links = [].slice.call(banner.querySelectorAll('a:not(.ds_button)'));
                links.forEach(link => {
                    if (!link.getAttribute('data-banner')) {
                        link.setAttribute('data-banner', `banner-${bannername}-link`);
                    }
                });

                const buttons = [].slice.call(banner.querySelectorAll('.ds_button:not(.ds_notification__close)'));
                buttons.forEach(button => {
                    if (!button.getAttribute('data-banner')) {
                        button.setAttribute('data-banner', `banner-${bannername}-${slugify(button.innerText)}`);
                    }
                });

                const close = banner.querySelector('.ds_notification__close');
                if (close && !close.getAttribute('data-banner')) {
                    close.setAttribute('data-banner', `banner-${bannername}-close`);
                }
            });
        },

        pagination: function (scope = document) {
            const paginations = tracking.gatherElements(scope, 'ds_pagination');
            paginations.forEach(pagination => {
                const loadmore = pagination.querySelector('.ds_pagination__load-more button');
                if (loadmore && !loadmore.getAttribute('data-search')) {
                    loadmore.setAttribute('data-search', 'pagination-more');
                }

                const paginationLinks = [].slice.call(pagination.querySelectorAll('a.ds_pagination__link'));
                paginationLinks.forEach(link => {
                    if (!link.getAttribute('data-search')) {
                        link.setAttribute('data-search', `pagination-${slugify(link.innerText)}`);
                    }
                });
            });
        },

        phaseBanners: function (scope = document) {
            const phaseBanners = tracking.gatherElements(scope, 'ds_phase-banner');
            phaseBanners.forEach(banner => {
                const bannername = banner.querySelector('.ds_tag') ? banner.querySelector('.ds_tag').innerText : 'phase';

                const links = [].slice.call(banner.querySelectorAll('a'));
                links.forEach(link => {
                    if (!link.getAttribute('data-banner')) {
                        link.setAttribute('data-banner', `banner-${slugify(bannername)}-link`);
                    }
                });
            });
        },

        radios: function (scope = document) {
            const radios = tracking.gatherElements(scope, 'ds_radio__input');
            radios.forEach(radio => {
                if (!radio.getAttribute('data-form') && radio.name && radio.id) {
                    radio.setAttribute('data-form', `radio-${radio.name}-${radio.id}`);
                }
            });
        },

        searchResults: function (scope = document) {
            const searchResultsSets = tracking.gatherElements(scope, 'ds_search-results');
            searchResultsSets.forEach(searchResults => {
                const list = searchResults.querySelector('.ds_search-results__list');

                if (!list) {
                    return;
                }

                const items = [].slice.call(searchResults.querySelectorAll('.ds_search-result'));

                let start = 1;
                if (list.getAttribute('start')) {
                    start = +list.getAttribute('start');
                }

                items.forEach((item, index) => {
                    const link = item.querySelector('.ds_search-result__link');
                    let count;
                    if (list.getAttribute('data-total')) {
                        count = list.getAttribute('data-total');
                    }

                    let attributeValue = `search-result-${start + index}`;
                    if (count) {
                        attributeValue += `/${count}`;
                    }
                    link.setAttribute('data-search', attributeValue);
                });
            });
        },

        searchSuggestions: function (scope = document) {
            const searchSuggestionBlocks = tracking.gatherElements(scope, 'ds_search-suggestions');
            searchSuggestionBlocks.forEach(searchSuggestionBlock => {
                const searchSuggestionLinks = [].slice.call(searchSuggestionBlock.querySelectorAll('.ds_search-suggestions a'));
                searchSuggestionLinks.forEach((link, index) => {
                    link.setAttribute('data-search', `suggestion-result-${index + 1}/${searchSuggestionLinks.length}`);
                });
            });
        },

        selects: function (scope = document) {
            const selects = tracking.gatherElements(scope, 'ds_select');
            selects.forEach(select => {
                // data attributes
                if (!select.getAttribute('data-form') && select.id) {
                    select.setAttribute('data-form', `select-${select.id}`);
                }

                const options = [].slice.call(select.querySelectorAll('option'));
                options.forEach(option => {
                    let valueSlug = 'null';
                    if (option.value) {
                        valueSlug = slugify(option.value);
                    }
                    option.setAttribute('data-form', `${select.getAttribute('data-form')}-${valueSlug}`);
                });

                // events
                if (!select.classList.contains('js-has-tracking-event')) {
                    select.addEventListener('change', (e) => {
                        window.dataLayer.push({ 'event': e.target.querySelector(':checked').dataset.form });
                    });

                    select.classList.add('js-has-tracking-event');
                }
            });
        },

        sequentialNavs: function (scope = document) {
            const sequentialNavs = tracking.gatherElements(scope, 'ds_sequential-nav');
            sequentialNavs.forEach(sequentialNav => {
                const prev = sequentialNav.querySelector('.ds_sequential-nav__item--prev > .ds_sequential-nav__button ');
                const next = sequentialNav.querySelector('.ds_sequential-nav__item--next > .ds_sequential-nav__button ');

                if (prev && !prev.getAttribute('data-navigation')) {
                    prev.setAttribute('data-navigation', `sequential-previous`);
                }
                if (next && !next.getAttribute('data-navigation')) {
                    next.setAttribute('data-navigation', `sequential-next`);
                }
            });
        },

        sideNavs: function (scope = document) {
            const sideNavs = tracking.gatherElements(scope, 'ds_side-navigation');
            sideNavs.forEach(sideNav => {
                const list = sideNav.querySelector('.ds_side-navigation__list');
                const button = sideNav.querySelector('.js-side-navigation-button');
                const control = sideNav.querySelector('.js-toggle-side-navigation');

                function setNavButton() {
                    button.setAttribute('data-navigation', `navigation-${control.checked ? 'close' : 'open'}`);
                }

                function recurse(list, stub = '') {
                    [].slice.call(list.children).forEach((listItem, index) => {
                        [].slice.call(listItem.children).forEach(child => {
                            if (child.classList.contains('ds_side-navigation__list')) {
                                recurse(child, `${stub}-${index+1}`);
                            } else {
                                child.setAttribute('data-navigation', `sidenav${stub}-${index+1}`);
                            }
                        });
                    });
                }

                // set data attribute on list items
                recurse(list);

                if (button) {
                    // set data attribute on open/close toggle
                    setNavButton();

                    // events
                    button.addEventListener('click', () => {
                        setNavButton();
                    });
                }
            });
        },

        siteBranding: function (scope = document) {
            const siteBrandings = tracking.gatherElements(scope, 'ds_site-branding');
            siteBrandings.forEach(branding => {
                const logo = branding.querySelector('.ds_site-branding__logo');

                if (logo && !logo.getAttribute('data-header')) {
                    logo.setAttribute('data-header', 'header-logo');
                }

                const title = branding.querySelector('.ds_site-branding__title');

                if (title && !title.getAttribute('data-header')) {
                    title.setAttribute('data-header', 'header-title');
                }
            });
        },

        siteFooter: function (scope = document) {
            const siteFooters = tracking.gatherElements(scope, 'ds_site-footer');
            siteFooters.forEach(footer => {
                const logo = footer.querySelector('.ds_site-footer__org-link');

                if (!logo.getAttribute('data-footer')) {
                    logo.setAttribute('data-footer', 'footer-logo');
                }

                const copyrightLinks = [].slice.call(footer.querySelectorAll('.ds_site-footer__copyright a'));
                copyrightLinks.forEach(link => {
                    if (!link.getAttribute('data-footer')) {
                        link.setAttribute('data-footer', 'footer-copyright');
                    }
                });

                const links = [].slice.call(footer.querySelectorAll('.ds_site-items__item a:not(.ds_button)'));
                links.forEach((link, index) => {
                    if (!link.getAttribute('data-footer')) {
                        link.setAttribute('data-footer', `footer-link-${index + 1}`);
                    }
                });
            });
        },

        siteNavigation: function (scope = document) {
            const siteNavigations = tracking.gatherElements(scope, 'ds_site-navigation');
            siteNavigations.forEach(siteNavigation => {
                const links = [].slice.call(siteNavigation.querySelectorAll('.ds_site-navigation__link'));
                links.forEach((link, index) => {
                    if (!link.getAttribute('data-device')) {
                        link.setAttribute('data-device', 'desktop');
                    }
                    if (!link.getAttribute('data-header')) {
                        link.setAttribute('data-header', `header-link-${index + 1}`);
                    }
                });
            });

            const mobileNavigations = tracking.gatherElements(scope, 'ds_mobile-navigation');
            mobileNavigations.forEach(mobileNavigation => {
                const toggler = mobileNavigation.querySelector('.ds_mobile-navigation__button');
                if (toggler) {
                    toggler.setAttribute('data-header', 'header-menu-toggle');
                }

                const links = [].slice.call(mobileNavigation.querySelectorAll('.ds_mobile-navigation__link'));
                links.forEach((link, index) => {
                    if (!link.getAttribute('data-device')) {
                        link.setAttribute('data-device', 'mobile');
                    }
                    if (!link.getAttribute('data-header')) {
                        link.setAttribute('data-header', `header-link-${index + 1}`);
                    }
                });
            });
        },

        tabs: function (scope = document) {
            const tabSets = tracking.gatherElements(scope, 'ds_tab-container');
            tabSets.forEach(tabSet => {
                const tabs = [].slice.call(tabSet.querySelectorAll('.ds_tab__label'));
                tabs.forEach((tab, index) => {
                    if (!tab.getAttribute('data-navigation')) {
                        tab.setAttribute('data-navigation', `tab-${index + 1}`);
                    }
                });
            });
        },

        textInputs: function (scope = document) {
            const textInputs = [].slice.call(scope.querySelectorAll('input.ds_input'));
            textInputs.forEach(textInput => {
                if (!textInput.getAttribute('data-form') && textInput.id) {
                    const type = textInput.type;
                    textInput.setAttribute('data-form', `${type}input-${textInput.id}`);
                }
            });
        },

        textareas: function (scope = document) {
            const textareas = [].slice.call(scope.querySelectorAll('textarea.ds_input'));
            textareas.forEach(textarea => {
                if (!textarea.getAttribute('data-form') && textarea.id) {
                    textarea.setAttribute('data-form', `textarea-${textarea.id}`);
                }
            });
        },

        warningTexts: function (scope = document) {
            const warningTexts = tracking.gatherElements(scope, 'ds_warning-text');
            warningTexts.forEach(warningText => {

                const links = [].slice.call(warningText.querySelectorAll('.ds_warning-text a:not(.ds_button)'));
                links.forEach(link => {
                    link.setAttribute('data-navigation', 'warning-link');
                });
            });
        }
    }
};

        /**
         * still to go:
         * cookie notice
         */

export default tracking;
