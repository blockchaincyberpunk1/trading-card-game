// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./CardOwnership.sol";

/// @title CardTrading
/// @notice This contract enables the trading of NFT cards between players.
/// @dev This contract depends on CardOwnership for managing ownership during trades.
contract CardTrading {
    CardOwnership private cardOwnership;

    /// @notice Event for logging card trades
    /// @param from The address sending the card
    /// @param to The address receiving the card
    /// @param tokenId The token ID of the card being traded
    event CardTraded(address indexed from, address indexed to, uint256 tokenId);

    /// @param cardOwnershipAddress The address of the CardOwnership contract
    constructor(address cardOwnershipAddress) {
        cardOwnership = CardOwnership(cardOwnershipAddress);
    }

    /// @notice Executes a trade between two users
    /// @dev Trade execution requires both parties to have approved this contract to manage their tokens
    /// @param from The address of the user sending the card
    /// @param to The address of the user receiving the card
    /// @param tokenId The token ID of the card to be traded
    function trade(address from, address to, uint256 tokenId) external {
        // Require that the call to the trade function is authorized by the owner of the token
        require(cardOwnership.ownerOf(tokenId) == from, "CardTrading: `from` is not the owner of the token");
        
        // Ensure that the sender has approved this contract to manage the token on their behalf
        require(cardOwnership.getApproved(tokenId) == address(this) || cardOwnership.isApprovedForAll(from, address(this)),
                "CardTrading: This contract is not authorized to manage the token");

        // Transfer the token to the new owner
        cardOwnership.safeTransferFrom(from, to, tokenId);
        emit CardTraded(from, to, tokenId);
    }

    /// @notice Get the ownership contract address being used by the trading contract
    /// @return The address of the CardOwnership contract
    function getCardOwnershipContract() external view returns (address) {
        return address(cardOwnership);
    }
}
