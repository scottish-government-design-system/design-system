import DS from './index';

declare global {
    interface Window { DS: typeof DS }
}

window.DS = DS;
