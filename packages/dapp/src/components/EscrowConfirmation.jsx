import { Flex, HStack, Text, Button } from '@chakra-ui/react';

import { AccountLink } from '../shared/AccountLink';

import { spoilsPercent, NETWORK_CONFIG } from '../utils/constants';

export const EscrowConfirmation = ({
  context,
  client,
  serviceProvider,
  tokenType,
  paymentDue,
  milestones,
  payments,
  selectedDay,
  isLoading,
  setLoading,
  updateStep,
  register,
  setTx
}) => {
  const createInvoice = async () => {
    setLoading(true);

    let chainID = context.chainID;
    let ethersProvider = context.provider;
    let clientAddress = client;

    let daoAddress =
      parseInt(chainID) === 100 ? NETWORK_CONFIG['RG_XDAI'] : serviceProvider;

    let serviceProviders = [daoAddress, serviceProvider]; // [dao address, multisig address]
    let splitFactor = spoilsPercent;
    let resolver =
      NETWORK_CONFIG[parseInt(chainID)]['RESOLVERS']['LexDAO']['address']; //arbitration
    let tokenAddress =
      NETWORK_CONFIG[parseInt(chainID)]['TOKENS'][tokenType]['address'];
    let paymentsInWei = [];
    let terminationTime = new Date(selectedDay).getTime() / 1000;

    payments.map((amount) =>
      paymentsInWei.push(context.web3.utils.toWei(amount))
    );

    try {
      let transaction = await register(
        chainID,
        ethersProvider,
        clientAddress,
        serviceProviders,
        splitFactor,
        resolver,
        tokenAddress,
        paymentsInWei,
        terminationTime,
        '0x0000000000000000000000000000000000000000000000000000000000000000'
      );

      setTx(transaction);
      console.log(transaction);

      updateStep((prevStep) => prevStep + 1);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <Flex
      direction='column'
      background='#262626'
      padding='1.5rem'
      minWidth='50%'
    >
      <HStack mb='.5rem' justifyContent='space-between'>
        <Text fontWeight='bold' fontFamily='jetbrains'>
          Project Name:
        </Text>
        <Text fontFamily='rubik' color='white' maxWidth='200px' isTruncated>
          {context.project_name}
        </Text>
      </HStack>
      <HStack mb='.5rem' justifyContent='space-between'>
        <Text fontWeight='bold' fontFamily='jetbrains'>
          Client Address:
        </Text>
        <AccountLink address={client} />
      </HStack>
      <HStack mb='.5rem' justifyContent='space-between'>
        <Text fontWeight='bold' fontFamily='jetbrains'>
          Service Provider Address:
        </Text>
        <AccountLink address={serviceProvider} />
      </HStack>
      <HStack mb='.5rem' justifyContent='space-between'>
        <Text fontWeight='bold' fontFamily='jetbrains'>
          Arbitration Provider:
        </Text>
        <Text fontFamily='rubik' color='white'>
          LexDAO
        </Text>
      </HStack>
      <HStack mb='.5rem' justifyContent='space-between'>
        <Text fontWeight='bold' fontFamily='jetbrains'>
          Payment Token:
        </Text>
        <Text fontFamily='rubik' color='yellow'>
          {tokenType}
        </Text>
      </HStack>
      <HStack mb='.5rem' justifyContent='space-between'>
        <Text fontWeight='bold' fontFamily='jetbrains'>
          Payment Due:
        </Text>
        <Text fontFamily='rubik' color='yellow'>
          {paymentDue}
        </Text>
      </HStack>
      <HStack mb='.5rem' justifyContent='space-between'>
        <Text fontWeight='bold' fontFamily='jetbrains'>
          No of Payments:
        </Text>
        <Text fontFamily='rubik' color='yellow'>
          {milestones}
        </Text>
      </HStack>

      <Flex direction='row' width='100%'>
        <Button
          variant='primary'
          minW='25%'
          color='red'
          border='2px solid'
          borderColor='red'
          bg='black'
          p='5px'
          mr='.5rem'
          isDisabled={isLoading}
          onClick={() => updateStep((prevStep) => prevStep - 1)}
        >
          Back
        </Button>
        <Button
          variant='primary'
          w='100%'
          isDisabled={isLoading}
          onClick={createInvoice}
        >
          {isLoading ? 'Creating Escrow..' : 'Create Escrow'}
        </Button>
      </Flex>
    </Flex>
  );
};
