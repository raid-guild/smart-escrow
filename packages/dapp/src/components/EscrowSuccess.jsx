import { Flex, Text, Link, Button, Heading, VStack } from '@chakra-ui/react';

import styled from '@emotion/styled';
import { useState, useEffect } from 'react';

import { CopyIcon } from '../icons/CopyIcon';
import { Loader } from '../components/Loader';

import { explorerUrls } from '../utils/constants';
import { awaitInvoiceAddress } from '../utils/invoice';

const StyledButton = styled(Button)`
  display: block;
  font-family: 'Rubik Mono One', sans-serif;
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: #fffffe;
  background-color: #ff3864;
  border: none;
  border-radius: 3px;
  padding: 12px;
  margin-top: 2rem;
  &:hover {
    cursor: pointer;
    background-color: #16161a;
    color: #ff3864;
  }
`;

const copyToClipboard = (value) => {
  const tempInput = document.createElement('input');
  tempInput.value = value;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
};

const getExplorerUrl = (chainId) => explorerUrls[chainId] || explorerUrls[4];

export const getTxLink = (chainId, hash) =>
  `${getExplorerUrl(chainId)}/tx/${hash}`;

export const EscrowSuccess = ({ ethersProvider, tx, chainID, history }) => {
  const [invoiceId, setInvoiceId] = useState('');

  const getInvoice = async () => {
    let invoiceID = await awaitInvoiceAddress(ethersProvider, tx);
    setInvoiceId(invoiceID);
    console.log(invoiceID);
  };

  useEffect(() => {
    getInvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex
      direction='column'
      alignItems='center'
      background='#262626'
      padding='1.5rem'
      minWidth='50%'
    >
      <Heading fontFamily='mono' size='md' color='guildRed' mb='2rem'>
        {invoiceId ? 'Escrow created!' : 'Generating Escrow Id...'}
      </Heading>

      <Text
        color='white'
        textAlign='center'
        fontSize='sm'
        fontFamily='jetbrains'
        mb='1rem'
      >
        {invoiceId
          ? 'You can view your transaction '
          : 'You can check the progress of your transaction '}
        <Link
          href={getTxLink(chainID, tx.hash)}
          isExternal
          color='red.500'
          textDecoration='underline'
        >
          here
        </Link>
      </Text>

      {invoiceId ? (
        <VStack w='100%' align='stretch' mb='1rem'>
          <Text fontWeight='bold'>Your Invoice ID</Text>
          <Flex
            p='0.3rem'
            justify='space-between'
            align='center'
            bg='background'
            borderRadius='0.25rem'
            w='100%'
          >
            <Link
              ml='0.5rem'
              href={`https://blockscout.com/poa/xdai/address/${invoiceId}`}
              color='white'
              overflow='hidden'
            >
              {invoiceId}
            </Link>
            {document.queryCommandSupported('copy') && (
              <Button
                ml={4}
                onClick={() => copyToClipboard(invoiceId)}
                variant='ghost'
                colorScheme='red'
                h='auto'
                w='auto'
                minW='2'
                p={2}
              >
                <CopyIcon boxSize={4} />
              </Button>
            )}{' '}
          </Flex>
        </VStack>
      ) : (
        <Loader />
      )}

      <StyledButton
        onClick={() => {
          history.push('/');
        }}
      >
        Go Home
      </StyledButton>
    </Flex>
  );
};
