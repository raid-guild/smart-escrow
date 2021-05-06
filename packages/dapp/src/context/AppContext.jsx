import React, { Component, createContext } from 'react';

import { SafeAppWeb3Modal as Web3Modal } from '@gnosis.pm/safe-apps-web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';

const wXDAI_ABI = require('../abi/wXDAI.json');
const wETH_ABI = require('../abi/wETH.json');

const { w_XDAI, w_ETH } = require('../utils/constants').contractAddresses;

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
    const wXDAI = new web3.eth.Contract(wXDAI_ABI, w_XDAI);
    const wETH = new web3.eth.Contract(wETH_ABI, w_ETH);
    const chainID = await web3.eth.net.getId();

    this.setState({ web3, wXDAI, wETH, chainID });
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

      const wXDAI = new web3.eth.Contract(wXDAI_ABI, w_XDAI);
      const wETH = new web3.eth.Contract(wETH_ABI, w_ETH);

      let chainID = await web3.eth.net.getId();

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

          wXDAI,
          wETH,
          chainID
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
