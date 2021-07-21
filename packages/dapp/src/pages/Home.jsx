import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Heading,
  VStack,
  useToast,
  Box,
  Button,
  Tooltip
} from '@chakra-ui/react';
import styled from '@emotion/styled';

import { QuestionIcon } from '../icons/QuestionIcon';
import { theme } from '../theme/theme';
import { Loader } from '../components/Loader';
import { AppContext } from '../context/AppContext';

const StyledInput = styled.input`
  width: 350px;
  outline: none;
  color: white;
  font-family: ${theme.fonts.spaceMono};
  font-size: 1.1rem;
  border-radius: 3px;
  background-color: ${theme.colors.blackLighter};
  margin-bottom: 15px;
  padding: 10px;
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
    component = (
      <span style={{ width: '50px' }}>
        <Loader />
      </span>
    );
  } else if (validId) {
    if (context.account === '') {
      component = (
        <Button w='350px' variant='primary' onClick={context.connectAccount}>
          Connect Wallet
        </Button>
      );
    } else if (
      context.chainID.toString() !== '100' &&
      context.chainID !== '0x64' &&
      context.chainID.toString() !== '4' &&
      context.chainID !== '0x4'
    ) {
      component = (
        <p
          style={{ fontFamily: "'Rubik Mono One', sans-serif", color: '#fff' }}
        >
          Switch to xDai or Rinkeby
        </p>
      );
    } else if (context.invoice_id !== '') {
      component = (
        <Button w='350px' variant='primary' onClick={escrowClickHandler}>
          View Escrow
        </Button>
      );
    } else {
      component = (
        <Button w='350px' variant='primary' onClick={registerClickHandler}>
          Register Escrow
        </Button>
      );
    }
  } else {
    component = (
      <Button w='350px' variant='primary' onClick={validateID}>
        Validate ID
      </Button>
    );
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
    <VStack height='150px' maxW='350px'>
      <Heading variant='headingOne'>
        Start here by providing the Raid ID.{' '}
        <Tooltip
          label='Raid ID can be found in the Raids V2 table of RaidCentral base in airtable corresponding to the Raid you wanna create an invoice for. Contact a Cleric for access.'
          placement='auto-start'
        >
          <QuestionIcon boxSize='1.2rem' />
        </Tooltip>
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
  );
};
