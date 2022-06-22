const hre = require('hardhat');
const fs = require('fs-extra');
const ethers = require('ethers');
const Web3 = require('web3');

const contractName = "FiveLab_Whitelist";
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { account0 } = await getNamedAccounts();

  console.log('-------------- Deploying --------------------------');
  console.log('contractName: ', contractName);
  console.log('Network name: ', hre.network.name);
  console.log('Deployer: ' + account0);

  const token = await deploy(contractName, {
    from: account0,
    args: [],
    log: true,
  });

  fs.mkdirSync(`./export/${contractName}`, { recursive: true });

  const deployData = {
    contractAddress: token.address,
    deployer: account0,
  };

  fs.writeFileSync(
    `./export/${contractName}/config.json`,
    JSON.stringify(deployData, null, 2)
  );

  const contractJson = require(`../artifacts/contracts/${contractName}.sol/${contractName}.json`);
  fs.writeFileSync(
    `./export/${contractName}/${contractName}.json`,
    JSON.stringify(contractJson.abi, null, 2)
  );

  console.log('deployData:', deployData);
  console.log('-------------- Deployed --------------------------');
};

module.exports.tags = [contractName];
