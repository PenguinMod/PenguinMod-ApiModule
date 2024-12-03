const safeParseJSON = (possibleJson, forceObject) => {
    try {
        return JSON.parse(possibleJson);
    } catch {
        if (forceObject) {
            return {};
        }
        return possibleJson;
    }
};
const doBasicRequest = (url, options, doResolve, json) => {
    return new Promise((resolve, reject) => {
        fetch(url, options).then(response => {
            if (response.ok) {
                if (!doResolve) {
                    return resolve(response);
                }

                response.text().then(text => {
                    if (json) {
                        return resolve(safeParseJSON(text));
                    }
                    return resolve(text);
                }).catch(reject);
            } else {
                response.text().then(text => {
                    if (json) {
                        return reject(safeParseJSON(text), response.status);
                    }
                    return reject(text, response.status);
                }).catch(err => {
                    reject(err, response.status)
                });
            }
        }).catch(reject);
    });
};

/**
 * @class This class is used to interact with specific projects. Be careful that you do not waste requests by loading a bunch of project info to only use one or two fields.
 */
class PenguinModProject {
    /**
     * 
     * @param {string} apiUrl 
     * @param {string} projectId 
     * @param {{
     *      _id:string,
    *      id:string,
    *      author:{id:string, username:string},
    *      title:string,
    *      instructions:string,
    *      notes:string,
    *      remix:string,
    *      featured:boolean,
    *      views:number,
    *      date:number,
    *      lastUpdate:number,
    *      rating:string,
    *      public:boolean,
    *      softRejected:boolean,
    *      hardReject:boolean,
    *      hardRejectTime:number,
    *      loves:number,
    *      votes:number
    * }} metadata Metadata from the API.
     * @param {ArrayBuffer} thumbnail The thumbnail for a project. Should be a valid image format.
     * @param {ArrayBuffer} file The PenguinMod project file for a project. Should be the same as a .pmp file from the editor.
     * @private @param {*} _assets Meant for internal use. Use the file parameter.
     * @private @param {*} _protobuf Meant for internal use. Use the file parameter.
     */
    constructor(apiUrl, projectId, metadata, thumbnail, file, _assets, _protobuf) {
        /**
         * The base API url, will be the same as PenguinModAPI.globalApiUrl in normal use.
         * @type {string}
         */
        this.apiUrl = apiUrl;
        /**
         * The project ID meant for this project. Will be null for non-existent projects.
         * @type {string?}
         */
        this.projectId = projectId;
        /**
         * The thumbnail for this project. Should be a valid image format.
         * @type {ArrayBuffer?}
         */
        this.thumbnail = thumbnail;

        /**
         * The internal project ID meant for this project. Will be null for non-existent projects.
         * @type {string?}
         */
        this.internalId = null;
        this.author = null;
        this.title = null;
        this.instructions = null;
        this.notes = null;
        this.remix = null;
        this.featured = null;
        this.views = null;
        this.date = null;
        this.lastUpdate = null;
        this.rating = null;
        this.public = null;
        this.softRejected = null;
        this.hardReject = null;
        this.hardRejectTime = null;
        this.loves = null;
        this.votes = null;

        if (metadata) {
            this.setValuesFromMetadata(metadata);
        }

        /**
         * @private Meant for internal use. Use the file property.
         */
        this._assets = _assets;
        /**
         * @private Meant for internal use. Use the file property.
         */
        this._protobuf = _protobuf;
        /**
         * @private Meant for internal use. Use the file property.
         */
        this._file = null;
    }
    
    /**
     * Takes the metadata object from the API and sets all of the values in the class accordingly.
     * @param {{
     *      _id:string,
     *      id:string,
     *      author:{id:string, username:string},
     *      title:string,
     *      instructions:string,
     *      notes:string,
     *      remix:string,
     *      featured:boolean,
     *      views:number,
     *      date:number,
     *      lastUpdate:number,
     *      rating:string,
     *      public:boolean,
     *      softRejected:boolean,
     *      hardReject:boolean,
     *      hardRejectTime:number,
     *      loves:number,
     *      votes:number
     * }} metadata Metadata from the API.
     */
    setValuesFromMetadata(metadata) {
        this.internalId = metadata._id;
        this.author = null;
        this.title = null;
        this.instructions = null;
        this.notes = null;
        this.remix = null;
        this.featured = null;
        this.views = null;
        this.date = null;
        this.lastUpdate = null;
        this.rating = null;
        this.public = null;
        this.softRejected = null;
        this.hardReject = null;
        this.hardRejectTime = null;
        this.loves = null;
        this.votes = null;
    }
}

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
        return await doBasicRequest(this.globalApiUrl, null, true, true);
    }
    /**
     * This will get the API's server stats such as number of users and projects.
     * @link https://projects.penguinmod.com/api/v1/misc/getStats
     * @returns {Promise<{userCount:number, bannedCount:number, projectCount:number, remixCount:number, featuredCount:number}>} The statistics of the server's content.
     */
    static async getStats() {
        return await doBasicRequest(`${this.globalApiUrl}/misc/getStats`, null, true, true);
    }
    
    /**
     * Returns a boolean that is true if uploading is enabled for all users.
     * @link https://projects.penguinmod.com/api/v1/projects/canuploadprojects
     * @returns {Promise<boolean>}
     */
    static async canUploadProjects() {
        const canUploadObject = await doBasicRequest(`${this.globalApiUrl}/projects/canuploadprojects`, null, true, true);
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
        const canViewObject = await doBasicRequest(`${this.globalApiUrl}/projects/canviewprojects`, {
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

module.exports = PenguinModAPI;