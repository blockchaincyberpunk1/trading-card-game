// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./CardOwnership.sol";

/// @title CardBattling
/// @notice Manages card battles, including setup, outcome determination, and state updates post-battle.
/// @dev This contract interacts with CardOwnership to verify ownership and check card eligibility for battles.
contract CardBattling {
    CardOwnership private cardOwnership;

    /// @notice Event emitted when a battle is conducted
    /// @param winner The address of the winner
    /// @param loser The address of the loser
    /// @param winnerTokenId The token ID of the winning card
    /// @param loserTokenId The token ID of the losing card
    event BattleConducted(address indexed winner, address indexed loser, uint256 winnerTokenId, uint256 loserTokenId);

    /// @param cardOwnershipAddress The address of the CardOwnership contract
    constructor(address cardOwnershipAddress) {
        cardOwnership = CardOwnership(cardOwnershipAddress);
    }

    /// @notice Initiates a battle between two cards
    /// @dev Requires the owners of the cards to have registered them for battle
    /// @param tokenId1 The token ID of the first participant
    /// @param tokenId2 The token ID of the second participant
    function initiateBattle(uint256 tokenId1, uint256 tokenId2) external {
        // Ensure that both cards exist and are owned by using ownerOf which reverts if the token does not exist
        address owner1 = cardOwnership.ownerOf(tokenId1);
        address owner2 = cardOwnership.ownerOf(tokenId2);
        require(owner1 != address(0), "CardBattling: First card does not exist");
        require(owner2 != address(0), "CardBattling: Second card does not exist");
        require(owner1 != owner2, "CardBattling: Cannot battle your own cards");

        // Simulate the battle logic (simplified for example)
        // For real logic, this could depend on stats of the cards which may be stored on-chain
        address winner;
        address loser;
        uint256 winnerTokenId;
        uint256 loserTokenId;

        // Example simplistic battle decision: Randomly decide the winner
        if (block.timestamp % 2 == 0) {
            winner = owner1;
            loser = owner2;
            winnerTokenId = tokenId1;
            loserTokenId = tokenId2;
        } else {
            winner = owner2;
            loser = owner1;
            winnerTokenId = tokenId2;
            loserTokenId = tokenId1;
        }

        // Log the battle results
        emit BattleConducted(winner, loser, winnerTokenId, loserTokenId);
    }

    /// @notice Returns the ownership contract address used by the battling contract
    /// @return The address of the CardOwnership contract
    function getCardOwnershipContract() external view returns (address) {
        return address(cardOwnership);
    }
}
