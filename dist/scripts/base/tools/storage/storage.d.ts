type CategoryArgs = 'necessary' | 'preferences' | 'statistics' | 'campaigns' | 'marketing';
export type StorageArgs = {
    hasPermission: (category: CategoryArgs) => boolean;
    getIsJsonString: (string: string) => boolean;
    get: (obj: {
        type: string;
        name: string;
    }) => string;
    remove: (obj: {
        type: string;
        name: string;
    }) => void;
    set: (obj: {
        type: string;
        name: string;
        value: string;
        expiresDays?: number;
        category: CategoryArgs;
    }) => void;
    error?: unknown;
    getCookie: (name: string) => void;
    getLocalStorage: (name: string) => void;
    getSessionStorage: (name: string) => void;
    removeCookie: (name: string) => void;
    removeLocalStorage: (name: string) => void;
    removeSessionStorage: (name: string) => void;
    setCookie: (category: CategoryArgs, name: string, value: string, expiresDays: number) => void;
    setLocalStorage: (category: CategoryArgs, name: string, value: string) => void;
    setSessionStorage: (category: CategoryArgs, name: string, value: string) => void;
    unsetCookieWithDomain: (name: string, domain?: string) => void;
    cookie: {
        get: (name: string) => string | null;
        remove: (name: string, _window?: Window) => void;
        set: (name: string, value: string, expiresDays?: number) => void;
    };
};
declare global {
    interface Window {
        storage: StorageArgs;
    }
}
declare const storage: StorageArgs;
export default storage;
