# Trading Card Game Contracts

This directory contains the smart contracts for the Trading Card Game project. These contracts manage various aspects of the game, including card ownership, battling, trading, and the in-game economy.

## Summary

The smart contracts are divided into several components, each responsible for different functionalities within the game:

1. **CardOwnership.sol**:
    - Manages ownership and basic actions of non-fungible token (NFT) cards using the ERC-721 standard.
    - Includes functionalities for minting new cards, setting base URIs for token metadata, and retrieving token URIs.

2. **CardBattling.sol**:
    - Manages card battles, including setup, outcome determination, and state updates post-battle.
    - Interacts with the CardOwnership contract to verify ownership and check card eligibility for battles.

3. **CardTrading.sol**:
    - Enables the trading of NFT cards between players.
    - Depends on the CardOwnership contract for managing ownership during trades.

4. **GameEconomy.sol**:
    - Manages the in-game economy, issuing and handling tokens or points as rewards based on player activities in trading and battling.
    - Interacts with the CardTrading and CardBattling contracts to determine reward eligibility and distribution.
    - Implements ERC-20 token functionalities for issuing rewards and special game mechanics.

## Setup and Usage

1. Deploy the smart contracts to a compatible Ethereum Virtual Machine (EVM) environment, such as Ethereum mainnet, testnets, or a local development blockchain.
2. Interact with the deployed contracts using an Ethereum wallet or through automated scripts to perform actions like minting cards, initiating battles, trading cards, and rewarding players.
3. Ensure proper configuration and testing of contract interactions to maintain game balance and fairness.

## License

The smart contracts are provided under the MIT License. See individual files for details.
