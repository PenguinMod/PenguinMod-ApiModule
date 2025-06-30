const utils = require("../misc/utils.js");
const PenguinModAPIError = require("./PenguinModAPIError.js");

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
     * @throws {PenguinModAPIError}
     * @returns {Promise<{userCount:number, bannedCount:number, projectCount:number, remixCount:number, featuredCount:number, totalViews:number, mongodb_stats:object}>} The statistics of the server's content.
     */
    async getStats() {
        return await utils.doBasicRequest(`${this._parent.apiUrl}/v1/misc/getStats`, null, this._parent, utils.RequestType.JSON);
    }
    /**
     * Returns an object containing the latest dates the policy documents were updated.
     * @link https://projects.penguinmod.com/api/v1/misc/getLastPolicyUpdate
     * @throws {PenguinModAPIError}
     * @returns {Promise<{TOS:number, guidelines:number, privacyPolicy:number}>} The dates policy documents were last updated.
     */
    async getLastPolicyUpdate() {
        return await utils.doBasicRequest(`${this._parent.apiUrl}/v1/misc/getLastPolicyUpdate`, null, this._parent, utils.RequestType.JSON);
    }

    /**
     * Returns the dates that this account last read the policy documents.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/misc/getLastPolicyRead
     * @throws {PenguinModAPIError}
     * @returns {Promise<{TOS:number, guidelines:number, privacyPolicy:number}>} The dates policy documents were last read on this account.
     */
    async getLastPolicyRead() {
        return await utils.doBasicRequest(`${this._parent.apiUrl}/v1/misc/getLastPolicyRead?token=${encodeURIComponent(this._parent.token)}`, null, this._parent, utils.RequestType.JSON);
    }
    /**
     * Saves the current date as the last time the guidelines policy document was read.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/misc/markGuidelinesAsRead
     * @throws {PenguinModAPIError}
     * @returns {Promise<void>}
     */
    async markGuidelinesAsRead() {
        const url = `${this._parent.apiUrl}/v1/misc/markGuidelinesAsRead`;
        utils.assert(!!this._parent.token, url, "Reauthenticate", "No token is registered.");
        await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: this._parent.token,
            })
        }, this._parent, utils.RequestType.JSON);
    }
    /**
     * Saves the current date as the last time the privacyPolicy policy document was read.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/misc/markPrivacyPolicyAsRead
     * @throws {PenguinModAPIError}
     * @returns {Promise<void>}
     */
    async markPrivacyPolicyAsRead() {
        const url = `${this._parent.apiUrl}/v1/misc/markPrivacyPolicyAsRead`;
        utils.assert(!!this._parent.token, url, "Reauthenticate", "No token is registered.");
        await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: this._parent.token,
            })
        }, this._parent, utils.RequestType.JSON);
    }
    /**
     * Saves the current date as the last time the TOS policy document was read.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/misc/markTOSAsRead
     * @throws {PenguinModAPIError}
     * @returns {Promise<void>}
     */
    async markTOSAsRead() {
        const url = `${this._parent.apiUrl}/v1/misc/markTOSAsRead`;
        utils.assert(!!this._parent.token, url, "Reauthenticate", "No token is registered.");
        await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: this._parent.token,
            })
        }, this._parent, utils.RequestType.JSON);
    }

    /**
     * Returns the profanity list.
     * Requires token.
     * Only accessible on admin accounts.
     * @link https://projects.penguinmod.com/api/v1/misc/getProfanityList
     * @throws {PenguinModAPIError}
     * @returns {Promise<{illegalWords:Array<string>, illegalWebsites:Array<string>, spacedOutWordsOnly:Array<string>, potentiallyUnsafeWords:Array<string>, potentiallyUnsafeWordsSpacedOut:Array<string>, legalExtensions:Array<string>}>} The current profanity list.
     */
    async getProfanityList() {
        const url = `${this._parent.apiUrl}/v1/misc/getProfanityList?token=${encodeURIComponent(this._parent.token)}`;
        utils.assert(!!this._parent.token, url, "Reauthenticate", "No token is registered.");
        return await utils.doBasicRequest(url, null, this._parent, utils.RequestType.JSON);
    }
    /**
     * Saves the current date as the last time the specified policy documents were updated.
     * Requires token.
     * Only accessible on admin accounts.
     * @link https://projects.penguinmod.com/api/v1/misc/setLastPolicyUpdate
     * @param {Array<"privacyPolicy"|"tos"|"guidelines">} types Which documents to update.
     * @throws {PenguinModAPIError}
     * @returns {Promise<void>}
     */
    async setLastPolicyUpdate(types) {
        const url = `${this._parent.apiUrl}/v1/misc/setLastPolicyUpdate`;
        utils.assert(!!this._parent.token, url, "Reauthenticate", "No token is registered.");
        await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: this._parent.token,
                types
            })
        }, this._parent, utils.RequestType.JSON);
    }
    /**
     * Sets the profanity list.
     * Requires token.
     * Only accessible on admin accounts.
     * @link https://projects.penguinmod.com/api/v1/misc/setProfanityList
     * @param {{illegalWords:Array<string>, illegalWebsites:Array<string>, spacedOutWordsOnly:Array<string>, potentiallyUnsafeWords:Array<string>, potentiallyUnsafeWordsSpacedOut:Array<string>, legalExtensions:Array<string>}} newProfanityList 
     * @throws {"InvalidFormatExtra"} Will throw if any extra keys are added to the list object
     * @throws {"InvalidFormatNonArray"} Will throw if any of the keys are not arrays
     * @throws {"InvalidFormatNonString"} Will throw if any of the arrays contain non-strings
     * @throws {PenguinModAPIError} Any other exception, including not providing an object as the list.
     * @returns {Promise<void>}
     */
    async setProfanityList(newProfanityList) {
        const url = `${this._parent.apiUrl}/v1/misc/setProfanityList`;
        utils.assert(!!this._parent.token, url, "Reauthenticate", "No token is registered.");
        try {
            await utils.doBasicRequest(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: this._parent.token,
                    json: newProfanityList
                })
            }, this._parent, utils.RequestType.JSON);
        } catch (err) {
            if (err && err instanceof PenguinModAPIError && err.data && err.data.error === "Invalid inner words object") {
                throw "InvalidFormatNonArray";
            }
            if (err && err instanceof PenguinModAPIError && err.data && err.data.error === "Invalid word") {
                throw "InvalidFormatNonString";
            }
            if (err && err instanceof PenguinModAPIError && err.data && err.data.error === "Invalid key") {
                throw "InvalidFormatExtra";
            }
            throw err;
        }
    }

    /*
    /**
     * @link https://projects.penguinmod.com/api/v1/misc/updateApi
     * @param {string} hash
     * @param {any} packet
     * @throws {PenguinModAPIError}
     * @returns {Promise<any>}
     * /
    async updateApi(hash, packet) {
        return await utils.doBasicRequest(`${this._parent.apiUrl}/v1/misc/updateApi`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-hub-signature-256": hash,
            },
            body: JSON.stringify(packet)
        }, this._parent, true, true);
    }
    */
}

module.exports = PenguinModAPIMisc;