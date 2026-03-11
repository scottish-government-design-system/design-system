'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const PromiseRequest = function (url, method = 'GET') {
    const request = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
        request.onreadystatechange = () => {
            if (request.readyState !== 4) {
                return;
            }
            /* v8 ignore if -- @preserve */
            if (request.status >= 200 && request.status < 300) {
                resolve(request);
            }
            else {
                reject({
                    status: request.status,
                    statusText: request.statusText
                });
            }
        };
        request.open(method, url, true);
        request.send();
    });
};
exports.default = PromiseRequest;
