import React, { useContext, useEffect, useState } from 'react';
import {
  Flex,
  Box,
  Heading,
  Text,
  Link,
  FormControl,
  FormLabel
} from '@chakra-ui/react';

import { useHistory } from 'react-router-dom';
import styled from '@emotion/styled';
import { theme } from '../theme';

import { Container } from '../shared/Container';
import { RadioBox } from '../components/RadioBox';
import { StyledButton } from '../styled/StyledButton';

import { AppContext } from '../context/AppContext';

const StyledInput = styled.input`
  width: 500px;
  outline: none;
  color: #ff3864;
  font-family: ${theme.fonts.jetbrains};
  font-size: 1rem;
  border: 2px solid #ff3864;
  border-radius: 2px;
  background-color: transparent;
  margin-bottom: 15px;
  padding: 10px;
  &::placeholder {
    color: #ff3864;
    opacity: 1;
  }
`;

export const RaidInfo = (props) => {
  const context = useContext(AppContext);

  const [tokenType, updateTokenType] = useState('WXDAI');

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
        justifyContent='center'
      >
        <Flex direction='column' alignItems='center' mr='3rem'>
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
        </Flex>
        <Flex direction='column' background='black' padding='1.5rem'>
          <FormControl isRequired>
            <StyledInput placeholder='Client Address *' name='client-address' />
          </FormControl>

          <FormControl isRequired>
            <StyledInput placeholder='Service Provider Address *' />
          </FormControl>

          <FormControl>
            <StyledInput placeholder='Total Payment Due *' />
          </FormControl>

          <FormControl>
            <StyledInput type='number' placeholder='No of Payments *' />
          </FormControl>

          <FormControl>
            <FormLabel fontFamily='jetbrains'>Payment Token</FormLabel>
            <RadioBox
              options={['WXDAI', 'WETH']}
              updateRadio={updateTokenType}
              name='payment-token'
              defaultValue={tokenType}
              value={tokenType}
            />
          </FormControl>
          <StyledButton
            style={{ width: 'auto', marginTop: '1rem' }}
            onClick={() => history.push('/register-escrow')}
          >
            Next
          </StyledButton>
        </Flex>
      </Flex>
    </Container>
  );
};
