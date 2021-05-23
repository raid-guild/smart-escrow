import {
  Flex,
  Input,
  Button,
  FormControl,
  FormLabel,
  Link
} from '@chakra-ui/react';

import { RadioBox } from './RadioBox';
import styled from '@emotion/styled';
import { theme } from '../theme';
import { useEffect, useState } from 'react';

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
  font-family: ${theme.fonts.jetbrains};
  font-weight: bold;
`;

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
  margin-top: 1rem;
  &:hover {
    cursor: pointer;
    background-color: #16161a;
    color: #ff3864;
  }
`;

const ARBITRATION_PROVIDER = '0x034CfED494EdCff96f0D7160dC2B55Cae5Ee69E1';
const SPOILS = '0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f';

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
    setTokenType(tokens[0]);
  };

  useEffect(() => updateTokenList(), []);

  return (
    <Flex
      direction='column'
      background='#262626'
      padding='1.5rem'
      minWidth='50%'
    >
      <FormControl isRequired>
        <StyledFormLabel>Client Address</StyledFormLabel>
        <StyledInput
          name='client'
          onChange={(e) => setClient(e.target.value)}
          value={client}
        />
      </FormControl>

      <FormControl isRequired>
        <StyledFormLabel>Service Provider Address</StyledFormLabel>
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
          <StyledFormLabel>No of Payments</StyledFormLabel>
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
        <FormControl mr='.5em' isRequired>
          <StyledFormLabel>Safety Valve Date</StyledFormLabel>
          <StyledInput
            type='date'
            color='white'
            name='safetyValveDate'
            onChange={(e) => setSelectedDay(e.target.value)}
            value={selectedDay}
          />
        </FormControl>
        <FormControl isReadOnly mr='.5em'>
          <Link
            href={`https://blockscout.com/poa/xdai/address/${ARBITRATION_PROVIDER}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <StyledFormLabel cursor='pointer'>
              Arbitration Provider
            </StyledFormLabel>
          </Link>
          <StyledInput value='LexDAO' isDisabled />
        </FormControl>

        <FormControl isReadOnly>
          <Link
            href={`https://blockscout.com/poa/xdai/address/${SPOILS}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <StyledFormLabel cursor='pointer'>Spoils Percent</StyledFormLabel>
          </Link>
          <StyledInput value='10%' readOnly isDisabled />
        </FormControl>
      </Flex>

      <StyledButton
        onClick={() => {
          if (!context.web3.utils.isAddress(client))
            return sendToast('Invalid Client Address.');
          if (!context.web3.utils.isAddress(serviceProvider))
            return sendToast('Invalid Service Provider Address.');
          if (tokenType === undefined)
            return sendToast('Select a Payment Token.');
          if (paymentDue < 1 || paymentDue === '')
            return sendToast('Invalid Payment Due Amount.');
          if (!selectedDay) return sendToast('Safety valve date required.');
          if (new Date(selectedDay).getTime() < new Date().getTime())
            return sendToast('Safety valve date needs to be in future.');
          updateStep((prevStep) => prevStep + 1);
        }}
      >
        Next: Set Payment Amounts
      </StyledButton>
    </Flex>
  );
};
