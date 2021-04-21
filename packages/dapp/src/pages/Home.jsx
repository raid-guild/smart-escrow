import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Flex, Heading, VStack, useToast, Box } from '@chakra-ui/react';

import { Container } from '../shared/Container';
import { Loader } from '../components/Loader';
import { StyledButton } from '../styled/StyledButton';
import { StyledInput } from '../styled/StyledInput';

import { AppContext } from '../context/AppContext';

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
    } else if (context.address) {
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
            color='guildRed'
            p={3}
            mt='1rem'
            bg='#16161a'
            fontFamily='jetbrains'
          >
            Raid ID not found or invalid.
          </Box>
        )
      });
    }
  };

  const registerClickHandler = async () => {
    await validateID();
    if (validId) history.push('/raid-info');
  };

  const escrowClickHandler = async () => {
    await validateID();
    if (validId) history.push('/escrow');
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
