import { useContext, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Flex,
  HStack,
  Text,
  Button,
  Divider,
  Box,
  useToast
} from '@chakra-ui/react';
import styled from '@emotion/styled';

import { Container } from '../shared/Container';

import { ProjectInfo } from '../components/ProjectInfo';

import { AppContext } from '../context/AppContext';

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

export const EscrowInfo = () => {
  const context = useContext(AppContext);
  const { id } = useParams();

  const history = useHistory();
  const toast = useToast();

  const initData = async () => {
    if (id) {
      let result = await context.setAirtableState(id);

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
        return history.push('/');
      }

      if (!result.escrow_index) {
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
              Escrow not registered for this ID.
            </Box>
          )
        });

        return history.push('/');
      }

      await context.connectAccount();
    }
  };

  useEffect(() => {
    initData();
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
        <ProjectInfo context={context} />
        <Flex
          direction='column'
          background='#262626'
          padding='1.5rem'
          minWidth='50%'
        >
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
              {context.client}
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
              {context.serviceProvider}
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

          <Divider />

          <HStack mt='.5rem' mb='.5rem' justifyContent='space-between'>
            <Text fontWeight='bold' fontFamily='jetbrains'>
              Total Payment Due:
            </Text>
            <Text fontFamily='mono' color='purple'>
              {context.paymentDue}
            </Text>
          </HStack>
          {context.payments.map((payment, index) => {
            return (
              <HStack
                mb='.5rem'
                justifyContent='space-between'
                textDecoration={`${index === 0 ? 'line-through' : 'none'}`}
              >
                <Text fontFamily='jetbrains'>{`payment#${index + 1}:`}</Text>
                <Text fontFamily='jetbrains' color='white'>
                  {`${payment} ${context.token}`}
                </Text>
              </HStack>
            );
          })}

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
            >
              Lock
            </StyledButton>
            <StyledButton
              style={{
                minWidth: '25%',
                marginRight: '.5rem',
                border: '2px solid #ff3864',
                backgroundColor: '#16161a',
                color: '#ff3864',
                padding: '5px'
              }}
            >
              Release
            </StyledButton>
            <StyledButton style={{ width: '100%' }}>Deposit</StyledButton>
          </Flex>
        </Flex>
      </Flex>
    </Container>
  );
};
