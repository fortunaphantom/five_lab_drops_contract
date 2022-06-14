const hre = require('hardhat');
const fs = require('fs-extra');
const ethers = require('ethers');
const Web3 = require('web3');

const contractName = "Five_lab_Nft";
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { account0 } = await getNamedAccounts();

  console.log('-------------- Deploying --------------------------');
  console.log('Network name: ', hre.network.name);
  console.log('Deployer: ' + account0);

  const token = await deploy(contractName, {
    from: account0,
    args: [
      contractName,
      contractName,
      "https://Five_labmeta.mypinata.cloud/ipfs/QmYZCNVkRsoPsoVgTs8XBKXZgvZ3oF6iGraFE71urHeWQu/",
      "https://Five_labmeta.mypinata.cloud/ipfs/QmfK8f77RbCUbiQQCELaqiufQVp42tzaZWDPnPJex3b2xS/0.json",
      Web3.utils.toWei("0.001"),
      10,
      [
        "0xA5DBC34d69B745d5ee9494E6960a811613B9ae32",
        "0x396823F49AA9f0e3FAC4b939Bc27aD5cD88264Db"
      ],
      [10, 90],
      "0xA5DBC34d69B745d5ee9494E6960a811613B9ae32",
      10,
      5
    ],
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
