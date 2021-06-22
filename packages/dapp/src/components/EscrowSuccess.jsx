import { Flex, Text, Link, Button, Heading, VStack } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { utils } from 'ethers';

import { CopyIcon } from '../icons/CopyIcon';
import { Loader } from '../components/Loader';

import { awaitInvoiceAddress } from '../utils/invoice';
import { getInvoice } from '../graphql/getInvoice';
import { getTxLink, copyToClipboard, apiRequest } from '../utils/helpers';

const POLL_INTERVAL = 5000;

export const EscrowSuccess = ({
  ethersProvider,
  tx,
  chainID,
  raidID,
  history
}) => {
  const [invoiceId, setInvoiceId] = useState('');
  const [invoice, setInvoice] = useState();

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
    if (tx && ethersProvider) {
      postTxHash();

      awaitInvoiceAddress(ethersProvider, tx).then((id) => {
        setInvoiceId(id.toLowerCase());
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tx, ethersProvider]);

  useEffect(() => {
    if (!utils.isAddress(invoiceId) || !!invoice) return () => undefined;

    let isSubscribed = true;

    const interval = setInterval(() => {
      console.log(chainID, invoiceId);
      getInvoice(chainID, invoiceId).then((inv) => {
        console.log(inv);
        if (isSubscribed && !!inv) {
          setInvoice(inv);
        }
      });
    }, POLL_INTERVAL);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [chainID, invoiceId, invoice]);

  useEffect(() => {
    if (utils.isAddress(invoiceId)) postInvoiceId();
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
        {invoice ? 'Escrow Registered!' : 'Escrow Registration Received'}
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
          target='_blank'
          rel='noopener noreferrer'
        >
          here
        </Link>
      </Text>

      {invoice ? (
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
              href={`/escrow/${raidID}`}
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
          history.push(`/`);
        }}
      >
        return home
      </Button>
    </Flex>
  );
};
