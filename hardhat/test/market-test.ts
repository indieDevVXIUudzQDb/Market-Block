import { ethers } from "hardhat";
import chai from "chai";

// @ts-ignore
import deepEqualInAnyOrder from "deep-equal-in-any-order";
// eslint-disable-next-line node/no-missing-import
import { Market, NFT } from "../src/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(deepEqualInAnyOrder);
const { expect } = chai;

describe("Market", function () {
  let market: Market,
    nft: NFT,
    seller: SignerWithAddress,
    buyer1: SignerWithAddress,
    buyer2: SignerWithAddress,
    marketAddress: string,
    nftContractAddress: string;

  beforeEach(async function () {
    // Setup
    [seller, buyer1, buyer2] = await ethers.getSigners();

    const MarketFactory = await ethers.getContractFactory("Market");

    market = await MarketFactory.deploy(
      ethers.utils.parseUnits("0.025", "ether")
    );

    await market.deployed();
    marketAddress = market.address;

    const NFTFactory = await ethers.getContractFactory("NFT");
    nft = await NFTFactory.deploy(marketAddress);
    await nft.deployed();
    nftContractAddress = nft.address;
    console.log("setup complete", "market address", marketAddress);
  });

  it("Should create, cancel and execute market sales", async function () {
    const listingPriceResult = await market.getListingPrice();
    const listingPrice = listingPriceResult.toString();
    const auctionPrice1 = ethers.utils.parseUnits("100", "ether");
    const auctionPrice2 = ethers.utils.parseUnits("200", "ether");
    const auctionPrice3 = ethers.utils.parseUnits("300", "ether");

    // Create tokens and market items
    await nft.createToken("https://www.mytokenlocation.com", 1, "");
    await nft.setApprovalForAll(marketAddress, true);
    await market.createMarketItem(nftContractAddress, 1, auctionPrice1, 1, "", {
      value: listingPrice,
    });

    await nft.createToken("https://www.mytokenlocation2.com", 1, "");
    await await nft.setApprovalForAll(marketAddress, true);
    await market.createMarketItem(nftContractAddress, 2, auctionPrice2, 1, "", {
      value: listingPrice,
    });

    await nft.createToken("https://www.mytokenlocation3.com", 1, "");
    await await nft.setApprovalForAll(marketAddress, true);
    await market.createMarketItem(nftContractAddress, 3, auctionPrice3, 1, "", {
      value: listingPrice,
    });

    // Create a sale
    await market
      .connect(buyer1)
      .createMarketSale(1, 1, "", { value: auctionPrice1 });

    // Cancel a market item
    await market.connect(seller).cancelMarketItem(2, 1, "");

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
    expect(item1.owner).to.equal(buyer1.address);
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

  it("Should allow resale of Item", async function () {
    const listingPriceResult = await market.getListingPrice();
    const listingPrice = listingPriceResult.toString();
    const auctionPrice1 = ethers.utils.parseUnits("100", "ether");
    const auctionPrice2 = ethers.utils.parseUnits("200", "ether");

    // Create tokens and market items
    await nft.createToken("https://www.mytokenlocation.com", 1, "");
    await await nft.setApprovalForAll(marketAddress, true);
    expect(await nft.balanceOf(seller.address, 1)).to.equal(1);

    await market.createMarketItem(nftContractAddress, 1, auctionPrice1, 1, "", {
      value: listingPrice,
    });

    expect(await nft.balanceOf(seller.address, 1)).to.equal(0);

    // Create a sale
    await market
      .connect(buyer1)
      .createMarketSale(1, 1, "", { value: auctionPrice1 });

    // Fetch all market items
    const itemResults = await market.fetchMarketItems();
    expect(itemResults.length).to.equal(1);
    expect(itemResults[0].tokenId.toString()).to.equal("1");

    expect(await nft.balanceOf(seller.address, 1)).to.equal(0);
    expect(await nft.balanceOf(buyer1.address, 1)).to.equal(1);

    await nft.setApprovalForAll(marketAddress, true);

    // Relist item for sale
    await market
      .connect(buyer1)
      .createMarketItem(nftContractAddress, 1, auctionPrice2, 1, "", {
        value: listingPrice,
      });

    // Create 2nd sale
    await market
      .connect(buyer2)
      .createMarketSale(2, 1, "", { value: auctionPrice2 });

    expect(await nft.balanceOf(buyer1.address, 1)).to.equal(0);
    expect(await nft.balanceOf(buyer2.address, 1)).to.equal(1);

    // Check final details of tokens
    const item1 = await market.fetchMarketItem(1);
    expect(item1.tokenId.toString()).to.equal("1");
    expect(item1.price.toString()).to.equal(auctionPrice1.toString());
    expect(item1.seller).to.equal(seller.address);
    expect(item1.owner).to.equal(buyer1.address);
    expect(item1.status).to.equal(1);

    // Check final details of tokens
    const item2 = await market.fetchMarketItem(2);
    expect(item2.tokenId.toString()).to.equal("1");
    expect(item2.price.toString()).to.equal(auctionPrice2.toString());
    expect(item2.seller).to.equal(buyer1.address);
    expect(item2.owner).to.equal(buyer2.address);
    expect(item2.status).to.equal(1);
  });

  it("Should fetch most recent market item for token", async function () {
    const listingPriceResult = await market.getListingPrice();
    const listingPrice = listingPriceResult.toString();
    const auctionPrice1 = ethers.utils.parseUnits("100", "ether");
    const auctionPrice2 = ethers.utils.parseUnits("200", "ether");
    const auctionPrice3 = ethers.utils.parseUnits("300", "ether");

    // Create tokens and market items
    await nft.createToken("https://www.mytokenlocation.com", 1, "");
    await nft.setApprovalForAll(marketAddress, true);
    expect(await nft.balanceOf(seller.address, 1)).to.equal(1);

    await market.createMarketItem(nftContractAddress, 1, auctionPrice1, 1, "", {
      value: listingPrice,
    });

    let recentMarketItem = await market.fetchMarketItemByTokenId("1");
    expect(recentMarketItem.itemId.toString()).to.equal("1");
    expect(recentMarketItem.status).to.equal(0);

    // Create a sale
    await market
      .connect(buyer1)
      .createMarketSale(1, 1, "", { value: auctionPrice1 });

    // Fetch all market items
    const itemResults = await market.fetchMarketItems();
    expect(itemResults.length).to.equal(1);
    expect(itemResults[0].itemId.toString()).to.equal("1");

    // Relist item for sale
    await nft.connect(buyer1).setApprovalForAll(marketAddress, true);

    await market
      .connect(buyer1)
      .createMarketItem(nftContractAddress, 1, auctionPrice2, 1, "", {
        value: listingPrice,
      });

    recentMarketItem = await market.fetchMarketItemByTokenId("1");
    expect(recentMarketItem.itemId.toString()).to.equal("2");
    expect(recentMarketItem.status).to.equal(0);

    // Create 2nd sale
    await market
      .connect(buyer2)
      .createMarketSale(2, 1, "", { value: auctionPrice2 });

    recentMarketItem = await market.fetchMarketItemByTokenId("1");
    expect(recentMarketItem.itemId.toString()).to.equal("2");
    expect(recentMarketItem.status).to.equal(1);

    // Relist item for sale for 2nd time
    await nft.connect(buyer2).setApprovalForAll(marketAddress, true);

    await market
      .connect(buyer2)
      .createMarketItem(nftContractAddress, 1, auctionPrice3, 1, "", {
        value: listingPrice,
      });
    // Cancel it
    await market.connect(buyer2).cancelMarketItem("3", 1, "");

    recentMarketItem = await market.fetchMarketItemByTokenId("1");
    expect(recentMarketItem.itemId.toString()).to.equal("3");
    expect(recentMarketItem.status).to.equal(2);
  });

  it("Should contain initial provided listing price, and should be updatable", async function () {
    const listingPriceResult = await market.getListingPrice();
    const initialListingPrice = listingPriceResult.toString();
    expect(initialListingPrice).to.equal("25000000000000000");

    await market.updateListingPrice(ethers.utils.parseUnits("30", "ether"));
    const updatedPriceResult = await market.getListingPrice();
    const listingPrice = updatedPriceResult.toString();
    expect(listingPrice).to.equal("30000000000000000000");
  });
});
