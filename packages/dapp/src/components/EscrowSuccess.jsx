import { Flex, Text, Link, Button, Heading, VStack } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

import { CopyIcon } from '../icons/CopyIcon';
import { Loader } from '../components/Loader';

import { awaitInvoiceAddress } from '../utils/invoice';
import {
  getTxLink,
  copyToClipboard,
  // getAddressLink,
  apiRequest
} from '../utils/helpers';

export const EscrowSuccess = ({
  ethersProvider,
  tx,
  chainID,
  raidID,
  history
}) => {
  const [invoiceId, setInvoiceId] = useState('');

  const getInvoice = async () => {
    let invoiceID = await awaitInvoiceAddress(ethersProvider, tx);
    setInvoiceId(invoiceID);
    console.log(invoiceID);
  };

  const postInvoiceId = async () => {
    let result = await apiRequest({
      type: 'update',
      raidID: raidID,
      txHash: tx.hash,
      invoiceId: invoiceId
    });

    console.log(result);
  };

  const postTxHash = async () => {
    let result = await apiRequest({
      type: 'update',
      raidID: raidID,
      txHash: tx.hash
    });
    console.log(result);
  };

  useEffect(() => {
    postTxHash();
    getInvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (invoiceId) postInvoiceId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId]);

  return (
    <Flex
      direction='column'
      alignItems='center'
      background='#262626'
      padding='1.5rem'
      minWidth='50%'
    >
      <Heading fontFamily='rubik' size='md' color='guildRed' mb='2rem'>
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
          color='yellow'
          textDecoration='underline'
        >
          here
        </Link>
      </Text>

      {invoiceId ? (
        <VStack w='100%' align='stretch' mb='1rem'>
          <Text fontWeight='bold'>Invoice URL</Text>
          <Flex
            p='0.3rem'
            justify='space-between'
            align='center'
            bg='black'
            borderRadius='0.25rem'
            w='100%'
            fontFamily='jetbrains'
          >
            <Link
              ml='0.5rem'
              href={`https://${window.location.hostname}/escrow/${raidID}`}
              color='yellow'
              overflow='hidden'
            >
              {`https://${window.location.hostname}/escrow/${raidID}`}
            </Link>
            {document.queryCommandSupported('copy') && (
              <Button
                ml={4}
                onClick={() =>
                  copyToClipboard(
                    `https://${window.location.hostname}/escrow/${raidID}`
                  )
                }
                bgColor='black'
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

      <Button
        variant='primary'
        onClick={() => {
          history.push(`/escrow/${raidID}`);
        }}
      >
        View invoice
      </Button>
    </Flex>
  );
};
