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
     * @returns {Promise<{TOS:number, guidelines:number, privacyPolicy:number}>} The dates policy documents were last updated.
     */
    async getLastPolicyUpdate() {
        return await utils.doBasicRequest(`${this._parent.apiUrl}/v1/misc/getLastPolicyUpdate`, null, true, true);
    }

    /**
     * Returns the dates that this account last read the policy documents.
     * Requires username and token.
     * @link https://projects.penguinmod.com/api/v1/misc/getLastPolicyRead
     * @returns {Promise<{TOS:number, guidelines:number, privacyPolicy:number}>} The dates policy documents were last read on this account.
     */
    async getLastPolicyRead() {
        if (this._parent.resolveDetails && this._parent.id) await this._parent.setUsernameFromId(this._parent.id);
        return await utils.doBasicRequest(`${this._parent.apiUrl}/v1/misc/getLastPolicyRead?username=${encodeURIComponent(this._parent.username)}&token=${encodeURIComponent(this._parent.token)}`, null, true, true);
    }
    // TODO: /api/v1/misc/getProfanityList
    // TODO: /api/v1/misc/markGuidelinesAsRead
    // TODO: /api/v1/misc/markPrivacyPolicyAsRead
    // TODO: /api/v1/misc/markTOSAsRead
    // TODO: /api/v1/misc/setLastPolicyUpdate
    // TODO: /api/v1/misc/setProfanityList
    // TODO: /api/v1/misc/updateApi
}

module.exports = PenguinModAPIMisc;