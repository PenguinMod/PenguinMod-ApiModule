const utils = require("../misc/utils.js");
const PenguinModAPIError = require("./PenguinModAPIError.js");

/**
 * @typedef {import("./PenguinModAPI")} PenguinModAPI
 */
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
     * @throws {"InvalidProjectID"} Will throw if the project ID is invalid.
     * @throws {"ProjectNotFound"} Will throw if no project was found with the specified ID.
     * @throws {PenguinModAPIError} Thrown in any other case.
     * @returns {Promise<number>} The amount of loves (likes) the project has.
     */
    async getLoves(projectId) {
        try {
            const json = await utils.doBasicRequest(`${this._parent.apiUrl}/v1/projects/getLoves?projectID=${encodeURIComponent(projectId)}`, null, this._parent, utils.RequestType.JSON);
            return json.loves;
        } catch (err) {
            if (err && err instanceof PenguinModAPIError && err.data && err.data.error === "InvalidProjectID") {
                throw "InvalidProjectID";
            }
            if (err && err instanceof PenguinModAPIError && err.data && err.data.error === "Project not found") {
                throw "ProjectNotFound";
            }
            throw err;
        }
    }
    /**
     * Gets the amount of votes a project has.
     * @link https://projects.penguinmod.com/api/v1/projects/getVotes
     * @param {string} projectId The project to get votes for.
     * @throws {"InvalidProjectID"} Will throw if the project ID is invalid.
     * @throws {"ProjectNotFound"} Will throw if no project was found with the specified ID.
     * @throws {PenguinModAPIError} Thrown in any other case.
     * @returns {Promise<number>} The amount of votes the project has.
     */
    async getVotes(projectId) {
        try {
            const json = await utils.doBasicRequest(`${this._parent.apiUrl}/v1/projects/getVotes?projectID=${encodeURIComponent(projectId)}`, null, this._parent, utils.RequestType.JSON);
            return json.votes;
        } catch (err) {
            if (err && err instanceof PenguinModAPIError && err.data && err.data.error === "InvalidProjectID") {
                throw "InvalidProjectID";
            }
            if (err && err instanceof PenguinModAPIError && err.data && err.data.error === "Project not found") {
                throw "ProjectNotFound";
            }
            throw err;
        }
    }


    // TODO: This should be merged with MessageFragmentUserFragment
    /**
     * @typedef {Object} ProjectUserFragment
     * @property {string} id The ID of the user attached to the Project.
     * @property {string} username The username of the user attached to the Project.
     */
    /**
     * @typedef {Object} Project
     * @property {string} id The ID of the project
     * @property {ProjectUserFragment|string|null} author Some info on the author of the project, or a user ID depending on the endpoint.
     * @property {string?} title The title of the project
     * @property {string?} instructions The instructions attached to this project.
     * @property {string?} notes The notes attached to this project.
     * @property {string|"0"|null} remix If this project is a remix, this will be the project ID of the project it remixed. Either `"0"` or not defined for non-remix projects.
     * @property {boolean} featured True if this project is featured.
     * @property {number} views The amount of times someone has visited the project page for this project.
     * @property {number} date The time in milliseconds that this project was published.
     * @property {number?} lastUpdate The time in milliseconds that this project was last updated.
     * @property {string?} rating The age-rating of this project. This property has specific intended values, but they have not been determined nor implemented yet.
     * @property {boolean?} public True if this project can be seen by others
     * @property {boolean?} softRejected True if this project is soft-rejected (hidden for review)
     * @property {boolean?} hardReject True if this project is hard-rejected (subject for deletion.)
     * @property {number?} hardRejectTime The time in milliseconds that this project was hard-rejected.
     * @property {number?} impressions The amount of times this project has been seen on the site.
     * @property {boolean?} noFeature True if this project cannot be featured.
     * @property {number?} featureDate The time in milliseconds that this project was featured.
     * @property {boolean?} manuallyFeatured True if this project was manually featured.
     */

    /**
     * Gets a list of all projects uploaded by ranked users on the site.
     * If logged in as a moderator, this will also include projects uploaded by unranked users.
     * @link https://projects.penguinmod.com/api/v1/projects/getprojects
     * @todo Make a PenguinModProject interface that defines the properties a project will have.
     * @param {Object} options Optional.
     * @param {number?} options.page Determines which page of projects should be returned. If not provided, page will be 0.
     * @param {boolean?} options.reverse Whether or not to show oldest projects first. Default is false.
     * @param {boolean?} options.login Whether or not to provide login info. Should be true for moderators who want to see unranked user's projects. Default is true.
     * @throws {"ViewingDisabled"|PenguinModAPIError} Throws "ViewingDisabled" if viewing projects is disabled.
     * @returns {Promise<Array<Project>>} An array of PenguinMod projects.
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
            if (err && err instanceof PenguinModAPIError && err.data && err.data.error === "Viewing is disabled") {
                throw "ViewingDisabled";
            }
            throw err;
        }
    }

    /**
     * Returns whether or not you have loved (liked) or voted a project.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/projects/getuserstatewrapper
     * @param {string} projectId The project to check.
     * @throws {"ProjectNotFound"} Will throw if no project was found with the specified ID.
     * @throws {PenguinModAPIError} Thrown in any other case.
     * @returns {Promise<{hasLoved:boolean, hasVoted:boolean}>}
     */
    async getUserState(projectId) {
        const url = `${this._parent.apiUrl}/v1/projects/getuserstatewrapper?projectId=${encodeURIComponent(projectId)}&token=${encodeURIComponent(this._parent.token)}`;
        utils.assert(!!this._parent.token, url, "Reauthenticate", "No token is registered.");
        try {
            const json = await utils.doBasicRequest(url, null, this._parent, utils.RequestType.JSON);
            return json;
        } catch (err) {
            if (err && err instanceof PenguinModAPIError && err.data && err.data.error === "Project not found") {
                throw "ProjectNotFound";
            }
            throw err;
        }
    }
    /**
     * Returns whether or not you have loved (liked) a project.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/projects/hasLoved
     * @param {string} projectId The project to check.
     * @throws {"ProjectNotFound"} Will throw if no project was found with the specified ID.
     * @throws {PenguinModAPIError} Thrown in any other case.
     * @returns {Promise<{boolean}>}
     */
    async hasLoved(projectId) {
        const url = `${this._parent.apiUrl}/v1/projects/hasLoved?projectID=${encodeURIComponent(projectId)}&token=${encodeURIComponent(this._parent.token)}`;
        utils.assert(!!this._parent.token, url, "Reauthenticate", "No token is registered.");
        try {
            const json = await utils.doBasicRequest(url, null, this._parent, utils.RequestType.JSON);
            return json.hasLoved;
        } catch (err) {
            if (err && err instanceof PenguinModAPIError && err.data && err.data.error === "Project not found") {
                throw "ProjectNotFound";
            }
            throw err;
        }
    }
    /**
     * Returns whether or not you have voted for a project.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/projects/hasVoted
     * @param {string} projectId The project to check.
     * @throws {"ProjectNotFound"} Will throw if no project was found with the specified ID.
     * @throws {PenguinModAPIError} Thrown in any other case.
     * @returns {Promise<{boolean}>}
     */
    async hasVoted(projectId) {
        const url = `${this._parent.apiUrl}/v1/projects/hasVoted?projectID=${encodeURIComponent(projectId)}&token=${encodeURIComponent(this._parent.token)}`;
        utils.assert(!!this._parent.token, url, "Reauthenticate", "No token is registered.");
        try {
            const json = await utils.doBasicRequest(url, null, this._parent, utils.RequestType.JSON);
            return json.hasVoted;
        } catch (err) {
            if (err && err instanceof PenguinModAPIError && err.data && err.data.error === "Project not found") {
                throw "ProjectNotFound";
            }
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
     * @throws {"ProjectNotFound"} Will throw if no project was found with the specified ID.
     * @throws {PenguinModAPIError} Thrown in any other case.
     * @returns {Promise<{boolean}>}
     */
    async hasLovedAdmin(projectId, targetUsername) {
        const url = `${this._parent.apiUrl}/v1/projects/hasLovedAdmin?projectID=${encodeURIComponent(projectId)}&token=${encodeURIComponent(this._parent.token)}&target=${encodeURIComponent(targetUsername)}`;
        utils.assert(!!this._parent.token, url, "Reauthenticate", "No token is registered.");
        try {
            const json = await utils.doBasicRequest(url, null, this._parent, utils.RequestType.JSON);
            return json.hasLoved;
        } catch (err) {
            if (err && err instanceof PenguinModAPIError && err.data && err.data.error === "Project not found") {
                throw "ProjectNotFound";
            }
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
     * @throws {"ProjectNotFound"} Will throw if no project was found with the specified ID.
     * @throws {PenguinModAPIError} Thrown in any other case.
     * @returns {Promise<{boolean}>}
     */
    async hasVotedAdmin(projectId, targetUsername) {
        const url = `${this._parent.apiUrl}/v1/projects/hasVotedAdmin?projectID=${encodeURIComponent(projectId)}&token=${encodeURIComponent(this._parent.token)}&target=${encodeURIComponent(targetUsername)}`;
        utils.assert(!!this._parent.token, url, "Reauthenticate", "No token is registered.");
        try {
            const json = await utils.doBasicRequest(url, null, this._parent, utils.RequestType.JSON);
            return json.hasVoted;
        } catch (err) {
            if (err && err instanceof PenguinModAPIError && err.data && err.data.error === "Project not found") {
                throw "ProjectNotFound";
            }
            throw err;
        }
    }
    // TODO: /api/v1/projects/getproject
    // TODO: /api/v1/projects/getprojectwrapper
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
    // TODO: /api/v1/projects/toggleaccountcreation
    // TODO: /api/v1/projects/toggleuploading
    // TODO: /api/v1/projects/toggleviewing
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