import DSComponent from '../../base/component/component';
type AutocompleteOptionsArgs = {
    minLength?: number;
    suggestionMappingFunction?: (suggestions: object[]) => SuggestionArgs[];
    throttleDelay?: number;
};
type SuggestionArgs = {
    displayText: string;
    isActive?: boolean;
};
/**
 * Autocomplete component
 *
 * @class Autocomplete
 * @extends DSComponent
 * @property {SuggestionArgs} activeSuggestion - the currently active suggestion
 * @property {string} endpointUrl - the URL of the autocomplete suggestions endpoint
 * @property {HTMLInputElement} inputElement - the input element for autocomplete
 * @property {number} keypressTimeout - the timeout ID for keypress throttling
 * @property {HTMLElement} listBoxElement - the list box element containing suggestions
 * @property {number} minLength - the minimum length of input to trigger suggestions
 * @property {Function} PromiseRequest - the function to make promise-based requests
 * @property {number} selectedSuggestion - the index of the currently selected suggestion
 * @property {HTMLElement} statusElement - the status element for screen reader updates
 * @property {number} statusTimeout - the timeout ID for status updates
 * @property {SuggestionArgs[]} suggestions - the array of current suggestions
 * @property {Function} suggestionMappingFunction - the function to map raw suggestions to Suggestion objects
 * @property {string} tempToggleCharacter - a temporary character to toggle status updates
 * @property {number} throttleDelay - the delay in milliseconds for throttling input
 */
declare class Autocomplete extends DSComponent {
    private activeSuggestion?;
    private endpointUrl;
    private inputElement;
    private keypressTimeout;
    private listBoxElement;
    private minLength;
    private PromiseRequest;
    private selectedSuggestion?;
    private statusElement;
    private statusTimeout;
    private suggestions;
    private suggestionMappingFunction;
    private tempToggleCharacter;
    private throttleDelay;
    /**
     * Creates an autocomplete component
     *
     * @param {HTMLElement} element - the autocomplete element
     * @param {string} endpointUrl - the URL of the autocomplete suggestions endpoint
     * @param {AutocompleteOptionsArgs} options - the autocomplete options
     */
    constructor(element: HTMLElement, endpointUrl: string, options?: AutocompleteOptionsArgs);
    /**
     * Initialise the autocomplete component
     * - bind event listeners to the input element
     * - fetch and display suggestions
     * - manage selection and acceptance of suggestions
     * - update status for screen readers
     * - handle keyboard and mouse interactions
     *
     * @returns {void}
     */
    init(): void;
    /**
     * Accept the selected suggestion
     * - updates the input element value
     * - sets data attributes for tracking
     * - clears the suggestions
     *
     * @returns {void}
     */
    private acceptSelectedSuggestion;
    /**
     * Build the HTML for a suggestion
     * - creates a span element with the suggestion text
     *
     * @param {string} suggestionHtml - the HTML content for the suggestion
     * @returns {string} - the HTML string for the suggestion
     */
    private buildSuggestionHtml;
    /**
     * Clear the search input
     * - clears the suggestions
     *
     * @returns {void}
     */
    private clearSearch;
    /**
     * Clear the suggestions
     * - removes all suggestions from the list box
     * - resets the input element state
     * - updates the status element
     * - clears the active suggestion
     *
     * @returns {void}
     */
    private clearSuggestions;
    /**
     * Fetch suggestions from the endpoint
     * - sends a request to the endpoint with the search term
     * - maps the results using the suggestion mapping function
     *
     * @param {string}searchTerm - the term to search for
     * @returns {Promise<void | SuggestionArgs[]>} - a promise that resolves to an array of suggestions
     */
    private fetchSuggestions;
    /**
     * Select a suggestion
     * - highlights the suggestion at the given index
     * - updates the input element state
     * - updates the active suggestion
     *
     * @param {number} selectionIndex - the index of the suggestion to select
     * @returns {void}
     */
    private selectSuggestion;
    /**
     * Show the suggestions
     * - renders the suggestions into the list box
     * - highlights matching text
     * - updates the input element state
     *
     * @param {SuggestionArgs[]} suggestions - the suggestions to show
     * @returns {void}
     */
    private showSuggestions;
    /**
     * Update the status
     * - Throttle updates to avoid overwhelming screen readers
     *
     * @param {number} suggestionCount - the number of suggestions
     * @param {number} delay - the delay in milliseconds
     * @returns {void}
     */
    private updateStatus;
    /**
     * Update the status text
     *
     * @param {string} text - the text to update the status with
     * @returns {void}
     */
    private updateStatusText;
    /**
     * Simple modulo function that handles negative numbers correctly
     *
     * @param {number} a - the dividend
     * @param {number} b - the divisor
     * @returns {number} - the result of a mod b
     */
    private modulo;
}
export default Autocomplete;
