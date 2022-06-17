const PromiseRequest = function (url, method = 'GET') {
    const request = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
        request.onreadystatechange = () => {
            if (request.readyState !== 4) {
                return;
            }

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
