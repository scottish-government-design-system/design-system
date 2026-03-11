import { initAll } from './all/all';
declare const DS: {
    base: {
        tools: {
            idModifier: typeof import("./base/tools/id-modifier/id-modifier").default;
            PromiseRequest: (url: string, method?: "GET" | "POST") => Promise<unknown>;
            storage: import("./base/tools/storage/storage").StorageArgs;
            temporaryFocus: typeof import("./base/tools/temporary-focus/temporary-focus").default;
            TokenList: typeof import("./base/tools/token-list/token-list").default;
            tracking: {
                hasAddedCanonicalUrl: boolean;
                hasAddedClickTracking: boolean;
                hasAddedPrefersColorScheme: boolean;
                hasAddedVersion: boolean;
                init: (scope?: HTMLElement) => void;
                gatherElements: (className: string, scope: HTMLElement) => HTMLElement[];
                getClickType: (event: MouseEvent) => string | undefined;
                getNearestSectionHeader: (element: HTMLElement) => Element | undefined;
                pushToDataLayer: (data: {
                    [key: string]: string | number | undefined;
                }) => void;
                add: {
                    clicks: (scope?: HTMLElement) => void;
                    canonicalUrl: () => void;
                    prefersColorScheme: () => void;
                    version: () => void;
                    accordions: (scope?: HTMLElement) => void;
                    asides: (scope?: HTMLElement) => void;
                    autocompletes: (scope?: HTMLElement) => void;
                    backToTop: (scope?: HTMLElement) => void;
                    breadcrumbs: (scope?: HTMLElement) => void;
                    buttons: (scope?: HTMLElement) => void;
                    cards: (scope?: HTMLElement) => void;
                    categoryLists: (scope?: HTMLElement) => void;
                    checkboxes: (scope?: HTMLElement) => void;
                    confirmationMessages: (scope?: HTMLElement) => void;
                    contactDetails: (scope?: HTMLElement) => void;
                    contentNavs: (scope?: HTMLElement) => void;
                    details: (scope?: HTMLElement) => void;
                    errorMessages: (scope?: HTMLElement) => void;
                    errorSummaries: (scope?: HTMLElement) => void;
                    externalLinks: (scope?: HTMLElement) => void;
                    hideThisPage: (scope?: HTMLElement) => void;
                    insetTexts: (scope?: HTMLElement) => void;
                    links: () => void;
                    metadataItems: (scope?: HTMLElement) => void;
                    notifications: (scope?: HTMLElement) => void;
                    pagination: (scope?: HTMLElement) => void;
                    phaseBanners: (scope?: HTMLElement) => void;
                    radios: (scope?: HTMLElement) => void;
                    searchFacets: (scope?: HTMLElement) => void;
                    searchResults: (scope?: HTMLElement) => void;
                    searchSuggestions: (scope?: HTMLElement) => void;
                    searchRelated: (scope?: HTMLElement) => void;
                    selects: (scope?: HTMLElement) => void;
                    sequentialNavs: (scope?: HTMLElement) => void;
                    sideNavs: (scope?: HTMLElement) => void;
                    siteBranding: (scope?: HTMLElement) => void;
                    siteFooter: (scope?: HTMLElement) => void;
                    siteNavigation: (scope?: HTMLElement) => void;
                    skipLinks: (scope?: HTMLElement) => void;
                    stepNavigation: (scope?: HTMLElement) => void;
                    summaryCard: (scope?: HTMLElement) => void;
                    summaryList: (scope?: HTMLElement) => void;
                    tabs: (scope?: HTMLElement) => void;
                    taskList: (scope?: HTMLElement) => void;
                    textInputs: (scope?: HTMLElement) => void;
                    textareas: (scope?: HTMLElement) => void;
                    warningTexts: (scope?: HTMLElement) => void;
                };
            };
        };
        utilities: {
            breakpointCheck: typeof import("./base/utilities/breakpoint-check/breakpoint-check").default;
        };
    };
    components: {
        Accordion: typeof import("./components/accordion/accordion").default;
        Autocomplete: typeof import("./components/autocomplete/autocomplete").default;
        BackToTop: typeof import("./components/back-to-top/back-to-top").default;
        CookieNotification: typeof import("./components/cookie-notification/cookie-notification").default;
        DatePicker: typeof import("./components/date-picker/date-picker").default;
        Details: typeof import("./components/details/details").default;
        HideThisPage: typeof import("./components/hide-this-page/hide-this-page").default;
        NotificationBanner: typeof import("./components/notification-banner/notification-banner").default;
        SideNavigation: typeof import("./components/side-navigation/side-navigation").default;
        SiteNavigation: typeof import("./components/site-navigation/site-navigation").default;
        skipLinks: {
            init(): void;
        };
        StepNavigation: typeof import("./components/step-navigation/step-navigation").default;
        MobileTables: typeof import("./components/table/table").default;
        MobileTable: typeof import("./components/table/table").MobileTable;
        Tabs: typeof import("./components/tabs/tabs").default;
        TabsNavigation: typeof import("./components/tabs/tabs-navigation").default;
    };
    forms: {
        CharacterCount: typeof import("./forms/character-count/character-count").default;
        Checkboxes: typeof import("./forms/checkbox/checkboxes").default;
    };
    version: string;
    initAll: typeof initAll;
    tracking: {
        hasAddedCanonicalUrl: boolean;
        hasAddedClickTracking: boolean;
        hasAddedPrefersColorScheme: boolean;
        hasAddedVersion: boolean;
        init: (scope?: HTMLElement) => void;
        gatherElements: (className: string, scope: HTMLElement) => HTMLElement[];
        getClickType: (event: MouseEvent) => string | undefined;
        getNearestSectionHeader: (element: HTMLElement) => Element | undefined;
        pushToDataLayer: (data: {
            [key: string]: string | number | undefined;
        }) => void;
        add: {
            clicks: (scope?: HTMLElement) => void;
            canonicalUrl: () => void;
            prefersColorScheme: () => void;
            version: () => void;
            accordions: (scope?: HTMLElement) => void;
            asides: (scope?: HTMLElement) => void;
            autocompletes: (scope?: HTMLElement) => void;
            backToTop: (scope?: HTMLElement) => void;
            breadcrumbs: (scope?: HTMLElement) => void;
            buttons: (scope?: HTMLElement) => void;
            cards: (scope?: HTMLElement) => void;
            categoryLists: (scope?: HTMLElement) => void;
            checkboxes: (scope?: HTMLElement) => void;
            confirmationMessages: (scope?: HTMLElement) => void;
            contactDetails: (scope?: HTMLElement) => void;
            contentNavs: (scope?: HTMLElement) => void;
            details: (scope?: HTMLElement) => void;
            errorMessages: (scope?: HTMLElement) => void;
            errorSummaries: (scope?: HTMLElement) => void;
            externalLinks: (scope?: HTMLElement) => void;
            hideThisPage: (scope?: HTMLElement) => void;
            insetTexts: (scope?: HTMLElement) => void;
            links: () => void;
            metadataItems: (scope?: HTMLElement) => void;
            notifications: (scope?: HTMLElement) => void;
            pagination: (scope?: HTMLElement) => void;
            phaseBanners: (scope?: HTMLElement) => void;
            radios: (scope?: HTMLElement) => void;
            searchFacets: (scope?: HTMLElement) => void;
            searchResults: (scope?: HTMLElement) => void;
            searchSuggestions: (scope?: HTMLElement) => void;
            searchRelated: (scope?: HTMLElement) => void;
            selects: (scope?: HTMLElement) => void;
            sequentialNavs: (scope?: HTMLElement) => void;
            sideNavs: (scope?: HTMLElement) => void;
            siteBranding: (scope?: HTMLElement) => void;
            siteFooter: (scope?: HTMLElement) => void;
            siteNavigation: (scope?: HTMLElement) => void;
            skipLinks: (scope?: HTMLElement) => void;
            stepNavigation: (scope?: HTMLElement) => void;
            summaryCard: (scope?: HTMLElement) => void;
            summaryList: (scope?: HTMLElement) => void;
            tabs: (scope?: HTMLElement) => void;
            taskList: (scope?: HTMLElement) => void;
            textInputs: (scope?: HTMLElement) => void;
            textareas: (scope?: HTMLElement) => void;
            warningTexts: (scope?: HTMLElement) => void;
        };
    };
    elementIdModifier: number;
};
export default DS;
export type DSArgs = typeof DS;
declare global {
    interface Window {
        DS: DSArgs;
    }
}
