import { initAll } from './all/all';
import base from './base/index';
import components from './components/index';
import forms from './forms/index';
import version from './version';

export default {
    base,
    components,
    forms,
    version,
    initAll: initAll,
    tracking: base.tools.tracking,
    elementIdModifier: 0
};
