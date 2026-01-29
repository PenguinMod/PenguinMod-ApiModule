# Project TODO

All of these TODOs should be completed before ApiModule is considered to have a "v1.0.0" release

## Generic

- [x] PenguinModAPIError (see src/misc/utils.js)
- [x] ApiModule header (see src/misc/utils.js)
- [x] Make TODOs in every PenguinModAPI file that lists which endpoints need to be implemented for that section
- [x] PenguinModProject interface (see src/classes/PenguinModAPIProjects.js)
- [ ] PenguinModDiscovery should probably be used on backend later on (rip ian)
- [ ] Move non-endpoint things like birthday or username validation into a generic class (see src/classes/PenguinModAPIUsers.js)

## Endpoint classes

Not listing individual endpoints for convenience, they are all listed within each class.

- [x] Finish PenguinModAPIMisc
- [ ] Finish PenguinModAPIProjects
- [ ] Finish PenguinModAPIUsers
  - [x] Finish everything but OAuth endpoints
  - [ ] Finish OAuth endpoints
