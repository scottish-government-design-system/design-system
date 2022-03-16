import Autocomplete from './components/autocomplete/autocomplete';
import Accordion from './components/accordion/accordion';
import BackToTop from './components/back-to-top/back-to-top';
import CharacterCount from './forms/character-count/character-count';
import CookieNotification from './components/cookie-notification/cookie-notification';
import DSDatePicker from './components/date-picker/date-picker';
import HidePage from './components/hide-this-page/hide-this-page';
import MobileMenu from './components/site-navigation/site-navigation';
import MobileTables from './components/table/table';
import NotificationBanner from './components/notification-banner/notification-banner';
import SideNavigation from './components/side-navigation/side-navigation';
import skipLinks from './components/skip-links/skip-links';

import tracking from './base/tools/tracking/tracking';
import aspectBoxFallback from './components/aspect-box/aspect-box-fallback';

const components = {
    Accordion,
    Autocomplete,
    BackToTop,
    CharacterCount,
    CookieNotification,
    DSDatePicker,
    HidePage,
    MobileMenu,
    MobileTables,
    NotificationBanner,
    SideNavigation,
    skipLinks
};

// Similar to gov.uk approach, allow DS to be applied in a more targeted way than the whole document if needed
// defaults to document
function initAll(scope = document) {

    const accordions = [].slice.call(scope.querySelectorAll('[data-module="ds-accordion"]'));
    accordions.forEach(accordion => new Accordion(accordion).init());

    const backToTopEl = scope.querySelector('[data-module="ds-back-to-top"]');
    if (backToTopEl) {
        const backToTop = new BackToTop(backToTopEl);
        backToTop.init();
    }

    const characterCountModules = [].slice.call(scope.querySelectorAll('[data-module="ds-character-count"]'));
    characterCountModules.forEach(characterCount => new CharacterCount(characterCount).init());

    const cookieNotificationEl = document.querySelector('[data-module="ds-cookie-notification"]');
    if (cookieNotificationEl) {
        const cookieNotification = new CookieNotification(cookieNotificationEl);
        cookieNotification.init();
    }

    const datePickers = [].slice.call(document.querySelectorAll('[data-module="ds-datepicker"]'));
    datePickers.forEach(datePicker => new DSDatePicker(datePicker).init());

    // this one is handled differently because it applies an event to the whole body and we only want that event once
    const hidePageButtons = [].slice.call(scope.querySelectorAll('.ds_hide-page'));
    if (hidePageButtons.length) {
        const hidePage = new HidePage();
        hidePage.init();
    }

    const mobileMenus = [].slice.call(scope.querySelectorAll('[data-module="ds-mobile-navigation-menu"]'));
    mobileMenus.forEach(mobileMenu =>  new MobileMenu(mobileMenu).init());

    const notificationBanners = [].slice.call(scope.querySelectorAll('[data-module="ds-notification"]'));
    notificationBanners.forEach(notificationBanner => new NotificationBanner(notificationBanner).init());

    const sideNavigations = [].slice.call(scope.querySelectorAll('[data-module="ds-side-navigation"]'));
    sideNavigations.forEach(sideNavigation => new SideNavigation(sideNavigation).init());

    // skip links doesn't need any special treatment -- just init it
    skipLinks.init();

    const tables = [].slice.call(scope.querySelectorAll('table[data-smallscreen]'));
    if (tables.length) {
        const mobileTables = new MobileTables();
        mobileTables.init();
    }

    tracking.init();
    aspectBoxFallback();
}

window.DS = window.DS || {};
window.DS.components = components;
window.DS.tracking = tracking;
window.DS.initAll = initAll;

export {
    initAll,
    Accordion,
    Autocomplete,
    BackToTop,
    CharacterCount,
    CookieNotification,
    DSDatePicker,
    HidePage,
    MobileMenu,
    MobileTables,
    NotificationBanner,
    SideNavigation,
    skipLinks
};
