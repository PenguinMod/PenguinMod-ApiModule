const utils = require("../misc/utils.js");
const countryLookup = require("../misc/country-lookup.json");
const PenguinModAPIError = require("./PenguinModAPIError.js");
/** @typedef {import("./PenguinModAPI")} PenguinModAPI */

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
     * Block a user. Optionally, unblock a user by passing `shouldUnblock` as `true`.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/users/blockuser
     * @param {string} targetUsername The username of the user you want to block.
     * @param {boolean?} shouldUnblock Whether to unblock this user or not.
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async blockUser(targetUsername, shouldUnblock) {
        const url = `${this._parent.apiUrl}/v1/users/blockuser`;
        utils.assert(!!this._parent.token, url, "Reauthenticate", "No token is registered.");
        await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: this._parent.token,
                target: targetUsername,
                active: !shouldUnblock
            })
        }, this._parent, utils.RequestType.JSON);
    }
    /**
     * Check if you're blocking a given user.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/users/hasblocked
     * @param {string} username Who you want to check if you're blocking.
     * @throws {PenguinModAPIError}
     * @returns {Promise<boolean|null>} If blocking or not, null if not found
     */
    async hasBlocked(username) {
        const token = this._parent.token;
        const url = `${this._parent.apiUrl}/v1/users/hasblocked?target=${encodeURIComponent(username)}&token=${encodeURIComponent(token)}`;
        utils.assert(!!token, url, "Reauthenticate", "No token is registered.");
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
     * Follow a user. Optionally, unfollow a user by passing `shouldUnfollow` as `true`.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/users/follow
     * @param {string} targetUsername The username of the user you want to follow.
     * @param {boolean?} shouldUnfollow Whether to unfollow this user or not.
     * @throws {PenguinModAPIError} Will also throw if following a followed user, or unfollowing a non-followed user.
     * @returns {Promise<null>}
     */
    async followUser(targetUsername, shouldUnfollow) {
        const url = `${this._parent.apiUrl}/v1/users/follow`;
        utils.assert(!!this._parent.token, url, "Reauthenticate", "No token is registered.");
        await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: this._parent.token,
                target: targetUsername,
                toggle: !shouldUnfollow
            })
        }, this._parent, utils.RequestType.JSON);
    }
    /**
     * Gets the amount of followers a user has.
     * @link https://projects.penguinmod.com/api/v1/users/meta/getfollowercount
     * @param {string} username The username of the user you want to check followers for.
     * @throws {PenguinModAPIError}
     * @returns {Promise<number>}
     */
    async getFollowerCount(username) {
        const url = `${this._parent.apiUrl}/v1/users/meta/getfollowercount?username=${encodeURIComponent(username)}`;
        const followers = await utils.doBasicRequest(url, null, this._parent, utils.RequestType.JSON);
        return followers.count;
    }
    /**
     * Gets the followers a user has.
     * @link https://projects.penguinmod.com/api/v1/users/meta/getfollowers
     * @param {string} username The username of the user you want to check followers for.
     * @throws {PenguinModAPIError}
     * @returns {Promise<Array<PenguinModTypes.StubUser>>}
     */
    async getFollowers(username) {
        const url = `${this._parent.apiUrl}/v1/users/meta/getfollowers?username=${encodeURIComponent(username)}`;
        const followers = await utils.doBasicRequest(url, null, this._parent, utils.RequestType.JSON);
        return followers;
    }
    /**
     * Checks if a user is following another user.
     * @link https://projects.penguinmod.com/api/v1/users/isfollowing
     * @param {string} username The username of the user you want to check followers for.
     * @param {string} target The target user you want to check if they are following.
     * @throws {PenguinModAPIError}
     * @returns {Promise<boolean>}
     */
    async isFollowing(username, target) {
        const url = `${this._parent.apiUrl}/v1/users/isfollowing?username=${encodeURIComponent(username)}&target=${encodeURIComponent(target)}`;
        const following = await utils.doBasicRequest(url, null, this._parent, utils.RequestType.JSON);
        return following.following;
    }

    /**
     * Get your feed.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/users/getmyfeed
     * @throws {PenguinModAPIError}
     * @returns {Promise<Array<PenguinModTypes.FeedItem>>}
     */
    async getMyFeed() {
        const url = `${this._parent.apiUrl}/v1/users/getmyfeed?token=${encodeURIComponent(this._parent.token)}`;
        utils.assert(!!this._parent.token, url, "Reauthenticate", "No token is registered.");
        const feed = await utils.doBasicRequest(url, null, this._parent, utils.RequestType.JSON);
        return feed.feed;
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
     * Get the profile of a user.
     * Token is optional. If the user has a private account, it can be viewed only if they allow followees to view and they're following you, or if you're a mod/admin.
     * @link https://projects.penguinmod.com/api/v1/users/profile
     * @param {string} username Username of the target.
     * @throws {PenguinModAPIError}
     * @returns {Promise<PenguinModTypes.UserProfile|null>} Either the resulting profile or null if not found (not found could be given from a profile whose user is currently banned).
     */
    async getProfile(username) {
        try {
            const has_token = !!this._parent.token;
            const token_str = has_token ? `&token=${this._parent.token}` : "";
            const json = await utils.doBasicRequest(`${this._parent.apiUrl}/v1/users/profile?target=${encodeURIComponent(username)}${token_str}`, null, this._parent, utils.RequestType.JSON);
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
     * @throws {PenguinModAPIError} Usually this only throws if the user cannot rank up at this time.
     * @returns {Promise<null>}
     */
    async requestRankUp() {
        await utils.doBasicRequest(`${this._parent.apiUrl}/v1/users/requestrankup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: this._parent.token,
            })
        }, this._parent, utils.RequestType.None);
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
        const url = `${this._parent.apiUrl}/v1/users/setEmail`;
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

    /**
     * Set your account's bio.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/users/setBio
     * @throws {PenguinModAPIError}
     * @param {string} bio New bio.
     * @returns {Promise<null>}
     */
    async setBio(bio) {
        const url = `${this._parent.apiUrl}/v1/users/setBio`;
        utils.assert(!!this._parent.token, url, "Reauthenticate", "No token is registered.");
        await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: this._parent.token,
                bio
            })
        }, this._parent, utils.RequestType.None);
    }
    /**
     * Set another account's bio.
     * Requires token.
     * Only accessible on moderator accounts.
     * @link https://projects.penguinmod.com/api/v1/users/setbioadmin
     * @throws {PenguinModAPIError}
     * @param {string} target The target user to edit the bio for.
     * @param {string} bio New bio.
     * @returns {Promise<null>}
     */
    async setBioAdmin(target, bio) {
        const url = `${this._parent.apiUrl}/v1/users/setbioadmin`;
        utils.assert(!!this._parent.token, url, "Reauthenticate", "No token is registered.");
        await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: this._parent.token,
                target,
                bio
            })
        }, this._parent, utils.RequestType.None);
    }
    /**
     * Makes a specific project featured on your profile.
     * The specified project must belong to you in order for it to be visible to other users on the frontend.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/users/setmyfeaturedproject
     * @param {string} projectId The project ID of the project to feature on your profile.
     * @param {number} featuredTitle This is a 1-index based number that chooses which featured label to use in the list of labels on the frontend.
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async setMyFeaturedProject(projectId, featuredTitle) {
        const url = `${this._parent.apiUrl}/v1/users/setmyfeaturedproject`;
        await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: this._parent.token,
                project: projectId,
                title: featuredTitle,
            })
        }, this._parent, utils.RequestType.None);
    }
    /**
     * Makes a specific project featured on someone else's profile.
     * The specified project must belong to the user in order for it to be visible to other users on the frontend.
     * Requires token.
     * Only accessible on moderator accounts.
     * @link https://projects.penguinmod.com/api/v1/users/setmyfeaturedprojectadmin
     * @param {string} projectId The project ID of the project to feature on your profile.
     * @param {number} featuredTitle This is a 1-index based number that chooses which featured label to use in the list of labels on the frontend.
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async setMyFeaturedProjectAdmin(target, projectId, featuredTitle) {
        const url = `${this._parent.apiUrl}/v1/users/setmyfeaturedprojectadmin`;
        await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: this._parent.token,
                target: target,
                project: projectId,
                title: featuredTitle,
            })
        }, this._parent, utils.RequestType.None);
    }
    /**
     * Saves an arbitrary object (with restrictions) to your profile.
     * For exact restrictions, see the `seeBlockedUserCustomization` function in https://github.com/PenguinMod/PenguinMod-BackendApi/blob/main/api/v1/db/UserManager.js
     * 
     * Requires token.
     * Only accessible on accounts with the "donator" badge.
     * @link https://projects.penguinmod.com/api/v1/users/customization/setCustomization
     * @param {Object} customData The arbitrary object to save.
     * @param {string} modTarget A specific user to set the customizations for. This parameter is only allowed if you are a moderator.
     * @throws {PenguinModAPIError} Usually this will only throw if the data is invalid, or you try to set someone else's customizations without being a moderator.
     * @returns {Promise<null>}
     */
    async setCustomization(customData, modTarget) {
        const url = `${this._parent.apiUrl}/v1/users/customization/setCustomization`;
        await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: this._parent.token,
                customization: customData,
                target: modTarget,
            })
        }, this._parent, utils.RequestType.None);
    }
    /**
     * Disables someone else's customizations from being visible, and disables their ability to use the customization feature.
     * Requires token.
     * Only accessible on moderator accounts.
     * @link https://projects.penguinmod.com/api/v1/users/customization/setCustomization
     * @param {string} target The user to revoke customizations from
     * @param {boolean} isDisabled `true` to revoke customizations, `false` to give them back.
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async setCustomizationDisabled(target, isDisabled) {
        const url = `${this._parent.apiUrl}/v1/users/customization/setCustomizationDisabled`;
        await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: this._parent.token,
                target,
                toggle: !isDisabled,
            })
        }, this._parent, utils.RequestType.None);
    }
    /**
     * Gets a specific user's donator customization.
     * @link https://projects.penguinmod.com/api/v1/users/customization/getCustomization
     * @param {string} username The user to check.
     * @throws {PenguinModAPIError} Will also throw for accounts that do not have the "donator" badge.
     * @returns {Promise<Object>} Resolves to an arbitrary object, see `setCustomization`
     */
    async getCustomization(username) {
        const url = `${this._parent.apiUrl}/v1/users/customization/getCustomization?target=${encodeURIComponent(username)}`;
        const data = await utils.doBasicRequest(url, null, this._parent, utils.RequestType.JSON);
        return data.customization;
    }

    /**
     * Check if a user exists by their username
     * @link https://projects.penguinmod.com/api/v1/users/userexists
     * @param {string} username The user's username
     * @throws {PenguinModAPIError}
     * @returns {Promise<boolean>}
     */
    async userExists(username) {
        if (!username) {
            return false;
        }

        const url = `${this._parent.apiUrl}/v1/users/userexists?username=${encodeURIComponent(username)}`;
        const exists = (await utils.doBasicRequest(url, null, this._parent, utils.RequestType.JSON)).exists;

        return exists;
    }
    /**
     * Check if a user is banned
     * @link https://projects.penguinmod.com/api/v1/users/isBanned
     * @param {string} username The user's username
     * @throws {PenguinModAPIError}
     * @returns {Promise<boolean>}
     */
    async isBanned(username) {
        const url = `${this._parent.apiUrl}/v1/users/isBanned?username=${encodeURIComponent(username)}`;
        const data = await utils.doBasicRequest(url, null, this._parent, utils.RequestType.JSON);
        return data.isBanned;
    }

    /**
     * Get your info.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/users/userfromcode
     * @throws {PenguinModAPIError}
     * @returns {Promise<PenguinModTypes.UserIdentity>}
     */
    async getInfo() {
        const url = `${this._parent.apiUrl}/v1/users/userfromcode?token=${this._parent.token}`;
        utils.assert(!!this._parent.token, url, "Reauthenticate", "No token is registered.");

        const data = await utils.doBasicRequest(url, null, this._parent, utils.RequestType.JSON);

        return data;
    }

    /**
     * Change your password. Also refreshes your token.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/users/changePassword
     * @param {string} old_password Your current password.
     * @param {string} new_password Your new password.
     * @throws {PenguinModAPIError}
     * @returns {Promise<string>} Your new token.
     */
    async changePassword(old_password, new_password) {
        const url = `${this._parent.apiUrl}/v1/users/changePassword`;
        utils.assert(!!this._parent.token, url, "Reauthenticate", "Missing token");

        const passwordDoesNotMeetLength = new_password.length < 8 || new_password.length > 50;
        const passwordMeetsTextInclude = new_password.match(/[a-z]/) && new_password.match(/[A-Z]/);
        const passwordMeetsSpecialInclude = new_password.match(/[0-9]/) && new_password.match(/[^a-z0-9]/i);
        utils.assert(!passwordDoesNotMeetLength, url, "InvalidPasswordLength", "Password must be between 8 and 50 characters long.");
        utils.assert(passwordMeetsTextInclude, url, "InvalidPasswordText", "Password must contain at least one letter.");
        utils.assert(passwordMeetsSpecialInclude, url, "InvalidPasswordSpecial", "Password must contain at least one number and one special character.");

        const data = await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: this._parent.token,
                old_password,
                new_password
            })
        }, this._parent, utils.RequestType.JSON);
        return data.token;
    }
    /**
     * Change your username.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/users/changeUsername
     * @param {string} newUsername Your new username.
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async changeUsername(newUsername) {
        const url = `${this._parent.apiUrl}/v1/users/changeUsername`;
        utils.assert(!!this._parent.token, url, "Reauthenticate", "Missing token");

        const usernameDoesNotMeetLength = newUsername.length < 3 || newUsername.length > 20;
        const usernameHasIllegalChars = newUsername.match(/[^a-z0-9\-_]/i);
        utils.assert(!usernameDoesNotMeetLength, url, "InvalidUsernameLength", "Username must be between 3 and 20 characters long.");
        utils.assert(!usernameHasIllegalChars, url, "InvalidUsernameChars", "Username can only contain letters, numbers, dashes and underscores.");

        await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: this._parent.token,
                newUsername,
            })
        }, this._parent, utils.RequestType.JSON);
    }

    parseBirthday(birthday) {
        if (!birthday) return;
        if (typeof birthday !== "string") return;
        try {
            const date = new Date(birthday);
            if (isNaN(date.getTime())) {
                return; // invalid format
            }

            return date.toISOString();
        } catch {
            return;
        }
    }

    /**
     * Create an account.
     * Returns a token.
     * Requires a Cloudflare Captcha token.
     * @link https://projects.penguinmod.com/api/v1/users/createAccount
     * @param {string} username Your new username.
     * @param {string} password Your new password. 
     * @param {string} captcha_token The captcha token from cloudflare.
     * @param {string|number|null} birthday Your birthday. Should be parseable by new Date(x). Optional, but you're gonna get hassled for it on the frontend sooo just provide it now. You can use `filloutSafetyDetails` later to set the missing info.
     * @param {string|null} country Your country, in country-code form. Same as above - optional but recommended to provide it now. You can use `filloutSafetyDetails` later to set the missing info.
     * @param {string} email Your email. Optional. You can use `setEmail` later to set an email for this account.
     * @throws {PenguinModAPIError}
     * @returns {Promise<string>} Your new token. 
     */
    async createAccount(username, password, captcha_token, birthday, country, email="") {
        const url = `${this._parent.apiUrl}/v1/users/createAccount`;

        // validate everything
        // block cuz im sooo sigma
        {
            const usernameDoesNotMeetLength = username.length < 3 || username.length > 20;
            const usernameHasIllegalChars = username.match(/[^a-z0-9\-_]/i);

            utils.assert(!usernameDoesNotMeetLength, url, "InvalidUsernameLength", "Username must be between 3 and 20 characters long.");
            utils.assert(!usernameHasIllegalChars, url, "InvalidUsernameChars", "Username can only contain letters, numbers, dashes and underscores.");

            const passwordDoesNotMeetLength = password.length < 8 || password.length > 50;
            const passwordMeetsTextInclude = password.match(/[a-z]/) && password.match(/[A-Z]/);
            const passwordMeetsSpecialInclude = password.match(/[0-9]/) && password.match(/[^a-z0-9]/i);

            utils.assert(!passwordDoesNotMeetLength, url, "InvalidPasswordLength", "Password must be between 8 and 50 characters long.");
            utils.assert(passwordMeetsTextInclude, url, "InvalidPasswordText", "Password must contain at least one letter.");
            utils.assert(passwordMeetsSpecialInclude, url, "InvalidPasswordSpecial", "Password must contain at least one number and one special character.");

            if (email) {
                utils.assert(this.isValidEmail(email), url, "InvalidEmail", `Email '${email}' is not a valid email.`);
            }

            if (birthday && !this.parseBirthday(birthday)) {
                throw new PenguinModAPIError("InvalidBirthday", "Birthday must be a valid date.", PenguinModAPIError.UNKNOWN_CODE, null, false, url, null, null, null);
            }

            if (country && !countryLookup.countryCodes.includes(country)) {
                throw new PenguinModAPIError("InvalidCountry", "Country must be a valid country code.", PenguinModAPIError.UNKNOWN_CODE, null, false, url, null, null, null);
            }
        }

        const data = await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username,
                password,
                captcha_token,
                birthday,
                country,
                email
            })
        }, this._parent, utils.RequestType.JSON);

        return data.token;
    }

    /**
     * Adds legal safety details to the currently logged in account.
     * It is recommended to set all of this information if it is missing, since some laws may require this information for us to abide by them.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/users/filloutSafetyDetails
     * @param {string|number|null} birthday Your birthday. Should be parseable by new Date(x).
     * @param {string|null} country Your country, in country-code form.
     * @throws {PenguinModAPIError} Note the API will reject requests to set information that has already been set before.
     * @returns {Promise<null>}
     */
    async filloutSafetyDetails(birthday, country) {
        const url = `${this._parent.apiUrl}/v1/users/filloutSafetyDetails`;

        if (birthday && !this.parseBirthday(birthday)) {
            throw new PenguinModAPIError("InvalidBirthday", "Birthday must be a valid date.", PenguinModAPIError.UNKNOWN_CODE, null, false, url, null, null, null);
        }
        if (country && !countryLookup.countryCodes.includes(country)) {
            throw new PenguinModAPIError("InvalidCountry", "Country must be a valid country code.", PenguinModAPIError.UNKNOWN_CODE, null, false, url, null, null, null);
        }
        if (!birthday && !country) {
            throw new PenguinModAPIError("MissingOneField", "Must have birthday and/or country", PenguinModAPIError.UNKNOWN_CODE, null, false, url, null, null, null);
        }

        await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: this._parent.token,
                birthday,
                country,
            })
        }, this._parent, utils.RequestType.None);
    }

    /**
     * Logs out of the account, invalidating the current token.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/users/logout
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async logout() {
        const url = `${this._parent.apiUrl}/v1/users/logout`;
        await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: this._parent.token,
            })
        }, this._parent, utils.RequestType.None);
    }
    /**
     * Allows you to log into an account from a provided username and password.
     * This will return a new token which can be used to access the specified account.
     * Requires a Cloudflare Captcha token.
     * @link https://projects.penguinmod.com/api/v1/users/passwordLogin
     * @param {string} username The username of the account.
     * @param {string} password The password of the account.
     * @param {string} captcha_token The captcha token from cloudflare.
     * @throws {PenguinModAPIError}
     * @returns {Promise<string>} A token for the account specified.
     */
    async passwordLogin(username, password, captcha_token) {
        const url = `${this._parent.apiUrl}/v1/users/passwordLogin`;
        const login = await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username,
                password,
                captcha_token
            })
        }, this._parent, utils.RequestType.JSON);
        return login.token;
    }
    /**
     * Verifies that a token results in a valid login.
     * Usually it's best to just use the token for the action you want to perform and see if the request fails, so you don't need to request the API twice.
     * @link https://projects.penguinmod.com/api/v1/users/tokenlogin
     * @param {string} token The token to use.
     * @throws {PenguinModAPIError} Will throw if the login is invalid.
     * @returns {Promise<null>}
     */
    async tokenLogin(token) {
        const url = `${this._parent.apiUrl}/v1/users/tokenlogin?token=${encodeURIComponent(token)}`;
        await utils.doBasicRequest(url, null, this._parent, utils.RequestType.None);
    }

    /**
     * Returns the amount of projects a specific user has uploaded.
     * @link https://projects.penguinmod.com/api/v1/users/getprojectcountofuser
     * @param {string} username The user to check.
     * @throws {PenguinModAPIError}
     * @returns {Promise<number>}
     */
    async getProjectCountOfUser(username) {
        const url = `${this._parent.apiUrl}/v1/users/getprojectcountofuser`;
        const data = await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                target: username,
            })
        }, this._parent, utils.RequestType.JSON);
        return data.count;
    }
    /**
     * Gets a specific user's badges.
     * @link https://projects.penguinmod.com/api/v1/users/getBadges
     * @param {string} username The user to check.
     * @throws {PenguinModAPIError}
     * @returns {Promise<Array<string>>}
     */
    async getBadges(username) {
        const url = `${this._parent.apiUrl}/v1/users/getBadges?username=${encodeURIComponent(username)}`;
        const data = await utils.doBasicRequest(url, null, this._parent, utils.RequestType.JSON);
        return data.badges;
    }

    /**
     * Reset an account's password using information from an email's reset password link.
     * You can only get `emailState` from a PenguinMod email, it is the `state` query parameter from a https://penguinmod.com/resetpassword URL.
     * @link https://projects.penguinmod.com/api/v1/users/resetpassword/reset
     * @param {string} email Which email asked to reset a password. This email must have a valid PenguinMod account attached to it.
     * @param {string} emailState A specific code sent in an email's password reset link.
     * @param {string} newPassword The new password to use for the email's account.
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async resetPassword(email, emailState, newPassword) {
        const url = `${this._parent.apiUrl}/v1/users/resetpassword/reset`;
        await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                state: emailState,
                password: newPassword,
            })
        }, this._parent, utils.RequestType.None);
    }
    /**
     * Send a password reset request via email. Returns the URL that the user can visit to reset their password.
     * Requires a Cloudflare Captcha token.
     * @link https://projects.penguinmod.com/api/v1/users/resetpassword/sendEmail
     * @param {string} email Which email to request a password reset for. This email must have a valid PenguinMod account attached to it.
     * @param {string} captcha_token The captcha token from cloudflare.
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async sendResetPasswordEmail(email, captcha_token) {
        const url = `${this._parent.apiUrl}/v1/users/resetpassword/sendEmail`;
        await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                captcha_token,
            })
        }, this._parent, utils.RequestType.None);
    }
    /**
     * Sends an email to this account's inbox that allows this account's email to be verified.
     * An email must be attached to this account, and the email cannot already be verified.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/users/resetpassword/sendVerifyEmail
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async sendVerifyEmail() {
        const url = `${this._parent.apiUrl}/v1/users/resetpassword/sendVerifyEmail`;
        await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: this._parent.token,
            })
        }, this._parent, utils.RequestType.None);
    }

    /**
     * Updates details about this account's private status.
     * `makePrivateToFollowing` only applies if the account is private.
     * Both parameters must be supplied to this function.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/users/privateProfile
     * @param {boolean} makePrivate Makes this profile private if `true`, and not private if `false`.
     * @param {boolean} makePrivateToFollowing Makes this profile only accessible to people you follow if `true`, and private to all if `false`. Only applies if the profile is private.
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async privateProfile(makePrivate, makePrivateToFollowing) {
        const url = `${this._parent.apiUrl}/v1/users/privateProfile`;
        await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: this._parent.token,
                privateProfile: makePrivate,
                privateToFollowing: makePrivateToFollowing,
            })
        }, this._parent, utils.RequestType.None);
    }

    /**
     * Gets any messages that this user has.
     * @link https://projects.penguinmod.com/api/v1/users/getmessages
     * @param {number?} page Which page of messages to look at. If not provided, page will be 0.
     * @throws {PenguinModAPIError}
     * @returns {Promise<Array<PenguinModTypes.Message>>}
     */
    async getMessages(page) {
        const token = this._parent.token;
        const url = `${this._parent.apiUrl}/v1/users/getmessages?token=${encodeURIComponent(token)}&page=${page}`;
        const data = await utils.doBasicRequest(url, null, this._parent, utils.RequestType.JSON);
        return data.messages;
    }
    /**
     * Gets any unread messages that this user has. 
     * @link https://projects.penguinmod.com/api/v1/users/getunreadmessages
     * @param {number?} page Which page of messages to look at. If not provided, page will be 0.
     * @throws {PenguinModAPIError}
     * @returns {Promise<Array<PenguinModTypes.Message>>}
     */
    async getUnreadMessages(page) {
        const token = this._parent.token;
        const url = `${this._parent.apiUrl}/v1/users/getunreadmessages?token=${encodeURIComponent(token)}&page=${page}`;
        const data = await utils.doBasicRequest(url, null, this._parent, utils.RequestType.JSON);
        return data.messages;
    }
    /**
     * Returns the amount of messages this user has.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/users/getmessagecount
     * @throws {PenguinModAPIError}
     * @returns {Promise<number>}
     */
    async getMessageCount() {
        const url = `${this._parent.apiUrl}/v1/users/getmessagecount?token=${encodeURIComponent(this._parent.token)}`;
        const data = await utils.doBasicRequest(url, null, this._parent, utils.RequestType.JSON);
        return data.count;
    }
    /**
     * Returns the amount of unread messages this user has. This also counts policy updates that have not been seen yet.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/users/getunreadmessagecount
     * @throws {PenguinModAPIError}
     * @returns {Promise<number>}
     */
    async getUnreadMessageCount() {
        const url = `${this._parent.apiUrl}/v1/users/getunreadmessagecount?token=${encodeURIComponent(this._parent.token)}`;
        const data = await utils.doBasicRequest(url, null, this._parent, utils.RequestType.JSON);
        return data.count;
    }
    /**
     * Marks every message sent to the user as read.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/users/markallmessagesasread
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async markAllMessagesAsRead() {
        const url = `${this._parent.apiUrl}/v1/users/markallmessagesasread`;
        await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: this._parent.token,
            })
        }, this._parent, utils.RequestType.None);
    }
    /**
     * Marks a specific message sent to the user as read.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/users/markmessageasread
     * @param {string} id The ID of the message to mark as read.
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async markMessageAsRead(id) {
        const url = `${this._parent.apiUrl}/v1/users/markmessageasread`;
        await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: this._parent.token,
                messageID: id,
            })
        }, this._parent, utils.RequestType.None);
    }

    /**
     * Sets the profile picture of this account.
     * Note that only `image/png` and `image/jpeg` are supported, and the image must not be recognized as `application/octet-stream`.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/users/setpfp
     * @param {ArrayBuffer} file The new profile picture to use.
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async setPFP(file) {
        const url = `${this._parent.apiUrl}/v1/users/setpfp?token=${encodeURIComponent(this._parent.token)}`;
        const formData = new FormData();
        formData.append("picture", new Blob([file]));

        await utils.doFormDataRequest(url, {
            method: "POST",
        }, formData, this._parent, utils.RequestType.JSON);
    }
    /**
     * Sets the profile picture of another user's account.
     * Note that only `image/png` and `image/jpeg` are supported, and the image must not be recognized as `application/octet-stream`.
     * Requires token.
     * Only accessible on moderator accounts.
     * @link https://projects.penguinmod.com/api/v1/users/setpfpadmin
     * @param {ArrayBuffer} file The new profile picture to use.
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async setPFPAdmin(target, file) {
        const url = `${this._parent.apiUrl}/v1/users/setpfpadmin`;
        const formData = new FormData();
        formData.append("token", this._parent.token);
        formData.append("target", target);
        formData.append("picture", new Blob([file]));

        await utils.doFormDataRequest(url, {
            method: "POST",
        }, formData, this._parent, utils.RequestType.JSON);
    }

    /**
     * Bans a user on the server. Handles permanent bans, temporary bans, and unbans.
     * Requires token.
     * Only accessible on moderator accounts.
     * @link https://projects.penguinmod.com/api/v1/users/ban
     * @param {string} target The user to ban.
     * @param {string} reason A reason to ban them for. Cannot be longer than 512 characters.
     * @param {boolean?} doUnban If true, will unban the user.
     * @param {number?} time A duration to ban the user for. If not set, the ban will be permanent.
     * @param {boolean?} removeFollows If false, will not remove the followers and following users from a permanently banned user.
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async ban(target, reason, doUnban, time, removeFollows) {
        const url = `${this._parent.apiUrl}/v1/users/ban`;
        await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: this._parent.token,
                target: target,
                reason: reason,
                toggle: doUnban !== true,
                time: time || 0,
                remove_follows: removeFollows !== false,
            })
        }, this._parent, utils.RequestType.None);
    }
    /**
     * Bans an IP from accessing the server. Handles IP bans and unbans.
     * Requires token.
     * Only accessible on moderator accounts.
     * @link https://projects.penguinmod.com/api/v1/users/banip
     * @param {string} targetIP The IP to ban.
     * @param {boolean?} doUnban If true, will unban the IP.
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async banIP(targetIP, doUnban) {
        const url = `${this._parent.apiUrl}/v1/users/banip`;
        await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: this._parent.token,
                targetIP: targetIP,
                toggle: doUnban !== true,
            })
        }, this._parent, utils.RequestType.None);
    }
    /**
     * Bans a user's IP from accessing the server. Handles user IP bans and unbans.
     * Requires token.
     * Only accessible on moderator accounts.
     * @link https://projects.penguinmod.com/api/v1/users/banuserip
     * @param {string} target The target user to ban.
     * @param {boolean?} doUnban If true, will unban the user.
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async banUserIP(target, doUnban) {
        const url = `${this._parent.apiUrl}/v1/users/banuserip`;
        await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: this._parent.token,
                target: target,
                toggle: doUnban !== true,
            })
        }, this._parent, utils.RequestType.None);
    }

    /**
     * Gets the alternate accounts (alts) that were made by this user.
     * Requires token.
     * Only accessible on moderator accounts.
     * @link https://projects.penguinmod.com/api/v1/users/getAlts
     * @param {string} target The target user to get the alts for.
     * @throws {PenguinModAPIError}
     * @returns {Promise<Array<string>>} The list of usernames for accounts this user made.
     */
    async getAlts(target) {
        const url = `${this._parent.apiUrl}/v1/users/getAlts?token=${encodeURIComponent(this._parent.token)}&target=${encodeURIComponent(target)}`;
        const data = await utils.doBasicRequest(url, null, this._parent, utils.RequestType.JSON);
        return data.alts;
    }

    // NOTE: Some of these are not real endpoints and are just meant to be loaded in a browser.
    // TODO: /api/v1/users/changeusernameadmin
    // TODO: /api/v1/users/assignPossition
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
    // TODO: /api/v1/users/addscratchlogin
    // TODO: /api/v1/users/addpasswordtooauth
    // TODO: /api/v1/users/createoauthaccount
    // TODO: /api/v1/users/loginoauthaccount
    // TODO: /api/v1/users/removeoauthmethod

    // NOTE FOR THESE: These are redirected to from the frontend, not fetched. Perhaps cleanup these into one function that redirects to the correct method so we avoid worrying about different methods, in case they're changed?

    // TODO: /api/v1/users/githubcallback/addpasswordfinal
    // TODO: /api/v1/users/googlecallback/addpasswordfinal
    // TODO: /api/v1/users/scratchaddpasswordfinal
}

module.exports = PenguinModAPIUsers;