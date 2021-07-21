import React, { Component, createContext } from 'react';

import { SafeAppWeb3Modal as Web3Modal } from '@gnosis.pm/safe-apps-web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';
import Web3 from 'web3';

import { rpcUrls } from '../utils/constants';
import { apiRequest } from '../utils/helpers';

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

    //airtable info
    invoice_id: '',
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

  setAirtableState = async (id) => {
    let data = await apiRequest({ type: 'validate', raidID: id });

    if (data !== 'NOT_FOUND') {
      this.setState({
        invoice_id: data['Invoice ID'] || '',
        raid_id: id,
        project_name: data['Project Name'] || 'Not Specified',
        client_name: data['Name'] || 'Not Specified',
        start_date: data['Raid Start Date'] || 'Not Specified',
        end_date: data['Expected Deadline'] || 'Not Specified',
        link_to_details: data['Specs Link'] || 'Not Specified',
        brief_description: data['Project Description'] || 'Not Specified'
      });
      return {
        validRaidId: true,
        invoice_id: data['Invoice ID'] || ''
      };
    } else {
      return { validRaidId: false, invoice_id: '' };
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
          provider: gotProvider,
          web3: web3Provider
        });
      } else {
        this.setState({
          chainID: gotChainId,
          provider: gotProvider,
          web3: web3Provider
        });
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
