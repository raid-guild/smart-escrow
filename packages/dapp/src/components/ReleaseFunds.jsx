import { Button, Heading, Link, Text, VStack } from '@chakra-ui/react';
import { BigNumber, utils } from 'ethers';
import React, { useContext, useEffect, useState } from 'react';

import { AppContext } from '../context/AppContext';
import { getTxLink } from '../utils/helpers';
import { NETWORK_CONFIG } from '../utils/constants';
import { release } from '../utils/invoice';

const parseTokenAddress = (chainId, address) => {
  for (const [key, value] of Object.entries(
    NETWORK_CONFIG[parseInt(chainId)]['TOKENS']
  )) {
    if (value['address'] === address.toLowerCase()) {
      return key;
    }
  }
};

export const ReleaseFunds = ({ invoice, balance, close }) => {
  const [loading, setLoading] = useState(false);
  const { chainID, provider } = useContext(AppContext);
  const { network, currentMilestone, amounts, address, token } = invoice;

  let amount = BigNumber.from(amounts[currentMilestone]);
  amount =
    currentMilestone === amounts.length - 1 && amount.lt(balance)
      ? balance
      : amounts[currentMilestone];

  const [transaction, setTransaction] = useState();

  useEffect(() => {
    const send = async () => {
      try {
        setLoading(true);
        const tx = await release(provider, address);
        setTransaction(tx);
        await tx.wait();
        // window.location.href = `/invoice/${getHexChainId(network)}/${address}`;
      } catch (releaseError) {
        console.log(releaseError);
        close();
      }
    };
    if (!loading && provider && balance && balance.gte(amount)) {
      send();
    }
  }, [network, amount, address, provider, balance, loading, close]);

  return (
    <VStack w='100%' spacing='1rem'>
      <Heading
        fontWeight='normal'
        mb='1rem'
        textTransform='uppercase'
        textAlign='center'
      >
        Release Funds
      </Heading>
      <Text textAlign='center' fontSize='sm' mb='1rem'>
        Follow the instructions in your wallet to release funds from escrow to
        the project team.
      </Text>
      <VStack my='2rem' px='5rem' py='1rem' bg='black' borderRadius='0.5rem'>
        <Text color='red.500' fontSize='0.875rem' textAlign='center'>
          Amount To Be Released
        </Text>
        <Text
          color='white'
          fontSize='1rem'
          fontWeight='bold'
          textAlign='center'
        >{`${utils.formatUnits(amount, 18)} ${parseTokenAddress(
          chainID,
          token
        )}`}</Text>
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
