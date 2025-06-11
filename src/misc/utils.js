const safeParseJSON = (possibleJson, forceObject) => {
    try {
        return JSON.parse(possibleJson);
    } catch {
        if (forceObject) {
            return {};
        }
        return possibleJson;
    }
};

/**
 * @param {string} url 
 * @param {RequestInit} options 
 * @param {boolean} doResolve If true, when the response is OK, the Response object will be returned.
 * @param {boolean} json Whether to parse as JSON or not. If the JSON is invalid, the text will be returned.
 */
const doBasicRequest = (url, options, doResolve, json) => {
    return new Promise((resolve, reject) => {
        fetch(url, options).then(response => {
            if (response.ok) {
                if (!doResolve) {
                    return resolve(response);
                }

                response.text().then(text => {
                    if (json) {
                        return resolve(safeParseJSON(text));
                    }
                    return resolve(text);
                }).catch(reject);
            } else {
                response.text().then(text => {
                    if (json) {
                        return reject(safeParseJSON(text));
                    }
                    return reject(text);
                }).catch(err => {
                    reject(err);
                });
            }
        }).catch(reject);
    });
};

module.exports = {
    safeParseJSON,
    doBasicRequest,
};
