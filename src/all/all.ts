import DS from '../index';

// Similar to gov.uk approach, allow DS to be applied in a more targeted way than the whole document if needed
// defaults to document
export function initAll(scope = document) {
    const accordionElements = [].slice.call(scope.querySelectorAll('[data-module="ds-accordion"]:not(.js-instantiated)')) as HTMLElement[];
    accordionElements.forEach(accordion => new DS.components.Accordion(accordion).init());

    const backToTopElements = [].slice.call(scope.querySelectorAll('[data-module="ds-back-to-top"]:not(.js-instantiated)')) as HTMLElement[];
    backToTopElements.forEach(backToTop => new DS.components.BackToTop(backToTop).init());

    const characterCountElements = [].slice.call(scope.querySelectorAll('[data-module="ds-character-count"]:not(.js-instantiated)')) as HTMLElement[];
    characterCountElements.forEach(characterCount => new DS.forms.CharacterCount(characterCount).init());

    const checkboxesElements = [].slice.call(scope.querySelectorAll('[data-module="ds-checkboxes"]:not(.js-instantiated)')) as HTMLElement[];
    checkboxesElements.forEach(checkboxes => new DS.forms.Checkboxes(checkboxes).init());

    const cookieNotificationElements = [].slice.call(document.querySelectorAll('[data-module="ds-cookie-notification"]:not(.js-instantiated)')) as HTMLElement[];
    cookieNotificationElements.forEach(cookieNotification => new DS.components.CookieNotification(cookieNotification).init());

    const datePickerElements = [].slice.call(document.querySelectorAll('[data-module="ds-datepicker"]:not(.js-instantiated)')) as HTMLElement[];
    datePickerElements.forEach(datePicker => new DS.components.DatePicker(datePicker).init());

    const detailsElements = [].slice.call(document.querySelectorAll('[data-module="ds-details"]:not(.js-instantiated)')) as HTMLDetailsElement[];
    detailsElements.forEach(details => new DS.components.Details(details).init());

    // this one is handled differently because it applies an event to the whole body and we only want that event once
    const hidePageElements = [].slice.call(scope.querySelectorAll('.ds_hide-page')) as HTMLElement[];
    hidePageElements.forEach(hidePage => new DS.components.HideThisPage(hidePage).init());

    const mobileMenuElements = [].slice.call(scope.querySelectorAll('[data-module="ds-mobile-navigation-menu"]:not(.js-instantiated)')) as HTMLElement[]
    mobileMenuElements.forEach(mobileMenu => new DS.components.SiteNavigation(mobileMenu).init());

    const notificationBannerElements = [].slice.call(scope.querySelectorAll('[data-module="ds-notification"]:not(.js-instantiated)')) as HTMLElement[]
    notificationBannerElements.forEach(notificationBanner => new DS.components.NotificationBanner(notificationBanner).init());

    const sideNavigationElements = [].slice.call(scope.querySelectorAll('[data-module="ds-side-navigation"]:not(.js-instantiated)')) as HTMLElement[]
    sideNavigationElements.forEach(sideNavigation => new DS.components.SideNavigation(sideNavigation).init());

    // skip links doesn't need any special treatment -- just init it
    DS.components.skipLinks.init();

    const stepNavigationElements = [].slice.call(scope.querySelectorAll('[data-module="ds-step-navigation"]:not(.js-instantiated)')) as HTMLElement[];
    stepNavigationElements.forEach(stepNavigation => new DS.components.StepNavigation(stepNavigation).init());

    const tableElements = [].slice.call(scope.querySelectorAll('table[data-smallscreen]')) as HTMLTableElement[];
    tableElements.forEach(table => new DS.components.MobileTable(table).init());

    const tabSetElements = [].slice.call(document.querySelectorAll('[data-module="ds-tabs"]:not(.js-instantiated)')) as HTMLElement[];
    tabSetElements.forEach(tabSet => new DS.components.Tabs(tabSet).init());

    const tabNavigationSetElements = [].slice.call(document.querySelectorAll('[data-module="ds-tabs-navigation"]:not(.js-instantiated)')) as HTMLElement[];
    tabNavigationSetElements.forEach(tabNavigationSet => new DS.components.TabsNavigation(tabNavigationSet).init());

    DS.base.tools.tracking.init();
}
