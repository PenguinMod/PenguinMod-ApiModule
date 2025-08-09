const utils = require("../misc/utils.js");
const PenguinModAPIError = require("./PenguinModAPIError.js");
const PenguinModAPIMisc = require("./PenguinModAPIMisc.js");
const PenguinModAPIUsers = require("./PenguinModAPIUsers.js");
const PenguinModAPIProjects = require("./PenguinModAPIProjects.js");

/**
 * @class This class is used to interface with general core endpoints of the PenguinMod API.
 * Recommended to name instances of this class "PenguinModClient" for clarity.
 */
class PenguinModAPI {
    /**
     * @param {Object} options Optional.
     * @param {string?} options.token If omitted, use setToken later.
     * @param {string?} options.apiUrl Sets the base API url. See PenguinModAPI.apiUrl or setApiUrl for info. If omitted, use setApiUrl later.
     * @returns {PenguinModAPI} PenguinModClient
     */
    constructor(options = {}) {
        this.token = options.token;

        /**
         * This is the API url used for all requests.
         * Most endpoints will append a version like /v1 before the endpoint.
         * 
         * Default is "https://projects.penguinmod.com/api"
         * @type {string}
         */
        this.apiUrl = options.apiUrl || "https://projects.penguinmod.com/api";

        /** @type {PenguinModAPIMisc} */
        this.misc = new PenguinModAPIMisc(this);
        /** @type {PenguinModAPIUsers} */
        this.users = new PenguinModAPIUsers(this);
        /** @type {PenguinModAPIProjects} */
        this.projects = new PenguinModAPIProjects(this);
    }
    /**
     * The new `token` of the account you want to use.
     * @param {string} token The new token to use.
     */
    setToken(token) {
        this.token = token;
    }
    /**
     * The new `apiUrl` to use.
     * Most endpoints will append a version like /v1 before the endpoint.
     * 
     * By default, ApiModule will use "https://projects.penguinmod.com/api"
     * @param {string} apiUrl The new base URL to use.
     */
    setApiUrl(apiUrl) {
        this.apiUrl = apiUrl;
    }

    /**
     * Can be overridden. Modify fetch options that the module sends.
     * @param {RequestInit?} options Optional, Fetch options
     * @param {string?} url Optional, the URL being fetched
     * @virtual
     * @returns {RequestInit} Fetch options
     */
    injectOptions(options, url) {
        return options;
    }

    /**
     * This will query the API url for v1, which should return API server information.
     * @link https://projects.penguinmod.com/api/v1
     * @throws {PenguinModAPIError}
     * @returns {Promise<object>} The metadata for the current API version used. Can be in any format.
     */
    async getMetadata() {
        return await utils.doBasicRequest(`${this.apiUrl}/v1`, null, this, utils.RequestType.JSON);
    }
    /**
     * Requests the ping endpoint as a way to check if the API is online without sending much data.
     * @link https://projects.penguinmod.com/api/v1/ping
     * @throws {PenguinModAPIError}
     * @returns {Promise<boolean>} True if the server responds properly.
     */
    async checkOnline() {
        try {
            return !!(await utils.doBasicRequest(`${this.apiUrl}/v1/ping`, null, this, utils.RequestType.None));
        } catch {
            return false;
        }
    }
}

module.exports = PenguinModAPI;