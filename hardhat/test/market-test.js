const chai = require("chai");
const { ethers } = require("hardhat");
const deepEqualInAnyOrder = require("deep-equal-in-any-order");

chai.use(deepEqualInAnyOrder);
const { expect } = chai;

describe("Market", function () {
  it("Should create and execute market sales", async function () {
    const Market = await ethers.getContractFactory("Market");
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy();
    await nft.deployed();
    const nftContractAddress = nft.address;

    const listingPriceResult = await market.getListingPrice();
    const listingPrice = listingPriceResult.toString();
    const auctionPrice = ethers.utils.parseUnits("100", "ether");

    await nft.createToken("https://www.mytokenlocation.com");
    await await nft.approve(marketAddress, 1);
    await nft.createToken("https://www.mytokenlocation2.com");
    await await nft.approve(marketAddress, 2);

    await market.createMarketItem(nftContractAddress, 1, auctionPrice, {
      value: listingPrice,
    });
    await await nft.approve(marketAddress, 2);

    await market.createMarketItem(nftContractAddress, 2, auctionPrice, {
      value: listingPrice,
    });

    const [_, buyer] = await ethers.getSigners();

    await market
      .connect(buyer)
      .createMarketSale(nftContractAddress, 1, { value: auctionPrice });

    let itemResults = await market.fetchItemsCreated();
    let items = itemResults.map((i) => {
      // const tokenUri = await i.tokenUri;
      return {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
      };
    });
    // console.log("items", items);
    expect(items[0]).to.deep.equalInAnyOrder({
      tokenId: "1",
      price: auctionPrice.toString(),
      seller: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      owner: buyer.address,
    });

    itemResults = await market.fetchAvailableMarketItems();
    items = itemResults.map((i) => {
      // const tokenUri = await i.tokenUri;
      return {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
      };
    });
    // console.log("items", items);
    expect(items[0]).to.deep.equalInAnyOrder({
      tokenId: "2",
      price: auctionPrice.toString(),
      seller: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      owner: "0x0000000000000000000000000000000000000000",
    });
  });
});
