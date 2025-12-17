'use strict';

/**
 * Generates a unique ID modifier string.
 * - Increments a global counter stored on the window object
 * - Returns a string in the format 'dsX', where X is the current counter value
 *
 * @returns {string} - the ID modifier string
 */
export default function (): string {
    // @ts-expect-error window type
    window.DS = window.DS || {};
    window.DS.elementIdModifier = window.DS.elementIdModifier || 0;
    window.DS.elementIdModifier += 1;
    return `ds${window.DS.elementIdModifier}`;
};
