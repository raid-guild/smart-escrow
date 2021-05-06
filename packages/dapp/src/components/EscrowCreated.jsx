import { Flex, Text, Link, Button } from '@chakra-ui/react';

import styled from '@emotion/styled';

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

export const EscrowCreated = ({ history }) => {
  return (
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
  );
};
