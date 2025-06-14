class PenguinModAPIError extends Error {
    /**
     * Unknown error.
     * Note that this is the only error message that non-JSON requests will return, unless the request is parsed later.
     */
    static UNKNOWN = "Unknown";
    /**
     * Unknown HTTP error code.
     */
    static UNKNOWN_CODE = 0;

    /**
     * @param {string} message An error message that PenguinMod-BackendApi sent back
     * @param {string} detail Text representation of the error. 
     * @param {number} httpCode The HTTP error code returned from the API
     * @param {any} data Anything the API sent back when the error occurred.
     * @param {boolean} parsingError Whether or not this was caused by failing to parse an API response
     * @param {string} url The URL that was fetched.
     * @param {RequestInit} request The fetch options provided to fetch()
     * @param {Response} response The actual response after "fetch()"ing a URL.
     * @param {Error} error The original error that PenguinModAPIError was created after.
     */
    constructor(message, detail, httpCode, data, parsingError = false, url, request, response, error) {
        super(message);

        // Dont include the creation of PenguinModAPIError in the stack trace.
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, PenguinModAPIError);
        }

        this.name = "PenguinModAPIError";
        this.message = message;
        this.cause = error;

        this.detail = String(detail);
        this.data = data;

        this.httpCode = httpCode;
        this.parsing = parsingError;

        this.url = url;
        this.request = request;
        this.response = response;
    }

    toString() {
        return `${this.message}${this.httpCode && this.httpCode !== PenguinModAPIError.UNKNOWN_CODE ? ` [${this.httpCode}]` : ""} - ${this.detail.trim()} at ${this.url}`;
    }
}

module.exports = PenguinModAPIError;