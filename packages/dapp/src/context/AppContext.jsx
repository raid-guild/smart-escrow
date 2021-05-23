import React, { Component, createContext } from 'react';

import { SafeAppWeb3Modal as Web3Modal } from '@gnosis.pm/safe-apps-web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';
import Web3 from 'web3';

import { rpcUrls } from '../utils/constants';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        4: rpcUrls[4],
        100: rpcUrls[100]
      }
    }
  }
};

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions
});

export const AppContext = createContext();

class AppContextProvider extends Component {
  state = {
    //web3 needs
    account: '',
    provider: '',
    web3: '',
    chainID: '',

    // invoice info
    client: '0xB96E81f80b3AEEf65CB6d0E280b15FD5DBE71937',
    serviceProvider: '0x5932221470936e5c845A93bB2b6AC3396f2863Ba',
    token: 'WXDAI',
    paymentDue: 5000,
    milestones: 3,
    payments: [1000, 3000, 1000],

    //airtable info
    escrow_index: '',
    raid_id: '',
    project_name: '',
    client_name: '',
    start_date: '',
    end_date: '',
    link_to_details: '',
    brief_description: '',

    //math needs
    spoils_percent: 0.1,

    //checks
    isLoading: false
  };

  async componentDidMount() {
    const web3 = new Web3(
      new Web3.providers.HttpProvider(`https://rpc.xdaichain.com/`)
    );

    const chainID = await web3.eth.net.getId();

    this.setState({ web3, chainID });
  }

  setAirtableState = async (id) => {
    let result = await fetch(
      'https://guild-keeper.herokuapp.com/escrow/validate-raid',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ID: id
        })
      }
    ).then((res) => res.json());

    if (result !== 'NOT_FOUND') {
      this.setState(
        {
          escrow_index: result['Escrow Index'] || '',
          raid_id: id,
          project_name: result['Project Name'] || 'Not Available',
          client_name: result['Name'] || 'Not Available',
          start_date: result['Raid Start Date'] || 'Not Available',
          end_date: result['Expected Deadline'] || 'Not Available',
          link_to_details: result['Specs Link'] || 'Not Available',
          brief_description: result['Project Description'] || 'Not Available'
        },
        () => this.fetchLockerInfo()
      );
      return {
        validRaidId: true,
        escrow_index: result['Escrow Index'] || ''
      };
    } else {
      return { validRaidId: false, escrow_index: '' };
    }
  };

  fetchLockerInfo = async () => {
    if (this.state.escrow_index) {
      // todo
    }
  };

  setWeb3Provider = async (prov, initialCall = false) => {
    if (prov) {
      const web3Provider = new Web3(prov);
      const gotProvider = new ethers.providers.Web3Provider(
        web3Provider.currentProvider
      );
      const gotChainId = Number(prov.chainId);

      if (initialCall) {
        const signer = gotProvider.getSigner();
        const gotAccount = await signer.getAddress();
        this.setState({
          account: gotAccount,
          chainID: gotChainId,
          provider: gotProvider
        });
      } else {
        this.setState({ chainID: gotChainId, provider: gotProvider });
      }
    }
  };

  connectAccount = async () => {
    try {
      this.updateLoadingState();

      const modalProvider = await web3Modal.requestProvider();

      await this.setWeb3Provider(modalProvider, true);

      const isGnosisSafe = !!modalProvider.safe;

      if (!isGnosisSafe) {
        modalProvider.on('accountsChanged', (accounts) => {
          this.setState({ account: accounts[0] });
        });
        modalProvider.on('chainChanged', (chainID) => {
          this.setState({ chainID });
          console.log(chainID);
        });
      }
    } catch (web3ModalError) {
      console.log(web3ModalError);
    } finally {
      this.updateLoadingState();
    }
  };

  updateLoadingState = () => {
    this.setState({ isLoading: !this.state.isLoading });
  };

  disconnect = async () => {
    web3Modal.clearCachedProvider();
    this.setState({ account: '', provider: '', web3: '', chainID: '' });
  };

  render() {
    return (
      <AppContext.Provider
        value={{
          ...this.state,
          setAirtableState: this.setAirtableState,
          connectAccount: this.connectAccount,
          updateLoadingState: this.updateLoadingState,
          disconnect: this.disconnect
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppContextProvider;
