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

    function traverse(element: Node) {
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
