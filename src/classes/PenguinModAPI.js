const utils = require("../misc/utils.js");
const PenguinModAPIMisc = require("./PenguinModAPIMisc.js");

/**
 * @class This class is used to interface with general core endpoints of the PenguinMod API.
 * Recommended to name instances of this class "PenguinModClient" for clarity.
 */
class PenguinModAPI {
    /**
     * @param {Object?} options
     * @param {string?} options.id The ID of the account to use. Both ID and username can be defined, but at least one should be given to use login-required endpoints. If omitted, use setId later.
     * @param {string?} options.username The username of the account to use. Both ID and username can be defined, but at least one should be given to use login-required endpoints. If omitted, use setUsername later.
     * @param {string?} options.token If omitted, use setToken later.
     * @param {string?} options.apiUrl Sets the base API url. See PenguinModAPI.apiUrl for info. If omitted, use setApiUrl later.
     * @returns {PenguinModAPI} PenguinModClient
     */
    constructor(options = {}) {
        this.id = options.id;
        this.username = options.username;
        this.token = options.token;

        /**
         * This is the API url used for all requests.
         * Most endpoints will append a version like /v1 before the endpoint.
         * Default is "https://projects.penguinmod.com/api"
         * @type {string}
         */
        this.apiUrl = options.apiUrl || "https://projects.penguinmod.com/api";

        /** @type {PenguinModAPIMisc} */
        this.misc = new PenguinModAPIMisc(options);
    }
    setId(id) {
        this.id = id;
        this.misc.id = id;
    }
    setUsername(username) {
        this.username = username;
        this.misc.username = username;
    }
    setToken(token) {
        this.token = token;
        this.misc.token = token;
    }
    setApiUrl(apiUrl) {
        this.apiUrl = apiUrl;
        this.misc.apiUrl = apiUrl;
    }

    /**
     * This will query the API url for v1, which should return API server information.
     * @link https://projects.penguinmod.com/api/v1
     * @returns The metadata for the current API version used. Can be in any format.
     */
    async getMetadata() {
        return await utils.doBasicRequest(`${this.apiUrl}/v1`, null, true, true);
    }
    /**
     * Requests the ping endpoint as a way to check if the API is online without sending much data.
     * @link https://projects.penguinmod.com/api/v1/ping
     * @returns {Promise<boolean>} True if the server responds properly.
     */
    async checkOnline() {
        try {
            return !!(await utils.doBasicRequest(`${this.apiUrl}/v1/ping`, null, false, false));
        } catch {
            return false;
        }
    }
}

module.exports = PenguinModAPI;