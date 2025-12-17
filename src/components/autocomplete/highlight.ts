type HighlightOptions = {
    className?: string;
    tagName?: string;
}

/**
 * Highlight matching text in an element
 *
 * @param {HTMLElement} element - the element to highlight
 * @param {string} pattern - the pattern to match
 * @param {HighlightOptions} options - the highlight options
 * @returns {void}
 */
function highlight(element: HTMLElement, pattern: string, options: HighlightOptions): void {
    const defaults = {
        tagName: 'MARK'
    };

    options = Object.assign({}, defaults, options);

    /**
     * Highlight matching text in a text node
     *
     * @param {Text} textNode - the text node to highlight
     * @param {string} pattern - the pattern to match
     * @returns {boolean}
     */
    function highlightTextNode(textNode: Text, pattern: string): boolean {
        if (!textNode.data || pattern === '') {
            return false;
        }

        let patternNode: Text
        let wrapperNode: HTMLElement;

        const regex = new RegExp(pattern, 'i');
        const match = regex.exec(textNode.data);

        if (match) {
            wrapperNode = document.createElement(options.tagName);

            if (options.className) {
                wrapperNode.className = options.className;
            }

            patternNode = textNode.splitText(match.index);
            patternNode.splitText(match[0].length);
            wrapperNode.appendChild(patternNode.cloneNode(true));

            textNode.parentNode.replaceChild(wrapperNode, patternNode);
        }

        return !!match;
    }

    /**
     * Traverse the element and highlight matching text nodes
     *
     * @param {Node} element - the element to traverse
     * @returns {void}
     */
    function traverse(element: Node): void {
        let childNode: Node;
        const TEXT_NODE_TYPE = 3;

        for (let i = 0; i < element.childNodes.length; i++) {
            childNode = element.childNodes[i];

            if (childNode.nodeType === TEXT_NODE_TYPE) {
                i += highlightTextNode(childNode as Text, pattern) ? 1 : 0;
            }

            else {
                traverse(childNode);
            }
        }
    }

    traverse(element);
}

export default highlight;
