"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DSComponent {
    #element;
    #isInitialised = false;
    constructor(element) {
        this.#element = element;
        if (this.#element)
            this.#element.classList.add('js-instantiated');
        this.#isInitialised = false;
    }
    set isInitialised(initialised) {
        this.#isInitialised = initialised;
        if (initialised) {
            this.#element.classList.add('js-initialised');
        }
        else {
            this.#element.classList.remove('js-initialised');
        }
    }
    get isInitialised() {
        return this.#isInitialised;
    }
}
exports.default = DSComponent;
