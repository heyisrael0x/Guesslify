// const {networkConfig} =
const { network, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
require("dotenv").config();

console.log("vrfCoordinatorV2Address");

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("30");
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let vrfCoordinatorV2Address, subscriptionId;
  if (developmentChains.includes(network.name)) {
    const vrfCoordinatorV2Mock = await ethers.getContract(
      "VRFCoordinatorV2Mock"
    );
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
    const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();
    const transactionReceipt = await transactionResponse.wait(1);
    subscriptionId = transactionReceipt.events[0].args.subId;
    // funding my subscription with some links locally
    await vrfCoordinatorV2Mock.fundSubscription(
      subscriptionId,
      VRF_SUB_FUND_AMOUNT
    );
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"];
    subscriptionId = networkConfig[chainId]["subscriptionId"];
  }

  const gasLane = networkConfig[chainId]["gasLane"];
  const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"];
  const leastEthToSend = networkConfig[chainId]["leastEthToSend"];
  const randomNumberRange = networkConfig[chainId]["randomNumberRange"];
  const numberOfTrials = networkConfig[chainId]["numberOfTrials"];
  const value = networkConfig[chainId]["value"];

  args = [
    vrfCoordinatorV2Address,
    gasLane,
    subscriptionId,
    callbackGasLimit,
    leastEthToSend,
    randomNumberRange,
    numberOfTrials,
  ];
  const guess2Win = await deploy("Guess", {
    from: deployer,
    args: args,
    log: true,
    value: value,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log(`Guess2Win Game deployed at ${guess2Win.address}`);

  if (developmentChains.includes(network.name)) {
    const vrfCoordinatorV2Mock = await ethers.getContract(
      "VRFCoordinatorV2Mock"
    );
    log(
      "--------------------------------------------------------------------------"
    );
    await vrfCoordinatorV2Mock.addConsumer(subscriptionId, guess2Win.address);
    console.log(`subId is: ${subscriptionId}`);
    console.log(`gameAdress is: ${guess2Win.address}`);
  }
  log(
    "--------------------------------------------------------------------------"
  );
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(guess2Win.address, args);
  } else {
    console.log("On a development chain we are not verifying");
    log("-----------------------------------------------------");
  }
};
module.exports.tags = ["all", "guess2Win"];
