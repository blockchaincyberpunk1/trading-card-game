// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CardTrading.sol";
import "./CardBattling.sol";

/// @title GameEconomy
/// @notice Manages the in-game economy, issuing and handling tokens or points as rewards based on player activities in trading and battling.
/// @dev Interacts with CardTrading and CardBattling contracts to determine reward eligibility and distribution.
contract GameEconomy is ERC20Burnable, Ownable {
    CardTrading private tradingContract;
    CardBattling private battlingContract;

    /// @notice Event emitted when tokens are rewarded
    /// @param player The address of the player receiving the reward
    /// @param amount The amount of tokens awarded
    event TokensRewarded(address indexed player, uint256 amount);

    /// @param tradingContractAddress The address of the CardTrading contract
    /// @param battlingContractAddress The address of the CardBattling contract
    constructor(address tradingContractAddress, address battlingContractAddress)
        ERC20("GameToken", "GTK") Ownable(msg.sender) {
        tradingContract = CardTrading(tradingContractAddress);
        battlingContract = CardBattling(battlingContractAddress);
    }

    /// @notice Rewards tokens to a player for participating in trading
    /// @param player The address of the player to reward
    /// @param amount The amount of tokens to reward
    function rewardForTrading(address player, uint256 amount) external onlyOwner {
        _rewardTokens(player, amount);
    }

    /// @notice Rewards tokens to a player for winning battles
    /// @param player The address of the winner
    /// @param amount The amount of tokens to reward
    function rewardForBattling(address player, uint256 amount) external onlyOwner {
        _rewardTokens(player, amount);
    }

    /// @dev Internal function to handle token rewarding logic
    /// @param player The address of the player to reward
    /// @param amount The amount of tokens to be rewarded
    function _rewardTokens(address player, uint256 amount) private {
        require(amount > 0, "GameEconomy: Reward amount must be greater than zero");
        _mint(player, amount);
        emit TokensRewarded(player, amount);
    }

    /// @notice Allows the owner to burn tokens from a player's balance, used for special game mechanics
    /// @param player The address of the player whose tokens are to be burned
    /// @param amount The amount of tokens to burn
    function burnTokens(address player, uint256 amount) external onlyOwner {
        _burn(player, amount);
    }
}
