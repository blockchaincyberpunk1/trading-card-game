// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @title A contract for managing ownership and basic actions of NFTs for a trading card game
/// @dev This contract utilizes ERC-721 standard for NFTs and includes enumerable and ownership functionalities
contract CardOwnership is ERC721Enumerable, Ownable {
    using Strings for uint256;

    /// @notice Event emitted when a new card is minted
    /// @param to The address of the recipient who receives the new card
    /// @param tokenId The token ID of the minted card
    event CardMinted(address to, uint256 tokenId);

    /// @notice Base URI for all token URIs
    string private _baseTokenURI;

    /// @param name The name of the token collection
    /// @param symbol The symbol of the token collection
    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) Ownable(msg.sender) {}

    /// @notice Sets the base URI for computing {tokenURI}
    /// @dev This internal function is utilized to set the base part of the URI for all tokens
    /// @param baseURI The base URI to be set
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    /// @notice Mints a new card NFT to the specified address
    /// @dev Calls ERC721's internal _safeMint function which checks for ERC721Receiver implementation
    /// @param to The address that will receive the minted card
    /// @param tokenId The token ID of the card to be minted
    function mint(address to, uint256 tokenId) external onlyOwner {
        _safeMint(to, tokenId);
        emit CardMinted(to, tokenId);
    }

    /// @notice Returns the URI for a given token ID
    /// @dev Will throw if the token ID does not exist
    /// @param tokenId The token ID
    /// @return The token URI as a string
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(
            ownerOf(tokenId) != address(0),
            "ERC721Metadata: URI query for nonexistent token"
        );
        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, tokenId.toString()))
                : "";
    }

    /// @dev Base URI for computing {tokenURI}
    /// @return The base URI as a string
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    
}
