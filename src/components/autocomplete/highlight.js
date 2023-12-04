function highlight(element, pattern, options) {
    const defaults = {
        tagName: 'MARK'
    };

    options = Object.assign({}, defaults, options);

    function highlightTextNode(textNode) {
        if (!textNode.data) {
            return false;
        }

        let match, patternNode, wrapperNode;

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

    function traverse(element) {
        let childNode, TEXT_NODE_TYPE = 3;

        for (let i = 0; i < element.childNodes.length; i++) {
            childNode = element.childNodes[i];

            if (childNode.nodeType === TEXT_NODE_TYPE) {
                i += highlightTextNode(childNode, pattern) ? 1 : 0;
            }

            else {
                traverse(childNode, highlightTextNode);
            }
        }
    }

    traverse(element);
}

export default highlight;
