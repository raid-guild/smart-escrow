import { Flex, HStack, Text, Button } from '@chakra-ui/react';

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

export const EscrowConfirmation = ({
  context,
  client,
  serviceProvider,
  tokenType,
  paymentDue,
  milestones,
  payments,
  isLoading,
  setLoading,
  sendToast,
  updateStep
}) => {
  return (
    <Flex
      direction='column'
      background='#262626'
      padding='1.5rem'
      minWidth='50%'
    >
      <HStack mb='.5rem' justifyContent='space-between'>
        <Text fontWeight='bold' fontFamily='jetbrains'>
          Project Name:
        </Text>
        <Text fontFamily='mono' color='white' maxWidth='200px' isTruncated>
          {context.project_name}
        </Text>
      </HStack>
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
          {client}
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
          {serviceProvider}
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
      <HStack mb='.5rem' justifyContent='space-between'>
        <Text fontWeight='bold' fontFamily='jetbrains'>
          Payment Token:
        </Text>
        <Text fontFamily='mono' color='purple'>
          {tokenType}
        </Text>
      </HStack>
      <HStack mb='.5rem' justifyContent='space-between'>
        <Text fontWeight='bold' fontFamily='jetbrains'>
          Payment Due:
        </Text>
        <Text fontFamily='mono' color='purple'>
          {paymentDue}
        </Text>
      </HStack>
      <HStack mb='.5rem' justifyContent='space-between'>
        <Text fontWeight='bold' fontFamily='jetbrains'>
          No of Payments:
        </Text>
        <Text fontFamily='mono' color='purple'>
          {milestones}
        </Text>
      </HStack>

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
          isDisabled={isLoading}
          onClick={() => updateStep((prevStep) => prevStep - 1)}
        >
          Back
        </StyledButton>
        <StyledButton
          style={{ width: '100%' }}
          isDisabled={isLoading}
          onClick={() => {
            // updateStep((prevStep) => prevStep + 1);
            setLoading(true);
          }}
        >
          {isLoading ? 'Creating Escrow..' : 'Create Escrow'}
        </StyledButton>
      </Flex>
    </Flex>
  );
};
