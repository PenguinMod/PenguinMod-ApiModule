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
                        return reject(safeParseJSON(text), response.status);
                    }
                    return reject(text, response.status);
                }).catch(err => {
                    reject(err, response.status)
                });
            }
        }).catch(reject);
    });
};

module.exports = {
    safeParseJSON,
    doBasicRequest,
};
