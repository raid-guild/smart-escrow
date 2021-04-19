import React from 'react';
import { useHistory } from 'react-router-dom';

import { useWeb3 } from '../context/Web3Context';

import { logError } from '../utils/helpers';

export const Home = () => {
  const { connectAccount, account } = useWeb3();

  const history = useHistory();

  const connectWallet = async () => {
    try {
      await connectAccount();
    } catch {
      logError("Couldn't connect web3 wallet");
    }
  };

  const validateRaidId = async () => {
    // Do RaidID validation
    if (true) {
      await connectWallet();
    }
  };

  return (
    <div>
      <h1>Home</h1>
      <input type='text' placeholder='Enter raid ID'></input>
      <button onClick={validateRaidId}>Connect</button>
    </div>
  );
};
