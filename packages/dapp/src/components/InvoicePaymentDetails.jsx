import { Flex, HStack, VStack, Text, Divider, Link } from '@chakra-ui/react';
import { BigNumber, utils } from 'ethers';
import { useEffect, useState } from 'react';

import { AccountLink } from '../shared/AccountLink';

import { balanceOf } from '../utils/erc20';
import { NETWORK_CONFIG, IPFS_ENDPOINT } from '../utils/constants';
import { getTxLink } from '../utils/helpers';

const parseTokenAddress = (chainId, address) => {
  for (const [key, value] of Object.entries(
    NETWORK_CONFIG[parseInt(chainId)]['TOKENS']
  )) {
    if (value['address'] === address.toLowerCase()) {
      return key;
    }
  }
};

const getIpfsLink = (hash) => `${IPFS_ENDPOINT}/ipfs/${hash}`;

export const InvoicePaymentDetails = ({ web3, invoice, chainID, provider }) => {
  const [balance, setBalance] = useState(BigNumber.from(0));

  useEffect(() => {
    balanceOf(provider, invoice.token, invoice.address)
      .then((b) => {
        setBalance(b);
      })
      .catch((balanceError) => console.log(balanceError));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    client,
    released,
    total,
    isLocked,
    disputes,
    resolutions,
    terminationTime,
    currentMilestone,
    amounts,
    resolver
  } = invoice;
  const deposited = BigNumber.from(released).add(balance);
  const due = deposited.gte(total)
    ? BigNumber.from(0)
    : BigNumber.from(total).sub(deposited);
  const dispute =
    isLocked && disputes.length > 0 ? disputes[disputes.length - 1] : undefined;
  const resolution =
    !isLocked && resolutions.length > 0
      ? resolutions[resolutions.length - 1]
      : undefined;
  const isExpired = terminationTime <= new Date().getTime() / 1000;
  const amount = BigNumber.from(
    currentMilestone < amounts.length ? amounts[currentMilestone] : 0
  );
  const isReleasable = !isLocked && balance.gte(amount) && balance.gt(0);

  return (
    <Flex direction='column' background='#262626' padding='2rem'>
      <HStack mt='.5rem' mb='1rem' justifyContent='space-between' fontSize='lg'>
        <Text fontWeight='bold' fontFamily='jetbrains'>
          Total Project Amount
        </Text>
        <Text>
          {web3.utils.fromWei(invoice.total)}{' '}
          {parseTokenAddress(chainID, invoice.token)}
        </Text>
      </HStack>
      {invoice.amounts.map((payment, index) => {
        return (
          <HStack
            key={index}
            mb='.2rem'
            justifyContent='space-between'
            fontFamily='jetbrains'
            color='yellow'
          >
            <Text>{`payment milestone #${index + 1}:`}</Text>
            <Text>
              {`${web3.utils.fromWei(payment)} ${parseTokenAddress(
                chainID,
                invoice.token
              )}`}
            </Text>
          </HStack>
        );
      })}
      <Divider mt='1rem' />
      <HStack
        mt='1rem'
        mb='.2rem'
        justifyContent='space-between'
        fontFamily='jetbrains'
        color='white'
      >
        <Text>Total Deposited</Text>
        <Text>
          {utils.formatUnits(deposited, 18)}{' '}
          {parseTokenAddress(chainID, invoice.token)}
        </Text>
      </HStack>
      <HStack
        justifyContent='space-between'
        color='white'
        fontFamily='jetbrains'
        mb='.2rem'
      >
        <Text>Total Released</Text>
        <Text>
          {utils.formatUnits(released, 18)}{' '}
          {parseTokenAddress(chainID, invoice.token)}
        </Text>
      </HStack>
      <HStack
        justifyContent='space-between'
        color='white'
        fontFamily='jetbrains'
      >
        <Text>Remaining Amount Due</Text>
        <Text>
          {utils.formatUnits(due, 18)}{' '}
          {parseTokenAddress(chainID, invoice.token)}
        </Text>
      </HStack>
      <Divider mt='1rem' mb='1rem' />

      {!dispute && !resolution && (
        <Flex
          justify='space-between'
          align='center'
          color='white'
          fontWeight='bold'
          fontSize='lg'
          fontFamily='jetbrains'
        >
          {isExpired || (due.eq(0) && !isReleasable) ? (
            <>
              <Text>Remaining Balance</Text>
              <Text textAlign='right'>{`${utils.formatUnits(
                balance,
                18
              )} ${parseTokenAddress(chainID, invoice.token)}`}</Text>{' '}
            </>
          ) : (
            <>
              <Text>
                {isReleasable && 'Next Amount to Release'}
                {!isReleasable && 'Total Due Today'}
              </Text>
              <Text textAlign='right'>{`${utils.formatUnits(
                isReleasable ? amount : amount.sub(balance),
                18
              )} ${parseTokenAddress(chainID, invoice.token)}`}</Text>
            </>
          )}
        </Flex>
      )}

      {dispute && (
        <VStack w='100%' align='stretch' spacing='1rem'>
          <Flex
            justify='space-between'
            align='center'
            fontWeight='bold'
            fontSize='lg'
          >
            <Text>Amount Locked</Text>
            <Text textAlign='right'>{`${utils.formatUnits(
              balance,
              18
            )} ${parseTokenAddress(chainID, invoice.token)}`}</Text>
          </Flex>
          <Text>
            {`A dispute is in progress with `}
            <AccountLink address={resolver} chainId={chainID} />
            <br />
            <Link href={getIpfsLink(dispute.ipfsHash)} isExternal>
              <u>View details on IPFS</u>
            </Link>
            <br />
            <Link href={getTxLink(chainID, dispute.txHash)} isExternal>
              <u>View transaction</u>
            </Link>
          </Text>
        </VStack>
      )}

      {resolution && (
        <VStack w='100%' align='stretch' spacing='1rem' color='red.500'>
          <Flex
            justify='space-between'
            align='center'
            fontWeight='bold'
            fontSize='lg'
          >
            <Text>Amount Dispersed</Text>
            <Text textAlign='right'>{`${utils.formatUnits(
              BigNumber.from(resolution.clientAward)
                .add(resolution.providerAward)
                .add(resolution.resolutionFee ? resolution.resolutionFee : 0),
              18
            )} ${parseTokenAddress(chainID, invoice.token)}`}</Text>
          </Flex>
          <Flex
            justify='space-between'
            direction={{ base: 'column', sm: 'row' }}
          >
            <Flex flex={1}>
              <Text textAlign={{ base: 'center', sm: 'left' }}>
                <AccountLink address={resolver} chainId={chainID} />
                {' has resolved the dispute and dispersed remaining funds'}
                <br />
                <Link href={getIpfsLink(resolution.ipfsHash)} isExternal>
                  <u>View details on IPFS</u>
                </Link>
                <br />
                <Link href={getTxLink(chainID, resolution.txHash)} isExternal>
                  <u>View transaction</u>
                </Link>
              </Text>
            </Flex>
            <VStack
              spacing='0.5rem'
              mt={{ base: '1rem', sm: '0' }}
              align={{ base: 'center', sm: 'stretch' }}
            >
              {resolution.resolutionFee && (
                <Text textAlign='right'>
                  {`${utils.formatUnits(
                    BigNumber.from(resolution.resolutionFee),
                    18
                  )} ${parseTokenAddress(chainID, invoice.token)} to `}
                  <AccountLink address={resolver} chainId={chainID} />
                </Text>
              )}
              <Text textAlign='right'>
                {`${utils.formatUnits(
                  BigNumber.from(resolution.clientAward),
                  18
                )} ${parseTokenAddress(chainID, invoice.token)} to `}
                <AccountLink address={client} chainId={chainID} />
              </Text>
              <Text textAlign='right'>
                {`${utils.formatUnits(
                  BigNumber.from(resolution.providerAward),
                  18
                )} ${parseTokenAddress(chainID, invoice.token)} to `}
                <AccountLink address={provider} chainId={chainID} />
              </Text>
            </VStack>
          </Flex>
        </VStack>
      )}
    </Flex>
  );
};
