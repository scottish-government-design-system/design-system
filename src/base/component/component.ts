export default class DSComponent {
    #element: HTMLElement;
    #isInitialised: boolean = false;

    constructor(element: HTMLElement) {
        this.#element = element;
        this.#isInitialised = false;
    }

    set isInitialised(initialised: boolean) {
        this.#isInitialised = initialised;
        initialised ? this.#element.classList.add('js-initialised') : this.#element.classList.remove('js-initialised');
    }

    get isInitialised() {
        return this.#isInitialised
    }
}
