import Accordion from './accordion/accordion.js';
import CharacterCount from './character-count/character-count.js';
import NotificationBanner from './notification-banner/notification-banner.js';
import SideNavigation from './side-navigation/side-navigation.js';
import MobileMenu from './site-navigation/site-navigation.js';
import CollapsibleSearchBox from './site-search/site-search.js';

const accordions = [].slice.call(document.querySelectorAll('.ds_accordion'));
accordions.forEach(accordion => new Accordion(accordion).init());

const notificationBanners = [].slice.call(document.querySelectorAll('.ds_notification'));
notificationBanners.forEach(notificationBanner => new NotificationBanner(notificationBanner).init());

const sideNavigations = [].slice.call(document.querySelectorAll('.ds_side-navigation'));
sideNavigations.forEach(sideNavigation => new SideNavigation(sideNavigation).init());

const mobileMenus = [].slice.call(document.querySelectorAll('#mobile-navigation-menu'));
mobileMenus.forEach(mobileMenu =>  new MobileMenu(mobileMenu).init());

const searchBoxes = [].slice.call(document.querySelectorAll('.ds_site-search--collapsible'));
searchBoxes.forEach(searchBox => new CollapsibleSearchBox(searchBox).init());
