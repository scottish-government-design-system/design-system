'use strict';

const PromiseRequest = function (
    url: string,
    method: 'GET' | 'POST' = 'GET'
) {
    const request = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
        request.onreadystatechange = () => {
            if (request.readyState !== 4) {
                return;
            }

            /* v8 ignore if -- @preserve */
            if (request.status >= 200 && request.status < 300) {
                resolve(request);
            } else {
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

export default PromiseRequest;
