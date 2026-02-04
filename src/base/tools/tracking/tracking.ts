'use strict';

import version from '../../../version';

declare global {
    interface Window { dataLayer: Record<string, string | number | undefined>[]; }
}

/**
 * Slugify a string
 *
 * @param {string} string - the string to slugify
 * @returns {string} the slugified string
 */
function slugify(string: string): string {
    string = String(string);

    return string
        .trim()
        // Make lower-case
        .toLowerCase()
        // Remove misc punctuation
        .replace(/['"’‘”“`]/g, '')
        // Replace non-word characters with dashes
        .replace(/[\W|_]+/g, '-')
        // Remove starting and trailing dashes
        .replace(/^-+|-+$/g, '');
}

/**
 * Get all previous siblings of an element
 *
 * @param {HTMLElement} node
 * @returns {HTMLElement[]}
 */
function prevUntil (node: HTMLElement): HTMLElement[] {
    const prevNodes = [];

    if (node.parentElement) {
        const nodeArray = [].slice.call(node.parentElement.children) as HTMLElement[];

        for (let i = 0, il = nodeArray.length; i < il; i++) {
            if (nodeArray[i] === node) {
                break;
            }

            prevNodes.push(nodeArray[i]);
        }
    }
    return prevNodes;
}

/**
 * Find an element in an array of nodes matching a selector
 * - also handles special cases where the selector is inside a special case element
 *   e.g. finding a heading inside a ds_page-header block
 *
 * @param {HTMLElement[]} nodeArray
 * @param {string} selector
 * @param {string} specialCases
 * @returns {HTMLElement | null}
 */
function findElementInNodeArray(nodeArray: HTMLElement[], selector: string, specialCases?: string): HTMLElement | null {
    nodeArray.reverse();

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

    return null;
}

/**
 * Tracking tools
 * - adds data attributes for tracking and pushes data to the dataLayer
 * - can be re-initialized on dynamic content by calling tracking.init(scope)
 * - scope parameter is optional and defaults to document.documentElement
 */
const tracking = {
    hasAddedCanonicalUrl: false,
    hasAddedClickTracking: false,
    hasAddedPrefersColorScheme: false,
    hasAddedVersion: false,

    /**
     * Initialize tracking
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    init: function (scope: HTMLElement = document.documentElement): void {
        let key: keyof typeof tracking.add;
        for (key in tracking.add) {
            tracking.add[key](scope)
        }
    },

    /**
     * Gather elements by class name
     *
     * @param {string} className - the class name to gather elements for
     * @param {HTMLElement} scope - the element to search within
     * @returns {HTMLElement[]}
     */
    gatherElements: function (className: string, scope: HTMLElement): HTMLElement[] {
        const elements = [].slice.call(scope.querySelectorAll(`.${className}`)) as HTMLElement[];

        if (scope.classList && scope.classList.contains(className)) {
            elements.push(scope);
        }

        return elements;
    },

    /**
     * Get the type of click (left/middle/right + modifier keys)
     *
     * @param {MouseEvent} event
     * @returns {string | undefined} - click type
     */
    getClickType: function (event: MouseEvent): string | undefined {
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

    /**
     * Get the nearest section header element for an element
     * - skips certain exceptions such as navigation elements
     * - looks for certain special cases such as page headers
     * - recursively checks parent elements if none found in previous siblings
     * - returns undefined if in an exception element
     *
     * @param {HTMLElement} element - the element to find the nearest section header for
     * @returns {Element | undefined} - nearest section header element
     */
    getNearestSectionHeader: function (element: HTMLElement): Element | undefined {
        const linkSectionExceptions = 'nav,.ds_metadata,.ds_summary-card__header';
        const linkSectionIdentifiers = 'h1,h2,h3,h4,h5,h6,.ds_details__summary';
        const linkSectionSpecialCases = '.ds_page-header,.ds_layout__header,.ds_accordion-item__header';

        if (typeof element.closest === 'function' && element.closest(linkSectionExceptions)) {
            return;
        }

        const possibleHeader = findElementInNodeArray(prevUntil(element), linkSectionIdentifiers, linkSectionSpecialCases);
        let nearestSectionHeader;

        if (possibleHeader) {
            nearestSectionHeader = possibleHeader;
        } else if (element.parentElement) {
            nearestSectionHeader = tracking.getNearestSectionHeader(element.parentElement);
        }

        return nearestSectionHeader;
    },

    /**
     * Push data to the dataLayer
     *
     * @param data
     * @returns {void}
     */
    pushToDataLayer: function(data: { [key: string]: string | number | undefined }): void {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(data);
    },

    /**
     * Add various tracking features
     */
    add: {
        /**
         * Add click tracking
         * - listens for click, auxclick and contextmenu events
         * - pushes click type to dataLayer
         * - only adds listeners once
         *
         * @param {HTMLElement} scope - the element to add click tracking to
         * @returns {void}
         */
        clicks: function (scope: HTMLElement = document.documentElement): void {
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

        /**
         * Add canonical URL to dataLayer
         * - only adds once
         *
         * @returns {void}
         */
        canonicalUrl: (): void => {
            const canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
            if (canonicalLink && canonicalLink.href) {
                if (!tracking.hasAddedCanonicalUrl) {
                    tracking.pushToDataLayer({
                        canonicalUrl: canonicalLink.href
                    });
                    tracking.hasAddedCanonicalUrl = true;
                }
            }
        },

        /**
         * Add prefers color scheme to dataLayer
         * - only adds once
         *
         * @returns {void}
         */
        prefersColorScheme: function (): void {
            /* v8 ignore if -- @preserve */
            if (!window.matchMedia) {
                return;
            }

            const colorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

            if (!tracking.hasAddedPrefersColorScheme) {
                tracking.pushToDataLayer({
                    prefersColorScheme: colorScheme
                });
                tracking.hasAddedPrefersColorScheme = true;
            }
        },

        /**
         * Add version to dataLayer
         * - only adds once
         *
         * @returns {void}
         */
        version: function (): void {
            if (!tracking.hasAddedVersion) {
                tracking.pushToDataLayer({
                    version: version
                });
                tracking.hasAddedVersion = true;
            }
        },

        /**
         * Sets data-navigation="accordion-link" on links in accordion panels
         * Sets data-accordion="accordion-[NAME]-[open/close]-all" on accordion open/close all buttons
         * Sets data-accordion="accordion-[NAME]-[open/close]-[INDEX+1]" on accordion header buttons
         * Adds event listeners to toggle the open/close state used in those attributed
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        accordions: function (scope: HTMLElement = document.documentElement): void {
            const accordions = tracking.gatherElements('ds_accordion', scope);

            accordions.forEach(accordion => {
                let name = '';
                if (accordion.dataset.name) {
                    name = accordion.dataset.name;
                }

                if (!accordion.classList.contains('js-initialised')) {
                    return;
                }

                const links = [].slice.call(accordion.querySelectorAll('a:not(.ds_button)')) as HTMLLinkElement[];
                links.forEach(link => {
                    if (!link.getAttribute('data-navigation')) {
                        link.setAttribute('data-navigation', `accordion-link`);
                    }
                });

                const openAll = accordion.querySelector('.js-open-all') as HTMLButtonElement;
                const items = [].slice.call(accordion.querySelectorAll('.ds_accordion-item')) as HTMLElement[];

                /**
                 * Check if all accordion items are open
                 *
                 * @returns {boolean}
                 */
                function checkOpenAll(): boolean {
                    const openItemsCount = accordion.querySelectorAll('.ds_accordion-item--open').length;
                    return (items.length === openItemsCount);
                }

                /**
                 * Set open all button data attribute
                 *
                 * @param {HTMLButtonElement} openAll
                 * @returns {void}
                 */
                function setOpenAll(openAll: HTMLButtonElement): void {
                    if (openAll) {
                        const open = checkOpenAll();

                        if (open) {
                            openAll.setAttribute('data-accordion', `accordion-${name.length ? name + '-' : name}close-all`);
                        } else {
                            openAll.setAttribute('data-accordion', `accordion-${name.length ? name + '-' : name}open-all`);
                        }
                    }
                }

                /**
                 * Set accordion item data attribute
                 *
                 * @param {HTMLElement} item
                 * @param {number} index
                 * @returns {void}
                 */
                function setAccordionItem(item: HTMLElement, index: number): void {
                    const itemButton = item.querySelector('.ds_accordion-item__button') as HTMLButtonElement;
                    const itemControl = item.querySelector('.ds_accordion-item__control') as HTMLInputElement;
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
                    const itemButton = item.querySelector('.ds_accordion-item__button') as HTMLButtonElement;
                    const itemControl = item.querySelector('.ds_accordion-item__control') as HTMLInputElement;
                    itemButton.addEventListener('click', () => {
                        itemButton.setAttribute('data-accordion', `accordion-${name.length ? name + '-' : name}${itemControl.checked ? 'close' : 'open'}-${index + 1}`);
                        setOpenAll(openAll);
                    });
                });
            });
        },

        /**
         * Sets data-navigation="link-related-[INDEX+1]" to article aside components
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        asides: function (scope: HTMLElement = document.documentElement): void {
            const asides = tracking.gatherElements('ds_article-aside', scope);
            asides.forEach(aside => {
                const links = [].slice.call(aside.querySelectorAll('a:not(.ds_button)')) as HTMLLinkElement[];

                links.forEach((link, index) => {
                    if (!link.getAttribute('data-navigation')) {
                        link.setAttribute('data-navigation', `link-related-${index + 1}`);
                    }
                });
            });
        },

        /**
         * Adds an event listener to push autocomplete data to the datalayer on click and keydown
         *
         * Pushed data:
         * - {string} event
         * - {string} searchText
         * - {string} clickText
         * - {number} resultsCount
         * - {string} clickedResults
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        autocompletes: function (scope: HTMLElement = document.documentElement): void {
            function autocompleteDataLayerPush(storedValue: string, inputElement: HTMLInputElement) {
                tracking.pushToDataLayer({
                    event: 'autocomplete',
                    searchText: storedValue,
                    clickText: inputElement.dataset.autocompletetext,
                    resultsCount: parseInt(inputElement.dataset.autocompletecount as string),
                    clickedResults: `result ${inputElement.dataset.autocompleteposition} of ${inputElement.dataset.autocompletecount}`
                });

                delete inputElement.dataset.autocompletetext;
                delete inputElement.dataset.autocompletecount;
                delete inputElement.dataset.autocompleteposition;
            }

            const autocompletes = tracking.gatherElements('ds_autocomplete', scope);
            autocompletes.forEach(autocomplete => {
                const inputElement = autocomplete.querySelector('.js-autocomplete-input') as HTMLInputElement;
                const listBoxElement = document.querySelector('#' + inputElement.getAttribute('aria-owns') + ' .ds_autocomplete__suggestions-list');

                let storedValue = inputElement.value;

                inputElement.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' && inputElement.dataset.autocompletetext) {
                        autocompleteDataLayerPush(storedValue, inputElement);
                    }

                    storedValue = inputElement.value;
                });

                listBoxElement?.addEventListener('mousedown', () => {
                    autocompleteDataLayerPush(storedValue, inputElement);
                });
            });
        },

        /**
         * Sets data-navigation="backtotop" on back to top components
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        backToTop: function (scope: HTMLElement = document.documentElement): void {
            const backToTops = tracking.gatherElements('ds_back-to-top__button', scope);
            backToTops.forEach(backToTop => {
                backToTop.setAttribute('data-navigation', 'backtotop');
            });
        },

        /**
         * Sets data-navigation="breadcrumb-[INDEX+1]" on breadcrumb item components
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        breadcrumbs: function (scope: HTMLElement = document.documentElement): void {
            const breadcrumbLists = tracking.gatherElements('ds_breadcrumbs', scope);
            breadcrumbLists.forEach(breadcrumbList => {
                const links = [].slice.call(breadcrumbList.querySelectorAll('.ds_breadcrumbs__link')) as HTMLLinkElement[];

                links.forEach((link, index) => {
                    if (!link.getAttribute('data-navigation')) {
                        link.setAttribute('data-navigation', `breadcrumb-${index + 1}`);
                    }
                });
            });
        },

        /**
         * Sets data-button="button-[TEXT]" on button components
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        buttons: function (scope: HTMLElement = document.documentElement): void {
            const buttons = [].slice.call(scope.querySelectorAll('.ds_button, input[type="button"], input[type="submit"], button')) as HTMLButtonElement[];
            buttons.forEach(button => {
                if (!button.getAttribute('data-button')) {
                    button.setAttribute('data-button', `button-${slugify(button.textContent)}`);
                }
            });
        },

        /**
         * Sets data-navigation="card-[INDEX+1]" on cards that are links
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        cards: function (scope: HTMLElement = document.documentElement): void {
            const linkedCards = tracking.gatherElements('ds_card__link--cover', scope);
            linkedCards.forEach((link, index) => {
                if (!link.getAttribute('data-navigation')) {
                    link.setAttribute('data-navigation', `card-${index + 1}`);
                }
            });
        },

        /**
         * Sets data-navigation="category-item-[INDEX+1]" on category item components
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        categoryLists: function (scope: HTMLElement = document.documentElement): void {
            const categoryLists = tracking.gatherElements('ds_category-list', scope);
            categoryLists.forEach(categoryList => {
                const links = [].slice.call(categoryList.querySelectorAll('.ds_category-item__link')) as HTMLLinkElement[];

                links.forEach((link, index) => {
                    if (!link.getAttribute('data-navigation')) {
                        link.setAttribute('data-navigation', `category-item-${index + 1}`);
                    }
                });
            });
        },

        /**
         * Sets data-form="checkbox-[ID]" on unchecked checkboxes
         * Sets data-form="checkbox-[ID]-checked" on checked checkboxes
         * Sets data-value="[ID]" on checkboxes
         * Adds an event listener to toggle that checked state on change
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        checkboxes: function (scope: HTMLElement = document.documentElement): void {
            const checkboxes = tracking.gatherElements('ds_checkbox__input', scope) as HTMLInputElement[];
            checkboxes.forEach(checkbox => {

                // data attributes
                let attributeValue = checkbox.getAttribute('data-form') || '';

                if (!attributeValue && checkbox.id) {
                    attributeValue = `checkbox-${checkbox.id}`;
                } else {
                    attributeValue = attributeValue.replace(/-checked/g, '');
                }

                if (checkbox.checked) {
                    attributeValue = attributeValue + '-checked';
                }

                checkbox.setAttribute('data-form', attributeValue);


                if (checkbox.id && !(checkbox.getAttribute('data-value'))) {
                    checkbox.setAttribute('data-value', `${checkbox.id}`);
                }

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

        /**
         * Sets data-navigation="confirmation-link" on links in confirmation message components
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        confirmationMessages: function (scope: HTMLElement = document.documentElement): void {
            const confirmationMessages = tracking.gatherElements('ds_confirmation-message', scope);
            confirmationMessages.forEach(confirmationMessage => {

                const links = [].slice.call(confirmationMessage.querySelectorAll('a:not(.ds_button)'));
                links.forEach((link: HTMLLinkElement) => {
                    link.setAttribute('data-navigation', 'confirmation-link');
                });
            });
        },

        /**
         * Sets data-navigation="contact-details-[TEXT]" on social media links in contact details blocks
         * Sets data-navigation="contact-details-email" on email links in contact details blocks
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        contactDetails: function (scope: HTMLElement = document.documentElement): void {
            const contactDetailsBlocks = tracking.gatherElements('ds_contact-details', scope);
            contactDetailsBlocks.forEach(contactDetails => {
                const socialLinks = [].slice.call(contactDetails.querySelectorAll('.ds_contact-details__social-link')) as HTMLLinkElement[];
                socialLinks.forEach(link => {
                    if (!link.getAttribute('data-navigation')) {
                        link.setAttribute('data-navigation', `contact-details-${slugify(link.textContent)}`);
                    }
                });

                const emailLinks = [].slice.call(contactDetails.querySelectorAll('a[href^="mailto"]')) as HTMLLinkElement[];
                emailLinks.forEach(link => {
                    if (!link.getAttribute('data-navigation')) {
                        link.setAttribute('data-navigation', 'contact-details-email');
                    }
                });
            });
        },

        /**
         * Sets data-navigation="contentsnav-[INDEX+1]" on contents nav links
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        contentNavs: function (scope: HTMLElement = document.documentElement): void {
            const contentsNavs = tracking.gatherElements('ds_contents-nav', scope);
            contentsNavs.forEach(contentsNav => {
                const links = [].slice.call(contentsNav.querySelectorAll('.ds_contents-nav__link')) as HTMLLinkElement[];

                links.forEach((link, index) => {
                    if (!link.getAttribute('data-navigation')) {
                        link.setAttribute('data-navigation', `contentsnav-${index + 1}`);
                    }
                });
            });
        },

        /**
         * Sets data-accordion="details-[STATE]" on the details summary element
         * Sets data-navigation="details-link" on links in details content
         * Adds an event listener to toggle the STATE value used in the data-accordion attribute
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        details: function (scope: HTMLElement = document.documentElement): void {
            const detailsElements = tracking.gatherElements('ds_details', scope) as HTMLDetailsElement[];
            detailsElements.forEach(detailsElement => {
                const summary = detailsElement.querySelector('.ds_details__summary') as HTMLElement;;

                summary.setAttribute('data-accordion', `detail-${detailsElement.open ? 'close' : 'open'}`);

                summary.addEventListener('click', () => {
                    summary.setAttribute('data-accordion', `detail-${detailsElement.open ? 'open' : 'close'}`);
                });

                const links = [].slice.call(detailsElement.querySelectorAll('a:not(.ds_button)')) as HTMLLinkElement[];
                links.forEach(link => {
                    if (!link.getAttribute('data-navigation')) {
                        link.setAttribute('data-navigation', `details-link`);
                    }
                });
            });
        },

        /**
         * Sets data-form="error-[NAME]" on error messages
         * NAME refers to the erroring field
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        errorMessages: function (scope: HTMLElement = document.documentElement): void {
            const errorMessages = tracking.gatherElements('ds_question__error-message', scope);
            errorMessages.forEach((errorMessage, index) => {
                if (typeof errorMessage.closest === 'function' && errorMessage.closest('.ds_question')) {
                    const question = errorMessage.closest('.ds_question');

                    const target = question?.querySelector('.js-validation-group, .ds_input, .ds_select, .ds_checkbox__input, .ds_radio__input') as HTMLInputElement;
                    let targetName = (index + 1).toString();

                    if (target) {
                        if (target.classList.contains('js-validation-group')) {
                            const unique = function (value: string, index: number, self: string[]) {
                                return self.indexOf(value) === index;
                            };

                            const inputs = [].slice.call(target.querySelectorAll('.ds_input, .ds_select, .ds_checkbox__input, .ds_radio__input')) as HTMLInputElement[];
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

        /**
         * Sets data-form="error-[NAME]" to links in error summary components
         * NAME is derived fro the fragment identifier in the link's href
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        errorSummaries: function (scope: HTMLElement = document.documentElement): void {
            const errorSummaries = tracking.gatherElements('ds_error-summary', scope);
            errorSummaries.forEach(errorSummary => {
                const errorSummaryLinks = [].slice.call(errorSummary.querySelectorAll('.ds_error-summary__list a')) as HTMLLinkElement[]
                errorSummaryLinks.forEach(link => {
                    if (!link.getAttribute('data-form') && link.href) {
                        link.setAttribute('data-form', `error-${link.href.substring(link.href.lastIndexOf('#') + 1)}`);
                    }
                });
            });
        },

        /**
         * Sets data-navigation="link-external" to external links
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        externalLinks: function (scope: HTMLElement = document.documentElement): void {
            const links = [].slice.call(scope.querySelectorAll('a')) as HTMLLinkElement[];

            links.filter(link => {
                let hostAndPort = window.location.hostname;
                /* v8 ignore else -- @preserve */
                if (window.location.port) {
                    hostAndPort += ':' + window.location.port;
                }
                const regex = new RegExp('/' + hostAndPort + '/?|^tel:|^mailto:|^/');
                return !regex.test(link.href);
            }).forEach(link => {
                link.setAttribute('data-navigation', 'link-external');
            });
        },

        /**
         * Sets data-navigation="hide-this-page" on hide this page links
         * Adds an event listener to push 'esc' presses the data layer
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        hideThisPage: function (scope: HTMLElement = document.documentElement): void {
            const hideThisPageElements = tracking.gatherElements('ds_hide-page', scope);
            hideThisPageElements.forEach(hideThisPageElement => {
                const hideThisPageButtons = [].slice.call(hideThisPageElement.querySelectorAll('.ds_hide-page__button')) as HTMLLinkElement[];

                hideThisPageButtons.forEach(hideThisPageButton => {
                    // attribute
                    hideThisPageButton.setAttribute('data-navigation', 'hide-this-page');

                    // event
                    document.addEventListener('keyup', (event) => {
                        if (event.key === 'Esc') {
                            tracking.pushToDataLayer({ 'event': 'hide-this-page-keyboard' });
                        }
                    });
                });
            });
        },

        /**
         * Sets data-navigation="inset-link" on links in inset text components
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        insetTexts: function (scope: HTMLElement = document.documentElement): void {
            const insetTexts = tracking.gatherElements('ds_inset-text', scope);
            insetTexts.forEach(insetText => {

                const links = [].slice.call(insetText.querySelectorAll('.ds_inset-text__text a:not(.ds_button)')) as HTMLLinkElement[];
                links.forEach(link => {
                    /* v8 ignore else -- @preserve */
                    if (!link.getAttribute('data-navigation')) {
                        link.setAttribute('data-navigation', 'inset-link');
                    }
                });
            });
        },

        /**
         * Sets data-section="[SECTIONNAME]" on links
         * SECIONNAME is determined by seeking the closest heading (or headinglike) element to the link
         */
        // todo: @returns, should this have scope?
        links: function () {
            const links = [].slice.call(document.querySelectorAll('a')) as HTMLLinkElement[];
            links.forEach(link => {
                const nearestHeader = tracking.getNearestSectionHeader(link);//
                if (nearestHeader) {
                    if (!link.getAttribute('data-section')) {
                        link.setAttribute('data-section', nearestHeader.textContent.trim());
                    }
                }
            });
        },

        /**
         * Sets data-navigation="[NAME]-[INDEX+1]" on links in metadata items
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        metadataItems: function (scope: HTMLElement = document.documentElement): void {
            const metadataItems = tracking.gatherElements('ds_metadata__item', scope);

            metadataItems.forEach((metadataItem, index) => {
                const keyElement = metadataItem.querySelector('.ds_metadata__key');
                let key: string;

                if (keyElement) {
                    key = keyElement.textContent.trim();
                } else {
                    key = `metadata-${index}`;
                }

                const links = [].slice.call(metadataItem.querySelectorAll('.ds_metadata__value a')) as HTMLLinkElement[];

                links.forEach((link, index) => {
                    if (!link.getAttribute('data-navigation')) {
                        link.setAttribute('data-navigation', `${slugify(key)}-${index + 1}`);
                    }
                });
            });
        },

        /**
         * Sets data-banner="banner-[NAME]-link" on links in notification banners
         * Sets data-banner="banner-[NAME]-[BUTTONTEXT]" on buttons in notification banners
         * Sets data-banner="banner-[NAME]-close" on notification banner close buttons
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        notifications: function (scope: HTMLElement = document.documentElement): void {
            const notificationBanners = tracking.gatherElements('ds_notification', scope);
            notificationBanners.forEach((banner, index) => {
                const bannername = banner.id || (index + 1).toString();

                const links = [].slice.call(banner.querySelectorAll('a:not(.ds_button)')) as HTMLLinkElement[];
                links.forEach(link => {
                    if (!link.getAttribute('data-banner')) {
                        link.setAttribute('data-banner', `banner-${bannername}-link`);
                    }
                });

                const buttons = [].slice.call(banner.querySelectorAll('.ds_button:not(.ds_notification__close)')) as HTMLButtonElement[];
                buttons.forEach(button => {
                    if (!button.getAttribute('data-banner')) {
                        button.setAttribute('data-banner', `banner-${bannername}-${slugify(button.textContent)}`);
                    }
                });

                const close = banner.querySelector('.ds_notification__close');
                if (close && !close.getAttribute('data-banner')) {
                    close.setAttribute('data-banner', `banner-${bannername}-close`);
                }
            });
        },

        /**
         * Sets data-search="pagination-more" on "load more" links
         * Sets data-search="pagination-[LINKTEXT]" on pagination links
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        pagination: function (scope: HTMLElement = document.documentElement): void {
            const paginations = tracking.gatherElements('ds_pagination', scope);
            paginations.forEach(pagination => {
                const loadmore = pagination.querySelector('.ds_pagination__load-more button');
                if (loadmore && !loadmore.getAttribute('data-search')) {
                    loadmore.setAttribute('data-search', 'pagination-more');
                }

                const paginationLinks = [].slice.call(pagination.querySelectorAll('a.ds_pagination__link')) as HTMLLinkElement[];
                paginationLinks.forEach(link => {
                    if (!link.getAttribute('data-search')) {
                        link.setAttribute('data-search', `pagination-${slugify(link.textContent)}`);
                    }
                });
            });
        },

        /**
         * Sets data-banner="banner-[NAME]-link" on links in phase banners
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        phaseBanners: function (scope: HTMLElement = document.documentElement): void {
            const phaseBanners = tracking.gatherElements('ds_phase-banner', scope);
            phaseBanners.forEach(banner => {
                const tagElement = banner.querySelector('.ds_tag');
                const bannername = tagElement ? tagElement.textContent.trim() : 'phase';

                const links = [].slice.call(banner.querySelectorAll('a')) as HTMLLinkElement[];
                links.forEach(link => {
                    if (!link.getAttribute('data-banner')) {
                        link.setAttribute('data-banner', `banner-${slugify(bannername)}-link`);
                    }
                });
            });
        },

        /**
         * Sets data-form="radio-[NAME]-[ID]" on radio buttons
         * Sets data-value="[ID]" on radio buttons
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        radios: function (scope: HTMLElement = document.documentElement): void {
            const radios = tracking.gatherElements('ds_radio__input', scope) as HTMLInputElement[];
            radios.forEach(radio => {
                if (!radio.getAttribute('data-form') && radio.name && radio.id) {
                    radio.setAttribute('data-form', `radio-${radio.name}-${radio.id}`);
                }

                if (radio.id && !(radio.getAttribute('data-value'))) {
                    radio.setAttribute('data-value', `${radio.id}`);
                }
            });
        },

        /**
         * Sets data-button="button-filter-[SLUG]-remove" on search facet buttons
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        searchFacets: function (scope: HTMLElement = document.documentElement): void {
            const facetButtons = tracking.gatherElements('ds_facet__button', scope);
            facetButtons.forEach(facetButton => {
                facetButton.setAttribute('data-button', `button-filter-${facetButton.dataset.slug}-remove`);
            });
        },

        /**
         * Sets data-search="search-promoted-[INDEX+1]/[TOTALPROMOTED]" on promoted results
         * Sets data-search="search-result-[INDEX+1]" on search results
         * Sets data-search="search-image-[INDEX+1]" on images in search results
         * Sets data-search="search-parent-link-[INDEX+1]" on search result context links
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        searchResults: function (scope: HTMLElement = document.documentElement): void {
            const searchResultsSets = tracking.gatherElements('ds_search-results', scope);
            searchResultsSets.forEach(searchResults => {
                const list = searchResults.querySelector('.ds_search-results__list');
                if (!list) {
                    return;
                }

                const items = [].slice.call(searchResults.querySelectorAll('.ds_search-result')) as HTMLElement[];
                const promotedItems = [].slice.call(searchResults.querySelectorAll('.ds_search-result--promoted'));

                const start = +(list.getAttribute('start') || '1')

                items.forEach((item, index) => {
                    const link = item.querySelector('.ds_search-result__link') as HTMLAnchorElement;
                    const mediaLink = item.querySelector('.ds_search-result__media-link');
                    const parentLink = item.querySelector('.ds_search-result__context a');

                    if(item.classList.contains('ds_search-result--promoted')){
                        const attributeValue = `search-promoted-${index + 1}/${promotedItems.length}`;
                        link.setAttribute('data-search', attributeValue);
                    } else {
                        let count;
                        if (list.getAttribute('data-total')) {
                            count = list.getAttribute('data-total');
                        }

                        let attributeValue = `search-result-${start + index - promotedItems.length}`;
                        const mediaAttributeValue = `search-image-${start + index - promotedItems.length}`;
                        let parentAttributeValue = `search-parent-link-${start + index - promotedItems.length}`;
                        if (count) {
                            attributeValue += `/${count}`;
                            parentAttributeValue += `/${count}`;
                        }
                        link.setAttribute('data-search', attributeValue);
                        if (mediaLink) {
                        mediaLink.setAttribute('data-search', mediaAttributeValue);
                        }
                        if (parentLink) {
                            parentLink.setAttribute('data-search', parentAttributeValue);
                        }
                    }
                });
            });
        },

        /**
         * Sets data-search="suggestion-result=[INDEX+1]/[TOTALSUGGESTIONS]" on search suggestions
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        searchSuggestions: function (scope: HTMLElement = document.documentElement): void {
            const searchSuggestionBlocks = tracking.gatherElements('ds_search-suggestions', scope);
            searchSuggestionBlocks.forEach(searchSuggestionBlock => {
                const searchSuggestionLinks = [].slice.call(searchSuggestionBlock.querySelectorAll('.ds_search-suggestions a')) as HTMLLinkElement[];
                searchSuggestionLinks.forEach((link, index) => {
                    link.setAttribute('data-search', `suggestion-result-${index + 1}/${searchSuggestionLinks.length}`);
                });
            });
        },

        /**
         * Sets data-search="search-related-[INDEX+1]/[TOTALLINKS]" on related search items
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        searchRelated: function (scope: HTMLElement = document.documentElement): void {
            const searchRelatedBlocks = tracking.gatherElements('ds_search-results__related', scope);
            searchRelatedBlocks.forEach(searchRelatedBlock => {
                const searchRelatedLinks = [].slice.call(searchRelatedBlock.querySelectorAll('.ds_search-results__related a')) as HTMLLinkElement[];
                searchRelatedLinks.forEach((link, index) => {
                    link.setAttribute('data-search', `search-related-${index + 1}/${searchRelatedLinks.length}`);
                });
            });
        },

        /**
         * Sets data-form="select=[ID]" on select components
         * Sets data-form="select-[ID]-[value]" on options
         * Adds an event listener to push change events to the data layer
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        selects: function (scope: HTMLElement = document.documentElement): void {
            const selects = tracking.gatherElements('ds_select', scope) as HTMLSelectElement[];
            selects.forEach(select => {
                // data attributes
                if (!select.getAttribute('data-form') && select.id) {
                    select.setAttribute('data-form', `select-${select.id}`);
                }

                const options = [].slice.call(select.querySelectorAll('option')) as HTMLOptionElement[];
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
                        const targetElement = e.target as HTMLElement;
                        const checkedItem = targetElement.querySelector(':checked') as HTMLElement;
                        tracking.pushToDataLayer({ 'event': String(checkedItem.dataset.form) });
                    });

                    select.classList.add('js-has-tracking-event');
                }
            });
        },

        /**
         * Sets data-navigation="sequential-previous" on previous links
         * Sets data-navigation="sequential-previous" on next links
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        sequentialNavs: function (scope: HTMLElement = document.documentElement): void {
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

        /**
         * Sets data-navigation="navigation-[STATE]" on the side nav open/close button
         * Sets data-navigation="sidenav-[COMPLICATEDINDEX]" on side nav links where
         *   COMPLICATEDINDEX represents the link's location in the tree
         *
         * e.g.
         * - foo (sidenav-1)
         * - bar (sidenav-2)
         *   - baz (sidenav-2-1)
         *   - qux (sidenav-2-2)
         *
         * etc
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        sideNavs: function (scope: HTMLElement = document.documentElement): void {
            const sideNavs = tracking.gatherElements('ds_side-navigation', scope);
            sideNavs.forEach(sideNav => {
                const list = sideNav.querySelector('.ds_side-navigation__list') as HTMLUListElement;
                const button = sideNav.querySelector('.js-side-navigation-button');
                const control = sideNav.querySelector('.js-toggle-side-navigation') as HTMLInputElement;

                function setNavButton() {
                    button?.setAttribute('data-navigation', `navigation-${control.checked ? 'close' : 'open'}`);
                }

                function recurse(list: HTMLUListElement, stub = '') {
                    [].slice.call(list.children).forEach((listItem: HTMLLIElement, index: number) => {
                        [].slice.call(listItem.children).forEach((child: HTMLElement) => {
                            if (child.classList.contains('ds_side-navigation__list')) {
                                recurse(child as HTMLUListElement, `${stub}-${index+1}`);
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

        /**
         * Sets data-header="header-logo" on brand/logo link
         * Sets data-header="header-title" on site title link
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        siteBranding: function (scope: HTMLElement = document.documentElement): void {
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

        /**
         * Sets data-footer="footer-logo" on footer org logo link(s)
         * Sets data-footer="footer-copyright" on footer copyright link(s)
         * Sets data-footer="footer-link-[INDEX+1]" on footer utility links
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        siteFooter: function (scope: HTMLElement = document.documentElement): void {
            const siteFooters = tracking.gatherElements('ds_site-footer', scope);
            siteFooters.forEach(footer => {
                const logoLinks = [].slice.call(footer.querySelectorAll('.ds_site-footer__org-link')) as HTMLLinkElement[];

                logoLinks.forEach(link => {
                    if (!link.getAttribute('data-footer')) {
                        link.setAttribute('data-footer', 'footer-logo');
                    }
                });

                const copyrightLinks = [].slice.call(footer.querySelectorAll('.ds_site-footer__copyright a')) as HTMLLinkElement[];
                copyrightLinks.forEach(link => {
                    if (!link.getAttribute('data-footer')) {
                        link.setAttribute('data-footer', 'footer-copyright');
                    }
                });

                const links = [].slice.call(footer.querySelectorAll('.ds_site-items__item a:not(.ds_button)')) as HTMLLinkElement[];
                links.forEach((link, index) => {
                    if (!link.getAttribute('data-footer')) {
                        link.setAttribute('data-footer', `footer-link-${index + 1}`);
                    }
                });
            });
        },

        /**
         * Sets data-device attribute on site nav links, value either 'mobile' and 'desktop'
         * Sets data-header="header-link-[INDEX+1]" on site nav links
         * Sets data-header="header-menu-toggle" on the site nav open/close button
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        siteNavigation: function (scope: HTMLElement = document.documentElement): void {
            const siteNavigations = tracking.gatherElements('ds_site-navigation', scope);
            siteNavigations.forEach(siteNavigation => {
                const links = [].slice.call(siteNavigation.querySelectorAll('.ds_site-navigation__link')) as HTMLLinkElement[];
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
                const toggler = mobileNavigation.parentNode?.querySelector('.js-toggle-menu');
                if (toggler) {
                    toggler.setAttribute('data-header', 'header-menu-toggle');
                }
            });
        },

        /**
         * Sets data-navigation="skip-link-[INDEX+1]" on links in skip links components
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        skipLinks: function (scope: HTMLElement = document.documentElement): void {
            const skipLinks = [].slice.call(scope.querySelectorAll('.ds_skip-links__link')) as HTMLLinkElement[];
            skipLinks.forEach((link, index) => {
                if (!link.getAttribute('data-navigation')) {
                    link.setAttribute('data-navigation', `skip-link-${index + 1}`);
                }
            });
        },

        /**
         * Sets data-navigation="partof-sidebar" on stepnav sidebar links
         * Sets data-navigation="partof-header" on stepnav header links
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        stepNavigation: function (scope: HTMLElement = document.documentElement): void {
            const stepNavigations = tracking.gatherElements('ds_step-navigation', scope);
            stepNavigations.forEach(stepNavigation => {
                const partOfLinks = [].slice.call(stepNavigation.querySelectorAll('.ds_step-navigation__title-link')) as HTMLLinkElement[];
                partOfLinks.forEach(partOfLink => {
                    partOfLink.setAttribute('data-navigation', 'partof-sidebar');
                });
            });

            const stepNavigationTopBars = tracking.gatherElements('ds_step-navigation-top', scope);
            stepNavigationTopBars.forEach(stepNavigationTopBar => {
                const partOfLinks = [].slice.call(stepNavigationTopBar.querySelectorAll('a')) as HTMLLinkElement[];
                partOfLinks.forEach(partOfLink => {
                    partOfLink.setAttribute('data-navigation', 'partof-header');
                });
            });
        },

        /**
         * Sets data attributes on action links/buttons in summary cards
         * - data-navigation for links
         * - data-button for buttons
         *
         * The value of the attribute is derived from the element's text and the surrounding context.
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        summaryCard: function (scope: HTMLElement = document.documentElement): void {
            const summaryCards = tracking.gatherElements('ds_summary-card', scope);
            summaryCards.forEach((cards, index) => {
                const summaryListActions = [].slice.call(cards.querySelectorAll('.ds_summary-card__actions-list'));
                summaryListActions.forEach((actions: HTMLElement) => {
                    const actionButtons = [].slice.call(actions.querySelectorAll('button')) as HTMLButtonElement[];
                    const actionLinks = [].slice.call(actions.querySelectorAll('a')) as HTMLLinkElement[];
                    actionButtons.forEach(actionButton => {
                        actionButton.setAttribute('data-button', `button-${slugify(actionButton.textContent)}-${index + 1}`);
                    });
                    actionLinks.forEach(actionLink => {
                        actionLink.setAttribute('data-navigation', `navigation-${slugify(actionLink.textContent)}-${index + 1}`);
                    });
                });
            });
        },

        /**
         * Sets data attributes on action links/buttons in summary lists
         * - data-navigation for links
         * - data-button for buttons
         *
         * The value of the attribute is derived from the element's text and the surrounding context.
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        summaryList: function (scope: HTMLElement = document.documentElement): void {
            const summaryListActionContainers = tracking.gatherElements('ds_summary-list__actions', scope);
            summaryListActionContainers.forEach(actionContainer => {
                const actionElements = [].slice.call(actionContainer.querySelectorAll('button, a')) as HTMLLinkElement[] | HTMLButtonElement[];

                actionElements.forEach(actionElement => {
                    const actionElementType = actionElement.tagName === 'BUTTON' ? 'button' : 'navigation';

                    const keyForAction = actionElement.closest('.ds_summary-list__item')?.querySelector('.ds_summary-list__key') as HTMLElement;
                    const keyText = '-' + slugify(keyForAction.textContent as string);

                    actionElement.setAttribute(`data-${actionElementType}`, `${actionElementType}-${slugify(actionElement.textContent)}${keyText}`);
                });
            });
        },

        /**
         * Sets data-navigation="tab-link-[TABSET]-[LINKINDEX+1]" on tabs
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        tabs: function (scope: HTMLElement = document.documentElement): void {
            const tabComponent = tracking.gatherElements('ds_tabs', scope);
            let tabSet = 1;
            tabComponent.forEach(tabs => {
                const tabLinks = [].slice.call(tabs.querySelectorAll('.ds_tabs__tab-link')) as HTMLLinkElement[];
                tabLinks.forEach((link, index) => {
                    if (!link.getAttribute('data-navigation')) {
                        link.setAttribute('data-navigation', `tab-link-${tabSet}-${index + 1}`);
                    }
                });
                tabSet++;
            });
        },

        /**
         * Sets data-navigation="tasklist" on links in task lists
         * Sets data-navigation="tasklist-skip" on skip links in task lists
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        taskList: function (scope: HTMLElement = document.documentElement): void {
            const taskListLinks = tracking.gatherElements('ds_task-list__task-link', scope) as HTMLLinkElement[];
            taskListLinks.forEach(link => {
                if (!link.getAttribute('data-navigation')) {
                    link.setAttribute('data-navigation', `tasklist`);
                }
            });

            const taskListSkipLinks = tracking.gatherElements('js-task-list-skip-link', scope) as HTMLLinkElement[];
            taskListSkipLinks.forEach(link => {
                if (!link.getAttribute('data-navigation')) {
                    link.setAttribute('data-navigation', `tasklist-skip`);
                }
            });
        },

        /**
         * Sets data-form="[TYPE]input-[ID]" on text input components
         * e.g. data-form="textinput-foo", data-form="numberinput-bar"
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        textInputs: function (scope: HTMLElement = document.documentElement): void {
            const textInputs = [].slice.call(scope.querySelectorAll('input.ds_input')) as HTMLInputElement[];
            textInputs.forEach(textInput => {
                if (!textInput.getAttribute('data-form') && textInput.id) {
                    const type = textInput.type;
                    textInput.setAttribute('data-form', `${type}input-${textInput.id}`);
                }
            });
        },

        /**
         * Sets data-form="textarea-[ID]" on textarea components
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        textareas: function (scope: HTMLElement = document.documentElement): void {
            const textareas = [].slice.call(scope.querySelectorAll('textarea.ds_input')) as HTMLTextAreaElement[];
            textareas.forEach(textarea => {
                if (!textarea.getAttribute('data-form') && textarea.id) {
                    textarea.setAttribute('data-form', `textarea-${textarea.id}`);
                }
            });
        },

        /**
         * Sets data-navigation="warning-link" attributes on links within warning text components
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        warningTexts: function (scope: HTMLElement = document.documentElement): void {
            const warningTexts = tracking.gatherElements('ds_warning-text', scope);
            warningTexts.forEach(warningText => {

                const links = [].slice.call(warningText.querySelectorAll('.ds_warning-text a:not(.ds_button)')) as HTMLLinkElement[];
                links.forEach(link => {
                    link.setAttribute('data-navigation', 'warning-link');
                });
            });
        }
    }
};

export default tracking;
