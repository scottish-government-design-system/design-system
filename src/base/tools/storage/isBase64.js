export default function (str) {
    if (str ==='' || str.trim() ===''){ return false; }
    try {
        return window.btoa(window.atob(str)) == str;
    } catch (err) {
        return false;
    }
}
