import { useContext, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Flex,
  Box,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/react';
import { utils } from 'ethers';

import { ProjectInfo } from '../components/ProjectInfo';
import { Loader } from '../components/Loader';

import { AppContext } from '../context/AppContext';
import { getInvoice } from '../graphql/getInvoice';
import { getSmartInvoiceAddress, getRaidPartyAddress } from '../utils/invoice';
import { networkLabels } from '../utils/constants';

import { InvoicePaymentDetails } from '../components/InvoicePaymentDetails';
import { InvoiceMetaDetails } from '../components/InvoiceMetaDetails';
import { InvoiceButtonManager } from '../components/InvoiceButtonManager';

export const EscrowInfo = () => {
  const context = useContext(AppContext);
  const { id } = useParams();

  const history = useHistory();
  const toast = useToast();

  const [invoice, setInvoice] = useState();
  const [raidParty, setRaidParty] = useState('');
  const [invoiceFetchError, setInvoiceFetchError] = useState(false);

  const initData = async () => {
    if (id) {
      let result = await context.setAirtableState(id);

      if (!result.validRaidId) {
        toast({
          duration: 3000,
          position: 'top',
          render: () => (
            <Box
              color="white"
              p={3}
              mt="2rem"
              bg="#ff3864"
              fontFamily="jetbrains"
              textTransform="uppercase"
            >
              Raid ID not found or invalid.
            </Box>
          ),
        });
        return history.push('/');
      }

      if (!result.invoice_id) {
        toast({
          duration: 3000,
          position: 'top',
          render: () => (
            <Box
              color="white"
              p={3}
              mt="2rem"
              bg="#ff3864"
              fontFamily="jetbrains"
              textTransform="uppercase"
            >
              Escrow not registered for this ID.
            </Box>
          ),
        });

        return history.push('/');
      }

      await context.connectAccount();
    }
  };

  const getSmartInvoiceData = async () => {
    try {
      if (
        utils.isAddress(context.invoice_id) &&
        !Number.isNaN(parseInt(context.chainID))
      ) {
        let smartInvoice = await getSmartInvoiceAddress(
          context.invoice_id,
          context.provider,
        );
        console.log(context.chainID, smartInvoice);
        const invoice = await getInvoice(
          parseInt(context.chainID),
          smartInvoice,
        );
        setInvoice(invoice);
        setInvoiceFetchError(false);
      }
    } catch (err) {
      console.log(err);
      setInvoiceFetchError(true);
    }
  };

  const fetchRaidPartyAddress = async () => {
    if (invoice) {
      let addr = await getRaidPartyAddress(invoice.provider, context.provider);
      setRaidParty(addr);
    }
  };

  useEffect(() => {
    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (context.invoice_id) {
      getSmartInvoiceData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.invoice_id, context.chainID]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => fetchRaidPartyAddress(), [invoice]);

  return (
    <>
      {!invoice && !invoiceFetchError && <Loader />}
      {!invoice && invoiceFetchError && (
        <p
          style={{ fontFamily: "'Rubik Mono One', sans-serif", color: '#fff' }}
        >
          Couldn't find invoice in {networkLabels[parseInt(context.chainID)]}.
          Switch to {parseInt(context.chainID) === 1 ? 'XDAI' : 'MAINNET'} &
          reload.
        </p>
      )}
      {invoice && (
        <Flex
          width="100%"
          direction={{ md: 'column', lg: 'row' }}
          alignItems="center"
          justifyContent="space-evenly"
        >
          <Flex direction="column" minW="30%">
            <ProjectInfo context={context} />
            <InvoiceMetaDetails invoice={invoice} raidParty={raidParty} />
          </Flex>

          <Flex direction="column" minW="45%">
            <InvoicePaymentDetails
              web3={context.web3}
              invoice={invoice}
              chainID={context.chainID}
              provider={context.provider}
            />

            <InvoiceButtonManager
              invoice={invoice}
              account={context.account}
              provider={context.provider}
              raidParty={raidParty}
              wrappedAddress={context.invoice_id}
            />
          </Flex>
        </Flex>
      )}

      <Alert
        status={parseInt(context.chainID) !== 100 || 1 ? 'warning' : 'success'}
        width="auto"
        position="absolute"
        bottom="1rem"
        left="1rem"
      >
        {console.log(context.chainID)}
        <AlertIcon />
        <AlertTitle mr={2} fontFamily="jetbrains" color="black">
          {parseInt(context.chainID) === 1
            ? 'USING MAINNET'
            : parseInt(context.chainID) === 100
            ? 'USING XDAI'
            : parseInt(context.chainID) === 4
            ? 'USING RINKEBY'
            : 'UNSUPPORTED NETWORK'}
        </AlertTitle>
      </Alert>
    </>
  );
};
