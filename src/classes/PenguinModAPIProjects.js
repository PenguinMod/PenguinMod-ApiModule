const pmp_protobuf = require("pmp-protobuf");

const utils = require("../misc/utils.js");
const PenguinModAPIError = require("./PenguinModAPIError.js");
/** @typedef {import("./PenguinModAPI")} PenguinModAPI */

/**
 * @class This class is used to interface with endpoints related to projects within the PenguinMod API.
 * Should only be accessed through PenguinModAPI.projects
 * @private
 */
class PenguinModAPIProjects {
    /**
     * @param {PenguinModAPI} parent
     * @returns {PenguinModAPIProjects}
     * @private
     */
    constructor(parent) {
        /** @type {PenguinModAPI} @private */
        this._parent = parent;
    }

    /**
     * Returns a boolean that is true if uploading is enabled for all users.
     * @link https://projects.penguinmod.com/api/v1/projects/canuploadprojects
     * @throws {PenguinModAPIError}
     * @returns {Promise<boolean>} True if uploading is enabled for all users.
     */
    async canUploadProjects() {
        const json = await utils.doBasicRequest(`${this._parent.apiUrl}/v1/projects/canuploadprojects`, null, this._parent, utils.RequestType.JSON);
        return json.canUpload !== false;
    }
    /**
     * Returns a boolean that is true if viewing projects is enabled for all users.
     * @link https://projects.penguinmod.com/api/v1/projects/canviewprojects
     * @throws {PenguinModAPIError}
     * @returns {Promise<boolean>} True if viewing projects is enabled for all users.
     */
    async canViewProjects() {
        const json = await utils.doBasicRequest(`${this._parent.apiUrl}/v1/projects/canviewprojects`, null, this._parent, utils.RequestType.JSON);
        return json.viewing !== false;
    }
    /**
     * Gets the amount of loves (likes) a project has.
     * @link https://projects.penguinmod.com/api/v1/projects/getLoves
     * @param {string} projectId The project to get loves for.
     * @throws {PenguinModAPIError} Commonly throws if the project ID is invalid or no project was found.
     * @returns {Promise<number>} The amount of loves (likes) the project has.
     */
    async getLoves(projectId) {
        try {
            const json = await utils.doBasicRequest(`${this._parent.apiUrl}/v1/projects/getLoves?projectID=${encodeURIComponent(projectId)}`, null, this._parent, utils.RequestType.JSON);
            return json.loves;
        } catch (err) {
            throw err;
        }
    }
    /**
     * Gets the amount of votes a project has.
     * @link https://projects.penguinmod.com/api/v1/projects/getVotes
     * @param {string} projectId The project to get votes for.
     * @throws {PenguinModAPIError} Commonly throws if the project ID is invalid or no project was found.
     * @returns {Promise<number>} The amount of votes the project has.
     */
    async getVotes(projectId) {
        try {
            const json = await utils.doBasicRequest(`${this._parent.apiUrl}/v1/projects/getVotes?projectID=${encodeURIComponent(projectId)}`, null, this._parent, utils.RequestType.JSON);
            return json.votes;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Gets a list of all projects uploaded by ranked users on the site.
     * If logged in as a moderator, this will also include projects uploaded by unranked users.
     * @link https://projects.penguinmod.com/api/v1/projects/getprojects
     * @param {Object} options Optional.
     * @param {number?} options.page Determines which page of projects should be returned. If not provided, page will be 0.
     * @param {boolean?} options.reverse Whether or not to show oldest projects first. Default is false.
     * @param {boolean?} options.login Whether or not to provide login info. Should be true for moderators who want to see unranked user's projects. Default is true.
     * @throws {PenguinModAPIError} Can also throw if viewing projects is disabled.
     * @returns {Promise<Array<PenguinModTypes.Project>>} An array of PenguinMod projects.
     */
    async getProjects(options) {
        if (!options) options = {};
        try {
            const url = new URL(`${this._parent.apiUrl}/v1/projects/getprojects`);
            if (typeof options.page === "number") {
                url.searchParams.set("page", options.page);
            }
            if (typeof options.reverse === "boolean") {
                url.searchParams.set("reverse", options.reverse);
            }
            if (options.login !== false && this._parent.token) {
                url.searchParams.set("token", this._parent.token);
            }
            const json = await utils.doBasicRequest(url.toString(), null, this._parent, utils.RequestType.JSON);
            return json;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Returns whether or not you have loved (liked) or voted a project.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/projects/getuserstatewrapper
     * @param {string} projectId The project to check.
     * @throws {PenguinModAPIError} Commonly throws if the project ID is invalid or no project was found.
     * @returns {Promise<{hasLoved:boolean, hasVoted:boolean}>}
     */
    async getUserState(projectId) {
        const url = `${this._parent.apiUrl}/v1/projects/getuserstatewrapper?projectId=${encodeURIComponent(projectId)}&token=${encodeURIComponent(this._parent.token)}`;
        utils.assert(!!this._parent.token, url, "Reauthenticate", "No token is registered.");
        try {
            const json = await utils.doBasicRequest(url, null, this._parent, utils.RequestType.JSON);
            return json;
        } catch (err) {
            throw err;
        }
    }
    /**
     * Returns whether or not you have loved (liked) a project.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/projects/hasLoved
     * @param {string} projectId The project to check.
     * @throws {PenguinModAPIError} Commonly throws if the project ID is invalid or no project was found.
     * @returns {Promise<boolean>}
     */
    async hasLoved(projectId) {
        const url = `${this._parent.apiUrl}/v1/projects/hasLoved?projectID=${encodeURIComponent(projectId)}&token=${encodeURIComponent(this._parent.token)}`;
        utils.assert(!!this._parent.token, url, "Reauthenticate", "No token is registered.");
        try {
            const json = await utils.doBasicRequest(url, null, this._parent, utils.RequestType.JSON);
            return json.hasLoved;
        } catch (err) {
            throw err;
        }
    }
    /**
     * Returns whether or not you have voted for a project.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/projects/hasVoted
     * @param {string} projectId The project to check.
     * @throws {PenguinModAPIError} Commonly throws if the project ID is invalid or no project was found.
     * @returns {Promise<boolean>}
     */
    async hasVoted(projectId) {
        const url = `${this._parent.apiUrl}/v1/projects/hasVoted?projectID=${encodeURIComponent(projectId)}&token=${encodeURIComponent(this._parent.token)}`;
        utils.assert(!!this._parent.token, url, "Reauthenticate", "No token is registered.");
        try {
            const json = await utils.doBasicRequest(url, null, this._parent, utils.RequestType.JSON);
            return json.hasVoted;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Returns whether or not another user has loved (liked) a project.
     * Requires token.
     * Only accessible on admin accounts.
     * @link https://projects.penguinmod.com/api/v1/projects/hasLovedAdmin
     * @param {string} projectId The project to check.
     * @param {string} targetUsername The target user by username.
     * @throws {PenguinModAPIError} Commonly throws if the project ID is invalid or no project was found.
     * @returns {Promise<boolean>}
     */
    async hasLovedAdmin(projectId, targetUsername) {
        const url = `${this._parent.apiUrl}/v1/projects/hasLovedAdmin?projectID=${encodeURIComponent(projectId)}&token=${encodeURIComponent(this._parent.token)}&target=${encodeURIComponent(targetUsername)}`;
        utils.assert(!!this._parent.token, url, "Reauthenticate", "No token is registered.");
        try {
            const json = await utils.doBasicRequest(url, null, this._parent, utils.RequestType.JSON);
            return json.hasLoved;
        } catch (err) {
            throw err;
        }
    }
    /**
     * Returns whether or not another user has voted for a project.
     * Requires token.
     * Only accessible on admin accounts.
     * @link https://projects.penguinmod.com/api/v1/projects/hasVotedAdmin
     * @param {string} projectId The project to check.
     * @param {string} targetUsername The target user by username.
     * @throws {PenguinModAPIError} Commonly throws if the project ID is invalid or no project was found.
     * @returns {Promise<boolean>}
     */
    async hasVotedAdmin(projectId, targetUsername) {
        const url = `${this._parent.apiUrl}/v1/projects/hasVotedAdmin?projectID=${encodeURIComponent(projectId)}&token=${encodeURIComponent(this._parent.token)}&target=${encodeURIComponent(targetUsername)}`;
        utils.assert(!!this._parent.token, url, "Reauthenticate", "No token is registered.");
        try {
            const json = await utils.doBasicRequest(url, null, this._parent, utils.RequestType.JSON);
            return json.hasVoted;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Returns which users have loved (liked) a project.
     * Requires token.
     * Only accessible on admin accounts.
     * @link https://projects.penguinmod.com/api/v1/projects/getWhoLoved
     * @param {string} projectID The project to check.
     * @param {number?} page Which page of usernames to look at. If not provided, page will be 0.
     * @throws {PenguinModAPIError} Commonly throws if the project ID is invalid or no project was found.
     * @returns {Promise<Array<string>>}
     */
    async getWhoLoved(projectID, page) {
        const url = `${this._parent.apiUrl}/v1/projects/getWhoLoved?projectID=${encodeURIComponent(projectID)}&token=${encodeURIComponent(this._parent.token)}&page=${encodeURIComponent(page)}`;
        const json = await utils.doBasicRequest(url, null, this._parent, utils.RequestType.JSON);
        return json.loves;
    }
    /**
     * Returns which users have voted for a project.
     * Requires token.
     * Only accessible on admin accounts.
     * @link https://projects.penguinmod.com/api/v1/projects/getWhoVoted
     * @param {string} projectID The project to check.
     * @param {number?} page Which page of usernames to look at. If not provided, page will be 0.
     * @throws {PenguinModAPIError} Commonly throws if the project ID is invalid or no project was found.
     * @returns {Promise<Array<string>>}
     */
    async getWhoVoted(projectID, page) {
        const url = `${this._parent.apiUrl}/v1/projects/getWhoVoted?projectID=${encodeURIComponent(projectID)}&token=${encodeURIComponent(this._parent.token)}&page=${encodeURIComponent(page)}`;
        const json = await utils.doBasicRequest(url, null, this._parent, utils.RequestType.JSON);
        return json.votes;
    }

    /**
     * Changes the ID of a project. Makes old links break but the new ID can be any string.
     * Requires token.
     * Only accessible on admin accounts.
     * @link https://projects.penguinmod.com/api/v1/users/changeprojectid
     * @param {string} target The target project ID.
     * @param {string} newId The new project ID.
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async changeProjectId(target, newId) {
        // TODO: This should probably not be under users/
        const url = `${this._parent.apiUrl}/v1/users/changeprojectid`;
        await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: this._parent.token,
                target,
                newId
            })
        }, this._parent, utils.RequestType.None);
    }

    /**
     * Gets the metadata from a project.
     * @link https://projects.penguinmod.com/api/v1/projects/getproject
     * @param {string} projectID The ID of the project to pull from.
     * @param {boolean?} safe Will return a default set of "No Project Found" information if the project does not exist.
     * @throws {PenguinModAPIError} Can also throw if viewing projects is disabled.
     * @returns {Promise<PenguinModTypes.Project>} The project information
     */
    async getProjectMeta(projectID, safe) {
        const url = `${this._parent.apiUrl}/v1/projects/getproject?requestType=metadata&projectID=${encodeURIComponent(projectID)}${safe ? `&safe=${encodeURIComponent(safe)}` : ""}`;
        const json = await utils.doBasicRequest(url, null, this._parent, utils.RequestType.JSON);
        return json;
    }
    /**
     * Gets the thumbnail from a project.
     * @link https://projects.penguinmod.com/api/v1/projects/getproject
     * @param {string} projectID The ID of the project to pull from.
     * @param {boolean?} safe Will return a default set of "No Project Found" information if the project does not exist.
     * @throws {PenguinModAPIError} Can also throw if viewing projects is disabled.
     * @returns {Promise<ArrayBuffer>} The project thumbnail
     */
    async getProjectThumbnail(projectID, safe) {
        const url = `${this._parent.apiUrl}/v1/projects/getproject?requestType=thumbnail&projectID=${encodeURIComponent(projectID)}${safe ? `&safe=${encodeURIComponent(safe)}` : ""}`;
        const arrayBuffer = await utils.doBasicRequest(url, null, this._parent, utils.RequestType.ArrayBuffer);
        return arrayBuffer;
    }
    /**
     * Gets a project file from the server
     * @link https://projects.penguinmod.com/api/v1/projects/getprojectwrapper
     * @param {string} projectId The ID of the project to pull from.
     * @param {boolean?} safe Will return a default set of "No Project Found" information if the project does not exist.
     * @param {boolean?} assets If false, will not return any assets in the .pmp project.
     * @throws {PenguinModAPIError} Can also throw if viewing projects is disabled.
     * @returns {Promise<ArrayBuffer>} The .pmp project
     */
    async getProjectFile(projectId, safe, assets) {
        const url = `${this._parent.apiUrl}/v1/projects/getprojectwrapper?projectId=${encodeURIComponent(projectId)}${safe ? `&safe=${encodeURIComponent(safe)}` : ""}${typeof assets === "boolean" ? `&assets=${encodeURIComponent(assets)}` : ""}`;
        const json = await utils.doBasicRequest(url, null, this._parent, utils.RequestType.JSON);
        
        const blob = new Uint8Array(json.project.data);
        const packedAssets = [];
        for (const asset of json.assets) {
            const uint8 = new Uint8Array(asset.buffer.data);
            packedAssets.push({
                id: asset.id,
                buffer: uint8.buffer,
            });
        }
        return pmp_protobuf.protobufToPMP(blob, packedAssets);
    }

    /**
     * Toggles viewing projects on or off. Prevents most endpoints that return projects from working properly.
     * Requires token.
     * Only accessible on admin accounts.
     * @link https://projects.penguinmod.com/api/v1/projects/toggleviewing
     * @param {string} toggle True to enable, false to disable.
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async toggleViewing(toggle) {
        const url = `${this._parent.apiUrl}/v1/projects/toggleviewing`;
        await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: this._parent.token,
                toggle
            })
        }, this._parent, utils.RequestType.None);
    }
    /**
     * Toggles uploading projects on or off. Prevents users from uploading or updating projects.
     * Requires token.
     * Only accessible on admin accounts.
     * @link https://projects.penguinmod.com/api/v1/projects/toggleuploading
     * @param {string} toggle True to enable, false to disable.
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async toggleUploading(toggle) {
        const url = `${this._parent.apiUrl}/v1/projects/toggleuploading`;
        await utils.doBasicRequest(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: this._parent.token,
                toggle
            })
        }, this._parent, utils.RequestType.None);
    }

    // TODO: /api/v1/projects/updateProject
    // TODO: /api/v1/projects/uploadProject
    // TODO: /api/v1/projects/getWhoLoved
    // TODO: /api/v1/projects/getWhoVoted
    // TODO: /api/v1/projects/interactions/loveToggle
    // TODO: /api/v1/projects/interactions/registerView
    // TODO: /api/v1/projects/interactions/showMeLess
    // TODO: /api/v1/projects/interactions/showMeMore
    // TODO: /api/v1/projects/interactions/voteToggle
    // TODO: /api/v1/projects/manualfeature
    // TODO: /api/v1/projects/deletemodmessage
    // TODO: /api/v1/projects/hardDeleteProject
    // TODO: /api/v1/projects/dispute
    // TODO: /api/v1/projects/downloadHardReject
    // TODO: /api/v1/projects/hardreject
    // TODO: /api/v1/projects/modmessage
    // TODO: /api/v1/projects/modresponse
    // TODO: /api/v1/projects/restore
    // TODO: /api/v1/projects/softreject
    // TODO: /api/v1/projects/frontpage
    // TODO: /api/v1/projects/getfeaturedprojects
    // TODO: /api/v1/projects/getmyprojects
    // TODO: /api/v1/projects/getprojectsbyauthor
    // TODO: /api/v1/projects/getrandomproject
    // TODO: /api/v1/projects/getremixes
    // TODO: /api/v1/projects/searchprojects
    // TODO: /api/v1/projects/searchusers
    // TODO: /api/v1/projects/deletethumb
    // TODO: /api/v1/projects/setCanBeFeatured
}

module.exports = PenguinModAPIProjects;