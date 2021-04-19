import { rpcUrls } from './constants';

export const getRpcUrl = (chainId) => rpcUrls[chainId] || rpcUrls[4];

export const logError = (error) => console.log(error);
