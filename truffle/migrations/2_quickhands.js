//const Token = artifacts.require("Token");
const QuickHands = artifacts.require("QuickHands");

module.exports = function (deployer) {
  deployer.deploy(QuickHands);
};
