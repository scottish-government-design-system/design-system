export default class DSComponent {
    #element: HTMLElement;
    #isInitialised: boolean = false;

    constructor(element: HTMLElement) {
        this.#element = element;
        if (this.#element) this.#element.classList.add('js-instantiated');
        this.#isInitialised = false;
    }

    set isInitialised(initialised: boolean) {
        this.#isInitialised = initialised;
        if (initialised) {
            this.#element.classList.add('js-initialised');
        } else {
            this.#element.classList.remove('js-initialised');
        }
    }

    get isInitialised() {
        return this.#isInitialised
    }
}
