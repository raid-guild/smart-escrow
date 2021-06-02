import { Button, Heading, Link, Text, VStack } from '@chakra-ui/react';
import { utils } from 'ethers';
import React, { useContext, useEffect, useState } from 'react';

import { AppContext } from '../context/AppContext';
import { getTxLink } from '../utils/helpers';
import { withdraw } from '../utils/invoice';

import { tokenInfo, hexChainIds } from '../utils/constants';

const getTokenInfo = (chainId, token) =>
  (tokenInfo[chainId] || tokenInfo[4])[token] || {
    decimals: 18,
    symbol: 'UNKNOWN'
  };

const getHexChainId = (network) => hexChainIds[network] || hexChainIds.rinkeby;

export const WithdrawFunds = ({ invoice, balance, close }) => {
  const [loading, setLoading] = useState(false);
  const { chainID, provider } = useContext(AppContext);
  const { network, address, token } = invoice;

  const { decimals, symbol } = getTokenInfo(chainID, token);
  const [transaction, setTransaction] = useState();

  useEffect(() => {
    const send = async () => {
      try {
        setLoading(true);
        const tx = await withdraw(provider, address);
        setTransaction(tx);
        await tx.wait();
        window.location.href = `/invoice/${getHexChainId(network)}/${address}`;
        setLoading(false);
      } catch (withdrawError) {
        close();
        console.log(withdrawError);
      }
    };
    if (!loading && provider && balance.gte(0)) {
      send();
    }
  }, [network, balance, address, provider, loading, close]);

  return (
    <VStack w='100%' spacing='1rem'>
      <Heading
        fontWeight='normal'
        mb='1rem'
        textTransform='uppercase'
        textAlign='center'
      >
        Withdraw Funds
      </Heading>
      <Text textAlign='center' fontSize='sm' mb='1rem'>
        Follow the instructions in your wallet to withdraw remaining funds from
        the escrow.
      </Text>
      <VStack my='2rem' px='5rem' py='1rem' bg='black' borderRadius='0.5rem'>
        <Text color='red.500' fontSize='0.875rem' textAlign='center'>
          Amount To Be Withdrawn
        </Text>
        <Text
          color='white'
          fontSize='1rem'
          fontWeight='bold'
          textAlign='center'
        >{`${utils.formatUnits(balance, decimals)} ${symbol}`}</Text>
      </VStack>
      {transaction && (
        <Text color='white' textAlign='center' fontSize='sm'>
          Follow your transaction{' '}
          <Link
            href={getTxLink(chainID, transaction.hash)}
            isExternal
            color='red.500'
            textDecoration='underline'
          >
            here
          </Link>
        </Text>
      )}
      <Button
        onClick={close}
        variant='primary'
        textTransform='uppercase'
        w='100%'
      >
        Close
      </Button>
    </VStack>
  );
};
