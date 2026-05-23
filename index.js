const PenguinMod = require("./src/index.js");
module.exports = PenguinMod;

const api = new PenguinMod.PenguinModAPI();

api.projects.getRandomProject().then((res) => console.log(res));
