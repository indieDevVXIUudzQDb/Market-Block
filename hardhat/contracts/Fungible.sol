//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract Fungible is IERC1155, ERC1155URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;

    // Mapping from token ID to approved address amount
    mapping(uint256 => mapping(address => uint256)) private _approvedBalances;
    mapping(uint256 => mapping(address =>  mapping(address => uint256))) private _approvedSellerBalances;

    event Approval(address indexed approved, uint256 indexed tokenId, uint256 indexed amount);

    constructor(address marketplaceAddress) ERC1155("https://game.example/api/item/{id}.json"){
        console.log("Creating Fungible:", marketplaceAddress);
        contractAddress = marketplaceAddress;
    }

    function createToken(string memory tokenURI, uint256 amount, bytes memory data) public returns (uint){
        console.log("Creating Asset:", tokenURI, amount);
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId, amount, data);
        _setURI(newItemId, tokenURI);
        approve(contractAddress, newItemId, amount);
        return newItemId;
    }

    function safeTransferFrom(
        address seller,
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public {
        uint256 approvedBalance = _getApproved(_msgSender(), id);
        require(
            from == _msgSender() || approvedBalance >= amount || isApprovedForAll(from, _msgSender()),
            "ERC1155: caller is not owner nor approved"
        );
        _safeTransferFrom(from, to, id, amount, data);
        if (from != _msgSender()) {
            _approvedBalances[id][_msgSender()] -= amount;
            _approvedSellerBalances[id][_msgSender()][seller] -= amount;

        }
    }

    function approve(address operator, uint256 tokenId, uint256 amount) public {
        require(amount > 0, "ERC1155: Amount must be greater than 0");
        uint256 senderBalance = balanceOf(msg.sender, tokenId);
        uint256 approvedBalance = getApprovedForSeller(msg.sender, operator, tokenId);
        require(approvedBalance <= senderBalance, "ERC1155: insufficient balance");
        uint256 remainingBalance = senderBalance - approvedBalance;
        require(amount <= remainingBalance, "ERC1155: insufficient balance");
        _approve(msg.sender, operator, tokenId, amount);
    }

    function _getApproved(address operator, uint256 tokenId) internal view returns (uint256) {
        return _approvedBalances[tokenId][operator];
    }

    function getApprovedForSeller(address seller, address operator, uint256 tokenId) public view returns (uint256) {
        return _approvedSellerBalances[tokenId][operator][seller];
    }

    function _approve(address seller, address operator, uint256 tokenId, uint256 amount) internal {
        _approvedBalances[tokenId][operator] += amount;
        _approvedSellerBalances[tokenId][operator][seller] += amount;
        emit Approval(operator, tokenId, amount);
    }

    function _exists(address from, uint256 tokenId) internal view returns (bool) {
        return balanceOf(from, tokenId) > 0;
    }
}