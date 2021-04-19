import { CONFIG } from '../config';

const { INFURA_ID, IPFS_ENDPOINT, BOX_ENDPOINT, NETWORK_CONFIG } = CONFIG;

export { INFURA_ID, IPFS_ENDPOINT, BOX_ENDPOINT };

export const networkLabels = {
  100: 'xDai',
  1: 'Ethereum',
  3: 'Ropsten',
  4: 'Rinkeby',
  5: 'Görli',
  42: 'Kovan',
  56: 'BSC',
  77: 'Sokol',
  137: 'Matic'
};

export const networkNames = {
  1: 'ETH Mainnet',
  4: 'Rinkeby Testnet',
  42: 'Kovan Testnet',
  100: 'xDai Chain'
};

export const rpcUrls = {
  1: `https://mainnet.infura.io/v3/${INFURA_ID}`,
  4: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
  42: `https://kovan.infura.io/v3/${INFURA_ID}`,
  100: 'https://rpc.xdaichain.com'
};

export const SUPPORTED_NETWORKS = Object.keys(NETWORK_CONFIG).map((n) =>
  Number(n)
);

export const contractAddresses = {
  Locker: '0x7f8F6E42C169B294A384F5667c303fd8Eedb3CF3',
  w_XDAI: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
  w_ETH: '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1',
  RaidGuild: '0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f',
  LexArbitration: '0x034CfED494EdCff96f0D7160dC2B55Cae5Ee69E1'
};
