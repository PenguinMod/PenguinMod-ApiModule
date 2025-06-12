const utils = require("../misc/utils.js");

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
     * @returns {Promise<string|null>} The ID of the user, or null if not found.
     */
    async getId(username) {
        try {
            const json = await utils.doBasicRequest(`${this._parent.apiUrl}/v1/users/getid?username=${encodeURIComponent(username)}`, null, true, true);
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
            const json = await utils.doBasicRequest(`${this._parent.apiUrl}/v1/users/getusername?ID=${encodeURIComponent(id)}`, null, true, true);
            return json.username || null; // false is returned if no user is found
        } catch (err) {
            if (err && err.error === "UserNotFound") {
                return null;
            }
            throw err;
        }
    }
    // NOTE: Some of these are not real endpoints and are just meant to be loaded in a browser.
    // TODO: /api/v1/users/blockuser
    // TODO: /api/v1/users/getmyfeed
    // TODO: /api/v1/users/getpfp
    // TODO: /api/v1/users/hasblocked
    // TODO: /api/v1/users/profile
    // TODO: /api/v1/users/requestrankup
    // TODO: /api/v1/users/setEmail
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
    // TODO: /api/v1/users/sendloginsuccess
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