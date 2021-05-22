import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Flex, Heading, VStack, useToast, Box } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { theme } from '../theme';

import { Container } from '../shared/Container';
import { Loader } from '../components/Loader';

import { AppContext } from '../context/AppContext';

const StyledButton = styled.button`
  width: 350px;
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
  &:hover {
    cursor: pointer;
    background-color: #16161a;
    color: #ff3864;
  }
`;

const StyledInput = styled.input`
  width: 350px;
  outline: none;
  color: white;
  font-family: ${theme.fonts.jetbrains};
  font-size: 1.1rem;
  border: 2px solid #ff3864;
  border-radius: 5px;
  background-color: transparent;
  margin-bottom: 15px;
  padding: 12px;
  &::placeholder {
    color: #ff3864;
    opacity: 1;
  }
`;

const ButtonManager = (
  context,
  validId,
  escrowClickHandler,
  registerClickHandler,
  validateID
) => {
  let component;
  if (context.isLoading) {
    component = <Loader />;
  } else if (validId) {
    if (context.chainID.toString() !== '100' && context.chainID !== '0x64') {
      component = (
        <p
          style={{ fontFamily: "'Rubik Mono One', sans-serif", color: '#fff' }}
        >
          Switch to xDai
        </p>
      );
    } else if (context.account) {
      if (context.escrow_index !== '') {
        component = (
          <StyledButton onClick={escrowClickHandler}>View Escrow</StyledButton>
        );
      } else {
        component = (
          <StyledButton onClick={registerClickHandler}>
            Register Escrow
          </StyledButton>
        );
      }
    } else {
      component = (
        <StyledButton onClick={context.connectAccount}>
          Connect Wallet
        </StyledButton>
      );
    }
  } else {
    component = <StyledButton onClick={validateID}>Validate ID</StyledButton>;
  }

  return component;
};

export const Home = () => {
  const context = useContext(AppContext);
  const [ID, setID] = useState('');
  const [validId, setValidId] = useState(false);

  const toast = useToast();

  const history = useHistory();

  const validateID = async () => {
    if (ID === '') return alert('ID cannot be empty!');
    context.updateLoadingState();
    let result = await context.setAirtableState(ID);
    setValidId(result.validRaidId);
    context.updateLoadingState();
    if (!result.validRaidId) {
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
            Raid ID not found or invalid.
          </Box>
        )
      });
    }
  };

  const registerClickHandler = async () => {
    await validateID();
    if (validId) history.push('/register-escrow');
  };

  const escrowClickHandler = async () => {
    await validateID();
    if (validId) history.push(`/escrow/${context.raid_id}`);
  };

  return (
    <Container>
      <Flex marginRight='auto' marginLeft='3rem'>
        <VStack height='150px' marginTop='auto' marginBottom='auto'>
          <Heading
            size='md'
            fontFamily='jetbrains'
            color='guildRed'
            marginBottom='1rem'
          >
            Start here by providing the Raid ID..
          </Heading>
          <StyledInput
            type='text'
            placeholder='Enter Raid ID'
            onChange={(event) => setID(event.target.value)}
          ></StyledInput>
          {ButtonManager(
            context,
            validId,
            escrowClickHandler,
            registerClickHandler,
            validateID
          )}
        </VStack>
      </Flex>
    </Container>
  );
};
