'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const temporary_focus_1 = __importDefault(require("../../base/tools/temporary-focus/temporary-focus"));
/**
 * Skip links component
 */
const skipLinks = {
    /**
     * Initialise skip links
     * - adds click event to skip links to focus target element
     *
     * @returns {void}
     */
    init() {
        [].slice.call(document.querySelectorAll('.ds_skip-links__link')).forEach((link) => {
            link.addEventListener('click', () => {
                const linkTarget = document.querySelector(link.getAttribute('href'));
                if (linkTarget) {
                    (0, temporary_focus_1.default)(linkTarget);
                }
            });
        });
    }
};
exports.default = skipLinks;
