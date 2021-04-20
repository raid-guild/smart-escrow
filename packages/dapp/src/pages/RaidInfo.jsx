import React, { useContext, useEffect } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import styled from '@emotion/styled';

import { Container } from '../shared/Container';
import { StyledButton } from '../styled/StyledButton';

import { AppContext } from '../context/AppContext';

const StyledH1 = styled.h1`
  font-size: 1.1rem;
  font-family: 'Rubik Mono One', sans-serif;
  color: #fffffe;
`;

const StyledH2 = styled.h2`
  font-size: 1rem;
  font-weight: normal;
  font-family: 'JetBrains Mono', monospace;
  color: #a7a9be;
`;

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
        direction='column'
        maxWidth='450px'
        marginRight='auto'
        marginLeft='3rem'
        letterSpacing='1.5px'
      >
        <Flex direction='column' alignItems='flex-start'>
          <StyledH2>{context.client_name}</StyledH2>
          <StyledH1>{context.project_name}</StyledH1>
          <Box marginTop='15px' marginBottom='.7rem'>
            <p style={{ color: '#a7a9be', fontFamily: "'Texturina', serif" }}>
              Start: {context.start_date.split('T')[0]}
            </p>
            <p style={{ color: '#a7a9be', fontFamily: "'Texturina', serif" }}>
              Planned End: {context.end_date}
            </p>
          </Box>
          {/* <motion.p>
            {context.brief_description}
            </motion.p> */}
          <a
            href={context.link_to_details}
            target='_blank'
            rel='noopener noreferrer'
            style={{
              color: '#7f5af0',
              marginBottom: '5px',
              textDecoration: 'underline',
              fontFamily: "'Texturina', serif"
            }}
          >
            Link to details of agreement
          </a>

          <Box>
            <a
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
              <p
                style={{
                  marginRight: '5px',
                  textTransform: 'uppercase',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '.7rem'
                }}
              >
                Spoils - {context.spoils_percent * 100}% of payment
              </p>{' '}
              <i className='fas fa-external-link-square-alt'></i>
            </a>
            <a
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
              <p
                style={{
                  marginRight: '5px',
                  textTransform: 'uppercase',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '.7rem'
                }}
              >
                Arbitration Provider - LexDAO
              </p>
              <i className='fas fa-external-link-square-alt'></i>
            </a>
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
