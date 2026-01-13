const axios = require("axios");

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
 * The type that the result of the request is parsed as (i.e. text, json, etc)
 */
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
/**
 * @param {string} url 
 * @param {RequestInit?} options 
 * @param {FormData?} formData Any FormData to send with the request.
 * @param {PenguinModAPI} apiClass Required to add headers.
 * @param {string} requestType The type that the result of the request is parsed as (i.e. text, json, etc). Use the RequestType object.
 * @returns {Promise<any>}
 */
const doFormDataRequest = async (url, options, formData, apiClass, requestType) => {
    if (!apiClass) throw new Error("Provide apiClass to doFormDataRequest");
    options = apiClass.injectOptions(options, url);
    if (!options) options = {};
    if (!options.headers) options.headers = {};
    options.headers["PenguinMod-Tooling"] = "PenguinMod-ApiModule";

    let axiosResponseType = null;
    if (requestType === RequestType.Text) axiosResponseType = 'text';
    if (requestType === RequestType.ArrayBuffer) axiosResponseType = 'arraybuffer';
    if (requestType === RequestType.JSON) axiosResponseType = 'json';

    try {
        const response = await axios({
            url: url,
            method: options.method || "GET",
            data: formData,
            headers: options.headers,
            responseType: axiosResponseType,
        });

        // text requests can fail with json so we parse them
        const responseData = response.data;
        const jsonResp = (typeof responseData === "string")
            ? safeParseJSON(responseData)
            : responseData;
        if (jsonResp && jsonResp.error) {
            throw new PenguinModAPIError(jsonResp.error, responseData, response.status, responseData, false, url, options);
        }

        if (responseData instanceof ArrayBuffer && !(response.status >= 200 && response.status < 400)) {
            // Note: Your original code rejects if status is 200-400 for ArrayBuffers.
            // I am keeping that logic here as requested.
            throw new PenguinModAPIError("FormDataRequestArrayBufferFailed", "FormDataRequestArrayBufferFailed", response.status, responseData, true, url, options);
        }

        return responseData;
    } catch (err) {
        if (err instanceof PenguinModAPIError) throw err;

        if (axios.isCancel(err)) {
            throw new PenguinModAPIError("FormDataRequestAborted", "FormDataRequestAborted", PenguinModAPIError.UNKNOWN_CODE, null, false, url, options, null, err);
        }

        const errorMessage = err.response ? (err.response.data ? err.response.data.error || "FormDataRequestFailed" : "FormDataRequestFailed") : "FormDataRequestFailed";
        const status = err.response ? err.response.status : PenguinModAPIError.UNKNOWN_CODE;
        throw new PenguinModAPIError("FormDataRequestFailed", errorMessage, status, err.response, false, url, options, null, err);
    }
};

/**
 * Assert a bool. Error if false.
 * @param {boolean|any} val The value to check.
 * @param {string} url The url that was being fetched when asserting this.
 * @param {string|None} message The error message. Defaults to "AssertFailed".
 * @param {string|None} detail Extra detail on the error message. Defaults to "Assert failed."
 * @throws {PenguinModAPIError} 
 */
const assert = (val, url, message="AssertFailed", detail="Assert failed.") => {
    if (!val) {
        throw new PenguinModAPIError(message, detail, PenguinModAPIError.ASSERT_FAILED, null, false, url, null, null, null);
    }
}

module.exports = {
    safeParseJSON,
    doBasicRequest,
    doFormDataRequest,
    RequestType,
    assert
};
