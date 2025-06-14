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
        const json = await utils.doBasicRequest(`${this._parent.apiUrl}/v1/projects/canuploadprojects`, null, this._parent, true, true);
        return json.canUpload !== false;
    }
    /**
     * Returns a boolean that is true if viewing projects is enabled for all users.
     * @link https://projects.penguinmod.com/api/v1/projects/canviewprojects
     * @throws {PenguinModAPIError}
     * @returns {Promise<boolean>} True if viewing projects is enabled for all users.
     */
    async canViewProjects() {
        const json = await utils.doBasicRequest(`${this._parent.apiUrl}/v1/projects/canviewprojects`, null, this._parent, true, true);
        return json.viewing !== false;
    }
    // TODO: /api/v1/projects/getproject
    // TODO: /api/v1/projects/getprojects
    // TODO: /api/v1/projects/getprojectwrapper
    // TODO: /api/v1/projects/updateProject
    // TODO: /api/v1/projects/uploadProject
    // TODO: /api/v1/projects/getLoves
    // TODO: /api/v1/projects/getuserstatewrapper
    // TODO: /api/v1/projects/getVotes
    // TODO: /api/v1/projects/getWhoLoved
    // TODO: /api/v1/projects/getWhoVoted
    // TODO: /api/v1/projects/hasLoved
    // TODO: /api/v1/projects/hasLovedAdmin
    // TODO: /api/v1/projects/hasVoted
    // TODO: /api/v1/projects/hasVotedAdmin
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
}

module.exports = PenguinModAPIProjects;