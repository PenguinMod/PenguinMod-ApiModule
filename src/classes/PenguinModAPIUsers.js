const utils = require("../misc/utils.js");
const PenguinModAPIError = require("./PenguinModAPIError.js");

/**
 * @typedef {import("./PenguinModAPI")} PenguinModAPI
 */
/**
 * @class This class is used to interface with endpoints related to users within the PenguinMod API.
 * Should only be accessed through PenguinModAPI.users
 * @private
 */
class PenguinModAPIUsers {
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
     * Returns the ID of a user by their username.
     * @link https://projects.penguinmod.com/api/v1/users/getid
     * @param {string} username The username of the user you want to get the ID of.
     * @throws {PenguinModAPIError}
     * @returns {Promise<string|null>} The ID of the user, or null if not found.
     */
    async getId(username) {
        try {
            const json = await utils.doBasicRequest(`${this._parent.apiUrl}/v1/users/getid?username=${encodeURIComponent(username)}`, null, this._parent, utils.RequestType.JSON);
            return json.id;
        } catch (err) {
            if (err && err instanceof PenguinModAPIError && err.data && err.data.error === "UserNotFound") {
                return null;
            }
            throw err;
        }
    }
    /**
     * Returns the username of a user by their ID.
     * @link https://projects.penguinmod.com/api/v1/users/getusername
     * @param {string} id The ID of the user you want to get the username of.
     * @throws {PenguinModAPIError}
     * @returns {Promise<string|null>} The username of the user, or null if not found.
     */
    async getUsername(id) {
        try {
            const json = await utils.doBasicRequest(`${this._parent.apiUrl}/v1/users/getusername?ID=${encodeURIComponent(id)}`, null, this._parent, utils.RequestType.JSON);
            return json.username || null; // false is returned if no user is found
        } catch (err) {
            if (err && err instanceof PenguinModAPIError && err.data && err.data.error === "UserNotFound") {
                return null;
            }
            throw err;
        }
    }

    /**
     * Block a user.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/users/blockuser
     * @param {string} targetUsername The username of the user you want to block.
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async blockUser(targetUsername) {
        const url = `${this._parent.apiUrl}/v1/users/blockuser`;
        utils.assert(!!this._parent.token, url, "Reauthenticate", "No token is registered.");
        await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: this._parent.token,
                target: targetUsername
            })
        }, this._parent, utils.RequestType.JSON);
    }

    /**
     * Get your feed.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/users/getmyfeed
     * @throws {PenguinModAPIError}
     * @returns {Promise<Array<object>>}
     */
    async getMyFeed() {
        const url = `${this._parent.apiUrl}/v1/users/getmyfeed?token=${encodeURIComponent(this._parent.token)}`;
        utils.assert(!!this._parent.token, url, "Reauthenticate", "No token is registered.");
        const feed = await utils.doBasicRequest(url, null, this._parent, true, true);
        return feed;
    }

    /**
     * Get the profile picture of a user.
     * @link https://projects.penguinmod.com/api/v1/users/getpfp
     * @param {string} username The username of the user. 
     * @throws {PenguinModAPIError}
     * @returns {Promise<Uint8Array|null>} The profile picture as an octet stream, or null if not found.
     */
    async getPFP(username) {
        try {
            const pfp = await utils.doBasicRequest(`${this._parent.apiUrl}/v1/users/getpfp?username=${encodeURIComponent(username)}`, null, this._parent, utils.RequestType.ArrayBuffer);
            return pfp;
        } catch (err) {
            if (err && err instanceof PenguinModAPIError && err.data && err.data.error === "NotFound") {
                return null;
            }
            throw err;
        }
    }

    /**
     * Check if you're blocking a given user.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/users/hasblocked
     * @param {string} username Who you want to check if you're blocking.
     * @throws {PenguinModAPIError}
     * @returns {Promise<boolean|null>} If blocking or not, null if not found
     */
    async hasblocked(username) {
        const url = `${this._parent.apiUrl}/v1/users/hasblocked?username${encodeURIComponent(username)}`;
        utils.assert(!!this._parent.token, url, "Reauthenticate", "No token is registered.");
        try {
            const json = await utils.doBasicRequest(url, null, this._parent, utils.RequestType.JSON);
            return json.has_blocked; 
        } catch (err) {
            if (err && err instanceof PenguinModAPIError && err.data && err.data.error === "Target not found") {
                return null;
            }
            throw err;
        }
    }

    /**
     * @typedef {Object} Profile
     * @property {string} id The ID of the user.
     * @property {string} username The username of the user.
     * @property {string} real_username The username of the user, with capitalization preserved.
     * @property {Array<string>} badges The badges of the user.
     * @property {boolean} donator If the user is a donator.
     * @property {number} rank The rank of the user. 0 represents new penguin, 1 represents penguin.
     * @property {string} bio The user's bio.
     * @property {number} myFeaturedProject the user's featured project.
     * @property {number} myFeaturedProjectTitle An enum-ish of the titles. Each integer represents a different title.
     * @property {number} followers The follower count of the user.
     * @property {boolean} canrankup If the user can rank up.
     * @property {boolean} privateProfile If the user's account is private.
     * @property {boolean} canFollowingSeeProfile If people the user follows can see the users account when the account is private.
     * @property {boolean} isFollowing If the user is following you.
     */

    /**
     * Get the profile of a user.
     * Token is optional. If the user has a private account, it can be viewed only if they allow followees to view and they're following you, or if you're a mod/admin.
     * @link https://projects.penguinmod.com/api/v1/users/profile
     * @param {string} username Username of the target.
     * @throws {PenguinModAPIError}
     * @returns {Promise<Profile|null>} Either the resulting profile or null if not found (not found could be given from a profile whose user is currently banned).
     */
    async getProfile(username) {
        try {
            const has_token = !!this._parent.token;
            const token_str = has_token ? `&token=${this._parent.token}` : "";
            const json = await utils.doBasicRequest(`${this._parent.apiUrl}/v1/users/profile?username${encodeURIComponent(username)}${token_str}`, null, this._parent, utils.RequestType.JSON);
            return json; 
        } catch (err) {
            if (err && err instanceof PenguinModAPIError && err.data && err.data.error === "NotFound") {
                return null;
            }
            throw err;
        }
    }

    /**
     * Request a rank up.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/users/requestrankup
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async requestRankUp() {
        await utils.doBasicRequest(`${this._parent.apiUrl}/v1/users/requestrankup?token=${encodeURIComponent(this._parent.token)}`, null, this._parent, utils.RequestType.None);
    }

    /**
     * Check if an email is valid. Same function as used in the API.
     * @param {string} email
     * @returns {boolean} 
     */
    isValidEmail(email) {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    }

    /**
     * Set your email.
     * Requires token.
     * Email must be a valid email.
     * @link https://projects.penguinmod.com/api/v1/users/setEmail
     * @throws {PenguinModAPIError}
     * @param {string} email New email.
     * @returns {Promise<null>}
     */
    async setEmail(email) {
        const url = `${this._parent.apiUrl}/v1/users/setEmail`
        utils.assert(!!this._parent.token, url, "Reauthenticate", "No token is registered.");
        utils.assert(this.isValidEmail(email), url, "InvalidEmail", `Email '${email}' is not a valid email.`);
        await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: this._parent.token,
                email
            })
        }, this._parent, utils.RequestType.None);
    }

    // NOTE: Some of these are not real endpoints and are just meant to be loaded in a browser.
    // TODO: /api/v1/users/userexists
    // TODO: /api/v1/users/userfromcode
    // TODO: /api/v1/users/changePassword
    // TODO: /api/v1/users/createAccount
    // TODO: /api/v1/users/filloutSafetyDetails
    // TODO: /api/v1/users/logout
    // TODO: /api/v1/users/passwordLogin
    // TODO: /api/v1/users/tokenlogin
    // TODO: /api/v1/users/resetpassword/reset
    // TODO: /api/v1/users/resetpassword/sendEmail
    // TODO: /api/v1/users/resetpassword/sendVerifyEmail
    // TODO: /api/v1/users/getmessagecount
    // TODO: /api/v1/users/getmessages
    // TODO: /api/v1/users/getunreadmessagecount
    // TODO: /api/v1/users/getunreadmessages
    // TODO: /api/v1/users/markallmessagesasread
    // TODO: /api/v1/users/markmessageasread
    // TODO: /api/v1/users/sendmessage
    // TODO: /api/v1/users/changeUsername
    // TODO: /api/v1/users/getBadges
    // TODO: /api/v1/users/getprojectcountofuser
    // TODO: /api/v1/users/isBanned
    // TODO: /api/v1/users/privateProfile
    // TODO: /api/v1/users/setBio
    // TODO: /api/v1/users/setmyfeaturedproject
    // TODO: /api/v1/users/setpfp
    // TODO: /api/v1/users/customization/setCustomization
    // TODO: /api/v1/users/follow
    // TODO: /api/v1/users/meta/getfollowercount
    // TODO: /api/v1/users/meta/getfollowers
    // TODO: /api/v1/users/isfollowing
    // TODO: /api/v1/users/ban
    // TODO: /api/v1/users/getAlts
    // TODO: /api/v1/users/setbioadmin
    // TODO: /api/v1/users/setmyfeaturedprojectadmin
    // TODO: /api/v1/users/setpfpadmin
    // TODO: /api/v1/users/changeusernameadmin
    // TODO: /api/v1/users/assignPossition
    // TODO: /api/v1/users/banip
    // TODO: /api/v1/users/banuserip
    // TODO: /api/v1/users/setbadgesmultiple
    // TODO: /api/v1/users/changeprojectid
    // TODO: /api/v1/users/deleteaccount
    // TODO: /api/v1/users/deleteallemails
    // TODO: /api/v1/users/getadmins
    // TODO: /api/v1/users/getAllAccountsWithIP
    // TODO: /api/v1/users/getAllIPs
    // TODO: /api/v1/users/getemail
    // TODO: /api/v1/users/getmods
    // TODO: /api/v1/users/getworstoffenders
    // TODO: /api/v1/users/isadmin
    // TODO: /api/v1/users/ismod
    // TODO: /api/v1/users/massbanregex
    // TODO: /api/v1/users/setBadges
    // TODO: /api/v1/users/verifyfollowers
    // TODO: /api/v1/users/addoauthmethod
    // TODO: /api/v1/users/githubcallback/addmethod
    // TODO: /api/v1/users/googlecallback/addmethod
    // TODO: /api/v1/users/addscratchlogin
    // TODO: /api/v1/users/addpasswordtooauth
    // TODO: /api/v1/users/githubcallback/addpasswordfinal
    // TODO: /api/v1/users/githubcallback/addpassword
    // TODO: /api/v1/users/googlecallback/addpasswordfinal
    // TODO: /api/v1/users/googlecallback/addpassword
    // TODO: /api/v1/users/scratchaddpasswordfinal
    // TODO: /api/v1/users/scratchaddpassword
    // TODO: /api/v1/users/createoauthaccount
    // TODO: /api/v1/users/githubcallback/createaccount
    // TODO: /api/v1/users/googlecallback/createaccount
    // TODO: /api/v1/users/scratchoauthcreate
    // TODO: /api/v1/users/githubcallback/login
    // TODO: /api/v1/users/googlecallback/login
    // TODO: /api/v1/users/loginoauthaccount
    // TODO: /api/v1/users/scratchoauthlogin
    // TODO: /api/v1/users/removeoauthmethod
}

module.exports = PenguinModAPIUsers;