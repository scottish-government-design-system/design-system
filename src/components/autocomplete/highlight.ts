type HighlightOptions = {
    className?: string;
    tagName?: string;
}

function highlight(element: HTMLElement, pattern: string, options: HighlightOptions) {
    const defaults = {
        tagName: 'MARK'
    };

    options = Object.assign({}, defaults, options);

    function highlightTextNode(textNode: Text, pattern: string) {
        if (!textNode.data || pattern === '') {
            return false;
        }

        let match: RegExpExecArray, patternNode: Text, wrapperNode: HTMLElement;

        let regex = new RegExp(pattern, 'i');

        if (match = regex.exec(textNode.data)) {
            wrapperNode = document.createElement(options.tagName);
            options.className && (wrapperNode.className = options.className);

            patternNode = textNode.splitText(match.index);
            patternNode.splitText(match[0].length);
            wrapperNode.appendChild(patternNode.cloneNode(true));

            textNode.parentNode.replaceChild(wrapperNode, patternNode);
        }

        return !!match;
    }

    function traverse(element: Node) {
        let childNode: Node, TEXT_NODE_TYPE = 3;

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
