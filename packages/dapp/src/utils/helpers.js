import { rpcUrls, networkLabels, networkNames } from './constants';

export const getRpcUrl = (chainId) => rpcUrls[chainId] || rpcUrls[4];

export const logError = (error) => console.log(error);

export const getAccountString = (account) => {
  const len = account.length;
  return `0x${account.substr(2, 3).toUpperCase()}...${account
    .substr(len - 3, len - 1)
    .toUpperCase()}`;
};

export const getNetworkName = (chainId) =>
  networkNames[chainId] || 'Unknown Chain';

export const getNetworkLabel = (chainId) => networkLabels[chainId] || 'unknown';
