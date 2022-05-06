const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Market", function () {
  it("Should create and execute market sales", async function () {
    const Market = await ethers.getContractFactory("Market");
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftContractAddress = nft.address;

    const listingPriceResult = await market.getListingPrice();
    const listingPrice = listingPriceResult.toString();
    const auctionPrice = ethers.utils.parseUnits("100", "ether");

    await nft.createToken("https://www.mytokenlocation.com");
    await nft.createToken("https://www.mytokenlocation2.com");

    await market.createMarketItem(nftContractAddress, 1, auctionPrice, {
      value: listingPrice,
    });
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, {
      value: listingPrice,
    });

    const [_, buyerAddress] = await ethers.getSigners();

    await market
      .connect(buyerAddress)
      .createMarketSale(nftContractAddress, 1, { value: auctionPrice });

    const itemResults = await market.fetchMarketItems();
    console.log("itemResults: ", itemResults);

    const items = await Promise.all(
      itemResults.map(async (i) => {
        const tokenUri = await i.tokenUri;
        return {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri,
        };
      })
    );
    console.log("items: ", items);
  });
});
