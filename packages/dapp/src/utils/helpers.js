import axios from 'axios';

import {
  explorerUrls,
  networkLabels,
  NETWORK_CONFIG,
  nativeSymbols,
  wrappedNativeToken
} from './constants';

export const copyToClipboard = (value) => {
  const tempInput = document.createElement('input');
  tempInput.value = value;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
};

export const getExplorerUrl = (chainId) =>
  explorerUrls[chainId] || explorerUrls[4];

export const getTxLink = (chainId, hash) =>
  `${getExplorerUrl(chainId)}/tx/${hash}`;

export const getAddressLink = (chainId, hash) =>
  `${getExplorerUrl(chainId)}/address/${hash}`;

export const getResolverUrl = (chainId) => {
  let resolverAddress = NETWORK_CONFIG[chainId]
    ? NETWORK_CONFIG[chainId]['RESOLVERS']['LexDAO']['address']
    : undefined;
  return `${getExplorerUrl(chainId)}/address/${resolverAddress}`;
};

export const getSpoilsUrl = (chainId, address) => {
  let spoilsAddress = chainId === 100 ? NETWORK_CONFIG['RG_XDAI'] : address;
  return `${getExplorerUrl(chainId)}/address/${spoilsAddress}`;
};

export const getNetworkLabel = (chainId) =>
  networkLabels[parseInt(chainId)] || 'unknown';

export const getAccountString = (account) => {
  const len = account.length;
  return `0x${account.substr(2, 3).toUpperCase()}...${account
    .substr(len - 3, len - 1)
    .toUpperCase()}`;
};

export const getNativeTokenSymbol = (chainId) =>
  nativeSymbols[chainId] || nativeSymbols[4];

export const getWrappedNativeToken = (chainId) =>
  wrappedNativeToken[chainId] || wrappedNativeToken[4];

export const apiRequest = async ({
  type,
  raidID,
  txHash = '',
  invoiceId = ''
}) => {
  let result;

  if (type === 'validate')
    result = await axios.post('/validate-raid', {
      ID: raidID
    });

  if (type === 'update')
    result = await axios.post('/update-invoice', {
      ID: raidID,
      Hash: txHash,
      Index: invoiceId
    });

  return result.data;
};
