# PenguinMod-ApiModule
PenguinMod-ApiModule is intended to make interacting with the PenguinMod API simple and easy.
Designed for use in other PenguinMod repositories only, but it may work for automating certain tasks on existing accounts only.

# Using this module
## User Notice
This module is designed for PenguinMod's own resporitories.
Use with caution in your own work, since breaking changes may be made often.

Use of this module for API spam or malicious activity will result in your IP being blocked.

## Errors
Errors thrown by the API will reject with a `PenguinModAPIError`.

If an endpoint uses a JSON response, `PenguinModAPIError.message` will return the `error` property in the JSON response.

If an endpoint uses a text response, `PenguinModAPIError.message` will return the entire text response.

In some error cases, the `PenguinModAPIError.message` property can instead be one of these values:
- `"FetchFailed"`: Used if the fetch fails entirely.
- `"ParseJSONFailed"`: Used if a JSON response was expected but the JSON was invalid.
    - You can still get the API response from `PenguinModAPIError.data` in this case.
- `"ParseTextFailed"`: Used if `Response.text()` somehow fails.

You can also get the full API response with `PenguinModAPIError.data`.

To get the original `Error` instance, use `PenguinModAPIError.cause`. Note that this will be null if the fetch succeeded, and the API just returned it's own error.

Other notable `PenguinModAPIError` properties:
- `httpCode:number`: The HTTP error code that the API returned.
    - If the fetch failed in a way where the `Response` object was never accessible
    (usually CORS error in browser), this will be `PenguinModAPIError.UNKNOWN_CODE`.
- `parsing:boolean`: Will be `true` if the error was caused by failing to parse the response.
- `url:string`: The URL that was being fetched.
- `request:RequestInit?`: The request's options, if present.
- `response:Response?`: The fetch response, if present.

The `PenguinModAPIError` class is exported by this module if you need it for any purpose.

## Example
```js
const { PenguinModAPI } = require("../index");
const PenguinModClient = new PenguinModAPI();

// core endpoints
PenguinModClient.checkOnline().then(console.log).catch(console.log); // boolean
PenguinModClient.getMetadata().then(console.log).catch(console.log); // {} arbitrary object

// misc endpoints
// {userCount:number, bannedCount:number, projectCount:number, remixCount:number, featuredCount:number, totalViews:number, mongodb_stats:object}
PenguinModClient.misc.getStats().then(console.log).catch(console.log);
PenguinModClient.misc.getLastPolicyUpdate().then(console.log).catch(console.log); // {TOS:number, guidelines:number, privacyPolicy:number}

// users endpoints
PenguinModClient.users.getId("PenguinMod").then(console.log).catch(console.log); // string
PenguinModClient.users.getUsername("01JPZVED48ZT6H4VVMBZT6V2PE").then(console.log).catch(console.log); // string

// projects endpoints
PenguinModClient.projects.canUploadProjects().then(console.log).catch(console.log); // boolean
PenguinModClient.projects.canViewProjects().then(console.log).catch(console.log); // boolean
PenguinModClient.projects.getProjects().then(console.log).catch(console.log); // [{...}], array of projects
PenguinModClient.projects.getLoves("sigma").then(console.log).catch(console.log); // number
PenguinModClient.projects.getVotes("sigma").then(console.log).catch(console.log); // number

// SIGN IN ONLY!
// misc endpoints
PenguinModClient.misc.getLastPolicyRead().then(console.log).catch(console.log); // {TOS:number, guidelines:number, privacyPolicy:number}
PenguinModClient.misc.markGuidelinesAsRead().catch(console.log); // void
PenguinModClient.misc.markTOSAsRead().catch(console.log); // void
PenguinModClient.misc.markPrivacyPolicyAsRead().catch(console.log); // void

// ADMIN ONLY!
// misc endpoints
// {illegalWords:Array<string>, illegalWebsites:Array<string>, spacedOutWordsOnly:Array<string>,
// potentiallyUnsafeWords:Array<string>, potentiallyUnsafeWordsSpacedOut:Array<string>, legalExtensions:Array<string>}
PenguinModClient.misc.getProfanityList().then(console.log).catch(console.log);
PenguinModClient.misc.setLastPolicyUpdate(["guidelines", "tos", "privacyPolicy"]).catch(console.log); // void
PenguinModClient.misc.setProfanityList({ "illegalWords": ["badword"] }).catch(console.log); // void
```