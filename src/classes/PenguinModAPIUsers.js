const utils = require("../misc/utils.js");

/**
 * @typedef {import("./PenguinModAPI")} PenguinModAPI
 */
/**
 * @class This class is used to interface endpoints related to users within the PenguinMod API.
 * Should only be accessed through PenguinModAPI.users
 * @private
 */
class PenguinModAPIUsers {
    /**
     * @param {Object?} options
     * @param {string?} options.id
     * @param {string?} options.username
     * @param {string?} options.token
     * @param {string?} options.apiUrl
     * @returns {PenguinModAPIUsers}
     * @private
     */
    constructor(options = {}, parent) {
        /** @type {PenguinModAPI} @private */
        this._parent = parent;
        
        this.id = options.id;
        this.username = options.username;
        this.token = options.token;

        this.apiUrl = options.apiUrl || "https://projects.penguinmod.com/api";
        this.resolveDetails = options.resolveDetails !== false;
    }

    /**
     * Returns the ID of a user by their username.
     * @link https://projects.penguinmod.com/api/v1/users/getid
     * @param {string} username The username of the user you want to get the ID of.
     * @returns {Promise<string|null>} The ID of the user, or null if not found.
     */
    async getId(username) {
        try {
            const json = await utils.doBasicRequest(`${this.apiUrl}/v1/users/getid?username=${encodeURIComponent(username)}`, null, true, true);
            return json.id;
        } catch (err) {
            if (err && err.error === "UserNotFound") {
                return null;
            }
            throw err;
        }
    }
    /**
     * Returns the username of a user by their ID.
     * @link https://projects.penguinmod.com/api/v1/users/getusername
     * @param {string} id The ID of the user you want to get the username of.
     * @returns {Promise<string>} The username of the user, or null if not found.
     */
    async getUsername(id) {
        try {
            const json = await utils.doBasicRequest(`${this.apiUrl}/v1/users/getusername?ID=${encodeURIComponent(id)}`, null, true, true);
            return json.username || null; // false is returned if no user is found
        } catch (err) {
            if (err && err.error === "UserNotFound") {
                return null;
            }
            throw err;
        }
    }
}

module.exports = PenguinModAPIUsers;