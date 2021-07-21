import { useEffect, useState } from 'react';
import {
  Flex,
  Input,
  Button,
  FormControl,
  FormLabel,
  Link,
  Tooltip,
  HStack
} from '@chakra-ui/react';

import styled from '@emotion/styled';

import { RadioBox } from './RadioBox';

import { theme } from '../theme/theme';
import { QuestionIcon } from '../icons/QuestionIcon';

import { getResolverUrl, getSpoilsUrl } from '../utils/helpers';

const StyledInput = styled(Input)`
  width: 100%;
  outline: none;
  border: none;
  color: white;
  font-family: ${theme.fonts.jetbrains};
  font-size: 1rem;
  background-color: black;
  margin-bottom: 15px;
  padding: 10px;
  &::placeholder {
    color: #ff3864;
    opacity: 1;
  }
`;

const StyledFormLabel = styled(FormLabel)`
  font-family: ${theme.fonts.spaceMono};
  font-weight: bold;
`;

export const PaymentDetailsForm = ({
  context,
  client,
  serviceProvider,
  tokenType,
  paymentDue,
  milestones,
  selectedDay,
  setClient,
  setServiceProvider,
  setTokenType,
  setPaymentDue,
  setMilestones,
  setSelectedDay,
  sendToast,
  updateStep
}) => {
  const [tokens, setTokens] = useState([]);

  const updateTokenList = () => {
    if (parseInt(context.chainID) === 4) {
      setTokens(['WETH', 'DAI', 'TEST']);
    } else {
      setTokens(['WETH', 'WXDAI']);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => updateTokenList(), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => updateTokenList(), [context.chainID]);

  return (
    <Flex
      direction='column'
      background='#262626'
      padding='1.5rem'
      minWidth='50%'
    >
      <FormControl isRequired>
        <HStack alignItems='baseline' justifyContent='space-between'>
          <StyledFormLabel>Client Address</StyledFormLabel>
          <Tooltip
            label='This will be the address used to access the invoice'
            placement='auto-start'
          >
            <QuestionIcon boxSize='0.85rem' />
          </Tooltip>
        </HStack>
        <StyledInput
          name='client'
          onChange={(e) => setClient(e.target.value)}
          value={client}
        />
      </FormControl>

      <FormControl isRequired>
        <HStack alignItems='baseline' justifyContent='space-between'>
          <StyledFormLabel>Raid Party Address</StyledFormLabel>
          <Tooltip label='Recipient of the funds' placement='auto-start'>
            <QuestionIcon boxSize='0.85rem' />
          </Tooltip>
        </HStack>
        <StyledInput
          name='serviceProvider'
          onChange={(e) => setServiceProvider(e.target.value)}
          value={serviceProvider}
        />
      </FormControl>

      <Flex direction='row'>
        <FormControl isRequired>
          <StyledFormLabel>Payment Token</StyledFormLabel>
          <RadioBox
            options={tokens}
            updateRadio={setTokenType}
            name='paymentToken'
            defaultValue={tokenType}
            value={tokenType}
          />
        </FormControl>
        <FormControl isRequired mr='.5em'>
          <StyledFormLabel>Total Payment Due</StyledFormLabel>
          <StyledInput
            type='number'
            name='paymentDue'
            min='1'
            onChange={(e) => setPaymentDue(e.target.value)}
            value={paymentDue}
          />
        </FormControl>
        <FormControl isRequired>
          <HStack alignItems='baseline' justifyContent='space-between'>
            <StyledFormLabel>No of Payments</StyledFormLabel>
            <Tooltip
              label='Number of milestones in which the total payment will be processed'
              placement='auto-start'
            >
              <QuestionIcon boxSize='0.85rem' />
            </Tooltip>
          </HStack>
          <StyledInput
            type='number'
            name='milestones'
            min='1'
            onChange={(e) => setMilestones(e.target.value)}
            value={milestones}
          />
        </FormControl>
      </Flex>

      <Flex direction='row'>
        <FormControl isReadOnly mr='.5em'>
          <Link
            href={getResolverUrl(parseInt(context.chainID))}
            target='_blank'
            rel='noopener noreferrer'
          >
            <StyledFormLabel cursor='pointer'>
              Arbitration Provider
            </StyledFormLabel>
          </Link>
          <StyledInput value='LexDAO' isDisabled />
        </FormControl>

        <FormControl isReadOnly mr='.5em'>
          <Link
            href={getSpoilsUrl(parseInt(context.chainID), serviceProvider)}
            target='_blank'
            rel='noopener noreferrer'
          >
            <StyledFormLabel cursor='pointer'>Spoils Percent</StyledFormLabel>
          </Link>
          <StyledInput value='10%' readOnly isDisabled />
        </FormControl>

        <FormControl isRequired>
          <HStack alignItems='baseline' justifyContent='space-between'>
            <StyledFormLabel>Safety Valve Date </StyledFormLabel>
            <Tooltip
              label='The funds can be withdrawn by the client after 00:00:00 GMT on this date'
              placement='auto-start'
            >
              <QuestionIcon boxSize='0.85rem' />
            </Tooltip>
          </HStack>

          <StyledInput
            type='date'
            color='white'
            name='safetyValveDate'
            onChange={(e) => setSelectedDay(e.target.value)}
            value={selectedDay}
          />
        </FormControl>
      </Flex>

      <Button
        variant='primary'
        onClick={() => {
          if (
            parseInt(context.chainID) !== 4 &&
            parseInt(context.chainID) !== 100
          )
            return sendToast('Switch to a supported network.');
          if (!context.web3.utils.isAddress(client))
            return sendToast('Invalid Client Address.');
          if (!context.web3.utils.isAddress(serviceProvider))
            return sendToast('Invalid Raid Party Address.');
          if (client === serviceProvider)
            return sendToast(
              'Client and Raid party address cannot be the same.'
            );
          if (tokenType === undefined)
            return sendToast('Select a Payment Token.');
          if (paymentDue <= 0 || paymentDue === '')
            return sendToast('Invalid Payment Due Amount.');
          if (!selectedDay) return sendToast('Safety valve date required.');
          if (new Date(selectedDay).getTime() < new Date().getTime())
            return sendToast('Safety valve date needs to be in future.');

          updateStep((prevStep) => prevStep + 1);
        }}
      >
        Next: Set Payment Amounts
      </Button>
    </Flex>
  );
};
