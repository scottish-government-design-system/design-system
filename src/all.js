import Accordion from './components/accordion/accordion';
import CollapsibleSearchBox from './components/site-search/site-search';
import CharacterCount from './forms/character-count/character-count';
import DSDatePicker from './components/date-picker/date-picker';
import MobileMenu from './components/site-navigation/site-navigation';
import NotificationBanner from './components/notification-banner/notification-banner';
import SideNavigation from './components/side-navigation/side-navigation';

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

    const searchBoxes = [].slice.call(scope.querySelectorAll('[data-module="ds-site-search"]'));
    searchBoxes.forEach(searchBox => new CollapsibleSearchBox(searchBox).init());

    const sideNavigations = [].slice.call(scope.querySelectorAll('[data-module="ds-side-navigation"]'));
    sideNavigations.forEach(sideNavigation => new SideNavigation(sideNavigation).init());
}

export {
    initAll,
    Accordion,
    CharacterCount,
    CollapsibleSearchBox,
    DSDatePicker,
    MobileMenu,
    NotificationBanner,
    SideNavigation
};
