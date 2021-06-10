import {
  Button,
  Heading,
  Link,
  Text,
  VStack
  //   InputGroup,
  //   Input,
  //   InputRightElement
} from '@chakra-ui/react';
import { utils, Contract } from 'ethers';
import React, { useContext, useState } from 'react';

import { Loader } from '../components/Loader';

import { AppContext } from '../context/AppContext';

import {
  getTxLink,
  parseTokenAddress,
  apiNotifySpoils
} from '../utils/helpers';
import { awaitSpoilsWithdrawn } from '../utils/invoice';

export const WithdrawWrappedBalance = ({ contractAddress, token, balance }) => {
  const [loading, setLoading] = useState(false);
  const { chainID, provider } = useContext(AppContext);

  //   const [amountInput, setAmountInput] = useState('');
  //   const [amount, setAmount] = useState(BigNumber.from(0));

  const [transaction, setTransaction] = useState();

  const notifySpoilsSent = async (tx) => {
    let result = await awaitSpoilsWithdrawn(provider, tx);
    let status = await apiNotifySpoils(
      parseTokenAddress(chainID, result.token),
      utils.formatUnits(result.childShare, 18),
      utils.formatUnits(result.parentShare, 18),
      getTxLink(chainID, tx.hash)
    );
    console.log(status);
  };

  const withdrawFunds = async () => {
    if (!loading && provider && balance.gte(0)) {
      try {
        setLoading(true);
        const abi = new utils.Interface(['function withdrawAll() external']);
        const contract = new Contract(
          contractAddress,
          abi,
          provider.getSigner()
        );
        const tx = await contract.withdrawAll();
        setTransaction(tx);
        await tx.wait();
        notifySpoilsSent(tx);
        setTimeout(() => {
          window.location.reload();
        }, 10000);
      } catch (withdrawError) {
        setLoading(false);
        console.log(withdrawError);
      }
    }
  };

  return (
    <VStack w='100%' spacing='1rem'>
      <Heading
        fontWeight='normal'
        mb='1rem'
        textTransform='uppercase'
        textAlign='center'
        fontFamily='rubik'
        color='red'
      >
        Withdraw Balance
      </Heading>
      {/* <VStack my='2rem' py='1rem' fontFamily='jetbrains'>
        <Text color='red.500' fontSize='1.3rem' textAlign='center'>
          Available Balance
        </Text>
        <Text
          color='yellow'
          fontSize='1.3rem'
          fontWeight='bold'
          textAlign='center'
        >{`${utils.formatUnits(balance, 18)} ${parseTokenAddress(
          chainID,
          token
        )}`}</Text>
        <br />
        <InputGroup>
          <Input
            bg='black'
            color='white'
            border='none'
            type='number'
            value={amountInput}
            onChange={(e) => {
              const newAmountInput = e.target.value;
              setAmountInput(newAmountInput);
              if (newAmountInput) {
                const newAmount = utils.parseUnits(newAmountInput, 18);
                setAmount(newAmount);
              } else {
                setAmount(BigNumber.from(0));
              }
            }}
            placeholder='Amount to Withdraw'
          />
          <InputRightElement w={'6rem'}>
            {parseTokenAddress(chainID, token)}
          </InputRightElement>
        </InputGroup>
      </VStack> */}

      <Text textAlign='center' fontSize='sm' mb='1rem' fontFamily='jetbrains'>
        Follow the instructions in your wallet to withdraw the balance from
        wrapped invoice.
      </Text>
      <VStack my='2rem' px='5rem' py='1rem' bg='black' borderRadius='0.5rem'>
        <Text
          color='red.500'
          fontSize='0.875rem'
          textAlign='center'
          fontFamily='jetbrains'
        >
          Balance Available
        </Text>
        <Text
          color='yellow'
          fontSize='1rem'
          fontWeight='bold'
          textAlign='center'
          fontFamily='jetbrains'
        >{`${utils.formatUnits(balance, 18)} ${parseTokenAddress(
          chainID,
          token
        )}`}</Text>
      </VStack>

      {transaction && (
        <Text color='white' textAlign='center' fontSize='sm'>
          Follow your transaction{' '}
          <Link
            href={getTxLink(chainID, transaction.hash)}
            isExternal
            color='red.500'
            textDecoration='underline'
          >
            here
          </Link>
        </Text>
      )}
      {loading && <Loader />}
      {!loading && (
        <Button
          onClick={withdrawFunds}
          variant='primary'
          textTransform='uppercase'
          w='100%'
        >
          Withdraw
        </Button>
      )}
    </VStack>
  );
};
