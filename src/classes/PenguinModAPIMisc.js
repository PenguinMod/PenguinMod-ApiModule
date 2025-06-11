const utils = require("../misc/utils.js");

/**
 * @class This class is used to interface with the miscellaneous endpoints within the PenguinMod API.
 * Should only be accessed through PenguinModAPI.misc
 * @private
 */
class PenguinModAPIMisc {
    /**
     * @param {Object?} options
     * @param {string?} options.id
     * @param {string?} options.username
     * @param {string?} options.token
     * @param {string?} options.apiUrl
     * @returns {PenguinModAPIMisc}
     * @private
     */
    constructor(options = {}) {
        this.id = options.id;
        this.username = options.username;
        this.token = options.token;
        
        this.apiUrl = options.apiUrl || "https://projects.penguinmod.com/api";
    }

    /**
     * This will get the API's server stats such as number of users and projects.
     * @link https://projects.penguinmod.com/api/v1/misc/getStats
     * @returns {Promise<{userCount:number, bannedCount:number, projectCount:number, remixCount:number, featuredCount:number, totalViews:number, mongodb_stats:object}>} The statistics of the server's content.
     */
    async getStats() {
        return await utils.doBasicRequest(`${this.apiUrl}/v1/misc/getStats`, null, true, true);
    }
    /**
     * Returns an object containing the latest dates the policy documents were updated.
     * @link https://projects.penguinmod.com/api/v1/misc/getLastPolicyUpdate
     * @returns {Promise<{TOS:number, guidelines:number, privacyPolicy:number}>} The statistics of the server's content.
     */
    async getLastPolicyUpdate() {
        return await utils.doBasicRequest(`${this.apiUrl}/v1/misc/getLastPolicyUpdate`, null, true, true);
    }
}

module.exports = PenguinModAPIMisc;