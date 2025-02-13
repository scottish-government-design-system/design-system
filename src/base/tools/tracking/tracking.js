/* global document */

'use strict';

import storage from '../storage/storage';
import version from '../../../version';

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

function prevUntil (node) {
    const prevNodes = [];

    if (node.parentElement) {
        const nodeArray = [].slice.call(node.parentElement.children);

        for (let i = 0, il = nodeArray.length; i < il; i++) {
            if (nodeArray[i] === node) {
                break;
            }

            prevNodes.push(nodeArray[i]);
        }
    }
    return prevNodes;
}

function findElementInNodeArray(nodeArray, selector, specialCases) {
    nodeArray.reverse();

    // polyfill for IE
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }

    for (let i = 0, il = nodeArray.length; i < il; i++) {
        if (nodeArray[i].matches(selector)) {
            return nodeArray[i];
        }

        // this is to match cases such as finding a heading in a ds_page-header block
        if (specialCases && nodeArray[i].matches(specialCases)) {
            if (nodeArray[i].querySelector(selector)) {
                return nodeArray[i].querySelector(selector);
            }
        }
    }
}

const tracking = {
    init: function (scope) {
        if (!scope) {
            scope = document;
        }

        for (let key in tracking.add) {
            tracking.add[key](scope);
        }
    },

    gatherElements: function (className, scope) {
        let elements = [].slice.call(scope.querySelectorAll(`.${className}`));

        if (scope.classList && scope.classList.contains(className)) {
            elements.push(scope);
        }

        return elements;
    },

    getClickType: function (event) {
        switch (event.type) {
            case 'click':
                if (event.ctrlKey) {
                    return 'ctrl click'
                } else if (event.metaKey) {
                    return 'command/win click'
                } else if (event.shiftKey) {
                    return 'shift click'
                } else {
                    return 'primary click'
                }
            case 'auxclick':
                return 'middle click'
            case 'contextmenu':
                return 'secondary click'
        }
    },

    getNearestSectionHeader: function (element) {
        const linkSectionExceptions = 'nav,.ds_metadata';
        const linkSectionIdentifiers = 'h1,h2,h3,h4,h5,h6,.ds_accordion__button';
        const linkSectionSpecialCases = '.ds_page-header,.ds_layout__header';

        if (typeof element.closest === 'function' && element.closest(linkSectionExceptions)) {
            return false;
        }

        const possibleHeader = findElementInNodeArray(prevUntil(element), linkSectionIdentifiers, linkSectionSpecialCases);

        if (possibleHeader) {
            return possibleHeader;
        } else if (element.parentNode) {
            return tracking.getNearestSectionHeader(element.parentNode);
        } else {
            return false;
        }
    },

    pushToDataLayer: function(data) {
        if (storage.hasPermission(storage.categories.statistics)) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push(data);
        }
    },

    add: {
        clicks: function (scope = document) {
            if (!tracking.hasAddedClickTracking) {
                scope.addEventListener('click', event => {
                    // push to datalayer
                    tracking.pushToDataLayer({
                        'method': tracking.getClickType(event)
                    });
                });

                scope.addEventListener('auxclick', event => {
                    if (event.button === 1 || event.buttons === 4) {
                        // push to datalayer
                        tracking.pushToDataLayer({
                            'method': tracking.getClickType(event)
                        });
                    }
                });

                scope.addEventListener('contextmenu', event => {
                    // push to datalayer
                    tracking.pushToDataLayer({
                        'method': tracking.getClickType(event)
                    });
                });

                tracking.hasAddedClickTracking = true;
            }
        },

        version: function () {
            tracking.pushToDataLayer({
                version: version
            });
        },

        prefersColorScheme: function () {
            if (!window.matchMedia) {
                return;
            }

            const colorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

            tracking.pushToDataLayer({
                prefersColorScheme: colorScheme
            });
        },

        accordions: function (scope = document) {
            const accordions = tracking.gatherElements('ds_accordion', scope);

            accordions.forEach(accordion => {
                let name = '';
                if (accordion.dataset.name) {
                    name = accordion.dataset.name;
                }

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
                        const open = checkOpenAll();

                        if (open) {
                            openAll.setAttribute('data-accordion', `accordion-${name.length ? name + '-' : name}close-all`);
                        } else {
                            openAll.setAttribute('data-accordion', `accordion-${name.length ? name + '-' : name}open-all`);
                        }
                    }
                }

                function setAccordionItem(item, index) {
                    const itemButton = item.querySelector('.ds_accordion-item__button');
                    const itemControl = item.querySelector('.ds_accordion-item__control');
                    itemButton.setAttribute('data-accordion', `accordion-${name.length ? name + '-' : name}${itemControl.checked ? 'close' : 'open'}-${index + 1}`);
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
                        setOpenAll(openAll);
                    });
                }

                items.forEach((item, index) => {
                    const itemButton = item.querySelector('.ds_accordion-item__button');
                    const itemControl = item.querySelector('.ds_accordion-item__control');
                    itemButton.addEventListener('click', () => {
                        itemButton.setAttribute('data-accordion', `accordion-${name.length ? name + '-' : name}${itemControl.checked ? 'close' : 'open'}-${index + 1}`);
                        setOpenAll(openAll);
                    });
                });
            });
        },

        asides: function (scope = document) {
            const asides = tracking.gatherElements('ds_article-aside', scope);
            asides.forEach(aside => {
                const links = [].slice.call(aside.querySelectorAll('a:not(.ds_button)'));

                links.forEach((link, index) => {
                    if (!link.getAttribute('data-navigation')) {
                        link.setAttribute('data-navigation', `link-related-${index + 1}`);
                    }
                });
            });
        },

        autocompletes: function (scope = document) {
            function autocompleteDataLayerPush(storedValue, inputElement) {
                tracking.pushToDataLayer({
                    event: 'autocomplete',
                    searchText: storedValue,
                    clickText: inputElement.dataset.autocompletetext,
                    resultsCount: parseInt(inputElement.dataset.autocompletecount),
                    clickedResults: `result ${inputElement.dataset.autocompleteposition} of ${inputElement.dataset.autocompletecount}`
                });

                delete inputElement.dataset.autocompletetext;
                delete inputElement.dataset.autocompletecount;
                delete inputElement.dataset.autocompleteposition;
            }

            const autocompletes = tracking.gatherElements('ds_autocomplete', scope);
            autocompletes.forEach(autocomplete => {
                const inputElement = autocomplete.querySelector('.js-autocomplete-input');
                const listBoxElement = document.querySelector('#' + inputElement.getAttribute('aria-owns') + ' .ds_autocomplete__suggestions-list');

                let storedValue = inputElement.value;

                inputElement.addEventListener('keyup', (event) => {
                    if (event.key === 'Enter' && inputElement.dataset.autocompletetext) {
                        autocompleteDataLayerPush(storedValue, inputElement);
                    }

                    storedValue = inputElement.value;
                });

                listBoxElement.addEventListener('mousedown', () => {
                    autocompleteDataLayerPush(storedValue, inputElement);
                });
            });
        },

        backToTop: function (scope = document) {
            const backToTops = tracking.gatherElements('ds_back-to-top__button', scope);
            backToTops.forEach(backToTop => {
                backToTop.setAttribute('data-navigation', 'backtotop');
            });
        },

        breadcrumbs: function (scope = document) {
            const breadcrumbLists = tracking.gatherElements('ds_breadcrumbs', scope);
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

        cards: function (scope = document) {
            const linkedCards = tracking.gatherElements('ds_card__link--cover', scope);
            linkedCards.forEach((link, index) => {
                if (!link.getAttribute('data-navigation')) {
                    link.setAttribute('data-navigation', `card-${index + 1}`);
                }
            });
        },

        categoryLists: function (scope = document) {
            const categoryLists = tracking.gatherElements('ds_category-list', scope);
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
            const checkboxes = tracking.gatherElements('ds_checkbox__input', scope);
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

        confirmationMessages: function (scope = document) {
            const confirmationMessages = tracking.gatherElements('ds_confirmation-message', scope);
            confirmationMessages.forEach(confirmationMessage => {

                const links = [].slice.call(confirmationMessage.querySelectorAll('a:not(.ds_button)'));
                links.forEach(link => {
                    link.setAttribute('data-navigation', 'confirmation-link');
                });
            });
        },

        contactDetails: function (scope = document) {
            const contactDetailsBlocks = tracking.gatherElements('ds_contact-details', scope);
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
            const contentsNavs = tracking.gatherElements('ds_contents-nav', scope);
            contentsNavs.forEach(contentsNav => {
                const links = [].slice.call(contentsNav.querySelectorAll('.ds_contents-nav__link'));

                links.forEach((link, index) => {
                    if (!link.getAttribute('data-navigation')) {
                        link.setAttribute('data-navigation', `contentsnav-${index + 1}`);
                    }
                });
            });
        },

        details: function (scope = document) {
            const detailsElements = tracking.gatherElements('ds_details', scope);
            detailsElements.forEach(detailsElement => {
                const summary = detailsElement.querySelector('.ds_details__summary');

                summary.setAttribute('data-accordion', `detail-${detailsElement.open ? 'close' : 'open'}`);

                summary.addEventListener('click', () => {
                    summary.setAttribute('data-accordion', `detail-${detailsElement.open ? 'open' : 'close'}`);
                });
            });
        },

        errorMessages: function (scope = document) {
            const errorMessages = tracking.gatherElements('ds_question__error-message', scope);
            errorMessages.forEach((errorMessage, index) => {
                if (typeof errorMessage.closest === 'function' && errorMessage.closest('.ds_question')) {
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
                }
            });
        },

        errorSummaries: function (scope = document) {

            const errorSummaries = tracking.gatherElements('ds_error-summary', scope);
            errorSummaries.forEach(errorSummary => {
                const errorSummaryLinks = [].slice.call(errorSummary.querySelectorAll('.ds_error-summary__list a'));
                errorSummaryLinks.forEach(link => {
                    if (!link.getAttribute('data-form') && link.href) {
                        link.setAttribute('data-form', `error-${link.href.substring(link.href.lastIndexOf('#') + 1)}`);
                    }
                });
            });
        },

        externalLinks: function (scope = document) {
            const links = [].slice.call(scope.querySelectorAll('a'));
            links.filter(link => {
                let hostAndPort = window.location.hostname;
                if (window.location.port) {
                    hostAndPort += ':' + window.location.port;
                }
                const regex = new RegExp('/' + hostAndPort + '/?|^tel:|^mailto:|^/');
                return !regex.test(link.href);
            }).forEach(link => {
                link.setAttribute('data-navigation', 'link-external');
            });
        },

        hideThisPage: function (scope = document) {
            const hideThisPageElements = tracking.gatherElements('ds_hide-page', scope);
            hideThisPageElements.forEach(hideThisPageElement => {
                const hideThisPageButtons = [].slice.call(hideThisPageElement.querySelectorAll('.ds_hide-page__button'));

                hideThisPageButtons.forEach(hideThisPageButton => {
                    // attribute
                    hideThisPageButton.setAttribute('data-navigation', 'hide-this-page');

                    // event
                    document.addEventListener('keyup', (event) => {
                        if (event.key === 'Escape' || event.keyCode === 27) {
                            tracking.pushToDataLayer({ 'event': 'hide-this-page-keyboard' });
                        }
                    });
                });
            });
        },

        insetTexts: function (scope = document) {
            const insetTexts = tracking.gatherElements('ds_inset-text', scope);
            insetTexts.forEach(insetText => {

                const links = [].slice.call(insetText.querySelectorAll('.ds_inset-text__text a:not(.ds_button)'));
                links.forEach(link => {
                    link.setAttribute('data-navigation', 'inset-link');
                });
            });
        },

        links: function () {
            const links = [].slice.call(document.querySelectorAll('a'));

            links.forEach(link => {
                const nearestHeader = tracking.getNearestSectionHeader(link);
                if (nearestHeader) {
                    link.setAttribute('data-section', nearestHeader.innerText);
                }
            });
        },

        metadataItems: function (scope = document) {
            const metadataItems = tracking.gatherElements('ds_metadata__item', scope);

            metadataItems.forEach((metadataItem, index) => {
                const keyElement = metadataItem.querySelector('.ds_metadata__key');
                let key;

                if (keyElement) {
                    key = keyElement.innerText;
                } else {
                    key = `metadata-${index}`;
                }

                const links = [].slice.call(metadataItem.querySelectorAll('.ds_metadata__value a'));

                links.forEach((link, index) => {
                    if (!link.getAttribute('data-navigation')) {
                        link.setAttribute('data-navigation', `${slugify(key)}-${index + 1}`);
                    }
                });
            });
        },

        notifications: function (scope = document) {
            const notificationBanners = tracking.gatherElements('ds_notification', scope);
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
            const paginations = tracking.gatherElements('ds_pagination', scope);
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
            const phaseBanners = tracking.gatherElements('ds_phase-banner', scope);
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
            const radios = tracking.gatherElements('ds_radio__input', scope);
            radios.forEach(radio => {
                if (!radio.getAttribute('data-form') && radio.name && radio.id) {
                    radio.setAttribute('data-form', `radio-${radio.name}-${radio.id}`);
                }
            });
        },

        searchFacets: function (scope = document) {
            const facetButtons = tracking.gatherElements('ds_facet__button', scope);
            facetButtons.forEach(facetButton => {
                facetButton.setAttribute('data-button', `button-filter-${facetButton.dataset.slug}-remove`);
            });
        },

        searchResults: function (scope = document) {
            const searchResultsSets = tracking.gatherElements('ds_search-results', scope);
            searchResultsSets.forEach(searchResults => {
                const list = searchResults.querySelector('.ds_search-results__list');
                if (!list) {
                    return;
                }

                const items = [].slice.call(searchResults.querySelectorAll('.ds_search-result'));
                const promotedItems = [].slice.call(searchResults.querySelectorAll('.ds_search-result--promoted'));

                let start = 1;
                if (list.getAttribute('start')) {
                    start = +list.getAttribute('start');
                }

                items.forEach((item, index) => {
                    const link = item.querySelector('.ds_search-result__link');
                    const mediaLink = item.querySelector('.ds_search-result__media-link');
                    const parentLink = item.querySelector('.ds_search-result__context a');

                    if(item.classList.contains('ds_search-result--promoted')){
                        let attributeValue = `search-promoted-${index + 1}/${promotedItems.length}`;
                        link.setAttribute('data-search', attributeValue);
                    } else {

                        let count;
                        if (list.getAttribute('data-total')) {
                            count = list.getAttribute('data-total');
                        }

                        let attributeValue = `search-result-${start + index - promotedItems.length}`;
                        let mediaAttributeValue = `search-image-${start + index - promotedItems.length}`;
                        let parentAttributeValue = `search-parent-link-${start + index - promotedItems.length}`;
                        if (count) {
                            attributeValue += `/${count}`;
                            parentAttributeValue += `/${count}`;
                        }
                        link.setAttribute('data-search', attributeValue);
                        if(mediaLink){
                            mediaLink.setAttribute('data-search', mediaAttributeValue);
                        }
                        if(parentLink){
                            parentLink.setAttribute('data-search', parentAttributeValue);
                        }

                    }
                });
            });
        },

        searchSuggestions: function (scope = document) {
            const searchSuggestionBlocks = tracking.gatherElements('ds_search-suggestions', scope);
            searchSuggestionBlocks.forEach(searchSuggestionBlock => {
                const searchSuggestionLinks = [].slice.call(searchSuggestionBlock.querySelectorAll('.ds_search-suggestions a'));
                searchSuggestionLinks.forEach((link, index) => {
                    link.setAttribute('data-search', `suggestion-result-${index + 1}/${searchSuggestionLinks.length}`);
                });
            });
        },

        searchRelated: function (scope = document) {
            const searchRelatedBlocks = tracking.gatherElements('ds_search-results__related', scope);
            searchRelatedBlocks.forEach(searchRelatedBlock => {
                const searchRelatedLinks = [].slice.call(searchRelatedBlock.querySelectorAll('.ds_search-results__related a'));
                searchRelatedLinks.forEach((link, index) => {
                    link.setAttribute('data-search', `search-related-${index + 1}/${searchRelatedLinks.length}`);
                });
            });
        },

        selects: function (scope = document) {
            const selects = tracking.gatherElements('ds_select', scope);
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
                        tracking.pushToDataLayer({ 'event': e.target.querySelector(':checked').dataset.form });
                    });

                    select.classList.add('js-has-tracking-event');
                }
            });
        },

        sequentialNavs: function (scope = document) {
            const sequentialNavs = tracking.gatherElements('ds_sequential-nav', scope);
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
            const sideNavs = tracking.gatherElements('ds_side-navigation', scope);
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
            const siteBrandings = tracking.gatherElements('ds_site-branding', scope);
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
            const siteFooters = tracking.gatherElements('ds_site-footer', scope);
            siteFooters.forEach(footer => {
                const logoLinks = [].slice.call(footer.querySelectorAll('.ds_site-footer__org-link'));

                logoLinks.forEach(link => {
                    if (!link.getAttribute('data-footer')) {
                        link.setAttribute('data-footer', 'footer-logo');
                    }
                });

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
            const siteNavigations = tracking.gatherElements('ds_site-navigation', scope);
            siteNavigations.forEach(siteNavigation => {
                const links = [].slice.call(siteNavigation.querySelectorAll('.ds_site-navigation__link'));
                links.forEach((link, index) => {
                    if (!link.getAttribute('data-device')) {
                        if (typeof link.closest === 'function' && link.closest('.ds_site-navigation--mobile')) {
                            link.setAttribute('data-device', 'mobile');
                        } else {
                            link.setAttribute('data-device', 'desktop');
                        }
                    }
                    if (!link.getAttribute('data-header')) {
                        link.setAttribute('data-header', `header-link-${index + 1}`);
                    }
                });
            });

            const mobileNavigations = tracking.gatherElements('ds_site-navigation--mobile', scope);
            mobileNavigations.forEach(mobileNavigation => {
                const toggler = mobileNavigation.parentNode.querySelector('.js-toggle-menu');
                if (toggler) {
                    toggler.setAttribute('data-header', 'header-menu-toggle');
                }
            });
        },

        skipLinks: function (scope = document) {
            const skipLinks = [].slice.call(scope.querySelectorAll('.ds_skip-links__link'));
            skipLinks.forEach((link, index) => {
                if (!link.getAttribute('data-navigation')) {
                    link.setAttribute('data-navigation', `skip-link-${index + 1}`);
                }
            });
        },

        stepNavigation: function (scope = document) {
            const stepNavigations = tracking.gatherElements('ds_step-navigation', scope);
            stepNavigations.forEach(stepNavigation => {
                const partOfLinks = [].slice.call(stepNavigation.querySelectorAll('.ds_step-navigation__title-link'));
                partOfLinks.forEach(partOfLink => {
                    partOfLink.setAttribute('data-navigation', 'partof-sidebar');
                });
            });

            const stepNavigationTopBars = tracking.gatherElements('ds_step-navigation-top', scope);
            stepNavigationTopBars.forEach(stepNavigationTopBar => {
                const partOfLinks = [].slice.call(stepNavigationTopBar.querySelectorAll('a'));
                partOfLinks.forEach(partOfLink => {
                    partOfLink.setAttribute('data-navigation', 'partof-header');
                });
            });
        },

        summaryCard: function (scope = document) {
            const summaryCards = tracking.gatherElements('ds_summary-card', scope);
            summaryCards.forEach((cards, index) => {
                const summaryListActions = [].slice.call(cards.querySelectorAll('.ds_summary-card__actions-list'));
                summaryListActions.forEach(actions => {
                    const actionButtons = [].slice.call(actions.querySelectorAll('button'));
                    const actionLinks = [].slice.call(actions.querySelectorAll('a'));
                    actionButtons.forEach(actionButton => {
                        actionButton.setAttribute('data-button', `button-${slugify(actionButton.innerText)}-${index + 1}`);
                    });
                    actionLinks.forEach(actionLink => {
                        actionLink.setAttribute('data-navigation', `navigation-${slugify(actionLink.innerText)}-${index + 1}`);
                    });
                });
            });
        },

        summaryList: function (scope = document) {
            const summaryListActions = tracking.gatherElements('ds_summary-list__actions', scope);
            summaryListActions.forEach(actions => {
                const actionButtons = [].slice.call(actions.querySelectorAll('button'));
                const actionLinks = [].slice.call(actions.querySelectorAll('a'));
                actionButtons.forEach(actionButton => {
                    let questionText = '';
                    if(!!actionButton.getAttribute('aria-describedby')){
                        const question = scope.querySelector('#' + actionButton.getAttribute('aria-describedby'));
                        questionText = '-'+slugify(question.innerText);
                    }
                    actionButton.setAttribute('data-button', `button-${slugify(actionButton.innerText)}${questionText}`);
                });
                actionLinks.forEach(actionLink => {
                    let questionText = '';
                    if(!!actionLink.getAttribute('aria-describedby')){
                        const question = scope.querySelector('#' + actionLink.getAttribute('aria-describedby'));
                        questionText = '-'+slugify(question.innerText);
                    }
                    actionLink.setAttribute('data-navigation', `navigation-${slugify(actionLink.innerText)}${questionText}`);
                });
            });
        },

        tabs: function (scope = document) {
            const tabComponent = tracking.gatherElements('ds_tabs', scope);
            let tabSet = 1;
            tabComponent.forEach(tabs => {
                const tabLinks = [].slice.call(tabs.querySelectorAll('.ds_tabs__tab-link'));
                tabLinks.forEach((link, index) => {
                    if (!link.getAttribute('data-navigation')) {
                        link.setAttribute('data-navigation', `tab-link-${tabSet}-${index + 1}`);
                    }
                });
                tabSet++;
            });
        },

        taskList: function (scope = document) {
            const taskListLinks = tracking.gatherElements('ds_task-list__task-link', scope);
            taskListLinks.forEach(link => {
                if (!link.getAttribute('data-navigation')) {
                    link.setAttribute('data-navigation', `tasklist`);
                }
            });

            const taskListSkipLinks = tracking.gatherElements('js-task-list-skip-link', scope);
            taskListSkipLinks.forEach(link => {
                if (!link.getAttribute('data-navigation')) {
                    link.setAttribute('data-navigation', `tasklist-skip`);
                }
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
            const warningTexts = tracking.gatherElements('ds_warning-text', scope);
            warningTexts.forEach(warningText => {

                const links = [].slice.call(warningText.querySelectorAll('.ds_warning-text a:not(.ds_button)'));
                links.forEach(link => {
                    link.setAttribute('data-navigation', 'warning-link');
                });
            });
        }
    }
};

export default tracking;
