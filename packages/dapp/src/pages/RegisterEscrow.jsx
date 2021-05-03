import React, { useContext, useEffect, useState } from 'react';
import {
  Flex,
  Box,
  Heading,
  Text,
  Link,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Button,
  Input,
  useToast,
  HStack
} from '@chakra-ui/react';

import { useHistory } from 'react-router-dom';
import styled from '@emotion/styled';
import { theme } from '../theme';

import { Container } from '../shared/Container';
import { RadioBox } from '../components/RadioBox';

import { AppContext } from '../context/AppContext';

const ARBITRATION_PROVIDER = '0x034CfED494EdCff96f0D7160dC2B55Cae5Ee69E1';
const SPOILS = '0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f';

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

export const StyledFormLabel = styled(FormLabel)`
  font-family: ${theme.fonts.jetbrains};
  font-weight: bold;
`;

export const StyledButton = styled(Button)`
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

export const RegisterEscrow = (props) => {
  const context = useContext(AppContext);

  const [client, setClient] = useState('');
  const [serviceProvider, setServiceProvider] = useState('');
  const [tokenType, setTokenType] = useState('WXDAI');
  const [paymentDue, setPaymentDue] = useState('');
  const [milestones, setMilestones] = useState(2);
  const [selectedDay, setSelectedDay] = useState('');
  console.log(selectedDay);

  const [payments, setPayments] = useState(
    Array.from(Array(Number(milestones)))
  );

  const [step, updateStep] = useState(1);

  const history = useHistory();
  const toast = useToast();

  const sendToast = (msg) => {
    toast({
      duration: 3000,
      position: 'top',
      render: () => (
        <Box
          color='white'
          p={3}
          mt='2rem'
          bg='#ff3864'
          fontFamily='jetbrains'
          textTransform='uppercase'
        >
          {msg}
        </Box>
      )
    });
  };

  useEffect(() => {
    if (context.address === '') return history.push('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container backdropFilter='blur(.5rem)'>
      <Flex
        width='100%'
        direction='row'
        alignItems='center'
        justifyContent='space-evenly'
      >
        <Flex direction='column' alignItems='flex-start'>
          <Heading size='md' fontFamily='jetbrains' color='guildRed'>
            {context.client_name}
          </Heading>

          <Heading
            size='lg'
            fontFamily='mono'
            color='white'
            maxWidth='300px'
            isTruncated
          >
            {context.project_name}
          </Heading>

          <Box marginTop='15px' marginBottom='.7rem' fontFamily='jetbrains'>
            <Text color='#a7a9be'>
              Start: {context.start_date.split('T')[0]}
            </Text>
            <Text color='#a7a9be'>Planned End: {context.end_date}</Text>
          </Box>

          <Link
            href={context.link_to_details}
            target='_blank'
            rel='noopener noreferrer'
            color={`${theme.colors.purple}`}
            textDecoration='underline'
            fontFamily='jetbrains'
            marginBottom='.5rem'
          >
            Link to project doc provided
          </Link>
        </Flex>

        {step === 1 && (
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
                  options={['WXDAI', 'WETH']}
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
                  <StyledFormLabel cursor='pointer'>
                    Spoils Percent
                  </StyledFormLabel>
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
                if (paymentDue < 1 || paymentDue === '')
                  return sendToast('Invalid Payment Due Amount.');

                updateStep((prevStep) => prevStep + 1);
              }}
            >
              Next: Set Payment Amounts
            </StyledButton>
          </Flex>
        )}

        {step === 2 && (
          <Flex
            direction='column'
            background='#262626'
            padding='1.5rem'
            minWidth='40%'
          >
            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
              {Array.from(Array(Number(milestones)).keys()).map(
                (count, index) => {
                  return (
                    <FormControl key={count} isRequired>
                      <StyledFormLabel>{`Payment #${
                        index + 1
                      }`}</StyledFormLabel>
                      <InputGroup>
                        <StyledInput
                          focusBorderColor='none'
                          name={`payment${index + 1}`}
                          type='number'
                          min='1'
                          onChange={(e) => {
                            let temp = payments;
                            temp[index] = Number(e.target.value);
                            setPayments(temp);
                          }}
                          value={payments[index]}
                        />
                        <InputRightElement
                          fontFamily='jetbrains'
                          color='purple'
                          w='3.5rem'
                          mr='.5rem'
                        >
                          {tokenType}
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                  );
                }
              )}
            </div>

            <Text
              color={`${theme.colors.purple}`}
              textTransform='uppercase'
              fontFamily='jetbrains'
            >
              The sum should add up to {paymentDue} {tokenType}
            </Text>

            <Flex direction='row' width='100%'>
              <StyledButton
                style={{
                  minWidth: '25%',
                  marginRight: '.5rem',
                  border: '2px solid #ff3864',
                  backgroundColor: '#16161a',
                  color: '#ff3864',
                  padding: '5px'
                }}
                onClick={() => updateStep((prevStep) => prevStep - 1)}
              >
                Back
              </StyledButton>
              <StyledButton
                style={{ width: '100%' }}
                onClick={() => {
                  let sum = payments.reduce((acc, num) => acc + num);
                  if (sum !== Number(paymentDue))
                    return sendToast("Payments didn't add up to due amount.");
                  updateStep((prevStep) => prevStep + 1);
                }}
              >
                Next: Confirmation
              </StyledButton>
            </Flex>
          </Flex>
        )}

        {step === 3 && (
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
              <Text
                fontFamily='mono'
                color='white'
                maxWidth='200px'
                isTruncated
              >
                {context.project_name}
              </Text>
            </HStack>
            <HStack mb='.5rem' justifyContent='space-between'>
              <Text fontWeight='bold' fontFamily='jetbrains'>
                Client Address:
              </Text>
              <Text
                maxWidth='200px'
                fontFamily='mono'
                color='guildRed'
                isTruncated
                padding='5px'
                background='#16161a'
              >
                {client}
              </Text>
            </HStack>
            <HStack mb='.5rem' justifyContent='space-between'>
              <Text fontWeight='bold' fontFamily='jetbrains'>
                Service Provider Address:
              </Text>
              <Text
                fontFamily='mono'
                maxWidth='200px'
                color='guildRed'
                padding='5px'
                background='#16161a'
                isTruncated
              >
                {serviceProvider}
              </Text>
            </HStack>
            <HStack mb='.5rem' justifyContent='space-between'>
              <Text fontWeight='bold' fontFamily='jetbrains'>
                Arbitration Provider:
              </Text>
              <Text fontFamily='mono' color='white'>
                LexDAO
              </Text>
            </HStack>
            <HStack mb='.5rem' justifyContent='space-between'>
              <Text fontWeight='bold' fontFamily='jetbrains'>
                Payment Token:
              </Text>
              <Text fontFamily='mono' color='purple'>
                {tokenType}
              </Text>
            </HStack>
            <HStack mb='.5rem' justifyContent='space-between'>
              <Text fontWeight='bold' fontFamily='jetbrains'>
                Payment Due:
              </Text>
              <Text fontFamily='mono' color='purple'>
                {paymentDue}
              </Text>
            </HStack>
            <HStack mb='.5rem' justifyContent='space-between'>
              <Text fontWeight='bold' fontFamily='jetbrains'>
                No of Payments:
              </Text>
              <Text fontFamily='mono' color='purple'>
                {milestones}
              </Text>
            </HStack>

            <Flex direction='row' width='100%'>
              <StyledButton
                style={{
                  minWidth: '25%',
                  marginRight: '.5rem',
                  border: '2px solid #ff3864',
                  backgroundColor: '#16161a',
                  color: '#ff3864',
                  padding: '5px'
                }}
                onClick={() => updateStep((prevStep) => prevStep - 1)}
              >
                Back
              </StyledButton>
              <StyledButton
                style={{ width: '100%' }}
                onClick={() => {
                  let sum = payments.reduce((acc, num) => acc + num);
                  if (sum !== Number(paymentDue))
                    return sendToast("Payments didn't add up to due amount.");
                  updateStep((prevStep) => prevStep + 1);
                }}
              >
                Create Escrow
              </StyledButton>
            </Flex>
          </Flex>
        )}

        {step === 4 && (
          <Flex
            direction='column'
            background='#262626'
            padding='1.5rem'
            minWidth='50%'
          >
            <Text fontFamily='jetbrains'>
              Escrow creation in progress with the hash,{' '}
            </Text>
            <Link
              fontFamily='mono'
              maxWidth='250px'
              isTruncated
              href={`https://blockscout.com/poa/xdai/address/${ARBITRATION_PROVIDER}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              {ARBITRATION_PROVIDER}
            </Link>

            <StyledButton
              onClick={() => {
                history.push('/');
              }}
            >
              Go Home
            </StyledButton>
          </Flex>
        )}
      </Flex>
    </Container>
  );
};
