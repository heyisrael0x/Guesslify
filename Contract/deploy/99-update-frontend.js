const { ethers, network } = require("hardhat");
const fs = require("fs-extra");
const {
  FRONT_END_ABI_FILE,
  FRONT_END_ADDRESSES_FILE,
} = require("../helper-hardhat-config");

module.exports = async () => {
  if (true) {
    console.log("updating frontend....");
    // updateContractAddress();
    updateAbi();
    console.log("updated frontend....");
  }
};
async function updateAbi() {
  console.log("abi wroting");
  const guess2Win = await ethers.getContract("Guess");
  fs.writeFileSync(
    FRONT_END_ABI_FILE,
    guess2Win.interface.format(ethers.utils.FormatTypes.json)
  );
  console.log("abi done");
}
async function updateContractAddress() {
  console.log("address wroting");
  const guess2Win = await ethers.getContract("Guess");
  const chainId = network.config.chainId.toString();
  const result = (
    fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8")
  );
  const currentAddresses = JSON.stringify(result)
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
