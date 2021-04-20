import React, { useContext, useEffect } from 'react';
import { Flex, Box, Heading, Text, Link } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';

import { Container } from '../shared/Container';
import { StyledButton } from '../styled/StyledButton';

import { AppContext } from '../context/AppContext';

export const RaidInfo = (props) => {
  const context = useContext(AppContext);

  const history = useHistory();

  useEffect(() => {
    if (context.address === '') return history.push('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Flex
        min-height='300px'
        direction='column'
        maxWidth='450px'
        marginRight='auto'
        marginLeft='3rem'
        letterSpacing='1.5px'
      >
        <Flex direction='column' alignItems='flex-start'>
          <Heading size='md' fontFamily='jetbrains' color='guildRed'>
            {context.client_name}
          </Heading>

          <Heading size='lg' fontFamily='mono' color='white'>
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
              <Text fontFamily='jetbrains' fontSize='sm' color='guildRed'>
                Spoils - {context.spoils_percent * 100}% of payment
              </Text>{' '}
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
              <Text fontFamily='jetbrains' fontSize='sm' color='guildRed'>
                Arbitration Provider - LexDAO
              </Text>
              <i className='fas fa-external-link-square-alt'></i>
            </Link>
          </Box>
          <StyledButton
            style={{ width: 'auto', marginTop: '12px' }}
            onClick={() => history.push('/register-escrow')}
          >
            Next
          </StyledButton>
        </Flex>
      </Flex>
    </Container>
  );
};
