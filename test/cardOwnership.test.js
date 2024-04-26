const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CardOwnership", function () {
  let CardOwnership, cardOwnership, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    CardOwnership = await ethers.getContractFactory("CardOwnership");
    cardOwnership = await CardOwnership.deploy("GameCard", "GC");
    await cardOwnership.deployed();
  });

  it("Should mint a new card", async function () {
    await cardOwnership.connect(owner).mint(addr1.address, 1);
    expect(await cardOwnership.ownerOf(1)).to.equal(addr1.address);
  });

  it("Should set token URI after minting", async function () {
    const baseURI = "https://api.game.com/cards/";
    await cardOwnership.connect(owner).setBaseURI(baseURI);
    await cardOwnership.connect(owner).mint(addr1.address, 1);
    expect(await cardOwnership.tokenURI(1)).to.equal(baseURI + "1");
  });

  it("Should allow transferring a card", async function () {
    await cardOwnership.connect(owner).mint(addr1.address, 1);
    await cardOwnership.connect(addr1).transferFrom(addr1.address, addr2.address, 1);
    expect(await cardOwnership.ownerOf(1)).to.equal(addr2.address);
  });

  it("Should fail when querying for non-existent token URI", async function () {
    await expect(cardOwnership.tokenURI(999)).to.be.revertedWith("ERC721Metadata: URI query for nonexistent token");
  });

  it("Should return all tokens of an owner", async function () {
    await cardOwnership.connect(owner).mint(addr1.address, 1);
    await cardOwnership.connect(owner).mint(addr1.address, 2);
    await cardOwnership.connect(owner).mint(addr2.address, 3);

    expect(await cardOwnership.balanceOf(addr1.address)).to.equal(2);
    const tokens = [];
    for (let i = 0; i < await cardOwnership.balanceOf(addr1.address); i++) {
      tokens.push(await cardOwnership.tokenOfOwnerByIndex(addr1.address, i));
    }

    expect(tokens).to.have.members([ethers.BigNumber.from(1), ethers.BigNumber.from(2)]);
  });

  it("Should emit a CardMinted event when a card is minted", async function () {
    await expect(cardOwnership.connect(owner).mint(addr1.address, 1))
      .to.emit(cardOwnership, "CardMinted")
      .withArgs(addr1.address, 1);
  });

  it("Should enforce that only the owner can mint new cards", async function () {
    await expect(cardOwnership.connect(addr1).mint(addr2.address, 1))
      .to.be.revertedWith("Ownable: caller is not the owner");
  });
});
