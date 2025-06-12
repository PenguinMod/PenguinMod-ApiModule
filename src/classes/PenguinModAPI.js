const utils = require("../misc/utils.js");
const PenguinModAPIMisc = require("./PenguinModAPIMisc.js");
const PenguinModAPIUsers = require("./PenguinModAPIUsers.js");
const PenguinModAPIProjects = require("./PenguinModAPIProjects.js");

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
         * 
         * Default is "https://projects.penguinmod.com/api"
         * @type {string}
         */
        this.apiUrl = options.apiUrl || "https://projects.penguinmod.com/api";
        /**
         * If an endpoint requires id to be set but only username is set, this will get the ID from username.
         * If an endpoint requires username to be set but only id is set, this will get the username from ID.
         * 
         * Recommended to keep enabled because the API may change an endpoint to require different information later.
         * 
         * It's also just recommended to always set username and ID together, or fetch it from the API to save it.
         * 
         * Default is true.
         * @type {boolean}
         */
        this.resolveDetails = options.resolveDetails !== false; // so its true by default

        /** @type {PenguinModAPIMisc} */
        this.misc = new PenguinModAPIMisc(this);
        /** @type {PenguinModAPIUsers} */
        this.users = new PenguinModAPIUsers(this);
        /** @type {PenguinModAPIProjects} */
        this.projects = new PenguinModAPIProjects(this);
    }

    /**
     * Fetches the API to get the username by ID, and sets this client's username to the fetched username.
     * @param {string} id The ID to use to fetch username.
     * @throws {"UserNotFound"|any} Throws "UserNotFound" if the user is not found.
     * @returns {string} The username from ID
     */
    async setUsernameFromId(id) {
        const username = await this.users.getUsername(id);
        if (!username) throw "UserNotFound";
        this.username = username;
        return username;
    }
    /**
     * Fetches the API to get the ID by username, and sets this client's ID to the fetched ID.
     * @param {string} username The username to use to fetch ID.
     * @throws {"UserNotFound"|any} Throws "UserNotFound" if the user is not found.
     * @returns {string} The ID from username
     */
    async setIdFromUsername(username) {
        const id = await this.users.getId(username);
        if (!id) throw "UserNotFound";
        this.id = id;
        return id;
    }

    /**
     * This will query the API url for v1, which should return API server information.
     * @link https://projects.penguinmod.com/api/v1
     * @returns {object} The metadata for the current API version used. Can be in any format.
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