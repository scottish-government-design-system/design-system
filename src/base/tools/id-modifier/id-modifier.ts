'use strict';

export default function () {
    // @ts-expect-error window type
    window.DS = window.DS || {};
    window.DS.elementIdModifier = window.DS.elementIdModifier || 0;
    window.DS.elementIdModifier += 1;
    return `ds${window.DS.elementIdModifier}`;
};
