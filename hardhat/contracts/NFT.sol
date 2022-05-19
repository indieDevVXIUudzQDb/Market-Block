//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract NFT is IERC1155, ERC1155URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;

    constructor(address marketplaceAddress) ERC1155("https://game.example/api/item/{id}.json"){
        console.log("Creating NFT:", marketplaceAddress);
        contractAddress = marketplaceAddress;
    }

    function createToken(string memory tokenURI, uint256 amount, bytes memory data) public returns (uint){
        console.log("Creating Asset:", tokenURI, amount);
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId, amount, data);
        _setURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }
}