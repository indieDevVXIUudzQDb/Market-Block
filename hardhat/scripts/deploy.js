// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require("fs");
const { ethers } = require("hardhat");

async function main() {
  const Market = await hre.ethers.getContractFactory("Market");
  const nftMarket = await Market.deploy(ethers.utils.parseUnits("1", "ether"));
  await nftMarket.deployed();
  console.log("nftMarket deployed to:", nftMarket.address);

  const Fungible = await hre.ethers.getContractFactory("Fungible");
  const fungible = await Fungible.deploy(nftMarket.address);
  await fungible.deployed();
  console.log("fungible deployed to:", fungible.address);

  try {
    fs.writeFileSync(
      "../server/utils/constants/contracts.ts",
      `/* Auto generated from hardhat/deploy.js */
export const fungibleAddress = "${fungible.address}"
export const marketAddress = "${nftMarket.address}"
`
    );
    console.log("../server/utils/constants/contracts.ts written successfully");
  } catch (e) {
    console.error(e);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  // eslint-disable-next-line no-process-exit
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  });
