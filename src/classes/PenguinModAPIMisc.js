const utils = require("../misc/utils.js");

/**
 * @typedef {import("./PenguinModAPI")} PenguinModAPI
 */
/**
 * @class This class is used to interface with the miscellaneous endpoints within the PenguinMod API.
 * Should only be accessed through PenguinModAPI.misc
 * @private
 */
class PenguinModAPIMisc {
    /**
     * @param {PenguinModAPI} parent
     * @returns {PenguinModAPIUsers}
     * @private
     */
    constructor(parent) {
        /** @type {PenguinModAPI} @private */
        this._parent = parent;
    }

    /**
     * This will get the API's server stats such as number of users and projects.
     * @link https://projects.penguinmod.com/api/v1/misc/getStats
     * @returns {Promise<{userCount:number, bannedCount:number, projectCount:number, remixCount:number, featuredCount:number, totalViews:number, mongodb_stats:object}>} The statistics of the server's content.
     */
    async getStats() {
        return await utils.doBasicRequest(`${this._parent.apiUrl}/v1/misc/getStats`, null, true, true);
    }
    /**
     * Returns an object containing the latest dates the policy documents were updated.
     * @link https://projects.penguinmod.com/api/v1/misc/getLastPolicyUpdate
     * @returns {Promise<{TOS:number, guidelines:number, privacyPolicy:number}>} The statistics of the server's content.
     */
    async getLastPolicyUpdate() {
        return await utils.doBasicRequest(`${this._parent.apiUrl}/v1/misc/getLastPolicyUpdate`, null, true, true);
    }
}

module.exports = PenguinModAPIMisc;