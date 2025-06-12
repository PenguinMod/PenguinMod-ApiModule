# PenguinMod-ApiModule
PenguinMod-ApiModule is intended to make interacting with the PenguinMod API simple and easy.
Designed for use in other PenguinMod repositories only, but it may work for automating certain tasks on existing accounts only.

# User Notice
This module is designed for PenguinMod's own resporitories.
Use with caution in your own work, since breaking changes may be made often.

Use of this module for API spam or malicious activity will result in your IP being blocked.

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