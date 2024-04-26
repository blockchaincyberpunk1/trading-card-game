const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GameEconomy", function () {
  let GameEconomy, gameEconomy, CardTrading, cardTrading, CardBattling, cardBattling, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    // Deploy CardTrading
    CardTrading = await ethers.getContractFactory("CardTrading");
    const CardOwnership = await ethers.getContractFactory("CardOwnership");
    const cardOwnership = await CardOwnership.deploy("GameCards", "GC");
    await cardOwnership.deployed();
    cardTrading = await CardTrading.deploy(cardOwnership.address);
    await cardTrading.deployed();

    // Deploy CardBattling
    CardBattling = await ethers.getContractFactory("CardBattling");
    cardBattling = await CardBattling.deploy(cardOwnership.address);
    await cardBattling.deployed();

    // Deploy GameEconomy
    GameEconomy = await ethers.getContractFactory("GameEconomy");
    gameEconomy = await GameEconomy.deploy(cardTrading.address, cardBattling.address);
    await gameEconomy.deployed();

    // Assume some tokens are minted for testing
    await gameEconomy.mint(owner.address, ethers.utils.parseEther("1000"));
  });

  it("Should reward tokens for trading", async function () {
    await gameEconomy.connect(owner).rewardForTrading(addr1.address, 100);
    expect(await gameEconomy.balanceOf(addr1.address)).to.equal(100);
  });

  it("Should reward tokens for battling", async function () {
    await gameEconomy.connect(owner).rewardForBattling(addr1.address, 50);
    expect(await gameEconomy.balanceOf(addr1.address)).to.equal(50);
  });

  it("Should burn tokens correctly", async function () {
    await gameEconomy.connect(owner).mint(addr1.address, 200);
    await gameEconomy.connect(owner).burnTokens(addr1.address, 100);
    expect(await gameEconomy.balanceOf(addr1.address)).to.equal(100);
  });

  it("Should only allow the owner to reward tokens", async function () {
    await expect(gameEconomy.connect(addr1).rewardForTrading(addr2.address, 100))
      .to.be.revertedWith("Ownable: caller is not the owner");
    await expect(gameEconomy.connect(addr1).rewardForBattling(addr2.address, 100))
      .to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should only allow the owner to burn tokens", async function () {
    await gameEconomy.connect(owner).mint(addr1.address, 100);
    await expect(gameEconomy.connect(addr1).burnTokens(addr1.address, 50))
      .to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should not reward or burn more tokens than the contract balance", async function () {
    const initialSupply = await gameEconomy.balanceOf(owner.address);
    await expect(gameEconomy.connect(owner).rewardForTrading(addr1.address, initialSupply.add(1)))
      .to.be.revertedWith("ERC20: transfer amount exceeds balance");
    await expect(gameEconomy.connect(owner).burnTokens(owner.address, initialSupply.add(1)))
      .to.be.revertedWith("ERC20: burn amount exceeds balance");
  });
});
