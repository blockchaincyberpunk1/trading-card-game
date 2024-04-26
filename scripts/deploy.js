async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy CardOwnership
  const CardOwnership = await ethers.getContractFactory("CardOwnership");
  const cardOwnership = await CardOwnership.deploy("GameCards", "GMC");
  await cardOwnership.deployed();
  console.log("CardOwnership deployed to:", cardOwnership.address);

  // Deploy CardTrading
  const CardTrading = await ethers.getContractFactory("CardTrading");
  const cardTrading = await CardTrading.deploy(cardOwnership.address);
  await cardTrading.deployed();
  console.log("CardTrading deployed to:", cardTrading.address);

  // Deploy CardBattling
  const CardBattling = await ethers.getContractFactory("CardBattling");
  const cardBattling = await CardBattling.deploy(cardOwnership.address);
  await cardBattling.deployed();
  console.log("CardBattling deployed to:", cardBattling.address);

  // Deploy GameEconomy
  const GameEconomy = await ethers.getContractFactory("GameEconomy");
  const gameEconomy = await GameEconomy.deploy(cardTrading.address, cardBattling.address);
  await gameEconomy.deployed();
  console.log("GameEconomy deployed to:", gameEconomy.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
