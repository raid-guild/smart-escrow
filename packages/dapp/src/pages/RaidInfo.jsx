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
  InputRightElement
} from '@chakra-ui/react';

import { useHistory } from 'react-router-dom';
import styled from '@emotion/styled';
import { theme } from '../theme';

import { Container } from '../shared/Container';
import { RadioBox } from '../components/RadioBox';

import { AppContext } from '../context/AppContext';

const StyledInput = styled.input`
  width: 100%;
  outline: none;
  color: #ff3864;
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

export const StyledButton = styled.button`
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

export const RaidInfo = (props) => {
  const context = useContext(AppContext);

  const [tokenType, updateTokenType] = useState('WXDAI');
  const [step, updateStep] = useState(1);

  const [milestones, setMilestones] = useState(1);

  const history = useHistory();

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
            color='#7f5af0'
            textDecoration='underline'
            fontFamily='jetbrains'
            marginBottom='.5rem'
          >
            Link to details of agreement
          </Link>

          <Box>
            <Link
              href={`https://blockscout.com/poa/xdai/address/${context.spoils_address}`}
              target='_blank'
              rel='noopener noreferrer'
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                textDecoration: 'none'
              }}
            >
              <Text
                fontFamily='jetbrains'
                fontSize='sm'
                color='guildRed'
                mr='10px'
              >
                Spoils - {context.spoils_percent * 100}% of payment
              </Text>
              <i className='fas fa-external-link-square-alt'></i>
            </Link>
            <Link
              href={`https://blockscout.com/poa/xdai/address/${context.resolver_address}`}
              target='_blank'
              rel='noopener noreferrer'
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                textDecoration: 'none'
              }}
            >
              <Text
                fontFamily='jetbrains'
                fontSize='sm'
                color='guildRed'
                mr='10px'
              >
                Arbitration Provider - LexDAO
              </Text>
              <i className='fas fa-external-link-square-alt'></i>
            </Link>
          </Box>
        </Flex>

        {step === 1 && (
          <Flex
            direction='column'
            background='#262626'
            padding='1.5rem'
            minWidth='45%'
          >
            <FormControl isRequired>
              <FormLabel fontFamily='jetbrains'>Client Address</FormLabel>
              <StyledInput name='client-address' />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontFamily='jetbrains'>
                Service Provider Address
              </FormLabel>
              <StyledInput />
            </FormControl>

            <Flex direction='row'>
              <FormControl isRequired>
                <FormLabel fontFamily='jetbrains'>Payment Token</FormLabel>
                <RadioBox
                  options={['WXDAI', 'WETH']}
                  updateRadio={updateTokenType}
                  name='payment-token'
                  defaultValue={tokenType}
                  value={tokenType}
                />
              </FormControl>
              <FormControl isRequired mr='.5em'>
                <FormLabel fontFamily='jetbrains'>Total Payment Due</FormLabel>
                <StyledInput />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontFamily='jetbrains'>No of Payments</FormLabel>
                <StyledInput
                  type='number'
                  onChange={(e) => setMilestones(e.target.value)}
                />
              </FormControl>
            </Flex>
            <StyledButton
              onClick={() => updateStep((prevStep) => prevStep + 1)}
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
            minWidth='45%'
          >
            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
              {Array.from(Array(Number(milestones)).keys()).map(
                (count, index) => {
                  return (
                    <FormControl isRequired>
                      <FormLabel fontFamily='jetbrains'>{`Payment #${
                        index + 1
                      }`}</FormLabel>
                      <InputGroup>
                        <StyledInput />
                        <InputRightElement
                          fontFamily='jetbrains'
                          color='white'
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

            <Flex direction='row' width='100%'>
              <StyledButton
                style={{
                  maxWidth: '25%',
                  marginRight: '.5rem',
                  border: '2px solid #ff3864',
                  backgroundColor: '#16161a',
                  color: '#ff3864'
                }}
                onClick={() => updateStep((prevStep) => prevStep - 1)}
              >
                Back
              </StyledButton>
              <StyledButton
                style={{ width: '100%' }}
                onClick={() => updateStep((prevStep) => prevStep + 1)}
              >
                Next: Confirmation
              </StyledButton>
            </Flex>
          </Flex>
        )}
      </Flex>
    </Container>
  );
};
