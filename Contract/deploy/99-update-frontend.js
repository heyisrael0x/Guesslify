const { ethers, network } = require("hardhat");
// const {  } = require("fs");
const fs = require("fs-extra");
const {
  FRONT_END_ABI_FILE,
  FRONT_END_ADDRESSES_FILE,
} = require("../helper-hardhat-config");

// const FRONT_END_ADDRESSES_FILE = "../../Client/src/utils/address.json";
// const FRONT_END_ABI_FILE = "../../Client/src/utils/abi.json";

module.exports = async () => {
  if (true) {
    console.log("updating frontend....");
    // updateContractAddress();
    // updateAbi();
    console.log("updating frontend....");
  }
  // const { ethers } = require("hardhat");
  // console.log("started");
  // const wallet = ethers.Wallet.createRandom();
  // const address = wallet.address;
  // console.log(wallet);
  // console.log(address);
  // const provider = ethers.getDefaultProvider('ropsten')
  // console.log(provider)
};
async function updateAbi() {
  console.log("abi wroting");
  const guess2Win = await ethers.getContract("Guess");
  console.log(`guess2Win: ${guess2Win}`);
  fs.writeFileSync(
    FRONT_END_ABI_FILE,
    guess2Win.interface.format(ethers.utils.FormatTypes.json)
  );
  console.log("abi done");
}
async function updateContractAddress() {
  console.log("address wroting");
  const guess2Win = await ethers.getContract("Guess");
  console.log(guess2Win.address);
  const chainId = network.config.chainId.toString();
  console.log(chainId);
  const currentAddresses = JSON.parse(
    fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8")
  );
  console.log(currentAddresses);
  console.log(guess2Win.address);
  if (chainId in currentAddresses) {
    if (!currentAddresses[chainId].includes(guess2Win.address)) {
      currentAddresses[chainId].push(guess2Win.address);
    }
  }
  {
    currentAddresses[chainId] = guess2Win.address;
  }
  fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses));
  console.log("currentAddresses done");
}
module.exports.tags = ["all", "frontend"];
