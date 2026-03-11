'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
/**
 * Generates a unique ID modifier string.
 * - Increments a global counter stored on the window object
 * - Returns a string in the format 'dsX', where X is the current counter value
 *
 * @returns {string} - the ID modifier string
 */
function default_1() {
    window.DS = window.DS || {};
    window.DS.elementIdModifier = window.DS.elementIdModifier || 0;
    window.DS.elementIdModifier += 1;
    return `ds${window.DS.elementIdModifier}`;
}
;
