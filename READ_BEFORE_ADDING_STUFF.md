# Notice

Everything should be designed so the API can stop relying on `username` or `id`s being supplied to endpoints to identify the **logged in** user.
It should be able to eventually rely entirely on the `token` to get `id` or `username`.

Everything should also be accessible just from the `PenguinModAPI` class, unless it's not connected to the Projects API.
A good example of this would be adding support for stuff like the Basic API or Storage Extension API, but that shouldn't be a priority until the Projects API is fully implemented.
