import Accordion from './components/accordion/accordion';
import CollapsibleSearchBox from './components/site-search/site-search';
import CharacterCount from './forms/character-count/character-count';
import DSDatePicker from './components/date-picker/date-picker';
import MobileMenu from './components/site-navigation/site-navigation';
import NotificationBanner from './components/notification-banner/notification-banner';
import SideNavigation from './components/side-navigation/side-navigation';
import QuickExit from './components/quick-exit/quick-exit';
import MobileTables from './components/table/table';

// Similar to gov.uk approach, allow DS to be applied in a more targeted way than the whole document if needed
// defaults to document
function initAll(scope = document) {
    const accordions = [].slice.call(scope.querySelectorAll('[data-module="ds-accordion"]'));
    accordions.forEach(accordion => new Accordion(accordion).init());

    const characterCountModules = [].slice.call(scope.querySelectorAll('[data-module="ds-character-count"]'));
    // const characterCountElements = [].slice.call(scope.querySelectorAll('input[maxlength], textarea[maxlength]'));
    // characterCountElements.forEach(element => characterCountModules.push(element.parentNode));
    characterCountModules.forEach(characterCount => new CharacterCount(characterCount).init());

    const datePickers = [].slice.call(document.querySelectorAll('[data-module="ds-datepicker"]'));
    datePickers.forEach(datePicker => new DSDatePicker(datePicker).init());

    const mobileMenus = [].slice.call(scope.querySelectorAll('[data-module="ds-mobile-navigation-menu"]'));
    mobileMenus.forEach(mobileMenu =>  new MobileMenu(mobileMenu).init());

    const notificationBanners = [].slice.call(scope.querySelectorAll('[data-module="ds-notification"]'));
    notificationBanners.forEach(notificationBanner => new NotificationBanner(notificationBanner).init());

    // this one is handled differently because it applies an event to the whole body and we only want that event once
    const quickExitButtons = [].slice.call(scope.querySelectorAll('.ds_quick-exit'));
    if (quickExitButtons.length) {
        const quickExit = new QuickExit();
        quickExit.init();
    }

    const searchBoxes = [].slice.call(scope.querySelectorAll('[data-module="ds-site-search"]'));
    searchBoxes.forEach(searchBox => new CollapsibleSearchBox(searchBox).init());

    const sideNavigations = [].slice.call(scope.querySelectorAll('[data-module="ds-side-navigation"]'));
    sideNavigations.forEach(sideNavigation => new SideNavigation(sideNavigation).init());

    const tables = [].slice.call(scope.querySelectorAll('table[data-smallscreen]'));
    if (tables.length) {
        const mobileTables = new MobileTables();
        mobileTables.init();
    }
}

export {
    initAll,
    Accordion,
    CharacterCount,
    CollapsibleSearchBox,
    DSDatePicker,
    MobileMenu,
    NotificationBanner,
    QuickExit,
    SideNavigation
};
