require("@nomiclabs/hardhat-waffle");
const fs = require("fs");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const privateKey = fs.readFileSync(".secret").toString();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    // mumbai: {
    //   url: process.env.INFURA_POLYGON_MUMBAI_URL || "",
    //   accounts: [privateKey],
    // },
    // mainnet: {},
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "../server/artifacts",
  },
  mocha: {
    timeout: 40000,
  },
};
