const utils = require("../misc/utils.js");
const PenguinModProject = require("./PenguinModProject.js");

/**
 * @class This class is used to interface with general non-account related aspects of the PenguinMod API.
 */
class PenguinModAPI {
    /**
     * This is the API url used for all requests.
     * Default is "https://projects.penguinmod.com/api/v1"
     * @type {string}
     */
    static globalApiUrl = "https://projects.penguinmod.com/api/v1";

    /**
     * This will query the API url exactly, which should return API server information.
     * @link https://projects.penguinmod.com/api/v1
     * @returns The metadata for the current API version used.
     */
    static async getMetadata() {
        return await utils.doBasicRequest(this.globalApiUrl, null, true, true);
    }
    /**
     * This will get the API's server stats such as number of users and projects.
     * @link https://projects.penguinmod.com/api/v1/misc/getStats
     * @returns {Promise<{userCount:number, bannedCount:number, projectCount:number, remixCount:number, featuredCount:number}>} The statistics of the server's content.
     */
    static async getStats() {
        return await utils.doBasicRequest(`${this.globalApiUrl}/misc/getStats`, null, true, true);
    }
    
    /**
     * Returns a boolean that is true if uploading is enabled for all users.
     * @link https://projects.penguinmod.com/api/v1/projects/canuploadprojects
     * @returns {Promise<boolean>}
     */
    static async canUploadProjects() {
        const canUploadObject = await utils.doBasicRequest(`${this.globalApiUrl}/projects/canuploadprojects`, null, true, true);
        if (!canUploadObject) throw new Error("canuploadprojects returned a non-object");
        if (typeof canUploadObject !== "object") throw new Error("canuploadprojects returned a non-object");
        return canUploadObject.canUpload !== false;
    }
    /**
     * Returns a boolean that is true if viewing projects is enabled for all users.
     * @link https://projects.penguinmod.com/api/v1/projects/canviewprojects
     * @todo For some reason this is a POST request. There doesn't seem to be a reason for this, so it should be fixed on the backend at some point.
     * @returns {Promise<boolean>}
     */
    static async canViewProjects() {
        const canViewObject = await utils.doBasicRequest(`${this.globalApiUrl}/projects/canviewprojects`, {
            method: "POST"
        }, true, true);
        if (!canViewObject) throw new Error("canviewprojects returned a non-object");
        if (typeof canViewObject !== "object") throw new Error("canviewprojects returned a non-object");
        return canViewObject.viewing !== false;
    }

    /**
     * Returns a PenguinMod project under the specified project id.
     * @param {string} projectId The Project ID of the project, should be a string. This is because the ID may start with 0.
     * @param {"metadata"|"thumbnail"|"file"} requestType Determines what content to load in first.
     * @param {boolean} useFallbackProject If the project does not exist, setting this to true will return the "No project found" project.
     * @link https://projects.penguinmod.com/api/v1/projects/getProject
     * @returns {Promise<PenguinModProject>}
     */
    static async getProject(projectId, requestType, useFallbackProject) {
        
    }
}

module.exports = PenguinModAPI