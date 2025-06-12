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
    /**
     * Saves the current date as the last time the guidelines policy document was read.
     * Requires username and token.
     * @link https://projects.penguinmod.com/api/v1/misc/markGuidelinesAsRead
     * @returns {Promise<void>}
     */
    async markGuidelinesAsRead() {
        if (this._parent.resolveDetails && this._parent.id) await this._parent.setUsernameFromId(this._parent.id);
        await utils.doBasicRequest(`${this._parent.apiUrl}/v1/misc/markGuidelinesAsRead`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: this._parent.username,
                token: this._parent.token,
            })
        }, true, true);
    }
    /**
     * Saves the current date as the last time the privacyPolicy policy document was read.
     * Requires username and token.
     * @link https://projects.penguinmod.com/api/v1/misc/markPrivacyPolicyAsRead
     * @returns {Promise<void>}
     */
    async markPrivacyPolicyAsRead() {
        if (this._parent.resolveDetails && this._parent.id) await this._parent.setUsernameFromId(this._parent.id);
        await utils.doBasicRequest(`${this._parent.apiUrl}/v1/misc/markPrivacyPolicyAsRead`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: this._parent.username,
                token: this._parent.token,
            })
        }, true, true);
    }
    /**
     * Saves the current date as the last time the TOS policy document was read.
     * Requires username and token.
     * @link https://projects.penguinmod.com/api/v1/misc/markTOSAsRead
     * @returns {Promise<void>}
     */
    async markTOSAsRead() {
        if (this._parent.resolveDetails && this._parent.id) await this._parent.setUsernameFromId(this._parent.id);
        await utils.doBasicRequest(`${this._parent.apiUrl}/v1/misc/markTOSAsRead`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: this._parent.username,
                token: this._parent.token,
            })
        }, true, true);
    }

    /**
     * Returns the profanity list.
     * Requires username and token.
     * Only accessible on admin accounts.
     * @link https://projects.penguinmod.com/api/v1/misc/getProfanityList
     * @returns {Promise<{illegalWords:Array<string>, illegalWebsites:Array<string>, spacedOutWordsOnly:Array<string>, potentiallyUnsafeWords:Array<string>, potentiallyUnsafeWordsSpacedOut:Array<string>, legalExtensions:Array<string>}>} The current profanity list.
     */
    async getProfanityList() {
        if (this._parent.resolveDetails && this._parent.id) await this._parent.setUsernameFromId(this._parent.id);
        return await utils.doBasicRequest(`${this._parent.apiUrl}/v1/misc/getProfanityList?username=${encodeURIComponent(this._parent.username)}&token=${encodeURIComponent(this._parent.token)}`, null, true, true);
    }
    /**
     * Saves the current date as the last time the specified policy documents were updated.
     * Requires username and token.
     * Only accessible on admin accounts.
     * @link https://projects.penguinmod.com/api/v1/misc/setLastPolicyUpdate
     * @param {Array<"privacyPolicy"|"tos"|"guidelines">} types Which documents to update.
     * @returns {Promise<void>}
     */
    async setLastPolicyUpdate(types) {
        if (this._parent.resolveDetails && this._parent.id) await this._parent.setUsernameFromId(this._parent.id);
        await utils.doBasicRequest(`${this._parent.apiUrl}/v1/misc/setLastPolicyUpdate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: this._parent.username,
                token: this._parent.token,
                types
            })
        }, true, true);
    }
    /**
     * Sets the profanity list.
     * Requires username and token.
     * Only accessible on admin accounts.
     * @link https://projects.penguinmod.com/api/v1/misc/setProfanityList
     * @param {{illegalWords:Array<string>, illegalWebsites:Array<string>, spacedOutWordsOnly:Array<string>, potentiallyUnsafeWords:Array<string>, potentiallyUnsafeWordsSpacedOut:Array<string>, legalExtensions:Array<string>}} newProfanityList 
     * @throws {"InvalidFormatExtra"} Will throw if any extra keys are added to the list object
     * @throws {"InvalidFormatNonArray"} Will throw if any of the keys are not arrays
     * @throws {"InvalidFormatNonString"} Will throw if any of the arrays contain non-strings
     * @returns {Promise<void>}
     */
    async setProfanityList(newProfanityList) {
        if (this._parent.resolveDetails && this._parent.id) await this._parent.setUsernameFromId(this._parent.id);
        try {
            await utils.doBasicRequest(`${this._parent.apiUrl}/v1/misc/setProfanityList`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: this._parent.username,
                    token: this._parent.token,
                    json: newProfanityList
                })
            }, true, true);
        } catch (err) {
            if (err && err.error === "Invalid inner words object") {
                throw "InvalidFormatNonArray";
            }
            if (err && err.error === "Invalid word") {
                throw "InvalidFormatNonString";
            }
            if (err && err.error === "Invalid key") {
                throw "InvalidFormatExtra";
            }
            throw err;
        }
    }

    /**
     * @link https://projects.penguinmod.com/api/v1/misc/updateApi
     * @param {string} hash
     * @param {any} packet
     * @returns {Promise<any>}
     */
    async updateApi(hash, packet) {
        return await utils.doBasicRequest(`${this._parent.apiUrl}/v1/misc/updateApi`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-hub-signature-256": hash,
            },
            body: JSON.stringify(packet)
        }, true, true);
    }
}

module.exports = PenguinModAPIMisc;