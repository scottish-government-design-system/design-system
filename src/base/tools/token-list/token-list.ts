'use strict';

/**
 * Token list
 *
 * @class TokenList
 * @extends DSComponent
 * @property {Array<string>} tokens - array of tokens
 */
class TokenList {
    private tokens: Array<string>;

    /**
     * TokenList is a rough equivalent of DOMTokenList for managing a space-separated list of strings.
     *
     * @param {string} tokens
     */
    constructor(tokens: string) {
        if (tokens && tokens.trim().length > 0) {
            this.tokens = tokens.replace(/\s+/g, ' ').split(' ');
        } else {
            this.tokens = [];
        }
    }

    /**
     * Add one or more strings to the token list
     *
     * @param {string | Array<string>} itemsToAdd - space-separated list or array of strings to add
     * @returns {string} - updated value of the token list
     */
    add(itemsToAdd: string | Array<string>): string {
        // if supplied as space-separated list, convert to array
        if (typeof itemsToAdd === 'string') {
            itemsToAdd = itemsToAdd.replace(/\s+/g, ' ').split(' ');
        }

        itemsToAdd.forEach(item => {
            if (!this.tokens.includes(item)) {
                this.tokens.push(item);
            }
        });

        return this.value;
    }

    /**
     * Remove one or more strings from the token list
     *
     * @param {string} tokens - space-separated list of strings to remove
     * @returns {string} - updated value of the token list
     */
    remove(tokens: string): string {
        const itemsToRemove = tokens.replace(/\s+/g, ' ').split(' ');

        itemsToRemove.forEach(item => {
            if (this.tokens.includes(item)) {
                this.tokens.splice(this.tokens.indexOf(item), 1);
            }
        });

        return this.value;
    }

    /**
     * Check if the token list contains a specific string
     *
     * @param {string} token - string to check for
     * @returns {boolean}
     */
    contains(token: string): boolean {
        return this.tokens.includes(token);
    }

    /**
     * Get the current value of the token list as a space-separated string
     *
     * @returns {string}
     */
    get value(): string {
        return this.tokens.join(' ').trim();
    }
}

export default TokenList;
