# PenguinMod-ApiModule

PenguinMod-ApiModule is intended to make interacting with the PenguinMod API simple and easy.
Designed for use in other PenguinMod repositories only, but it may work for automating certain tasks on existing accounts only.

## Using this module

### User Notice

This module is designed for PenguinMod's own resporitories.
Use with caution in your own work, since breaking changes may be made often.

Use of this module for API spam or malicious activity will result in your IP being blocked.

[Terms of Service](https://penguinmod.com/terms)

[Privacy Policy](https://penguinmod.com/privacy)

### Tokens

You will need a PenguinMod account token to use the sign-in only endpoints.

#### NEVER SHARE YOUR PENGUINMOD TOKEN WITH OTHERS.
A PenguinMod moderator and developer will **NEVER** ask for your PenguinMod token. **You are being tricked if someone is asking for your token.**

#### NEVER USE YOUR PENGUINMOD TOKEN OR PASSWORD DIRECTLY IN YOUR CODE.
If you are developing code that can be found online, you should always be careful to never place your password or token in a place where people can access it.

Currently, you can obtain your `token` from LocalStorage under the key `token`:
```js
// NEVER SHARE YOUR PENGUINMOD TOKEN WITH OTHERS.
// A PenguinMod moderator and developer will NEVER ask for your PenguinMod token.
localStorage.getItem("token")
```
*This only works on the Home page at [penguinmod.com](https://penguinmod.com) [(PenguinMod-Home)](https://github.com/PenguinMod/PenguinMod-Home), your token is not available in the Editor.*

If your token was grabbed by another user, program, site, etc., you can reset it by changing your password or logging out of your account.

Tokens may also expire automatically after a long time.

### Errors

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

### Captcha-locked features

You will likely not be able to create accounts on the official PenguinMod servers programatically
using PenguinMod-ApiModule due to the requirement of a captcha token.

The `passwordLogin` endpoint also requires a captcha token, so you cannot log into an account using only it's password
on the official servers.

The `sendResetPasswordEmail` function also requires a captcha token.

If you do find a way to create accounts on the official PenguinMod servers, remember that use of PenguinMod-ApiModule for abuse or malicious activity
is against [PenguinMod's Terms of Service](https://penguinmod.com/terms) and will result in your IP being blocked.

If you want to create accounts (or login via password) on a local or custom version of PenguinMod-BackendApi without Cloudflare Captcha, you will
have to set the `.env` variable `CFCaptchaEnabled` to `false`. If you are also using PenguinMod-Home locally, you may also have to set
the `.env` variable `PUBLIC_CAPTCHA_ENABLED` to `false` there too.

Once the `CFCaptchaEnabled` variable is updated on the API, the `captcha_token` argument is no longer used by the API.

Here is a code example for making accounts locally:

```js
PenguinModClient.users.createAccount("MyRobot1", "a_super_safe_password", null, "01-01-2000", "US").then((token) => {
    PenguinModClient.setToken(token);
    // the new account can be used now
}).catch(console.log);
```

## Example

```js
const { PenguinModAPI } = require("../index");
const PenguinModClient = new PenguinModAPI({
    token: "super-secret-token", // NEVER share your account's token to anyone.
});

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
PenguinModClient.users.getPFP("PenguinMod").then(console.log).catch(console.log); // Uint8Array
PenguinModClient.users.getProfile("PenguinMod").then(console.log).catch(console.log); // Profile
PenguinModClient.users.userExists("PenguinMod").then(console.log).catch(console.log); // boolean
PenguinModClient.users.createAccount("MyRobot1", "a_super_safe_password", "cloudflare captcha token here", "01-01-2000", "US").then(console.log).catch(console.log); // string, returns the token for the new account
PenguinModClient.users.passwordLogin("PenguinMod", "totally_our_password", "cloudflare captcha token here").then(console.log).catch(console.log); // string, a new token to use
PenguinModClient.users.tokenLogin("an_account_token_here").catch(console.log); // void
PenguinModClient.users.getProjectCountOfUser("PenguinMod").then(console.log).catch(console.log); // number
PenguinModClient.users.getBadges("PenguinMod").then(console.log).catch(console.log); // Array<string>
PenguinModClient.users.resetPassword("exampleemail@example.com", "email state", "NewSecurePassword1234!").catch(console.log); // void
PenguinModClient.users.sendResetPasswordEmail("exampleemail@example.com", "cloudflare captcha token here").catch(console.log); // void

// projects endpoints
PenguinModClient.projects.canUploadProjects().then(console.log).catch(console.log); // boolean
PenguinModClient.projects.canViewProjects().then(console.log).catch(console.log); // boolean
PenguinModClient.projects.getProjects().then(console.log).catch(console.log); // [{...}], array of projects
PenguinModClient.projects.getLoves("sigma").then(console.log).catch(console.log); // number
PenguinModClient.projects.getVotes("sigma").then(console.log).catch(console.log); // number
PenguinModClient.projects.getUserState("sigma").then(console.log).catch(console.log); // { hasLoved:boolean, hasVoted:boolean }

// SIGN IN ONLY!
// misc endpoints
PenguinModClient.misc.getLastPolicyRead().then(console.log).catch(console.log); // {TOS:number, guidelines:number, privacyPolicy:number}
PenguinModClient.misc.markGuidelinesAsRead().catch(console.log); // void
PenguinModClient.misc.markTOSAsRead().catch(console.log); // void
PenguinModClient.misc.markPrivacyPolicyAsRead().catch(console.log); // void

// users endpoints
PenguinModClient.users.getInfo().then(console.log).catch(console.log); // SelfInfo
PenguinModClient.users.setBio("This is my About Me").catch(console.log); // void
PenguinModClient.users.blockUser("PenguinMod").catch(console.log); // void
PenguinModClient.users.hasBlocked("PenguinMod").then(console.log).catch(console.log); // boolean
PenguinModClient.users.getMyFeed().then(console.log).catch(console.log); // Array<FeedItem>
PenguinModClient.users.requestRankUp().then(() => console.log("success")).catch(console.log); // void
PenguinModClient.users.setEmail("exampleemail@example.com").catch(console.log); // void
PenguinModClient.users.changePassword("oldpassword", "newpassword").then(console.log).catch(console.log); // string, makes a new token for the account
PenguinModClient.users.filloutSafetyDetails("01-01-2000", "US").then(console.log).catch(console.log); // void
PenguinModClient.users.logout().catch(console.log); // void
PenguinModClient.users.getMessageCount().then(console.log).catch(console.log); // number
PenguinModClient.users.getUnreadMessageCount().then(console.log).catch(console.log); // number
PenguinModClient.users.markAllMessagesAsRead().catch(console.log); // void
PenguinModClient.users.markMessageAsRead("01JXQYAJF425G60QK1ENH7RQY0").catch(console.log); // void
PenguinModClient.users.changeUsername("SuperGuy3333").catch(console.log); // void
PenguinModClient.users.followUser("PenguinMod").catch(console.log); // void
PenguinModClient.users.sendVerifyEmail().catch(console.log); // void

// projects endpoints
PenguinModClient.projects.hasLoved("sigma").then(console.log).catch(console.log); // boolean
PenguinModClient.projects.hasVoted("sigma").then(console.log).catch(console.log); // boolean

// ADMIN ONLY!
// misc endpoints
// {illegalWords:Array<string>, illegalWebsites:Array<string>, spacedOutWordsOnly:Array<string>,
// potentiallyUnsafeWords:Array<string>, potentiallyUnsafeWordsSpacedOut:Array<string>, legalExtensions:Array<string>}
PenguinModClient.misc.getProfanityList().then(console.log).catch(console.log);
PenguinModClient.misc.setLastPolicyUpdate(["guidelines", "tos", "privacyPolicy"]).catch(console.log); // void
PenguinModClient.misc.setProfanityList({ "illegalWords": ["badword"] }).catch(console.log); // void

// projects endpoints
PenguinModClient.projects.hasLovedAdmin("sigma", "PenguinMod").then(console.log).catch(console.log); // boolean
PenguinModClient.projects.hasVotedAdmin("sigma", "PenguinMod").then(console.log).catch(console.log); // boolean
```
