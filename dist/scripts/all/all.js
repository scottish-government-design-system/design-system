"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAll = initAll;
const index_1 = __importDefault(require("../index"));
// Similar to gov.uk approach, allow DS to be applied in a more targeted way than the whole document if needed
// defaults to document
function initAll(scope = document) {
    const accordionElements = [].slice.call(scope.querySelectorAll('[data-module="ds-accordion"]:not(.js-instantiated)'));
    accordionElements.forEach(accordion => new index_1.default.components.Accordion(accordion).init());
    const backToTopElements = [].slice.call(scope.querySelectorAll('[data-module="ds-back-to-top"]:not(.js-instantiated)'));
    backToTopElements.forEach(backToTop => new index_1.default.components.BackToTop(backToTop).init());
    const characterCountElements = [].slice.call(scope.querySelectorAll('[data-module="ds-character-count"]:not(.js-instantiated)'));
    characterCountElements.forEach(characterCount => new index_1.default.components.CharacterCount(characterCount).init());
    const checkboxesElements = [].slice.call(scope.querySelectorAll('[data-module="ds-checkboxes"]:not(.js-instantiated)'));
    checkboxesElements.forEach(checkboxes => new index_1.default.components.Checkboxes(checkboxes).init());
    const cookieNotificationElements = [].slice.call(document.querySelectorAll('[data-module="ds-cookie-notification"]:not(.js-instantiated)'));
    cookieNotificationElements.forEach(cookieNotification => new index_1.default.components.CookieNotification(cookieNotification).init());
    const datePickerElements = [].slice.call(document.querySelectorAll('[data-module="ds-datepicker"]:not(.js-instantiated)'));
    datePickerElements.forEach(datePicker => new index_1.default.components.DatePicker(datePicker).init());
    const detailsElements = [].slice.call(document.querySelectorAll('[data-module="ds-details"]:not(.js-instantiated)'));
    detailsElements.forEach(details => new index_1.default.components.Details(details).init());
    // this one is handled differently because it applies an event to the whole body and we only want that event once
    const hidePageElements = [].slice.call(scope.querySelectorAll('.ds_hide-page'));
    hidePageElements.forEach(hidePage => new index_1.default.components.HideThisPage(hidePage).init());
    const mobileMenuElements = [].slice.call(scope.querySelectorAll('[data-module="ds-mobile-navigation-menu"]:not(.js-instantiated)'));
    mobileMenuElements.forEach(mobileMenu => new index_1.default.components.SiteNavigation(mobileMenu).init());
    const notificationBannerElements = [].slice.call(scope.querySelectorAll('[data-module="ds-notification"]:not(.js-instantiated)'));
    notificationBannerElements.forEach(notificationBanner => new index_1.default.components.NotificationBanner(notificationBanner).init());
    const sideNavigationElements = [].slice.call(scope.querySelectorAll('[data-module="ds-side-navigation"]:not(.js-instantiated)'));
    sideNavigationElements.forEach(sideNavigation => new index_1.default.components.SideNavigation(sideNavigation).init());
    // skip links doesn't need any special treatment -- just init it
    index_1.default.components.skipLinks.init();
    const stepNavigationElements = [].slice.call(scope.querySelectorAll('[data-module="ds-step-navigation"]:not(.js-instantiated)'));
    stepNavigationElements.forEach(stepNavigation => new index_1.default.components.StepNavigation(stepNavigation).init());
    const tableElements = [].slice.call(scope.querySelectorAll('table[data-smallscreen]'));
    tableElements.forEach(table => new index_1.default.components.MobileTable(table).init());
    const tabSetElements = [].slice.call(document.querySelectorAll('[data-module="ds-tabs"]:not(.js-instantiated)'));
    tabSetElements.forEach(tabSet => new index_1.default.components.Tabs(tabSet).init());
    const tabNavigationSetElements = [].slice.call(document.querySelectorAll('[data-module="ds-tabs-navigation"]:not(.js-instantiated)'));
    tabNavigationSetElements.forEach(tabNavigationSet => new index_1.default.components.TabsNavigation(tabNavigationSet).init());
    index_1.default.base.tools.tracking.init();
}
