import React, { Component, createContext } from 'react';

import { SafeAppWeb3Modal as Web3Modal } from '@gnosis.pm/safe-apps-web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';
import Web3 from 'web3';

const lockerABI = require('../abi/Locker.json');
const wXDAI_ABI = require('../abi/wXDAI.json');
const wETH_ABI = require('../abi/wETH.json');

const {
  Locker,
  w_XDAI,
  w_ETH,
  RaidGuild,
  LexArbitration
} = require('../utils/constants').contractAddresses;

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        100: 'https://rpc.xdaichain.com/'
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
    address: '',
    provider: '',
    web3: '',
    chainID: '',
    //contracts & address
    locker: '',
    client_address: '',
    resolver_address: LexArbitration,
    spoils_address: RaidGuild,
    //locker info
    cap: '',
    confirmed: '',
    locked: '',
    released: '',
    token: '',
    termination: '',
    client: '',
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
    isClient: false,
    isLoading: false
  };

  async componentDidMount() {
    const web3 = new Web3(
      new Web3.providers.HttpProvider(`https://rpc.xdaichain.com/`)
    );
    const locker = new web3.eth.Contract(lockerABI, Locker);
    const wXDAI = new web3.eth.Contract(wXDAI_ABI, w_XDAI);
    const wETH = new web3.eth.Contract(wETH_ABI, w_ETH);
    const chainID = await web3.eth.net.getId();

    this.setState({ web3, locker, wXDAI, wETH, chainID });
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
    if (this.state.escrow_index !== '' && this.state.locker) {
      let {
        cap,
        confirmed,
        locked,
        released,
        token,
        termination,
        client
      } = await this.state.locker.methods
        .lockers(this.state.escrow_index)
        .call();
      this.setState({
        cap,
        confirmed,
        locked,
        released,
        token,
        termination,
        client
      });
    }
  };

  connectAccount = async () => {
    try {
      this.updateLoadingState();
      // web3Modal.clearCachedProvider();

      const provider = await web3Modal.requestProvider();
      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();

      const isGnosisSafe = !!provider.safe;

      if (!isGnosisSafe) {
        provider.on('accountsChanged', (accounts) => {
          this.setState({ address: accounts[0] });
        });
        provider.on('chainChanged', (chainId) => {
          this.setState({ chainID: chainId });
        });
      }

      const locker = new web3.eth.Contract(lockerABI, Locker);
      const wXDAI = new web3.eth.Contract(wXDAI_ABI, w_XDAI);
      const wETH = new web3.eth.Contract(wETH_ABI, w_ETH);

      let chainID = await web3.eth.net.getId();

      let ethers_locker = new ethers.Contract(
        Locker,
        lockerABI,
        new ethers.providers.Web3Provider(web3.currentProvider)
      );

      let isClient = false;

      if (accounts[0] === this.state.client) {
        isClient = true;
      }

      provider.on('chainChanged', (chainId) => {
        this.setState({ chainID: chainId });
      });

      provider.on('accountsChanged', (accounts) => {
        window.location.href = '/';
      });

      this.setState(
        {
          address: accounts[0],
          provider,
          web3,
          isClient,
          locker,
          wXDAI,
          wETH,
          chainID,
          ethers_locker
        },
        () => {
          this.updateLoadingState();
        }
      );
    } catch (err) {
      this.updateLoadingState();
    }
  };

  updateLoadingState = () => {
    this.setState({ isLoading: !this.state.isLoading });
  };

  disconnect = async () => {
    web3Modal.clearCachedProvider();
    this.setState({ address: '', provider: '', web3: '', chainID: '' });
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
