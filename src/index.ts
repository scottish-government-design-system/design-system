import { initAll } from './all/all';
import base from './base/index';
import components from './components/index';
import forms from './forms/index';
import version from './version';

const DS = {
    base,
    components,
    forms,
    version,
    initAll: initAll,
    tracking: base.tools.tracking,
    elementIdModifier: 0
};

export default DS;

export type DSArgs = typeof DS;

declare global {
    interface Window { DS: DSArgs }
};

window.DS = DS;
