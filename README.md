# PenguinMod-ApiModule
PenguinMod-ApiModule is intended to make interacting with the PenguinMod API simple and easy. Designed for use in other PenguinMod repositories only, but it may work for automating certain tasks on existing accounts only.

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
```