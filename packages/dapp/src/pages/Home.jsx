import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Flex, Heading } from '@chakra-ui/react';

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

  const history = useHistory();

  const validateID = async () => {
    if (ID === '') return alert('ID cannot be empty!');
    context.updateLoadingState();
    let result = await context.setAirtableState(ID);
    setValidId(result.validRaidId);
    context.updateLoadingState();
    if (!result.validRaidId) alert('ID not found!');
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
      <Flex
        height='300px'
        direction='column'
        alignItems='center'
        background='black'
        padding='.7rem'
        marginRight='auto'
        marginLeft='3rem'
      >
        <Heading
          size='md'
          fontFamily='jetbrains'
          color='guildRed'
          maxWidth='300px'
          marginRight='auto'
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
      </Flex>
    </Container>
  );
};
