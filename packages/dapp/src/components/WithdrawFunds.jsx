import { Button, Heading, Link, Text, VStack } from '@chakra-ui/react';
import { utils } from 'ethers';
import React, { useContext, useState } from 'react';

import { AppContext } from '../context/AppContext';
import { getTxLink, parseTokenAddress } from '../utils/helpers';
import { withdraw } from '../utils/invoice';

import { Loader } from '../components/Loader';

export const WithdrawFunds = ({ contractAddress, token, balance }) => {
  const [loading, setLoading] = useState(false);
  const { chainID, provider } = useContext(AppContext);

  const [transaction, setTransaction] = useState();

  const withdrawFunds = async () => {
    if (!loading && provider && balance.gte(0)) {
      try {
        setLoading(true);
        const tx = await withdraw(provider, contractAddress);
        setTransaction(tx);
        await tx.wait();
        setLoading(false);
        setTimeout(() => {
          window.location.reload();
        }, 20000);
      } catch (withdrawError) {
        console.log(withdrawError);
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
        Withdraw Funds
      </Heading>
      <Text textAlign='center' fontSize='sm' mb='1rem' fontFamily='jetbrains'>
        Follow the instructions in your wallet to withdraw remaining funds from
        the escrow.
      </Text>
      <VStack my='2rem' px='5rem' py='1rem' bg='black' borderRadius='0.5rem'>
        <Text
          color='red.500'
          fontSize='0.875rem'
          textAlign='center'
          fontFamily='jetbrains'
        >
          Amount To Be Withdrawn
        </Text>
        <Text
          color='yellow'
          fontSize='1rem'
          fontWeight='bold'
          textAlign='center'
          fontFamily='jetbrains'
        >{`${utils.formatUnits(balance, 18)} ${parseTokenAddress(
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
      {loading && <Loader />}
      <Button
        onClick={withdrawFunds}
        variant='primary'
        textTransform='uppercase'
        w='100%'
      >
        Withdraw
      </Button>
    </VStack>
  );
};
