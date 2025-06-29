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

const RequestType = {
    None: "none",
    Text: "text",
    JSON: "json",
    ArrayBuffer: "arrbuff"
};

/**
 * @typedef {import("../classes/PenguinModAPI")} PenguinModAPI
 */
/**
 * @param {string} url 
 * @param {RequestInit?} options 
 * @param {PenguinModAPI} apiClass Required to add headers.
 * @param {string} requestType The type that the result of the request is parsed as (i.e. text, json, etc). Use the RequestType object.
 * @returns {Promise<any>}
 */
const doBasicRequest = (url, options, apiClass, requestType) => {
    if (!apiClass) throw new Error("Provide apiClass to doBasicRequest");
    options = apiClass.injectOptions(options, url);
    if (!options) options = {};
    if (!options.headers) options.headers = {};
    options.headers["PenguinMod-Tooling"] = "PenguinMod-ApiModule";
    
    return new Promise((resolve, reject) => {
        fetch(url, options).then(response => {
            if (response.ok) {
                if (requestType === RequestType.None) {
                    return resolve(response);
                }

                if (requestType === RequestType.ArrayBuffer) {
                    response
                    .arrayBuffer()
                    .then(arr_buff => resolve(arr_buff))
                    .catch((err) => {
                        const pmError = new PenguinModAPIError("ParseArrayBufferFailed", err, response.status, null, true, url, options, response, err);
                        reject(pmError);
                    });
                } else {
                    response.text().then(text => {
                        if (requestType === RequestType.JSON) {
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
                }
            } else {
                response.text().then(text => {
                    // a text API might error in JSON
                    const jsonResp = safeParseJSON(text);
                    const errorMsg = jsonResp && jsonResp.error ? jsonResp.error : text || PenguinModAPIError.UNKNOWN;
                    const pmError = new PenguinModAPIError(errorMsg, text, response.status, jsonResp, false, url, options, response, null);
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
    RequestType
};
