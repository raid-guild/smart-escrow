import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';

import { SafeAppWeb3Modal as Web3Modal } from '@gnosis.pm/safe-apps-web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';
import Web3 from 'web3';

import { getRpcUrl, logError } from '../utils/helpers';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        1: getRpcUrl(1),
        4: getRpcUrl(4),
        42: getRpcUrl(42),
        100: getRpcUrl(100)
      }
    }
  }
};

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions
  // theme: {
  //   background: '',
  //   main: '',
  //   secondary: '',
  //   hover: ''
  // }
});

export const Web3Context = createContext();
export const useWeb3 = () => useContext(Web3Context);

export const Web3ContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [{ account, provider, chainId }, setWeb3] = useState({});

  const setWeb3Provider = async (provider, initialCall = false) => {
    if (provider) {
      const web3Provider = new Web3(provider);
      const gotProvider = new ethers.providers.Web3Provider(
        web3Provider.currentProvider
      );
      const gotChainId = Number(provider.chainId);

      if (initialCall) {
        const signer = gotProvider.getSigner();
        const gotAccount = await signer.getAddress();

        setWeb3((_provider) => ({
          ..._provider,
          provider: gotProvider,
          chainId: gotChainId,
          account: gotAccount
        }));
      } else {
        setWeb3((_provider) => ({
          ..._provider,
          provider: gotProvider,
          chainId: gotChainId
        }));
      }
    }
  };

  const connectWeb3 = useCallback(async () => {
    try {
      setLoading(true);

      const modalProvider = await web3Modal.requestProvider();

      await setWeb3Provider(modalProvider, true);

      const isGnosisSafe = !!modalProvider.safe;

      if (!isGnosisSafe) {
        modalProvider.on('accountsChanged', (accounts) => {
          setWeb3((_provider) => ({
            ..._provider,
            account: accounts[0]
          }));
        });
        modalProvider.on('chainChanged', () => {
          setWeb3Provider(modalProvider);
        });
      }
    } catch (web3ModalError) {
      logError({ web3ModalError });
      throw web3ModalError;
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    web3Modal.clearCachedProvider();
    setWeb3({});
  });

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.autoRefreshOnNetworkChange = false;
    }
    // (async function load() {
    //   if ((await web3Modal.canAutoConnect()) || web3Modal.cachedProvider) {
    //     connectWeb3();
    //   }
    // })();
  }, [connectWeb3]);

  return (
    <Web3Context.Provider
      value={{
        loading,
        account,
        provider,
        chainId,
        connectAccount: connectWeb3,
        disconnect
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
