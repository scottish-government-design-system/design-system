"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const accordion_1 = __importDefault(require("./accordion/accordion"));
const autocomplete_1 = __importDefault(require("./autocomplete/autocomplete"));
const back_to_top_1 = __importDefault(require("./back-to-top/back-to-top"));
const character_count_1 = __importDefault(require("./character-count/character-count"));
const checkboxes_1 = __importDefault(require("./checkbox/checkboxes"));
const cookie_notification_1 = __importDefault(require("./cookie-notification/cookie-notification"));
const date_picker_1 = __importDefault(require("./date-picker/date-picker"));
const details_1 = __importDefault(require("./details/details"));
const hide_this_page_1 = __importDefault(require("./hide-this-page/hide-this-page"));
const notification_banner_1 = __importDefault(require("./notification-banner/notification-banner"));
const side_navigation_1 = __importDefault(require("./side-navigation/side-navigation"));
const site_navigation_1 = __importDefault(require("./site-navigation/site-navigation"));
const skip_links_1 = __importDefault(require("./skip-links/skip-links"));
const step_navigation_1 = __importDefault(require("./step-navigation/step-navigation"));
const table_1 = __importStar(require("./table/table"));
const tabs_1 = __importDefault(require("./tabs/tabs"));
const tabs_navigation_1 = __importDefault(require("./tabs/tabs-navigation"));
exports.default = {
    Accordion: accordion_1.default,
    Autocomplete: autocomplete_1.default,
    BackToTop: back_to_top_1.default,
    CharacterCount: character_count_1.default,
    Checkboxes: checkboxes_1.default,
    CookieNotification: cookie_notification_1.default,
    DatePicker: date_picker_1.default,
    Details: details_1.default,
    HideThisPage: hide_this_page_1.default,
    NotificationBanner: notification_banner_1.default,
    SideNavigation: side_navigation_1.default,
    SiteNavigation: site_navigation_1.default,
    skipLinks: skip_links_1.default,
    StepNavigation: step_navigation_1.default,
    MobileTables: table_1.default,
    MobileTable: table_1.MobileTable,
    Tabs: tabs_1.default,
    TabsNavigation: tabs_navigation_1.default
};
