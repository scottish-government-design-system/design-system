import { initAll } from './all/all';
import base from './base/index';
import components from './components/index';
import version from './version';

const DS = {
    base,
    components,
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
