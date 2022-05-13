const chai = require("chai");
const { ethers } = require("hardhat");
const deepEqualInAnyOrder = require("deep-equal-in-any-order");

chai.use(deepEqualInAnyOrder);
const { expect } = chai;

describe("Market", function () {
  it("Should create, cancel and execute market sales", async function () {
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

    await nft.createToken("https://www.mytokenlocation.com");
    await await nft.approve(marketAddress, 1);
    await nft.createToken("https://www.mytokenlocation2.com");
    await await nft.approve(marketAddress, 2);
    await nft.createToken("https://www.mytokenlocation3.com");
    await await nft.approve(marketAddress, 3);

    await market.createMarketItem(nftContractAddress, 1, auctionPrice1, {
      value: listingPrice,
    });

    await market.createMarketItem(nftContractAddress, 2, auctionPrice2, {
      value: listingPrice,
    });

    await market.createMarketItem(nftContractAddress, 3, auctionPrice3, {
      value: listingPrice,
    });

    await market
      .connect(buyer)
      .createMarketSale(nftContractAddress, 1, { value: auctionPrice1 });

    let itemResults = await market.fetchMarketItemsCreated();
    let items = itemResults.map((i) => {
      return {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
      };
    });
    expect(items[0]).to.deep.equalInAnyOrder({
      tokenId: "1",
      price: auctionPrice1.toString(),
      seller: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      owner: buyer.address,
    });

    await market.connect(seller).cancelMarketItem(2);

    itemResults = await market.fetchAvailableMarketItems();
    items = itemResults.map((i) => {
      return {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
      };
    });
    expect(items[0]).to.deep.equalInAnyOrder({
      tokenId: "3",
      price: auctionPrice3.toString(),
      seller: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      owner: "0x0000000000000000000000000000000000000000",
    });

    const item1 = await market.fetchMarketItem(1);
    expect(item1.tokenId.toString()).to.equal("1");
    expect(item1.price.toString()).to.equal(auctionPrice1.toString());
    expect(item1.seller).to.equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    expect(item1.owner).to.equal(buyer.address);
    expect(item1.status).to.equal(1);
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
