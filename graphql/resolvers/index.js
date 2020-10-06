const notesResolver = require("./notes");
const authResolver = require("./auth");

const mainResolver = {
  ...authResolver,
  ...notesResolver,
};

module.exports = mainResolver;
