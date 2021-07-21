import { Button, Flex, Heading, Link, Text, VStack } from '@chakra-ui/react';
import { BigNumber, utils } from 'ethers';
import React, { useCallback, useContext, useState } from 'react';

import { ReactComponent as LockImage } from '../assets/lock.svg';
import { AppContext } from '../context/AppContext';

import { AccountLink } from '../shared/AccountLink';
import { OrderedTextarea } from '../shared/OrderedTextArea';
import { getTxLink } from '../utils/helpers';
import { lock } from '../utils/invoice';
import { uploadDisputeDetails } from '../utils/ipfs';
import { Loader } from './Loader';

import { NETWORK_CONFIG } from '../utils/constants';

const parseTokenAddress = (chainId, address) => {
  for (const [key, value] of Object.entries(
    NETWORK_CONFIG[parseInt(chainId)]['TOKENS']
  )) {
    if (value['address'] === address.toLowerCase()) {
      return key;
    }
  }
};

const resolverInfo = {
  4: NETWORK_CONFIG[4].RESOLVERS,
  100: NETWORK_CONFIG[100].RESOLVERS
};

const getResolverInfo = (chainId, resolver) =>
  (resolverInfo[chainId] || resolverInfo[4])[resolver];

const resolvers = {
  4: Object.keys(NETWORK_CONFIG[4].RESOLVERS),
  100: Object.keys(NETWORK_CONFIG[100].RESOLVERS)
};
const getResolvers = (chainId) => resolvers[chainId] || resolvers[4];
const isKnownResolver = (chainId, resolver) =>
  getResolvers(chainId).indexOf(resolver.toLowerCase()) !== -1;

const getAccountString = (account) => {
  const len = account.length;
  return `0x${account.substr(2, 3).toUpperCase()}...${account
    .substr(len - 3, len - 1)
    .toUpperCase()}`;
};
const getResolverString = (chainId, resolver) => {
  const info = getResolverInfo(chainId, resolver);
  return info ? info.name : getAccountString(resolver);
};

export const LockFunds = ({
  invoice,
  balance,
  wrappedAddress,
  isRaidParty
}) => {
  const { chainID, provider } = useContext(AppContext);
  const { address, resolver, token, resolutionRate } = invoice;

  const [disputeReason, setDisputeReason] = useState('');

  const fee = `${utils.formatUnits(
    BigNumber.from(balance).div(resolutionRate),
    18
  )} ${parseTokenAddress(chainID, token)}`;

  const [locking, setLocking] = useState(false);
  const [transaction, setTransaction] = useState();

  const lockFunds = useCallback(async () => {
    if (provider && !locking && balance.gt(0) && disputeReason) {
      try {
        setLocking(true);
        const detailsHash = await uploadDisputeDetails({
          reason: disputeReason,
          invoice: address,
          amount: balance.toString()
        });
        const tx = await lock(
          provider,
          isRaidParty ? wrappedAddress : address,
          detailsHash
        );
        setTransaction(tx);
        await tx.wait();
        setTimeout(() => {
          window.location.reload();
        }, 20000);
      } catch (lockError) {
        setLocking(false);
        console.log(lockError);
      }
    }
  }, [
    provider,
    locking,
    balance,
    disputeReason,
    address,
    isRaidParty,
    wrappedAddress
  ]);

  if (locking) {
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
          Locking Funds
        </Heading>
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
        <Flex
          w='100%'
          justify='center'
          align='center'
          minH='7rem'
          my='3rem'
          position='relative'
          color='red.500'
        >
          <Loader size='6rem' />
          <Flex
            position='absolute'
            left='50%'
            top='50%'
            transform='translate(-50%,-50%)'
          >
            <LockImage width='2rem' />
          </Flex>
        </Flex>
      </VStack>
    );
  }

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
        Lock Funds
      </Heading>

      <Text textAlign='center' fontSize='sm' mb='1rem' fontFamily='jetbrains'>
        Locking freezes all remaining funds in the contract and initiates a
        dispute.
      </Text>
      <Text textAlign='center' fontSize='sm' mb='1rem' fontFamily='jetbrains'>
        {'Once a dispute has been initiated, '}
        <AccountLink address={resolver} />
        {
          ' will review your case, the project agreement and dispute reasoning before making a decision on how to fairly distribute remaining funds.'
        }
      </Text>

      <OrderedTextarea
        tooltip='Why do you want to lock these funds?'
        label='Dispute Reason'
        value={disputeReason}
        setValue={setDisputeReason}
      />
      <Text color='white' textAlign='center' fontFamily='jetbrains'>
        {`Upon resolution, a fee of ${fee} will be deducted from the locked fund amount and sent to `}
        <AccountLink address={resolver} />
        {` for helping resolve this dispute.`}
      </Text>
      <Button
        onClick={lockFunds}
        isDisabled={!disputeReason}
        textTransform='uppercase'
        variant='primary'
        w='100%'
      >
        {`Lock ${utils.formatUnits(balance, 18)} ${parseTokenAddress(
          chainID,
          token
        )}`}
      </Button>
      {isKnownResolver(chainID, resolver) && (
        <Link
          href={getResolverInfo(chainID, resolver).termsUrl}
          isExternal
          color='red.500'
          textDecor='underline'
        >
          Learn about {getResolverString(chainID, resolver)} dispute process &
          terms
        </Link>
      )}
    </VStack>
  );
};
