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
        const json = await utils.doBasicRequest(
            `${this._parent.apiUrl}/v1/projects/canuploadprojects`,
            null,
            this._parent,
            utils.RequestType.JSON,
        );
        return json.canUpload !== false;
    }
    /**
     * Returns a boolean that is true if viewing projects is enabled for all users.
     * @link https://projects.penguinmod.com/api/v1/projects/canviewprojects
     * @throws {PenguinModAPIError}
     * @returns {Promise<boolean>} True if viewing projects is enabled for all users.
     */
    async canViewProjects() {
        const json = await utils.doBasicRequest(
            `${this._parent.apiUrl}/v1/projects/canviewprojects`,
            null,
            this._parent,
            utils.RequestType.JSON,
        );
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
            const json = await utils.doBasicRequest(
                `${this._parent.apiUrl}/v1/projects/getLoves?projectID=${encodeURIComponent(projectId)}`,
                null,
                this._parent,
                utils.RequestType.JSON,
            );
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
            const json = await utils.doBasicRequest(
                `${this._parent.apiUrl}/v1/projects/getVotes?projectID=${encodeURIComponent(projectId)}`,
                null,
                this._parent,
                utils.RequestType.JSON,
            );
            return json.votes;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Gets a list of all projects uploaded by ranked users on the site.
     * If logged in as a moderator, this will also include projects uploaded by unranked users.
     * @link https://projects.penguinmod.com/api/v1/projects/getprojects
     * @param {number?} page Determines which page of projects should be returned. If not provided, page will be 0.
     * @param {boolean?} reverse Whether or not to show oldest projects first. Default is false.
     * @param {boolean?} login Whether or not to provide login info. Should be true for moderators who want to see unranked user's projects. Default is true.
     * @throws {PenguinModAPIError} Can also throw if viewing projects is disabled.
     * @returns {Promise<Array<PenguinModTypes.Project>>} An array of PenguinMod projects.
     */
    async getProjects(page, reverse, login) {
        try {
            const url = new URL(
                `${this._parent.apiUrl}/v1/projects/getprojects`,
            );
            if (typeof page === "number") {
                url.searchParams.set("page", page);
            }
            if (typeof reverse === "boolean") {
                url.searchParams.set("reverse", reverse);
            }
            if (login !== false && this._parent.token) {
                url.searchParams.set("token", this._parent.token);
            }
            const json = await utils.doBasicRequest(
                url.toString(),
                null,
                this._parent,
                utils.RequestType.JSON,
            );
            return json;
        } catch (err) {
            throw err;
        }
    }
    /**
     * Gets a list of all projects uploaded by a user on the site.
     * @link https://projects.penguinmod.com/api/v1/projects/getprojectsbyauthor
     * @param {string} authorUsername The user to look at.
     * @param {number?} page Which page of projects to look at. If not provided, page will be 0.
     * @param {boolean?} login Whether or not to provide login info. Should be true for moderators who want to see private user's projects. Default is true.
     * @throws {PenguinModAPIError}
     * @returns {Promise<Array<PenguinModTypes.Project>>} An array of PenguinMod projects.
     */
    async getProjectsByAuthor(authorUsername, page, login) {
        const url = new URL(
            `${this._parent.apiUrl}/v1/projects/getprojectsbyauthor`,
        );
        url.searchParams.set("authorUsername", authorUsername);
        if (typeof page === "number") {
            url.searchParams.set("page", page);
        }
        if (login !== false && this._parent.token) {
            url.searchParams.set("token", this._parent.token);
        }
        const json = await utils.doBasicRequest(
            url.toString(),
            null,
            this._parent,
            utils.RequestType.JSON,
        );
        return json;
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
        utils.assert(
            !!this._parent.token,
            url,
            "Reauthenticate",
            "No token is registered.",
        );
        try {
            const json = await utils.doBasicRequest(
                url,
                null,
                this._parent,
                utils.RequestType.JSON,
            );
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
        utils.assert(
            !!this._parent.token,
            url,
            "Reauthenticate",
            "No token is registered.",
        );
        try {
            const json = await utils.doBasicRequest(
                url,
                null,
                this._parent,
                utils.RequestType.JSON,
            );
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
        utils.assert(
            !!this._parent.token,
            url,
            "Reauthenticate",
            "No token is registered.",
        );
        try {
            const json = await utils.doBasicRequest(
                url,
                null,
                this._parent,
                utils.RequestType.JSON,
            );
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
        utils.assert(
            !!this._parent.token,
            url,
            "Reauthenticate",
            "No token is registered.",
        );
        try {
            const json = await utils.doBasicRequest(
                url,
                null,
                this._parent,
                utils.RequestType.JSON,
            );
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
        utils.assert(
            !!this._parent.token,
            url,
            "Reauthenticate",
            "No token is registered.",
        );
        try {
            const json = await utils.doBasicRequest(
                url,
                null,
                this._parent,
                utils.RequestType.JSON,
            );
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
        utils.assert(
            !!this._parent.token,
            url,
            "Reauthenticate",
            "No token is registered.",
        );
        const json = await utils.doBasicRequest(
            url,
            null,
            this._parent,
            utils.RequestType.JSON,
        );
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
        utils.assert(
            !!this._parent.token,
            url,
            "Reauthenticate",
            "No token is registered.",
        );
        const json = await utils.doBasicRequest(
            url,
            null,
            this._parent,
            utils.RequestType.JSON,
        );
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
        utils.assert(
            !!this._parent.token,
            url,
            "Reauthenticate",
            "No token is registered.",
        );
        await utils.doBasicRequest(
            url,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: this._parent.token,
                    target,
                    newId,
                }),
            },
            this._parent,
            utils.RequestType.None,
        );
    }

    /**
     * Gets the metadata from a project.
     * @link https://projects.penguinmod.com/api/v1/projects/getproject
     * @param {string} projectID The ID of the project to pull from.
     * @throws {PenguinModAPIError} Can also throw if viewing projects is disabled.
     * @returns {Promise<PenguinModTypes.Project>} The project information
     */
    async getProjectMeta(projectID) {
        const url = `${this._parent.apiUrl}/v1/projects/getproject?requestType=metadata&projectID=${encodeURIComponent(projectID)}`;
        const json = await utils.doBasicRequest(
            url,
            null,
            this._parent,
            utils.RequestType.JSON,
        );
        return json;
    }
    /**
     * Gets the thumbnail from a project.
     * @link https://projects.penguinmod.com/api/v1/projects/getproject
     * @param {string} projectID The ID of the project to pull from.
     * @throws {PenguinModAPIError} Can also throw if viewing projects is disabled.
     * @returns {Promise<ArrayBuffer>} The project thumbnail
     */
    async getProjectThumbnail(projectID) {
        const url = `${this._parent.apiUrl}/v1/projects/getproject?requestType=thumbnail&projectID=${encodeURIComponent(projectID)}`;
        const arrayBuffer = await utils.doBasicRequest(
            url,
            null,
            this._parent,
            utils.RequestType.ArrayBuffer,
        );
        return arrayBuffer;
    }

    /**
     * Get the url to a project's thumbnail. The URL can be used in an html image element's src field.
     * @param {string} project_id The ID of the project.
     * @returns {string} The url to the project's thumbnail.
     */
    getProjectThumbnailURL(project_id) {
        return `${this._parent.apiUrl}/v1/projects/getproject?projectID=${encodeURIComponent(project_id)}&requestType=thumbnail`;
    }

    /**
     * Gets a project file from the server
     * @link https://projects.penguinmod.com/api/v1/projects/getprojectwrapper
     * @param {string} projectId The ID of the project to pull from.
     * @param {boolean?} assets If false, will not return any assets in the .pmp project.
     * @throws {PenguinModAPIError} Can also throw if viewing projects is disabled.
     * @returns {Promise<ArrayBuffer>} The .pmp project
     */
    async getProjectFile(projectId, assets) {
        const url = `${this._parent.apiUrl}/v1/projects/getprojectwrapper?projectId=${encodeURIComponent(projectId)}${typeof assets === "boolean" ? `&assets=${encodeURIComponent(assets)}` : ""}`;
        const json = await utils.doBasicRequest(
            url,
            null,
            this._parent,
            utils.RequestType.JSON,
        );

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
        utils.assert(
            !!this._parent.token,
            url,
            "Reauthenticate",
            "No token is registered.",
        );
        await utils.doBasicRequest(
            url,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: this._parent.token,
                    toggle,
                }),
            },
            this._parent,
            utils.RequestType.None,
        );
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
        utils.assert(
            !!this._parent.token,
            url,
            "Reauthenticate",
            "No token is registered.",
        );
        await utils.doBasicRequest(
            url,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: this._parent.token,
                    toggle,
                }),
            },
            this._parent,
            utils.RequestType.None,
        );
    }

    /**
     * Toggles if we have/have not loved this project.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/projects/interactions/loveToggle
     * @param {string} project The projects ID.
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async loveProject(project) {
        const url = `${this._parent.apiUrl}/v1/projects/interactions/loveToggle`;
        utils.assert(
            !!this._parent.token,
            url,
            "Reauthenticate",
            "No token is registered.",
        );
        await utils.doBasicRequest(
            url,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: this._parent.token,
                    project,
                }),
            },
            this._parent,
            utils.RequestType.None,
        );
    }

    /**
     * Toggles if we have/have not voted for this project.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/projects/interactions/voteToggle
     * @param {string} project The projects ID.
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async voteProject(project) {
        const url = `${this._parent.apiUrl}/v1/projects/interactions/voteToggle`;
        utils.assert(
            !!this._parent.token,
            url,
            "Reauthenticate",
            "No token is registered.",
        );
        await utils.doBasicRequest(
            url,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: this._parent.token,
                    project,
                }),
            },
            this._parent,
            utils.RequestType.None,
        );
    }

    /**
     * Registers that this account has seen this project.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/projects/interactions/registerView
     * @param {string} project The projects ID.
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async viewProject(project) {
        const url = `${this._parent.apiUrl}/v1/projects/interactions/registerView`;
        utils.assert(
            !!this._parent.token,
            url,
            "Reauthenticate",
            "No token is registered.",
        );
        await utils.doBasicRequest(
            url,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: this._parent.token,
                    project,
                }),
            },
            this._parent,
            utils.RequestType.None,
        );
    }

    /**
     * Requests that less of this kind of project be suggested.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/projects/interactions/showMeLess
     * @param {string} project The projects ID.
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async showMeLessOf(project) {
        const url = `${this._parent.apiUrl}/v1/projects/interactions/showMeLess`;
        utils.assert(
            !!this._parent.token,
            url,
            "Reauthenticate",
            "No token is registered.",
        );
        await utils.doBasicRequest(
            url,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: this._parent.token,
                    project,
                }),
            },
            this._parent,
            utils.RequestType.None,
        );
    }

    /**
     * Requests that more of this kind of project be suggested.
     * Requires token.
     * @link https://projects.penguinmod.com/api/v1/projects/interactions/showMeMore
     * @param {string} project The projects ID.
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async showMeMoreOf(project) {
        const url = `${this._parent.apiUrl}/v1/projects/interactions/showMeMore`;
        utils.assert(
            !!this._parent.token,
            url,
            "Reauthenticate",
            "No token is registered.",
        );
        await utils.doBasicRequest(
            url,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: this._parent.token,
                    project,
                }),
            },
            this._parent,
            utils.RequestType.None,
        );
    }

    /**
     * Manually sets a project to either be featured or not. Alerts the project owner when featuring.
     * Requires token.
     * Only accessible on admin accounts.
     * @link https://projects.penguinmod.com/api/v1/projects/manualfeature
     * @param {string} project The projects ID.
     * @param {boolean} featured If the project should or should not be featured.
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async toggleProjectFeatured(project, featured) {
        const url = `${this._parent.apiUrl}/v1/projects/manualfeature`;
        utils.assert(
            !!this._parent.token,
            url,
            "Reauthenticate",
            "No token is registered.",
        );
        await utils.doBasicRequest(
            url,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: this._parent.token,
                    project,
                    toggle: featured,
                }),
            },
            this._parent,
            utils.RequestType.None,
        );
    }

    /**
     * Sets if a project can/can not be community featured. This does not control the ability for a project to manually be featured, nor does it remove the existing feature status.
     * Requires token.
     * Only accessible on admin accounts.
     * @link https://projects.penguinmod.com/v1/projects/setCanBeFeatured
     * @param {string} project The project ID.
     * @param {boolean} featurable If the project should/should not be able to be featured.
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async setCanBeFeatured(project, featurable) {
        const url = `${this._parent.apiUrl}/v1/projects/setCanBeFeatured`;
        utils.assert(
            !!this._parent.token,
            url,
            "Reauthenticate",
            "No token is registered.",
        );
        await utils.doBasicRequest(
            url,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: this._parent.token,
                    project,
                    toggle: featurable,
                }),
            },
            this._parent,
            utils.RequestType.None,
        );
    }

    /**
     * Search for projects.
     * @param {string} query The query to be searched.
     * @param {string} type The type of search. "featured", "newest", "uploaddate", and "views". Defaults to views.
     * @param {number} page The page of the search. Defaults to 0.
     * @param {boolean} reverse Whether or not to reverse the sorting. For example, if sorting by newest, when reversed, it will sort by oldest. Defaults to false.
     * @throws {PenguinModAPIError}
     * @returns {Promise<Array<PenguinModTypes.Project>>}
     */
    async searchProjects(query, type = "views", page = 0, reverse = false) {
        const url = `${this._parent.apiUrl}/v1/projects/searchprojects?query=${query}&type=${type}&page=${page}&reverse=${reverse}&token=${this._parent.token}`;
        return await utils.doBasicRequest(
            url,
            null,
            this._parent,
            utils.RequestType.JSON,
        );
    }

    /**
     * For internal use. Gets the size of a project based off its parts, then
     * @param {Blob} protobuf The project.json protobuf
     * @param {([Blob, string])[]} assets The project assets
     * @param {Blob?} thumbnail The thumbnail of the project
     * @param {string} url The url of the request, used for errors
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async _checkProjectSize(protobuf, assets, thumbnail, url) {
        const check_asset = (blob, error) => {
            if (
                blob.size >
                Number(this._parent.maxAssetSize) *
                    (is_donator ? 1.75 : 1) *
                    1024 *
                    1024
            ) {
                throw error;
            }
        };
        for (const asset of assets) {
            check_asset(
                asset[0],
                new PenguinModAPIError(
                    "AssetTooLarge",
                    "One of your assets is too large",
                ),
            );
        }
        check_asset(
            thumbnail,
            new PenguinModAPIError(
                "ThumbnailTooLarge",
                "Your project thumbnail exceeds the file size limit.",
            ),
        );

        const size = assets.reduce(
            (c, v) => c + v[0].size,
            protobuf.size + (thumbnail ? thumbnail.size : 0),
        );

        const is_donator = (await this._parent.users.getInfo()).badges.includes(
            "donator",
        );

        if (
            size >
            Number(this._parent.maxUploadSize) *
                (is_donator ? 1.75 : 1) *
                1024 *
                1024
        )
            throw new PenguinModAPIError(
                "ProjectTooLarge",
                "Your project is too large (the total size is over the limit)",
                PenguinModAPIError.UNKNOWN_CODE,
                null,
                false,
                url,
                null,
                null,
                null,
            );
    }

    /**
     * Upload a project
     * @param {Blob} project The PMP file
     * @param {Blob} thumbnail The thumbnail image
     * @param {string} title
     * @param {string} instructions
     * @param {string} notes
     * @param {string} remix
     * @throws {PenguinModAPIError} for errors such as title, instructions, or notes being too long, or errors with uploading
     * @returns {Promise<string>} The ID of the now uploaded project
     */
    async uploadProject(
        project,
        thumbnail,
        title,
        instructions,
        notes,
        remix = "0",
    ) {
        if (!project || !thumbnail) {
            throw new PenguinModAPIError(
                "MissingFiles",
                "Missing project file or thumbnail",
                PenguinModAPIError.UNKNOWN_CODE,
                null,
                false,
                url,
                null,
                null,
                null,
            );
        }

        const url = `${this._parent.apiUrl}/v1/projects/uploadProject`;

        const { json, assets } = await pmp_protobuf.PMPToParts(
            await project.arrayBuffer(),
        );
        const protobuf_u8a = pmp_protobuf.jsonToProtobuf(json);
        const protobuf = new Blob([protobuf_u8a]);

        await this._checkProjectSize(protobuf, assets, thumbnail, url);

        if (
            title.length > 100 ||
            instructions.length > 4096 ||
            notes.length > 4096
        ) {
            throw new PenguinModAPIError(
                "ProjectInfoTooLong",
                "Project title, instructions, or notes are too long",
                PenguinModAPIError.UNKNOWN_CODE,
                null,
                false,
                url,
                null,
                null,
                null,
            );
        }

        const formData = new FormData();

        formData.append("token", this._parent.token);
        formData.append("title", title);
        formData.append("instructions", instructions);
        formData.append("notes", notes);
        formData.append("remix", remix);
        assets.forEach((ent) => formData.append("assets", ...ent));
        formData.append("jsonFile", protobuf);
        formData.append("thumbnail", thumbnail);

        const { id } = await utils.doBasicRequest(
            url,
            {
                method: "POST",
                body: formData,
            },
            this._parent,
            utils.RequestType.JSON,
        );

        return id;
    }

    /**
     * Updates a project
     * Can be called by either the project owner or a moderator/admin.
     * @param {string} projectID ID of the project to be updated
     * @param {Blob?} project The PMP file, or null if not updating the file
     * @param {Blob?} thumbnail The thumbnail image, or null if not updating the thumbnail
     * @param {string} title
     * @param {string} instructions
     * @param {string} notes
     * @throws {PenguinModAPIError} for errors such as title, instructions, or notes being too long, or errors with uploading
     * @returns {Promise<void>}
     */
    async updateProject(
        projectID,
        project,
        thumbnail,
        title,
        instructions,
        notes,
    ) {
        const updating_file = project != null;
        const updating_thumb = thumbnail != null;

        if (!projectID) {
            throw new PenguinModAPIError(
                "MissingID",
                "Missing project ID",
                PenguinModAPIError.UNKNOWN_CODE,
                null,
                false,
                url,
                null,
                null,
                null,
            );
        }

        const url = `${this._parent.apiUrl}/v1/projects/updateProject`;

        let protobuf;
        let assets;

        if (updating_file) {
            const { json, assets: assets_ } = await pmp_protobuf.PMPToParts(
                await project.arrayBuffer(),
            );
            assets = assets_;
            const protobuf_u8a = pmp_protobuf.jsonToProtobuf(json);
            protobuf = new Blob([protobuf_u8a]);

            await this._checkProjectSize(protobuf, assets, thumbnail, url);
        }

        if (
            title.length > 100 ||
            instructions.length > 4096 ||
            notes.length > 4096
        ) {
            throw new PenguinModAPIError(
                "ProjectInfoTooLong",
                "Project title, instructions, or notes are too long",
                PenguinModAPIError.UNKNOWN_CODE,
                null,
                false,
                url,
                null,
                null,
                null,
            );
        }

        const formData = new FormData();

        formData.append("projectID", projectID);
        formData.append("token", this._parent.token);
        formData.append("title", title);
        formData.append("instructions", instructions);
        formData.append("notes", notes);
        if (updating_file) {
            assets.forEach((ent) => formData.append("assets", ...ent));
            formData.append("jsonFile", protobuf);
        }
        if (updating_thumb) {
            formData.append("thumbnail", thumbnail);
        }

        await utils.doBasicRequest(
            url,
            {
                method: "POST",
                body: formData,
            },
            this._parent,
            utils.RequestType.JSON,
        );
    }

    /**
     * Gets the sections and information used to display the front page.
     * If logged in as a moderator, this will also include projects uploaded by unranked users.
     * @link https://projects.penguinmod.com/api/v1/projects/frontpage
     * @param {boolean?} login Whether or not to provide login info. Should be true for moderators who want to see unranked user's projects. Default is true.
     * @throws {PenguinModAPIError}
     * @returns {Promise<PenguinModTypes.FrontPageResults>} The resulting sections and information for the front page.
     */
    async getFrontPage(login) {
        const url = new URL(`${this._parent.apiUrl}/v1/projects/frontpage`);
        if (login !== false && this._parent.token) {
            url.searchParams.set("token", this._parent.token);
        }
        const json = await utils.doBasicRequest(
            url.toString(),
            null,
            this._parent,
            utils.RequestType.JSON,
        );
        return json;
    }

    /**
     * Get some random projects.
     * @param {number} n The number of projects to fetch. Defaults to 0. Max is the max page size (usually 20).
     * @throws {PenguinModAPIError}
     * @returns {Promise<Array<PenguinModTypes.Project>>}
     */
    async getRandomProjects(n = 1) {
        const url = `${this._parent.apiUrl}/v1/projects/getrandomproject?n=${n}`;
        return await utils.doBasicRequest(
            url,
            null,
            this._parent,
            utils.RequestType.JSON,
        );
    }

    /**
     * Get the featured projects.
     * @param {number} page The page to fetch. Defaults to 0.
     * @throws {PenguinModAPIError}
     * @returns {Promise<Array<PenguinModTypes.Project>>}
     */
    async getFeaturedProjects(page = 0) {
        const url = `${this._parent.apiUrl}/v1/projects/getfeaturedprojects?page=${page}`;
        return await utils.doBasicRequest(
            url,
            null,
            this._parent,
            utils.RequestType.JSON,
        );
    }

    /**
     * Get the current users projects.
     * Requires token.
     * @param {number} page The page to fetch. Defaults to 0.
     * @throws {PenguinModAPIError}
     * @returns {Promise<Array<PenguinModTypes.Project>>}
     */
    async getMyProjects(page = 0) {
        const url = `${this._parent.apiUrl}/v1/projects/getmyprojects?token=${this._parent.token}&page=${page}`;
        utils.assert(
            !!this._parent.token,
            url,
            "Reauthenticate",
            "No token is registered.",
        );
        return await utils.doBasicRequest(
            url,
            null,
            this._parent,
            utils.RequestType.JSON,
        );
    }

    /**
     * Get the remixes of a specified project.
     * @param {string} projectID The ID of the project to get the remixes of.
     * @param {number} page The page to fetch. Defaults to 0.
     * @throws {PenguinModAPIError}
     * @returns {Promise<Array<PenguinModTypes.Project>>}
     */
    async getRemixes(projectID, page = 0) {
        const url = `${this._parent.apiUrl}/v1/projects/getremixes?projectID=${projectID}&page=${page}`;
        return await utils.doBasicRequest(
            url,
            null,
            this._parent,
            utils.RequestType.JSON,
        );
    }

    /**
     * Removes a projects thumbnail. Mod only.
     * Requires token.
     * @param {string} projectID The projects ID.
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async deleteThumbnail(projectID) {
        const url = `${this._parent.apiUrl}/v1/projects/deletethumb`;
        utils.assert(
            !!this._parent.token,
            url,
            "Reauthenticate",
            "No token is registered.",
        );
        await utils.doBasicRequest(
            url,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: this._parent.token,
                    projectID,
                }),
            },
            this._parent,
            utils.RequestType.None,
        );
    }

    /**
     * Restores a soft rejected project. Mod only.
     * Requires token.
     * @param {string} projectID The projects ID.
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async restoreProject(projectID) {
        const url = `${this._parent.apiUrl}/v1/projects/restore`;
        utils.assert(
            !!this._parent.token,
            url,
            "Reauthenticate",
            "No token is registered.",
        );
        await utils.doBasicRequest(
            url,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: this._parent.token,
                    project: projectID,
                }),
            },
            this._parent,
            utils.RequestType.None,
        );
    }

    /**
     * Hard rejects a project. Mod only.
     * Requires token.
     * @param {string} projectID The projects ID.
     * @param {string} message The message to be sent to the user and logged.
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async hardRejectProject(projectID, message) {
        const url = `${this._parent.apiUrl}/v1/projects/hardreject`;
        utils.assert(
            !!this._parent.token,
            url,
            "Reauthenticate",
            "No token is registered.",
        );
        await utils.doBasicRequest(
            url,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: this._parent.token,
                    project: projectID,
                    message,
                }),
            },
            this._parent,
            utils.RequestType.None,
        );
    }

    /**
     * Soft rejects a project. Mod only.
     * Requires token.
     * @param {string} projectID The projects ID.
     * @param {string} message The message to be sent to the user and logged.
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async softRejectProject(projectID, message) {
        const url = `${this._parent.apiUrl}/v1/projects/softreject`;
        utils.assert(
            !!this._parent.token,
            url,
            "Reauthenticate",
            "No token is registered.",
        );
        await utils.doBasicRequest(
            url,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: this._parent.token,
                    project: projectID,
                    message,
                }),
            },
            this._parent,
            utils.RequestType.None,
        );
    }

    /**
     * Deletes a project. Either by the author or an admin.
     * Requires token.
     * @param {string} projectID The projects ID.
     * @param {string?} reason The message to be sent to the user and logged if an admin is deleting the project.
     * @throws {PenguinModAPIError}
     * @returns {Promise<null>}
     */
    async deleteProject(projectID, reason) {
        const url = `${this._parent.apiUrl}/v1/projects/hardDeleteProject`;
        utils.assert(
            !!this._parent.token,
            url,
            "Reauthenticate",
            "No token is registered.",
        );
        await utils.doBasicRequest(
            url,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: this._parent.token,
                    project: projectID,
                    reason,
                }),
            },
            this._parent,
            utils.RequestType.None,
        );
    }

    /**
     * Downloads a hard rejected project. Either by the author or an admin.
     * Requires token.
     * @param {string} projectID The projects ID.
     * @throws {PenguinModAPIError}
     * @returns {Promise<{project:ArrayBuffer, assets: Array<{id:string, buffer: ArrayBuffer}>}>}
     */
    async downloadHardReject(projectID) {
        const url = `${this._parent.apiUrl}/v1/projects/downloadHardReject?token=${this._parent.token}&project=${projectID}`;
        utils.assert(
            !!this._parent.token,
            url,
            "Reauthenticate",
            "No token is registered.",
        );
        return await utils.doBasicRequest(
            url,
            null,
            this._parent,
            utils.RequestType.JSON,
        );
    }
}

module.exports = PenguinModAPIProjects;
