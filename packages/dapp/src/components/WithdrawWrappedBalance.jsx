import { Button, Heading, Link, Text, VStack } from '@chakra-ui/react';
import { utils, Contract } from 'ethers';
import React, { useContext, useState } from 'react';

import { Loader } from '../components/Loader';

import { AppContext } from '../context/AppContext';

import {
  getTxLink,
  parseTokenAddress,
  apiNotifySpoils
} from '../utils/helpers';
import { awaitSpoilsWithdrawn, getSmartInvoiceAddress } from '../utils/invoice';
import { getInvoice } from '../graphql/getInvoice';
import { balanceOf } from '../utils/erc20';

export const WithdrawWrappedBalance = ({ contractAddress, token, balance }) => {
  const [loading, setLoading] = useState(false);
  const { chainID, invoice_id, provider } = useContext(AppContext);

  const [transaction, setTransaction] = useState();

  const pollSubgraph = async () => {
    let smartInvoice = await getSmartInvoiceAddress(invoice_id, provider);

    let isSubscribed = true;

    const interval = setInterval(async () => {
      let inv = await getInvoice(parseInt(chainID), smartInvoice);
      if (isSubscribed && !!inv) {
        console.log(`Invoice data received, ${inv}`);

        let newBalance = await balanceOf(provider, token, contractAddress);

        if (!(utils.formatUnits(newBalance, 18) > 0)) {
          isSubscribed = false;
          clearInterval(interval);
          console.log(
            utils.formatUnits(newBalance, 18),
            utils.formatUnits(balance, 18)
          );
          window.location.reload();
        }
      }
    }, 5000);
  };

  const notifySpoilsSent = async (tx) => {
    let result = await awaitSpoilsWithdrawn(provider, tx);
    let status = await apiNotifySpoils(
      parseTokenAddress(chainID, result.token),
      utils.formatUnits(result.childShare, 18),
      utils.formatUnits(result.parentShare, 18),
      getTxLink(chainID, tx.hash)
    );
    console.log(status);
  };

  const withdrawFunds = async () => {
    if (!loading && provider && balance.gte(0)) {
      try {
        setLoading(true);
        const abi = new utils.Interface(['function withdrawAll() external']);
        const contract = new Contract(
          contractAddress,
          abi,
          provider.getSigner()
        );
        const tx = await contract.withdrawAll();
        setTransaction(tx);
        await tx.wait();
        notifySpoilsSent(tx);
        await pollSubgraph();
      } catch (withdrawError) {
        setLoading(false);
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
        Withdraw Balance
      </Heading>

      <Text textAlign='center' fontSize='sm' mb='1rem' fontFamily='jetbrains'>
        Follow the instructions in your wallet to withdraw the balance from
        wrapped invoice.
      </Text>
      <VStack my='2rem' px='5rem' py='1rem' bg='black' borderRadius='0.5rem'>
        <Text
          color='red.500'
          fontSize='0.875rem'
          textAlign='center'
          fontFamily='jetbrains'
        >
          Balance Available
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
      {!loading && (
        <Button
          onClick={withdrawFunds}
          variant='primary'
          textTransform='uppercase'
          w='100%'
        >
          Withdraw
        </Button>
      )}
    </VStack>
  );
};
