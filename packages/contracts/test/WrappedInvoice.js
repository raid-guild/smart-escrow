const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

const { deployMockContract } = waffle;
const ISmartInvoice = require("../build/contracts/interfaces/ISmartInvoice.sol/ISmartInvoice.json");
const IERC20 = require("../build/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json");

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
const EMPTY_BYTES32 =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

describe("WrappedInvoice", function () {
  const splitFactor = 10;
  let WrappedInvoice;
  let mockSmartInvoice;
  let invoice;
  let mockToken;
  let otherMockToken;
  let parent;
  let child;
  let addrs;

  beforeEach(async function () {
    [parent, child, ...addrs] = await ethers.getSigners();

    mockToken = await deployMockContract(parent, IERC20.abi);
    otherMockToken = await deployMockContract(parent, IERC20.abi);
    mockSmartInvoice = await deployMockContract(parent, ISmartInvoice.abi);

    WrappedInvoice = await ethers.getContractFactory("WrappedInvoice");
    invoice = await WrappedInvoice.deploy();
    await invoice.deployed();
    await mockSmartInvoice.mock.token.returns(mockToken.address);
    await mockSmartInvoice.mock.provider.returns(invoice.address);
    await invoice.init(
      parent.address,
      child.address,
      mockSmartInvoice.address,
      splitFactor,
    );
  });

  it("Should deploy a WrappedInvoice", async function () {
    expect(await invoice.parent()).to.equal(parent.address);
    expect(await invoice.child()).to.equal(child.address);
    expect(await invoice.invoice()).to.equal(mockSmartInvoice.address);
    expect(await invoice.splitFactor()).to.equal(splitFactor);
    expect(await invoice.token()).to.equal(mockToken.address);
  });

  it("Should revert initLock if already init", async function () {
    const receipt = invoice.initLock();
    await expect(receipt).to.revertedWith(
      "Initializable: contract is already initialized",
    );
  });

  it("Should revert init if initLocked", async function () {
    invoice = await WrappedInvoice.deploy();
    await invoice.deployed();
    await invoice.initLock();
    const receipt = invoice.init(
      parent.address,
      child.address,
      mockSmartInvoice.address,
      splitFactor,
    );
    await expect(receipt).to.revertedWith(
      "Initializable: contract is already initialized",
    );
  });

  it("Should revert init if invalid parent", async function () {
    invoice = await WrappedInvoice.deploy();
    await invoice.deployed();
    const receipt = invoice.init(
      ADDRESS_ZERO,
      child.address,
      mockSmartInvoice.address,
      splitFactor,
    );
    await expect(receipt).to.revertedWith("invalid parent");
  });

  it("Should revert init if invalid child", async function () {
    invoice = await WrappedInvoice.deploy();
    await invoice.deployed();
    const receipt = invoice.init(
      parent.address,
      ADDRESS_ZERO,
      mockSmartInvoice.address,
      splitFactor,
    );
    await expect(receipt).to.revertedWith("invalid child");
  });

  it("Should revert init if invalid invoice", async function () {
    invoice = await WrappedInvoice.deploy();
    await invoice.deployed();
    const receipt = invoice.init(
      parent.address,
      child.address,
      ADDRESS_ZERO,
      splitFactor,
    );
    await expect(receipt).to.revertedWith("invalid invoice");
  });

  it("Should revert init if invalid invoice provider", async function () {
    await mockSmartInvoice.mock.token.returns(mockToken.address);
    await mockSmartInvoice.mock.provider.returns(ADDRESS_ZERO);
    invoice = await WrappedInvoice.deploy();
    await invoice.deployed();
    const receipt = invoice.init(
      parent.address,
      child.address,
      mockSmartInvoice.address,
      splitFactor,
    );
    await expect(receipt).to.revertedWith("invalid invoice provider");
  });

  it("Should revert init if invalid split", async function () {
    invoice = await WrappedInvoice.deploy();
    await invoice.deployed();
    await mockSmartInvoice.mock.token.returns(mockToken.address);
    await mockSmartInvoice.mock.provider.returns(invoice.address);
    const receipt = invoice.init(
      parent.address,
      child.address,
      mockSmartInvoice.address,
      0,
    );
    await expect(receipt).to.revertedWith("invalid split");
  });

  it("Should withdrawAll balance", async function () {
    expect(await invoice.token()).to.equal(mockToken.address);
    await mockToken.mock.balanceOf.withArgs(invoice.address).returns(10);
    await mockToken.mock.transfer.withArgs(parent.address, 1).returns(true);
    await mockToken.mock.transfer.withArgs(child.address, 9).returns(true);

    const receipt = await invoice["withdrawAll()"]();
    await expect(receipt)
      .to.emit(invoice, "Withdraw")
      .withArgs(mockToken.address, 1, 9);
  });

  it("Should withdrawAll balance for other token", async function () {
    expect(await invoice.token()).to.not.equal(otherMockToken.address);
    await otherMockToken.mock.balanceOf.withArgs(invoice.address).returns(10);
    await otherMockToken.mock.transfer
      .withArgs(parent.address, 1)
      .returns(true);
    await otherMockToken.mock.transfer.withArgs(child.address, 9).returns(true);

    const receipt = await invoice["withdrawAll(address)"](
      otherMockToken.address,
    );
    await expect(receipt)
      .to.emit(invoice, "Withdraw")
      .withArgs(otherMockToken.address, 1, 9);
  });

  it("Should withdraw amount", async function () {
    expect(await invoice.token()).to.equal(mockToken.address);
    await mockToken.mock.balanceOf.withArgs(invoice.address).returns(20);
    await mockToken.mock.transfer.withArgs(parent.address, 1).returns(true);
    await mockToken.mock.transfer.withArgs(child.address, 9).returns(true);

    const receipt = await invoice["withdraw(uint256)"](10);
    await expect(receipt)
      .to.emit(invoice, "Withdraw")
      .withArgs(mockToken.address, 1, 9);
  });

  it("Should revert withdraw amount if not enough balance", async function () {
    expect(await invoice.token()).to.equal(mockToken.address);
    await mockToken.mock.balanceOf.withArgs(invoice.address).returns(5);
    await mockToken.mock.transfer.withArgs(parent.address, 1).returns(true);
    await mockToken.mock.transfer.withArgs(child.address, 9).returns(true);

    const receipt = invoice["withdraw(uint256)"](10);
    await expect(receipt).to.be.revertedWith("not enough balance");
  });

  it("Should withdraw amount for other token", async function () {
    expect(await invoice.token()).to.not.equal(otherMockToken.address);
    await otherMockToken.mock.balanceOf.withArgs(invoice.address).returns(20);
    await otherMockToken.mock.transfer
      .withArgs(parent.address, 1)
      .returns(true);
    await otherMockToken.mock.transfer.withArgs(child.address, 9).returns(true);

    const receipt = await invoice["withdraw(address,uint256)"](
      otherMockToken.address,
      10,
    );
    await expect(receipt)
      .to.emit(invoice, "Withdraw")
      .withArgs(otherMockToken.address, 1, 9);
  });

  it("Should withdraw amount for other token but not transfer if parentShare is 0", async function () {
    expect(await invoice.token()).to.not.equal(otherMockToken.address);
    await otherMockToken.mock.balanceOf.withArgs(invoice.address).returns(1);
    await otherMockToken.mock.transfer.withArgs(child.address, 1).returns(true);

    const receipt = await invoice["withdraw(address,uint256)"](
      otherMockToken.address,
      1,
    );
    await expect(receipt)
      .to.emit(invoice, "Withdraw")
      .withArgs(otherMockToken.address, 0, 1);
  });

  it("Should withdraw amount for other token but not transfer if childShare is 0", async function () {
    invoice = await WrappedInvoice.deploy();
    await invoice.deployed();
    await mockSmartInvoice.mock.token.returns(mockToken.address);
    await mockSmartInvoice.mock.provider.returns(invoice.address);
    await invoice.init(
      parent.address,
      child.address,
      mockSmartInvoice.address,
      1,
    );
    expect(await invoice.token()).to.not.equal(otherMockToken.address);
    await otherMockToken.mock.balanceOf.withArgs(invoice.address).returns(1);
    await otherMockToken.mock.transfer
      .withArgs(parent.address, 1)
      .returns(true);

    const receipt = await invoice["withdraw(address,uint256)"](
      otherMockToken.address,
      1,
    );
    await expect(receipt)
      .to.emit(invoice, "Withdraw")
      .withArgs(otherMockToken.address, 1, 0);
  });

  it("should disperseAll balance", async function () {
    expect(await invoice.token()).to.equal(mockToken.address);
    await mockToken.mock.balanceOf.withArgs(invoice.address).returns(10);
    await mockToken.mock.transfer.withArgs(parent.address, 1).returns(true);
    await mockToken.mock.transfer.withArgs(addrs[0].address, 4).returns(true);
    await mockToken.mock.transfer.withArgs(addrs[1].address, 5).returns(true);

    const amounts = [4, 5];
    const fundees = [addrs[0].address, addrs[1].address];
    const receipt = await invoice["disperseAll(uint256[],address[])"](
      amounts,
      fundees,
    );
    await expect(receipt)
      .to.emit(invoice, "Disperse")
      .withArgs(mockToken.address, 1, amounts, fundees);
  });

  it("Should disperseAll but not transfer if parentShare is 0", async function () {
    expect(await invoice.token()).to.equal(mockToken.address);
    await mockToken.mock.balanceOf.withArgs(invoice.address).returns(9);
    await mockToken.mock.transfer.withArgs(addrs[0].address, 4).returns(true);
    await mockToken.mock.transfer.withArgs(addrs[1].address, 5).returns(true);

    const amounts = [4, 5];
    const fundees = [addrs[0].address, addrs[1].address];
    const receipt = await invoice["disperseAll(uint256[],address[])"](
      amounts,
      fundees,
    );
    await expect(receipt)
      .to.emit(invoice, "Disperse")
      .withArgs(mockToken.address, 0, amounts, fundees);
  });

  it("should revert disperseAll if not raider", async function () {
    expect(await invoice.token()).to.equal(mockToken.address);
    invoice = invoice.connect(addrs[0]);
    const amounts = [4, 5];
    const fundees = [addrs[0].address, addrs[1].address];
    const receipt = invoice["disperseAll(uint256[],address[])"](
      amounts,
      fundees,
    );
    await expect(receipt).to.be.revertedWith("!raider");
  });

  it("should revert disperseAll balance if amounts length != fundees length ", async function () {
    expect(await invoice.token()).to.equal(mockToken.address);
    await mockToken.mock.balanceOf.withArgs(invoice.address).returns(10);

    const amounts = [4];
    const fundees = [];
    const receipt = invoice["disperseAll(uint256[],address[])"](
      amounts,
      fundees,
    );
    await expect(receipt).to.be.revertedWith(
      "fundees length != amounts length",
    );
  });

  it("should revert disperseAll balance if amounts don't add up", async function () {
    expect(await invoice.token()).to.equal(mockToken.address);
    await mockToken.mock.balanceOf.withArgs(invoice.address).returns(10);

    const amounts = [4];
    const fundees = [addrs[0].address];
    const receipt = invoice["disperseAll(uint256[],address[])"](
      amounts,
      fundees,
    );
    await expect(receipt).to.be.revertedWith("childShare != total");
  });

  it("should disperseAll balance for other token", async function () {
    expect(await invoice.token()).to.not.equal(otherMockToken.address);
    await otherMockToken.mock.balanceOf.withArgs(invoice.address).returns(10);
    await otherMockToken.mock.transfer
      .withArgs(parent.address, 1)
      .returns(true);
    await otherMockToken.mock.transfer
      .withArgs(addrs[0].address, 4)
      .returns(true);
    await otherMockToken.mock.transfer
      .withArgs(addrs[1].address, 5)
      .returns(true);

    const amounts = [4, 5];
    const fundees = [addrs[0].address, addrs[1].address];
    const receipt = await invoice["disperseAll(uint256[],address[],address)"](
      amounts,
      fundees,
      otherMockToken.address,
    );
    await expect(receipt)
      .to.emit(invoice, "Disperse")
      .withArgs(otherMockToken.address, 1, amounts, fundees);
  });

  it("should revert disperseAll for other token if not raider", async function () {
    expect(await invoice.token()).to.not.equal(otherMockToken.address);
    invoice = invoice.connect(addrs[0]);
    const amounts = [4, 5];
    const fundees = [addrs[0].address, addrs[1].address];
    const receipt = invoice["disperseAll(uint256[],address[],address)"](
      amounts,
      fundees,
      otherMockToken.address,
    );
    await expect(receipt).to.be.revertedWith("!raider");
  });

  it("should disperse amount", async function () {
    expect(await invoice.token()).to.equal(mockToken.address);
    await mockToken.mock.balanceOf.withArgs(invoice.address).returns(20);
    await mockToken.mock.transfer.withArgs(parent.address, 1).returns(true);
    await mockToken.mock.transfer.withArgs(addrs[0].address, 4).returns(true);
    await mockToken.mock.transfer.withArgs(addrs[1].address, 5).returns(true);

    const amounts = [4, 5];
    const fundees = [addrs[0].address, addrs[1].address];
    const receipt = await invoice["disperse(uint256[],address[],uint256)"](
      amounts,
      fundees,
      10,
    );
    await expect(receipt)
      .to.emit(invoice, "Disperse")
      .withArgs(mockToken.address, 1, amounts, fundees);
  });

  it("should revert disperse if not raider", async function () {
    expect(await invoice.token()).to.equal(mockToken.address);
    invoice = invoice.connect(addrs[0]);
    const amounts = [4, 5];
    const fundees = [addrs[0].address, addrs[1].address];
    const receipt = invoice["disperse(uint256[],address[],uint256)"](
      amounts,
      fundees,
      10,
    );
    await expect(receipt).to.be.revertedWith("!raider");
  });

  it("should revert disperse amount if not enough balance", async function () {
    expect(await invoice.token()).to.equal(mockToken.address);
    await mockToken.mock.balanceOf.withArgs(invoice.address).returns(5);
    await mockToken.mock.transfer.withArgs(parent.address, 1).returns(true);
    await mockToken.mock.transfer.withArgs(addrs[0].address, 4).returns(true);
    await mockToken.mock.transfer.withArgs(addrs[1].address, 5).returns(true);

    const amounts = [4, 5];
    const fundees = [addrs[0].address, addrs[1].address];
    const receipt = invoice["disperse(uint256[],address[],uint256)"](
      amounts,
      fundees,
      10,
    );
    await expect(receipt).to.be.revertedWith("not enough balance");
  });

  it("should disperse amount for other token", async function () {
    expect(await invoice.token()).to.not.equal(otherMockToken.address);
    await otherMockToken.mock.balanceOf.withArgs(invoice.address).returns(20);
    await otherMockToken.mock.transfer
      .withArgs(parent.address, 1)
      .returns(true);
    await otherMockToken.mock.transfer
      .withArgs(addrs[0].address, 4)
      .returns(true);
    await otherMockToken.mock.transfer
      .withArgs(addrs[1].address, 5)
      .returns(true);

    const amounts = [4, 5];
    const fundees = [addrs[0].address, addrs[1].address];
    const receipt = await invoice[
      "disperse(uint256[],address[],address,uint256)"
    ](amounts, fundees, otherMockToken.address, 10);
    await expect(receipt)
      .to.emit(invoice, "Disperse")
      .withArgs(otherMockToken.address, 1, amounts, fundees);
  });

  it("should revert disperse for other token if not raider", async function () {
    expect(await invoice.token()).to.not.equal(otherMockToken.address);
    invoice = invoice.connect(addrs[0]);
    const amounts = [4, 5];
    const fundees = [addrs[0].address, addrs[1].address];
    const receipt = invoice["disperse(uint256[],address[],address,uint256)"](
      amounts,
      fundees,
      otherMockToken.address,
      10,
    );
    await expect(receipt).to.be.revertedWith("!raider");
  });

  it("should lock smart invoice", async function () {
    await mockSmartInvoice.mock.lock.withArgs(EMPTY_BYTES32).returns();
    await invoice["lock(bytes32)"](EMPTY_BYTES32);
  });

  it("should revert lock if not raider", async function () {
    invoice = invoice.connect(addrs[0]);
    const receipt = invoice["lock(bytes32)"](EMPTY_BYTES32);
    await expect(receipt).to.be.revertedWith("!raider");
  });
});
