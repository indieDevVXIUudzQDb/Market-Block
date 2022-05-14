const chai = require("chai");
const { ethers } = require("hardhat");
const deepEqualInAnyOrder = require("deep-equal-in-any-order");

chai.use(deepEqualInAnyOrder);
const { expect } = chai;

describe("Market", function () {
  it("Should create, cancel and execute market sales", async function () {
    // Setup
    const [seller, buyer] = await ethers.getSigners();

    const Market = await ethers.getContractFactory("Market");
    const market = await Market.deploy(ethers.utils.parseUnits("1", "ether"));
    await market.deployed();
    const marketAddress = market.address;

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy();
    await nft.deployed();
    const nftContractAddress = nft.address;

    const listingPriceResult = await market.getListingPrice();
    const listingPrice = listingPriceResult.toString();
    const auctionPrice1 = ethers.utils.parseUnits("100", "ether");
    const auctionPrice2 = ethers.utils.parseUnits("200", "ether");
    const auctionPrice3 = ethers.utils.parseUnits("300", "ether");

    // Create tokens and market items
    await nft.createToken("https://www.mytokenlocation.com");
    await await nft.approve(marketAddress, 1);
    await market.createMarketItem(nftContractAddress, 1, auctionPrice1, {
      value: listingPrice,
    });

    await nft.createToken("https://www.mytokenlocation2.com");
    await await nft.approve(marketAddress, 2);
    await market.createMarketItem(nftContractAddress, 2, auctionPrice2, {
      value: listingPrice,
    });

    await nft.createToken("https://www.mytokenlocation3.com");
    await await nft.approve(marketAddress, 3);
    await market.createMarketItem(nftContractAddress, 3, auctionPrice3, {
      value: listingPrice,
    });

    // Create a sale
    await market
      .connect(buyer)
      .createMarketSale(nftContractAddress, 1, { value: auctionPrice1 });

    // Cancel a market item
    await market.connect(seller).cancelMarketItem(2);

    // Fetch all market items
    let itemResults = await market.fetchMarketItems();
    expect(itemResults.length).to.equal(3);
    expect(itemResults[0].tokenId.toString()).to.equal("1");

    // Fetch market items for sale for user
    itemResults = await market.fetchMarketItemsCreated();
    expect(itemResults.length).to.equal(3);
    expect(itemResults[0].tokenId.toString()).to.equal("1");

    // Fetch available market items
    itemResults = await market.fetchMarketItemsByStatus(0);
    expect(itemResults.length).to.equal(1);
    expect(itemResults[0].tokenId.toString()).to.equal("3");

    // Fetch sold market items
    itemResults = await market.fetchMarketItemsByStatus(1);
    expect(itemResults.length).to.equal(1);
    expect(itemResults[0].tokenId.toString()).to.equal("1");

    // Fetch cancelled market items
    itemResults = await market.fetchMarketItemsByStatus(2);
    expect(itemResults.length).to.equal(1);
    expect(itemResults[0].tokenId.toString()).to.equal("2");

    // Check final details of tokens
    const item1 = await market.fetchMarketItem(1);
    expect(item1.tokenId.toString()).to.equal("1");
    expect(item1.price.toString()).to.equal(auctionPrice1.toString());
    expect(item1.seller).to.equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    expect(item1.owner).to.equal(buyer.address);
    expect(item1.status).to.equal(1);

    const item2 = await market.fetchMarketItem(2);
    expect(item2.tokenId.toString()).to.equal("2");
    expect(item2.price.toString()).to.equal(auctionPrice2.toString());
    expect(item2.seller).to.equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    expect(item2.owner).to.equal("0x0000000000000000000000000000000000000000");
    expect(item2.status).to.equal(2);

    const item3 = await market.fetchMarketItem(3);
    expect(item3.tokenId.toString()).to.equal("3");
    expect(item3.price.toString()).to.equal(auctionPrice3.toString());
    expect(item3.seller).to.equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    expect(item3.owner).to.equal("0x0000000000000000000000000000000000000000");
    expect(item3.status).to.equal(0);
  });

  it("Should contain initial provided listing price, and should be updatable", async function () {
    const Market = await ethers.getContractFactory("Market");
    const market = await Market.deploy(
      ethers.utils.parseUnits("0.025", "ether")
    );
    await market.deployed();

    const listingPriceResult = await market.getListingPrice();
    const initialListingPrice = listingPriceResult.toString();
    expect(initialListingPrice).to.equal("25000000000000000");

    await market.updateListingPrice(ethers.utils.parseUnits("30", "ether"));
    const updatedPriceResult = await market.getListingPrice();
    const listingPrice = updatedPriceResult.toString();
    expect(listingPrice).to.equal("30000000000000000000");
  });
});
