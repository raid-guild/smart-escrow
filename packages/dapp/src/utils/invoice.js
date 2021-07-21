import { Contract, utils } from 'ethers';

import { NETWORK_CONFIG } from './constants';

const getInvoiceFactoryAddress = (chainId) => {
  const invoiceFactory = {
    4: NETWORK_CONFIG[4].INVOICE_FACTORY,
    100: NETWORK_CONFIG[100].INVOICE_FACTORY
  };

  return invoiceFactory[chainId] || invoiceFactory[4];
};

export const register = async (
  chainId,
  ethersProvider,
  client,
  providers,
  splitFactor,
  resolver,
  token,
  payments,
  terminationTime,
  details
) => {
  const abi = new utils.Interface([
    'function create(address _client, address[] calldata _providers, uint256 _splitFactor, uint8 _resolverType, address _resolver, address _token, uint256[] calldata _amounts, uint256 _terminationTime, bytes32 _details) external'
  ]);

  const contract = new Contract(
    getInvoiceFactoryAddress(chainId),
    abi,
    ethersProvider.getSigner()
  );

  const resolverType = 0;
  return contract.create(
    client,
    providers,
    splitFactor,
    resolverType,
    resolver,
    token,
    payments,
    terminationTime,
    details
  );
};

export const getSmartInvoiceAddress = async (address, ethersProvider) => {
  const abi = new utils.Interface([
    'function invoice() public view returns(address)'
  ]);
  const contract = new Contract(address, abi, ethersProvider);
  const smartInvoice = await contract.invoice();
  return smartInvoice;
};

export const getRaidPartyAddress = async (address, ethersProvider) => {
  const abi = new utils.Interface([
    'function child() public view returns(address)'
  ]);
  const contract = new Contract(address, abi, ethersProvider);
  const child = await contract.child();
  return child;
};

export const getResolutionRateFromFactory = async (
  chainId,
  ethersProvider,
  resolver
) => {
  if (!utils.isAddress(resolver)) return 20;
  try {
    const abi = new utils.Interface([
      'function resolutionRates(address resolver) public view returns (uint256)'
    ]);
    const contract = new Contract(
      getInvoiceFactoryAddress(chainId),
      abi,
      ethersProvider
    );

    const resolutionRate = Number(await contract.resolutionRates(resolver));
    return resolutionRate > 0 ? resolutionRate : 20;
  } catch (resolutionRateError) {
    console.log(resolutionRateError);
    return 20;
  }
};

export const awaitInvoiceAddress = async (ethersProvider, tx) => {
  await tx.wait(1);
  const abi = new utils.Interface([
    'event LogNewWrappedInvoice(uint256 indexed index, address wrappedInvoice)'
  ]);
  const receipt = await ethersProvider.getTransactionReceipt(tx.hash);
  const eventFragment = abi.events[Object.keys(abi.events)[0]];
  const eventTopic = abi.getEventTopic(eventFragment);
  const event = receipt.logs.find((e) => e.topics[0] === eventTopic);
  if (event) {
    const decodedLog = abi.decodeEventLog(
      eventFragment,
      event.data,
      event.topics
    );
    return decodedLog.wrappedInvoice;
  }
  return '';
};

export const awaitSpoilsWithdrawn = async (ethersProvider, tx) => {
  await tx.wait(1);
  const abi = new utils.Interface([
    'event Withdraw(address indexed token, uint256 parentShare, uint256 childShare)'
  ]);
  const receipt = await ethersProvider.getTransactionReceipt(tx.hash);
  const eventFragment = abi.events[Object.keys(abi.events)[0]];
  const eventTopic = abi.getEventTopic(eventFragment);
  const event = receipt.logs.find((e) => e.topics[0] === eventTopic);
  if (event) {
    const decodedLog = abi.decodeEventLog(
      eventFragment,
      event.data,
      event.topics
    );
    return decodedLog;
  }
  return '';
};

export const release = async (ethersProvider, address) => {
  const abi = new utils.Interface(['function release() public']);
  const contract = new Contract(address, abi, ethersProvider.getSigner());
  return contract.release();
};

export const withdraw = async (ethersProvider, address) => {
  const abi = new utils.Interface(['function withdraw() public']);
  const contract = new Contract(address, abi, ethersProvider.getSigner());
  return contract.withdraw();
};

export const lock = async (
  ethersProvider,
  address,
  detailsHash // 32 bits hex
) => {
  const abi = new utils.Interface(['function lock(bytes32 details) external']);
  const contract = new Contract(address, abi, ethersProvider.getSigner());
  return contract.lock(detailsHash);
};

export const resolve = async (
  ethersProvider,
  address,
  clientAward,
  providerAward,
  detailsHash // 32 bits hex
) => {
  const abi = new utils.Interface([
    'function resolve(uint256 clientAward, uint256 providerAward, bytes32 details) external'
  ]);
  const contract = new Contract(address, abi, ethersProvider.getSigner());
  return contract.resolve(clientAward, providerAward, detailsHash);
};
