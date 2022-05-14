//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract Market is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    enum AvailabilityStatus{AVAILABLE, SOLD, CANCELLED}

    address payable owner;
    uint256 listingPrice;

    mapping(uint256 => MarketItem) private idToMarketItem;

    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        AvailabilityStatus status;
    }

    event MarketItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 tokenId,
        address seller,
        address owner,
        uint256 price,
        AvailabilityStatus status
    );

    event MarketItemStatusChange (
        uint indexed itemId,
        AvailabilityStatus status
    );

    constructor(uint256 _listingPrice){
        owner = payable(msg.sender);
        listingPrice = _listingPrice;
    }

    function getListingPrice() public view returns (uint256){
        return listingPrice;
    }

    function updateListingPrice(uint _listingPrice) public payable {
        require(owner == msg.sender, "Only market owner can update listing price.");
        listingPrice = _listingPrice;
    }


    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        console.log("Creating Market Item:", nftContract, tokenId, price);

        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == listingPrice, "Price must be equal to listing price");

        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            AvailabilityStatus.AVAILABLE
        );
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(itemId, nftContract, tokenId, msg.sender, address(0), price, AvailabilityStatus.AVAILABLE);
    }

    function createMarketSale(
        address nftContract,
        uint256 itemId
    ) public payable nonReentrant {
        uint price = idToMarketItem[itemId].price;
        uint tokenId = idToMarketItem[itemId].tokenId;
        require(idToMarketItem[itemId].status == AvailabilityStatus.AVAILABLE, "This item is not available");
        require(msg.value == price, "Please submit the asking price in order to complete the purchase");

        idToMarketItem[itemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].status = AvailabilityStatus.SOLD;
        _itemsSold.increment();
        payable(owner).transfer(listingPrice);
        emit MarketItemStatusChange(itemId, AvailabilityStatus.SOLD);

    }

    function cancelMarketItem(uint256 itemId) public {
        require(owner == msg.sender, "Only market owner can cancel a market listing.");
        require(idToMarketItem[itemId].status != AvailabilityStatus.SOLD, "This item has already been sold");
        require(idToMarketItem[itemId].status != AvailabilityStatus.CANCELLED, "This item sale has already been cancelled");
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        address nftContract = idToMarketItem[itemId].nftContract;
        IERC721(nftContract).transferFrom(address(this), idToMarketItem[itemId].seller, tokenId);
        idToMarketItem[itemId].status = AvailabilityStatus.CANCELLED;

        emit MarketItemStatusChange(itemId, AvailabilityStatus.CANCELLED);
    }

    function fetchMarketItem(uint256 itemId) public view returns (MarketItem memory){
        return idToMarketItem[itemId];
    }

    function fetchMarketItems() public view returns (MarketItem[] memory){
        uint totalItemCount = _itemIds.current();
        uint currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](totalItemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            uint currentId = i + 1;
            MarketItem storage currentItem = idToMarketItem[currentId];
            items[currentIndex] = currentItem;
            currentIndex += 1;
        }
        return items;
    }


    function fetchMarketItemsByStatus(AvailabilityStatus status) public view returns (MarketItem[] memory){
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].status == status) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].status == status) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchMyMarketItems() public view returns (MarketItem[] memory){
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchMarketItemsCreated() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}
