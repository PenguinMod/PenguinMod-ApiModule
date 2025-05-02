/**
 * @class This class is used to interact with specific projects.
 * Be careful that you do not waste requests by loading a bunch of project info to only use one or two fields.
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
        this.title = metadata.title;
        this.instructions = metadata.instructions;
        this.notes = metadata.notes;
        this.remix = metadata.remix;
        this.featured = metadata.featured;
        this.views = metadata.views;
        this.date = metadata.date;
        this.lastUpdate = metadata.lastUpdate;
        this.rating = metadata.rating;
        this.public = metadata.public;
        this.softRejected = metadata.softRejected;
        this.hardReject = metadata.hardReject;
        this.hardRejectTime = metadata.hardRejectTime;
        this.loves = metadata.loves;
        this.votes = metadata.votes;
    }
}

module.exports = PenguinModProject