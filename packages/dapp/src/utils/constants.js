const INFURA_ID = process.env.REACT_APP_INFURA_ID;
const IPFS_ENDPOINT = 'https://ipfs.infura.io';
const BOX_ENDPOINT = 'https://ipfs.3box.io';

const NETWORK_CONFIG = {
  100: {
    WRAPPED_NATIVE_TOKEN: ''.toLowerCase(),
    INVOICE_FACTORY: ''.toLowerCase(),
    TOKENS: {
      ['0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d'.toLowerCase()]: {
        decimals: 18,
        symbol: 'WXDAI'
      },
      ['0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1'.toLowerCase()]: {
        decimals: 18,
        symbol: 'WETH'
      }
    }
    // RESOLVERS: {
    //   ['0x034CfED494EdCff96f0D7160dC2B55Cae5Ee69E1'.toLowerCase()]: {
    //     name: 'LexDAO',
    //     logoUrl: LexDAOLogo,
    //     termsUrl:
    //       'https://github.com/lexDAO/Arbitration/blob/master/rules/ToU.md#lexdao-resolver',
    //   },
    // },
  },
  4: {
    WRAPPED_NATIVE_TOKEN: ''.toLowerCase(),
    INVOICE_FACTORY: ''.toLowerCase(),
    TOKENS: {
      ['0xc778417E063141139Fce010982780140Aa0cD5Ab'.toLowerCase()]: {
        decimals: 18,
        symbol: 'WETH'
      },
      ['0x3af6b2f907f0c55f279e0ed65751984e6cdc4a42'.toLowerCase()]: {
        decimals: 18,
        symbol: 'DAI'
      },
      ['0x982e00B16c313E979C0947b85230907Fce45d50e'.toLowerCase()]: {
        decimals: 18,
        symbol: 'TEST'
      }
    }
    // RESOLVERS: {
    //   ['0x1206b51217271FC3ffCa57d0678121983ce0390E'.toLowerCase()]: {
    //     name: 'LexDAO',
    //     logoUrl: LexDAOLogo,
    //     termsUrl:
    //       'https://github.com/lexDAO/Arbitration/blob/master/rules/ToU.md#lexdao-resolver',
    //   },
    // },
  }
};

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

export const contractAddresses = {
  w_XDAI: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
  w_ETH: '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1',
  RaidGuild: '0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f',
  LexArbitration: '0x034CfED494EdCff96f0D7160dC2B55Cae5Ee69E1'
};
