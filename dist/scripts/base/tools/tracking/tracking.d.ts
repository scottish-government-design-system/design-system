declare global {
    interface Window {
        dataLayer: Record<string, string | number | undefined>[];
    }
}
/**
 * Tracking tools
 * - adds data attributes for tracking and pushes data to the dataLayer
 * - can be re-initialized on dynamic content by calling tracking.init(scope)
 * - scope parameter is optional and defaults to document.documentElement
 */
declare const tracking: {
    hasAddedCanonicalUrl: boolean;
    hasAddedClickTracking: boolean;
    hasAddedPrefersColorScheme: boolean;
    hasAddedVersion: boolean;
    /**
     * Initialize tracking
     *
     * @param {HTMLElement} scope - the element to initialize tracking on
     * @returns {void}
     */
    init: (scope?: HTMLElement) => void;
    /**
     * Gather elements by class name
     *
     * @param {string} className - the class name to gather elements for
     * @param {HTMLElement} scope - the element to search within
     * @returns {HTMLElement[]}
     */
    gatherElements: (className: string, scope: HTMLElement) => HTMLElement[];
    /**
     * Get the type of click (left/middle/right + modifier keys)
     *
     * @param {MouseEvent} event
     * @returns {string | undefined} - click type
     */
    getClickType: (event: MouseEvent) => string | undefined;
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
    getNearestSectionHeader: (element: HTMLElement) => Element | undefined;
    /**
     * Push data to the dataLayer
     *
     * @param data
     * @returns {void}
     */
    pushToDataLayer: (data: {
        [key: string]: string | number | undefined;
    }) => void;
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
        clicks: (scope?: HTMLElement) => void;
        /**
         * Add canonical URL to dataLayer
         * - only adds once
         *
         * @returns {void}
         */
        canonicalUrl: () => void;
        /**
         * Add prefers color scheme to dataLayer
         * - only adds once
         *
         * @returns {void}
         */
        prefersColorScheme: () => void;
        /**
         * Add version to dataLayer
         * - only adds once
         *
         * @returns {void}
         */
        version: () => void;
        /**
         * Sets data-navigation="accordion-link" on links in accordion panels
         * Sets data-accordion="accordion-[NAME]-[open/close]-all" on accordion open/close all buttons
         * Sets data-accordion="accordion-[NAME]-[open/close]-[INDEX+1]" on accordion header buttons
         * Adds event listeners to toggle the open/close state used in those attributed
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        accordions: (scope?: HTMLElement) => void;
        /**
         * Sets data-navigation="link-related-[INDEX+1]" to article aside components
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        asides: (scope?: HTMLElement) => void;
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
        autocompletes: (scope?: HTMLElement) => void;
        /**
         * Sets data-navigation="backtotop" on back to top components
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        backToTop: (scope?: HTMLElement) => void;
        /**
         * Sets data-navigation="breadcrumb-[INDEX+1]" on breadcrumb item components
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        breadcrumbs: (scope?: HTMLElement) => void;
        /**
         * Sets data-button="button-[TEXT]" on button components
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        buttons: (scope?: HTMLElement) => void;
        /**
         * Sets data-navigation="card-[INDEX+1]" on cards that are links
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        cards: (scope?: HTMLElement) => void;
        /**
         * Sets data-navigation="category-item-[INDEX+1]" on category item components
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        categoryLists: (scope?: HTMLElement) => void;
        /**
         * Sets data-form="checkbox-[ID]" on unchecked checkboxes
         * Sets data-form="checkbox-[ID]-checked" on checked checkboxes
         * Sets data-value="[ID]" on checkboxes
         * Adds an event listener to toggle that checked state on change
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        checkboxes: (scope?: HTMLElement) => void;
        /**
         * Sets data-navigation="confirmation-link" on links in confirmation message components
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        confirmationMessages: (scope?: HTMLElement) => void;
        /**
         * Sets data-navigation="contact-details-[TEXT]" on social media links in contact details blocks
         * Sets data-navigation="contact-details-email" on email links in contact details blocks
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        contactDetails: (scope?: HTMLElement) => void;
        /**
         * Sets data-navigation="contentsnav-[INDEX+1]" on contents nav links
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        contentNavs: (scope?: HTMLElement) => void;
        /**
         * Sets data-accordion="details-[STATE]" on the details summary element
         * Sets data-navigation="details-link" on links in details content
         * Adds an event listener to toggle the STATE value used in the data-accordion attribute
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        details: (scope?: HTMLElement) => void;
        /**
         * Sets data-form="error-[NAME]" on error messages
         * NAME refers to the erroring field
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        errorMessages: (scope?: HTMLElement) => void;
        /**
         * Sets data-form="error-[NAME]" to links in error summary components
         * NAME is derived fro the fragment identifier in the link's href
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        errorSummaries: (scope?: HTMLElement) => void;
        /**
         * Sets data-navigation="link-external" to external links
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        externalLinks: (scope?: HTMLElement) => void;
        /**
         * Sets data-navigation="hide-this-page" on hide this page links
         * Adds an event listener to push 'esc' presses the data layer
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        hideThisPage: (scope?: HTMLElement) => void;
        /**
         * Sets data-navigation="inset-link" on links in inset text components
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        insetTexts: (scope?: HTMLElement) => void;
        /**
         * Sets data-section="[SECTIONNAME]" on links
         * SECIONNAME is determined by seeking the closest heading (or headinglike) element to the link
         */
        links: () => void;
        /**
         * Sets data-navigation="[NAME]-[INDEX+1]" on links in metadata items
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        metadataItems: (scope?: HTMLElement) => void;
        /**
         * Sets data-banner="banner-[NAME]-link" on links in notification banners
         * Sets data-banner="banner-[NAME]-[BUTTONTEXT]" on buttons in notification banners
         * Sets data-banner="banner-[NAME]-close" on notification banner close buttons
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        notifications: (scope?: HTMLElement) => void;
        /**
         * Sets data-search="pagination-more" on "load more" links
         * Sets data-search="pagination-[LINKTEXT]" on pagination links
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        pagination: (scope?: HTMLElement) => void;
        /**
         * Sets data-banner="banner-[NAME]-link" on links in phase banners
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        phaseBanners: (scope?: HTMLElement) => void;
        /**
         * Sets data-form="radio-[NAME]-[ID]" on radio buttons
         * Sets data-value="[ID]" on radio buttons
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        radios: (scope?: HTMLElement) => void;
        /**
         * Sets data-button="button-filter-[SLUG]-remove" on search facet buttons
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        searchFacets: (scope?: HTMLElement) => void;
        /**
         * Sets data-search="search-promoted-[INDEX+1]/[TOTALPROMOTED]" on promoted results
         * Sets data-search="search-result-[INDEX+1]" on search results
         * Sets data-search="search-image-[INDEX+1]" on images in search results
         * Sets data-search="search-parent-link-[INDEX+1]" on search result context links
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        searchResults: (scope?: HTMLElement) => void;
        /**
         * Sets data-search="suggestion-result=[INDEX+1]/[TOTALSUGGESTIONS]" on search suggestions
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        searchSuggestions: (scope?: HTMLElement) => void;
        /**
         * Sets data-search="search-related-[INDEX+1]/[TOTALLINKS]" on related search items
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        searchRelated: (scope?: HTMLElement) => void;
        /**
         * Sets data-form="select=[ID]" on select components
         * Sets data-form="select-[ID]-[value]" on options
         * Adds an event listener to push change events to the data layer
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        selects: (scope?: HTMLElement) => void;
        /**
         * Sets data-navigation="sequential-previous" on previous links
         * Sets data-navigation="sequential-previous" on next links
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        sequentialNavs: (scope?: HTMLElement) => void;
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
        sideNavs: (scope?: HTMLElement) => void;
        /**
         * Sets data-header="header-logo" on brand/logo link
         * Sets data-header="header-title" on site title link
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        siteBranding: (scope?: HTMLElement) => void;
        /**
         * Sets data-footer="footer-logo" on footer org logo link(s)
         * Sets data-footer="footer-copyright" on footer copyright link(s)
         * Sets data-footer="footer-link-[INDEX+1]" on footer utility links
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        siteFooter: (scope?: HTMLElement) => void;
        /**
         * Sets data-device attribute on site nav links, value either 'mobile' and 'desktop'
         * Sets data-header="header-link-[INDEX+1]" on site nav links
         * Sets data-header="header-menu-toggle" on the site nav open/close button
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        siteNavigation: (scope?: HTMLElement) => void;
        /**
         * Sets data-navigation="skip-link-[INDEX+1]" on links in skip links components
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        skipLinks: (scope?: HTMLElement) => void;
        /**
         * Sets data-navigation="partof-sidebar" on stepnav sidebar links
         * Sets data-navigation="partof-header" on stepnav header links
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        stepNavigation: (scope?: HTMLElement) => void;
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
        summaryCard: (scope?: HTMLElement) => void;
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
        summaryList: (scope?: HTMLElement) => void;
        /**
         * Sets data-navigation="tab-link-[TABSET]-[LINKINDEX+1]" on tabs
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        tabs: (scope?: HTMLElement) => void;
        /**
         * Sets data-navigation="tasklist" on links in task lists
         * Sets data-navigation="tasklist-skip" on skip links in task lists
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        taskList: (scope?: HTMLElement) => void;
        /**
         * Sets data-form="[TYPE]input-[ID]" on text input components
         * e.g. data-form="textinput-foo", data-form="numberinput-bar"
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        textInputs: (scope?: HTMLElement) => void;
        /**
         * Sets data-form="textarea-[ID]" on textarea components
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        textareas: (scope?: HTMLElement) => void;
        /**
         * Sets data-navigation="warning-link" attributes on links within warning text components
         *
         * @param {HTMLElement} scope - the element to initialize tracking on
         * @returns {void}
         */
        warningTexts: (scope?: HTMLElement) => void;
    };
};
export default tracking;
