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
    deposits,
    releases,
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

  let sum = BigNumber.from(0);
  return (
    <Flex direction='column' background='#262626' padding='1rem'>
      <HStack mt='.5rem' mb='1rem' justifyContent='space-between'>
        <Text variant='textOne'>Total Project Amount</Text>
        <Text variant='textOne'>
          {web3.utils.fromWei(invoice.total)}{' '}
          {parseTokenAddress(chainID, invoice.token)}
        </Text>
      </HStack>
      <VStack align='stretch' spacing='0.25rem'>
        {invoice.amounts.map((amt, index) => {
          let tot = BigNumber.from(0);
          let ind = -1;
          let full = false;
          if (deposits.length > 0) {
            for (let i = 0; i < deposits.length; i += 1) {
              tot = tot.add(deposits[i].amount);
              if (tot.gt(sum)) {
                ind = i;
                if (tot.sub(sum).gte(amt)) {
                  full = true;
                  break;
                }
              }
            }
          }
          sum = sum.add(amt);

          return (
            <Flex
              key={index.toString()}
              justify='space-between'
              align='stretch'
              direction='row'
            >
              <Text variant='textOne'>Payment Milestone #{index + 1}</Text>
              <HStack align='center' justify='flex-end'>
                {index < currentMilestone && releases.length > index && (
                  <Link
                    fontSize='xs'
                    isExternal
                    color='grey'
                    fontStyle='italic'
                    href={getTxLink(chainID, releases[index].txHash)}
                  >
                    Released{' '}
                    {new Date(
                      releases[index].timestamp * 1000
                    ).toLocaleDateString()}
                  </Link>
                )}
                {!(index < currentMilestone && releases.length > index) &&
                  ind !== -1 && (
                    <Link
                      fontSize='xs'
                      isExternal
                      color='grey'
                      fontStyle='italic'
                      href={getTxLink(chainID, deposits[ind].txHash)}
                    >
                      {full ? '' : 'Partially '}Deposited{' '}
                      {new Date(
                        deposits[ind].timestamp * 1000
                      ).toLocaleDateString()}
                    </Link>
                  )}
                <Text
                  variant='textOne'
                  textAlign='right'
                  fontWeight='500'
                >{`${utils.formatUnits(amt, 18)} ${parseTokenAddress(
                  chainID,
                  invoice.token
                )}`}</Text>
              </HStack>
            </Flex>
          );
        })}
      </VStack>
      <Divider mt='1rem' />
      <HStack mt='1rem' mb='.2rem' justifyContent='space-between'>
        <Text variant='textOne'>Total Deposited</Text>
        <Text variant='textOne'>
          {utils.formatUnits(deposited, 18)}{' '}
          {parseTokenAddress(chainID, invoice.token)}
        </Text>
      </HStack>
      <HStack justifyContent='space-between' mb='.2rem'>
        <Text variant='textOne'>Total Released</Text>
        <Text variant='textOne'>
          {utils.formatUnits(released, 18)}{' '}
          {parseTokenAddress(chainID, invoice.token)}
        </Text>
      </HStack>
      <HStack justifyContent='space-between'>
        <Text variant='textOne'>Remaining Amount Due</Text>
        <Text variant='textOne'>
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
            fontFamily='jetbrains'
          >
            <Text>Amount Locked</Text>
            <Text textAlign='right'>{`${utils.formatUnits(
              balance,
              18
            )} ${parseTokenAddress(chainID, invoice.token)}`}</Text>
          </Flex>
          <Text fontFamily='jetbrains' color='purpleLight'>
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
        <VStack align='stretch' spacing='1rem' color='red.500'>
          <Flex
            justify='space-between'
            align='center'
            fontWeight='bold'
            fontSize='lg'
            fontFamily='jetbrains'
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
              <Text fontFamily='jetbrains' maxW='300px' color='purpleLight'>
                <AccountLink address={resolver} chainId={chainID} />
                {' has resolved the dispute and dispersed remaining funds'}
                <br />
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
              fontFamily='jetbrains'
            >
              {resolution.resolutionFee && (
                <Text textAlign='right' color='purpleLight'>
                  {`${utils.formatUnits(
                    BigNumber.from(resolution.resolutionFee),
                    18
                  )} ${parseTokenAddress(chainID, invoice.token)} to `}
                  <AccountLink address={resolver} chainId={chainID} />
                </Text>
              )}
              <Text textAlign='right' color='purpleLight'>
                {`${utils.formatUnits(
                  BigNumber.from(resolution.clientAward),
                  18
                )} ${parseTokenAddress(chainID, invoice.token)} to `}
                <AccountLink address={client} chainId={chainID} />
              </Text>
              <Text textAlign='right' color='purpleLight'>
                {`${utils.formatUnits(
                  BigNumber.from(resolution.providerAward),
                  18
                )} ${parseTokenAddress(chainID, invoice.token)} to `}
                <AccountLink address={invoice.provider} chainId={chainID} />
              </Text>
            </VStack>
          </Flex>
        </VStack>
      )}
    </Flex>
  );
};
