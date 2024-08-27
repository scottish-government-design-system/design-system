class TokenList {
    constructor(string) {
        if (string && string.trim().length > 0) {
            this.tokens = string.replace(/\s+/g, ' ').split(' ');
        } else {
            this.tokens = [];
        }
    }

    add(itemsToAdd) {
        // if supplied as space-separated list, convert to array
        if (typeof itemsToAdd === 'string') {
            itemsToAdd = itemsToAdd.replace(/\s+/g, ' ').split(' ');
        }

        itemsToAdd.forEach(item => {
            if (!this.tokens.includes(item)) {
                this.tokens.push(item);
            }
        });

        return this.value();
    }

    remove(string) {
        const itemsToRemove = string.replace(/\s+/g, ' ').split(' ');

        itemsToRemove.forEach(item => {
            if (this.tokens.includes(item)) {
                this.tokens.splice(this.tokens.indexOf(item), 1);
            }
        });

        return this.value();
    }

    contains(string) {
        return this.tokens.includes(string);
    }

    value() {
        return this.tokens.join(' ').trim();
    }
}

export default TokenList;
