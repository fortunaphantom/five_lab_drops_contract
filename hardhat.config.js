require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-etherscan')
require('@nomiclabs/hardhat-ethers');
require('hardhat-deploy')
require('dotenv-flow').config()

module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.8.1',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000
          },
        },
      }
    ]
  },
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    kovan: {
      url: process.env.KOVAN_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    rinkeby: {
      url: process.env.RINKEBY_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [process.env.PRIVATE_KEY]
    },
  },
  namedAccounts: {
    account0: 0
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
}