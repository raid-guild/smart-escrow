const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

const { deployMockContract } = waffle;
const { awaitInvoiceAddress, currentTimestamp } = require("./utils");
const IERC20 = require("../build/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json");

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
const EMPTY_BYTES32 =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

describe("WrappedInvoiceFactory", function () {
  let WrappedInvoice;
  let wrappedInvoice;
  let WrappedInvoiceFactory;
  let invoiceFactory;
  let mockSmartInvoiceFactory;
  let mockToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    mockToken = await deployMockContract(owner, IERC20.abi);

    const MockSmartInvoiceFactory = await ethers.getContractFactory(
      "MockSmartInvoiceFactory",
    );

    mockSmartInvoiceFactory = await MockSmartInvoiceFactory.deploy();

    WrappedInvoice = await ethers.getContractFactory("WrappedInvoice");

    wrappedInvoice = await WrappedInvoice.deploy();

    WrappedInvoiceFactory = await ethers.getContractFactory(
      "WrappedInvoiceFactory",
    );

    invoiceFactory = await WrappedInvoiceFactory.deploy(
      wrappedInvoice.address,
      mockSmartInvoiceFactory.address,
    );

    await invoiceFactory.deployed();
  });

  it("Should deploy with correct inputs", async function () {
    expect(await invoiceFactory.invoiceCount()).to.equal(0);
    expect(await invoiceFactory.smartInvoiceFactory()).to.equal(
      mockSmartInvoiceFactory.address,
    );
    expect(await invoiceFactory.implementation()).to.equal(
      wrappedInvoice.address,
    );
  });

  it("Should revert deploy if zero implementation", async function () {
    const receipt = WrappedInvoiceFactory.deploy(ADDRESS_ZERO, ADDRESS_ZERO);
    await expect(receipt).to.revertedWith("invalid implementation");
  });

  it("Should revert deploy if zero wrappedNativeToken", async function () {
    const receipt = WrappedInvoiceFactory.deploy(
      wrappedInvoice.address,
      ADDRESS_ZERO,
    );
    await expect(receipt).to.revertedWith("invalid smartInvoiceFactory");
  });

  it("Should deploy a WrappedInvoice", async function () {
    expect(await invoiceFactory.invoiceCount()).to.equal(0);
    const client = owner.address;
    const providers = [addr1.address, addr2.address];
    const splitFactor = 10;
    const resolver = addrs[0].address;
    const resolverType = 0;
    const token = mockToken.address;
    const amounts = [10, 10];
    const terminationTime = (await currentTimestamp()) + 3600;
    const details = EMPTY_BYTES32;
    const receipt = await invoiceFactory.create(
      client,
      providers,
      splitFactor,
      resolverType,
      resolver,
      token,
      amounts,
      terminationTime,
      details,
    );
    const invoiceAddress = await awaitInvoiceAddress(await receipt.wait());
    await expect(receipt)
      .to.emit(invoiceFactory, "LogNewWrappedInvoice")
      .withArgs(0, invoiceAddress);

    const invoice = await WrappedInvoice.attach(invoiceAddress);

    expect(await invoice.parent()).to.equal(addr1.address);
    expect(await invoice.child()).to.equal(addr2.address);
    expect(await invoice.splitFactor()).to.equal(splitFactor);
    expect(await invoice.token()).to.equal(token);

    expect(await invoiceFactory.getInvoiceAddress(0)).to.equal(invoiceAddress);
    expect(await invoiceFactory.invoiceCount()).to.equal(1);
  });

  it("Should revert deploy for invalid providers", async function () {
    expect(await invoiceFactory.invoiceCount()).to.equal(0);
    const client = owner.address;
    const providers = [addr1.address];
    const splitFactor = 10;
    const resolver = addrs[0].address;
    const resolverType = 0;
    const token = mockToken.address;
    const amounts = [10, 10];
    const terminationTime = (await currentTimestamp()) + 3600;
    const details = EMPTY_BYTES32;
    const receipt = invoiceFactory.create(
      client,
      providers,
      splitFactor,
      resolverType,
      resolver,
      token,
      amounts,
      terminationTime,
      details,
    );
    await expect(receipt).to.revertedWith("invalid providers");
  });
});
