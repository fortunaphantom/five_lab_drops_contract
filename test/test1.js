const { expect } = require('chai');
const { BigNumber } = require('ethers');
const { ethers } = require('hardhat');
const Web3 = require('web3');

let owner, addr1, addr2, addr3;
let Token;
let token;

let provider = ethers.getDefaultProvider();

const contractName = 'Five_lab_Nft';

beforeEach(async function () {
  [owner, addr1, addr2, addr3] = await ethers.getSigners();
  Token = await ethers.getContractFactory(contractName);

  token = await Token.deploy(
    contractName,
    contractName,
    'https://braindance.mypinata.cloud/ipfs/QmeQ5fPkGVm1GXFe8FHfhdhz7ey3Aufraj7aSH3Vn9eEiG/',
    Web3.utils.toWei('0.001'),
    10,
    [
      addr1.address,
      addr2.address,
    ],
    [10, 90],
    owner.address,
    10,
    8
  );
});

describe('Token contract', function () {
  it('owner test', async function () {
    // owner test
    expect(await token.owner()).to.equal(owner.address);
  });

  it('Mint revert: value below price', async function () {
    // mint
    await expect(
      token.connect(owner).mint({ value: ethers.utils.parseEther('0.0001')})
    ).to.be.reverted;
  });

  it ('Mint price', async function () {
    const price = await token.price();
    console.log({price: ethers.utils.formatEther(price)});
  });

  it('Mint success, Balance testing', async function () {
    const n = 4;
    for (let i = 0; i < n; i++) {
      await token.connect(owner).mint({ value: ethers.utils.parseEther('0.001')});
    }
    
    const balance = await token.balanceOf(owner.address);
    expect(balance).equal(BigNumber.from(n));
    console.log({balance});
  });

  it('Mint success, owned tokens, total supply', async function () {
    const n = 6;
    for (let i = 0; i < n; i++) {
      await token.connect(owner).mint({ value: ethers.utils.parseEther('0.001')});
    }
    
    const owned = await token.ownedTokens(owner.address);
    console.log({owned});
    const totalSupply = await token.totalSupply();
    console.log({totalSupply});
  });

  it('Mint success, balance testing', async function () {
    const balance1 = await provider.getBalance(owner.address);
    console.log({balance1: ethers.utils.formatEther(balance1)});

    const n = 6;
    for (let i = 0; i < n; i++) {
      await token.connect(owner).mint({ value: ethers.utils.parseEther('0.001')});
    }

    const balance2 = await provider.getBalance(owner.address);
    console.log({balance2: ethers.utils.formatEther(balance2)});

    console.log("Contract balance: " + ethers.utils.formatEther(await provider.getBalance(token.address)));
  });
});
