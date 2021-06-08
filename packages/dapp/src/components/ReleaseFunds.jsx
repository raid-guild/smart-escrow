import { Button, Heading, Link, Text, VStack } from '@chakra-ui/react';
import { BigNumber, utils } from 'ethers';
import React, { useContext, useState } from 'react';

import { Loader } from '../components/Loader';
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

export const ReleaseFunds = ({ invoice, balance }) => {
  const [loading, setLoading] = useState(false);
  const { chainID, provider } = useContext(AppContext);
  const { currentMilestone, amounts, address, token } = invoice;

  console.log(currentMilestone, amounts.length);

  const getReleaseAmount = (currentMilestone, amounts, balance) => {
    if (
      currentMilestone >= amounts.length ||
      (currentMilestone === amounts.length - 1 &&
        balance.gte(amounts[currentMilestone]))
    ) {
      return balance;
    }
    return BigNumber.from(amounts[currentMilestone]);
  };

  const [transaction, setTransaction] = useState();

  const releaseFunds = async () => {
    if (
      !loading &&
      provider &&
      balance &&
      balance.gte(getReleaseAmount(currentMilestone, amounts, balance))
    ) {
      try {
        setLoading(true);
        const tx = await release(provider, address);
        setTransaction(tx);
        await tx.wait();
        window.location.reload();
      } catch (releaseError) {
        console.log(releaseError);
      }
    }
  };

  return (
    <VStack w='100%' spacing='1rem'>
      <Heading
        fontWeight='normal'
        mb='1rem'
        textTransform='uppercase'
        textAlign='center'
        fontFamily='rubik'
        color='red'
      >
        Release Funds
      </Heading>
      <Text textAlign='center' fontSize='sm' mb='1rem' fontFamily='jetbrains'>
        Follow the instructions in your wallet to release funds from escrow to
        the project team.
      </Text>
      <VStack my='2rem' px='5rem' py='1rem' bg='black' borderRadius='0.5rem'>
        <Text
          color='red'
          fontSize='0.875rem'
          textAlign='center'
          fontFamily='jetbrains'
        >
          Amount To Be Released
        </Text>
        <Text
          color='yellow'
          fontSize='1rem'
          fontWeight='bold'
          textAlign='center'
          fontFamily='jetbrains'
        >{`${utils.formatUnits(
          getReleaseAmount(currentMilestone, amounts, balance),
          18
        )} ${parseTokenAddress(chainID, token)}`}</Text>
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
      {loading && <Loader />}

      {!loading && (
        <Button
          onClick={releaseFunds}
          textTransform='uppercase'
          variant='primary'
          w='100%'
        >
          Release
        </Button>
      )}
    </VStack>
  );
};
