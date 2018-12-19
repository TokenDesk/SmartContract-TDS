const BigNumber = require('bignumber.js');

const chai = require('chai');
chai.use(require('chai-as-promised'));
chai.use(require('chai-bignumber')(BigNumber));

const expect = chai.expect;

const OneEther = new BigNumber(web3.toWei(1, 'ether'));
const OneToken = new BigNumber(web3.toWei(1, 'ether'));
const TokendeskToken = artifacts.require("../contracts/TokendeskToken.sol");
const TokendeskToken721 = artifacts.require("../contracts/TokendeskToken721.sol");

contract('TokendeskToken Complex ICO', async (accounts) => {
	let token;
	let register721;
	before(async () => {
		register721 = await TokendeskToken721.new();
		token = await TokendeskToken.new(register721.address);
	});

	it('should always work', () => {});

	it('token mint token', async () => {
		await token.mintTokens([accounts[1]], [OneToken]);
		expect(await token.balanceOf(accounts[1])).to.be.bignumber.equal(OneToken);
	});

	it('fails to manually mint to 0x0 address', async () => {
		await expect(token.mintTokens([0], [OneToken])).eventually.rejected;
	});

	it('fails to manually mint 0 amount', async () => {
		await expect(token.mintTokens([accounts[1]], [0])).eventually.rejected;
	});

	it('fails to manually mint from other account', async () => {
		await expect(token.mintTokens([accounts[2]], [OneToken], {
			from: accounts[2]
		})).eventually.rejected;
	});

	it('owner can manually mint', async () => {
		await token.mintTokens([accounts[2]], [OneToken], {
			from: accounts[0]
		});

		expect(await token.balanceOf(accounts[2])).to.be.bignumber.equal(OneToken.mul(1));
	});

	it('fails to transfer tokens before ICO end', async () => {
		await expect(token.transfer(accounts[1], OneToken, {from : accounts[2]})).eventually.rejected;
	});

	it('mints to many addresses', async () => {
		await token.mintTokens([accounts[1], accounts[2]], [OneToken, OneToken]);

		expect(await token.balanceOf(accounts[1])).to.be.bignumber.equal(OneToken.mul(2));
		expect(await token.balanceOf(accounts[2])).to.be.bignumber.equal(OneToken.mul(2));
	});

	it('fails to mint to many addresses when array size unequal 1', async () => {
		await expect(token.mintTokens([accounts[1]], [OneToken, OneToken], {
			from: accounts[1]
		})).eventually.rejected;
	});

	it('fails to mint to many addresses when array size unequal 2', async () => {
		await expect(token.mintTokens([accounts[1], accounts[2]], [OneToken], {
			from: accounts[1]
		})).eventually.rejected;
	});

	it('fails to mint to many addresses when array is empty', async () => {
		await expect(token.mintTokens([], [], {
			from: accounts[1]
		})).eventually.rejected;
	});

	it('fails to mint to many addresses when array have > 100 elements', async () => {
		let receivers = [];
		let amounts = [];
		for (let i = 0; i < 101; i++) {
			receivers.push(accounts[0]);
			amounts.push(OneToken);
		}
		await expect(token.mintTokens(receivers, amounts, {
			from: accounts[1]
		})).eventually.rejected;
	});

	it('should manually mint tokens',  async () => {
		let receivers = [];
		let amounts = [];
		for (let i = 0; i < 100; i++) {
			receivers.push(accounts[1]);
			amounts.push(OneToken);
		}
		await expect(token.mintTokens(receivers, amounts)).eventually.fulfilled;

		expect(await token.balanceOf(accounts[1])).to.be.bignumber.equal(OneToken.mul(102));
	});

	it('should successfully close minting successfull', async () => {
		await expect(token.finishMinting()).eventually.fulfilled;
	});

	it('fails to mint when minting is finished', async () => {
		await expect(token.mintTokens([accounts[1], accounts[2]], [OneToken])).eventually.rejected;
	});

	it('set 721 minter', async () => {
		await expect(register721.addMinter(token.address)).eventually.fulfilled;
	});

	it('mint 721 token', async () => {
		const now = Math.round((new Date()).getTime() / 1000);
		await register721.mint(accounts[1], now);
		expect(await register721.balanceOf(accounts[1])).to.be.bignumber.equal(1);
	});

	it('mint again 721 token', async () => {
		const now = Math.round((new Date()).getTime() / 1000);
		await register721.mint(accounts[1], now);
		expect(await register721.balanceOf(accounts[1])).to.be.bignumber.equal(2);
	});

	it('transfer tokens after minting finished', async () => {
		await token.transfer(accounts[1], OneToken, {from : accounts[2]})

		expect(await token.balanceOf(accounts[1])).to.be.bignumber.equal(OneToken.mul(103));
		expect(await register721.balanceOf(accounts[2])).to.be.bignumber.equal(1);
	});

	it('transfer tokens twice', async () => {
		await token.transfer(accounts[1], OneToken, {from : accounts[2]})
		await token.transfer(accounts[2], OneToken, {from : accounts[1]})
		await token.transfer(accounts[2], OneToken, {from : accounts[1]})

		expect(await token.balanceOf(accounts[1])).to.be.bignumber.equal(OneToken.mul(102));
		expect(await token.balanceOf(accounts[2])).to.be.bignumber.equal(OneToken.mul(2));
		expect(await register721.balanceOf(accounts[1])).to.be.bignumber.equal(4);
		expect(await register721.balanceOf(accounts[2])).to.be.bignumber.equal(2);
	});

	it('should successfully mint with diferent function', async () => {
		await token.mint(accounts[1], OneToken);

		expect(await token.balanceOf(accounts[1])).to.be.bignumber.equal(OneToken.mul(103));
	});

});