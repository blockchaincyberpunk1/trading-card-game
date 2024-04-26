const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CardTrading", function () {
  let CardOwnership, CardTrading, cardOwnership, cardTrading, owner, addr1, addr2, addr3;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    CardOwnership = await ethers.getContractFactory("CardOwnership");
    cardOwnership = await CardOwnership.deploy("GameCard", "GC");
    await cardOwnership.deployed();

    CardTrading = await ethers.getContractFactory("CardTrading");
    cardTrading = await CardTrading.deploy(cardOwnership.address);
    await cardTrading.deployed();

    await cardOwnership.connect(owner).mint(addr1.address, 1);
    await cardOwnership.connect(owner).mint(addr2.address, 2);
  });

  it("Should trade a card between two users", async function () {
    await cardOwnership.connect(addr1).approve(cardTrading.address, 1);
    await cardTrading.connect(addr1).trade(addr1.address, addr2.address, 1);
    expect(await cardOwnership.ownerOf(1)).to.equal(addr2.address);
  });

  it("Should fail if a card is not approved for trade", async function () {
    await expect(cardTrading.connect(addr1).trade(addr1.address, addr2.address, 1))
      .to.be.revertedWith("CardTrading: This contract is not authorized to manage the token");
  });

  it("Should fail if the sender is not the owner of the card", async function () {
    await cardOwnership.connect(addr1).approve(cardTrading.address, 1);
    await expect(cardTrading.connect(addr2).trade(addr1.address, addr2.address, 1))
      .to.be.revertedWith("CardTrading: `from` is not the owner of the token");
  });

  it("Should emit CardTraded event on successful trade", async function () {
    await cardOwnership.connect(addr1).approve(cardTrading.address, 1);
    await expect(cardTrading.connect(addr1).trade(addr1.address, addr2.address, 1))
      .to.emit(cardTrading, "CardTraded")
      .withArgs(addr1.address, addr2.address, 1);
  });

  it("Should not allow trading a card to the zero address", async function () {
    await cardOwnership.connect(addr1).approve(cardTrading.address, 1);
    await expect(cardTrading.connect(addr1).trade(addr1.address, ethers.constants.AddressZero, 1))
      .to.be.revertedWith("ERC721: transfer to the zero address");
  });

  it("Can trade multiple cards if approvals are set", async function () {
    await cardOwnership.connect(addr1).approve(cardTrading.address, 1);
    await cardOwnership.connect(addr2).approve(cardTrading.address, 2);
    await cardTrading.connect(addr1).trade(addr1.address, addr3.address, 1);
    await cardTrading.connect(addr2).trade(addr2.address, addr3.address, 2);
    expect(await cardOwnership.ownerOf(1)).to.equal(addr3.address);
    expect(await cardOwnership.ownerOf(2)).to.equal(addr3.address);
  });
});
