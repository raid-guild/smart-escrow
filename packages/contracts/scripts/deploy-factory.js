/* eslint-disable */
const { ethers, run } = require("hardhat");

const smartInvoiceFactoryAddress = {
  4: "0x783F87D4c8EFDF2fb97022C92CF716936a1eD8d6",
  42: "",
  77: "",
  100: "",
};

const networkName = {
  4: "Rinkeby",
  42: "Kovan",
  77: "Sokol",
  100: "xDai",
};

const networkCurrency = {
  4: "ETH",
  42: "ETH",
  77: "SPOA",
  100: "xDai",
};

const BLOCKSCOUT_CHAIN_IDS = [77, 100];

async function main() {
  const [deployer] = await ethers.getSigners();
  const address = await deployer.getAddress();
  const { chainId } = await deployer.provider.getNetwork();
  console.log(
    "Deploying WrappedInvoiceFactory on network:",
    networkName[chainId],
  );
  console.log("Account address:", address);
  console.log(
    "Account balance:",
    ethers.utils.formatEther(await deployer.provider.getBalance(address)),
    networkCurrency[chainId],
  );

  const WrappedInvoice = await ethers.getContractFactory("WrappedInvoice");
  const wrappedInvoice = await WrappedInvoice.deploy();
  await wrappedInvoice.deployed();
  console.log("Implementation Address:", wrappedInvoice.address);

  const WrappedInvoiceFactory = await ethers.getContractFactory(
    "WrappedInvoiceFactory",
  );
  const wrappedInvoiceFactory = await WrappedInvoiceFactory.deploy(
    wrappedInvoice.address,
    smartInvoiceFactoryAddress[chainId],
  );
  await wrappedInvoiceFactory.deployed();
  console.log("Factory Address:", wrappedInvoiceFactory.address);

  await wrappedInvoice.initLock();

  const txHash = wrappedInvoiceFactory.deployTransaction.hash;
  const receipt = await deployer.provider.getTransactionReceipt(txHash);
  console.log("Block Number:", receipt.blockNumber);

  await wrappedInvoiceFactory.deployTransaction.wait(5);

  const TASK_VERIFY = BLOCKSCOUT_CHAIN_IDS.includes(chainId)
    ? "verify:verify-blockscout"
    : "verify:verify";

  await run(TASK_VERIFY, {
    address: wrappedInvoice.address,
    constructorArguments: [],
  });
  console.log("Verified Implementation");

  await run(TASK_VERIFY, {
    address: wrappedInvoiceFactory.address,
    constructorArguments: [
      wrappedInvoice.address,
      smartInvoiceFactoryAddress[chainId],
    ],
  });
  console.log("Verified Factory");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
