const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CardBattling", function () {
  let CardOwnership, CardBattling, cardOwnership, cardBattling, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    CardOwnership = await ethers.getContractFactory("CardOwnership");
    cardOwnership = await CardOwnership.deploy("GameCard", "GC");
    await cardOwnership.deployed();

    CardBattling = await ethers.getContractFactory("CardBattling");
    cardBattling = await CardBattling.deploy(cardOwnership.address);
    await cardBattling.deployed();

    // Mint two cards for battling
    await cardOwnership.connect(owner).mint(addr1.address, 1);
    await cardOwnership.connect(owner).mint(addr2.address, 2);
  });

  it("Should initiate a battle and emit event", async function () {
    await expect(cardBattling.connect(owner).initiateBattle(1, 2))
      .to.emit(cardBattling, "BattleConducted")
      .withArgs(addr1.address, addr2.address, 1, 2);
  });

  it("Should fail to battle if one of the cards does not exist", async function () {
    await expect(cardBattling.connect(owner).initiateBattle(1, 3))
      .to.be.revertedWith("CardBattling: Second card does not exist");
  });

  it("Should not allow a card to battle itself", async function () {
    await expect(cardBattling.connect(owner).initiateBattle(1, 1))
      .to.be.revertedWith("CardBattling: Cannot battle your own cards");
  });

  it("Should correctly determine the winner based on predetermined logic", async function () {
    let result = await cardBattling.callStatic.initiateBattle(1, 2);
    expect(result).to.equal(addr1.address);
    // You may need to adjust this test to match the specific logic of your battle determination.
  });

  it("Should fail if an unauthorized user tries to initiate a battle", async function () {
    await expect(cardBattling.connect(addr1).initiateBattle(1, 2))
      .to.be.revertedWith("Ownable: caller is not the owner");
  });

  // Advanced test scenario to simulate actual battle mechanics if applied
  it("Should simulate battle mechanics and update card statuses", async function () {
    // Assuming battle mechanics involve changing states or emitting specific events
    // This part of the test should be customized to match your contract's functionality
  });
});
