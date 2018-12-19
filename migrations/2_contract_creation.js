const TokendeskToken = artifacts.require("./TokendeskToken.sol");
const TokendeskToken721 = artifacts.require("../contracts/TokendeskToken721.sol");


//await deployer.deploy(TokendeskToken, "TokendeskToken", "TokendeskToken")

module.exports = function(deployer, network, addresses) {
	deployer.deploy(TokendeskToken721).then(() => {
		return deployer.deploy(TokendeskToken, TokendeskToken721.address);
	})
}