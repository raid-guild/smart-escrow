import {
  Flex,
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
  Text,
  Button
} from '@chakra-ui/react';

import styled from '@emotion/styled';
import { theme } from '../theme';

const StyledInput = styled(Input)`
  width: 100%;
  outline: none;
  border: none;
  color: white;
  font-family: ${theme.fonts.jetbrains};
  font-size: 1rem;
  background-color: black;
  margin-bottom: 15px;
  padding: 10px;
  &::placeholder {
    color: #ff3864;
    opacity: 1;
  }
`;

const StyledFormLabel = styled(FormLabel)`
  font-family: ${theme.fonts.jetbrains};
  font-weight: bold;
`;

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

export const PaymentsChunkForm = ({
  tokenType,
  paymentDue,
  milestones,
  payments,
  setPayments,
  sendToast,
  updateStep
}) => {
  return (
    <Flex
      direction='column'
      background='#262626'
      padding='1.5rem'
      minWidth='40%'
    >
      <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
        {Array.from(Array(Number(milestones)).keys()).map((count, index) => {
          return (
            <FormControl key={count} isRequired>
              <StyledFormLabel>{`Payment #${index + 1}`}</StyledFormLabel>
              <InputGroup>
                <StyledInput
                  focusBorderColor='none'
                  name={`payment${index + 1}`}
                  type='number'
                  onChange={(e) => {
                    let temp = [...payments];
                    temp[index] = e.target.value;
                    setPayments(temp);
                  }}
                  value={payments[index]}
                />
                <InputRightElement
                  fontFamily='jetbrains'
                  color='purple'
                  w='3.5rem'
                  mr='.5rem'
                >
                  {tokenType}
                </InputRightElement>
              </InputGroup>
            </FormControl>
          );
        })}
      </div>

      <Text
        color={`${theme.colors.purple}`}
        textTransform='uppercase'
        fontFamily='jetbrains'
      >
        The sum should add up to {paymentDue} {tokenType}
      </Text>

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
          onClick={() => updateStep((prevStep) => prevStep - 1)}
        >
          Back
        </StyledButton>
        <StyledButton
          style={{ width: '100%' }}
          onClick={() => {
            let sum = payments.reduce((acc, num) => Number(acc) + Number(num));
            if (Number(sum) !== Number(paymentDue))
              return sendToast("Payments didn't add up to due amount.");
            updateStep((prevStep) => prevStep + 1);
          }}
        >
          Next: Confirmation
        </StyledButton>
      </Flex>
    </Flex>
  );
};
