const { getGraph } = require("../../helpers/linkUtils");
const { getFileTree } = require("../../helpers/filetreeUtils");
const { userComputed } = require("../../helpers/userUtils");

module.exports = {
  // Handle graph data as a global data file instead of computed data
  filetree: (data) => getFileTree(data),
  userComputed: (data) => userComputed(data)
};
