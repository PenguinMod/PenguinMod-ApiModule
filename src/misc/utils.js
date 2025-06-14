const PenguinModAPIError = require("../classes/PenguinModAPIError");

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
 * @typedef {import("../classes/PenguinModAPI")} PenguinModAPI
 */
/**
 * @param {string} url 
 * @param {RequestInit?} options 
 * @param {PenguinModAPI} apiClass Required to add headers.
 * @param {boolean?} doResolve If true, when the response is OK, the Response object will be returned.
 * @param {boolean?} json Whether to parse as JSON or not. If the JSON is invalid, the text will be returned.
 */
const doBasicRequest = (url, options, apiClass, doResolve, json) => {
    if (!apiClass) throw new Error("Provide apiClass to doBasicRequest");
    options = apiClass.injectOptions(options, url);
    if (!options) options = {};
    if (!options.headers) options.headers = {};
    options.headers["PenguinMod-Tooling"] = "PenguinMod-ApiModule";
    
    return new Promise((resolve, reject) => {
        fetch(url, options).then(response => {
            if (response.ok) {
                if (!doResolve) {
                    return resolve(response);
                }

                response.text().then(text => {
                    if (json) {
                        try {
                            return resolve(JSON.parse(text));
                        } catch (err) {
                            const pmError = new PenguinModAPIError("ParseJSONFailed", err, response.status, text, true, url, options, response, err);
                            reject(pmError);
                        }
                    }
                    return resolve(text);
                }).catch((err) => {
                    const pmError = new PenguinModAPIError("ParseTextFailed", err, response.status, null, true, url, options, response, err);
                    reject(pmError);
                });
            } else {
                response.text().then(text => {
                    if (json) {
                        const jsonResp = safeParseJSON(text);
                        const pmError = new PenguinModAPIError(jsonResp && jsonResp.error ? jsonResp.error : PenguinModAPIError.UNKNOWN, text, response.status, jsonResp, false, url, options, response, null);
                        return reject(pmError);
                    }
                    const pmError = new PenguinModAPIError(PenguinModAPIError.UNKNOWN, text, response.status, text, false, url, options, response, null);
                    return reject(pmError);
                }).catch(err => {
                    const pmError = new PenguinModAPIError("ParseTextFailed", err, response.status, null, true, url, options, response, err);
                    reject(pmError);
                });
            }
        }).catch((err) => {
            const pmError = new PenguinModAPIError("FetchFailed", err, PenguinModAPIError.UNKNOWN_CODE, null, false, url, options, null, err);
            reject(pmError);
        });
    });
};

module.exports = {
    safeParseJSON,
    doBasicRequest,
};
