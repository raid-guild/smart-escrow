import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  Checkbox,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Select,
  Text,
  Tooltip,
  VStack
} from '@chakra-ui/react';
import { BigNumber, Contract, utils } from 'ethers';
import { useContext, useEffect, useState } from 'react';

import { Loader } from '../components/Loader';
import { AppContext } from '../context/AppContext';
import { QuestionIcon } from '../icons/QuestionIcon';
import { balanceOf } from '../utils/erc20';

import {
  getTxLink,
  getNativeTokenSymbol,
  getWrappedNativeToken,
  parseTokenAddress,
  checkedAtIndex,
  getCheckedStatus
} from '../utils/helpers';

import { getSmartInvoiceAddress } from '../utils/invoice';
import { getInvoice } from '../graphql/getInvoice';

export const DepositFunds = ({ invoice, deposited, due }) => {
  const { address, token, amounts, currentMilestone } = invoice;
  const { chainID, invoice_id, provider, account } = useContext(AppContext);

  const NATIVE_TOKEN_SYMBOL = getNativeTokenSymbol(chainID);
  const WRAPPED_NATIVE_TOKEN = getWrappedNativeToken(chainID);
  const isWRAPPED = token.toLowerCase() === WRAPPED_NATIVE_TOKEN;

  const [paymentType, setPaymentType] = useState(0);
  const [amount, setAmount] = useState(BigNumber.from(0));
  const [amountInput, setAmountInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState();

  const initialStatus = getCheckedStatus(deposited, amounts);
  const [checked, setChecked] = useState(initialStatus);

  const [balance, setBalance] = useState();

  const pollSubgraph = async () => {
    let smartInvoice = await getSmartInvoiceAddress(invoice_id, provider);

    let isSubscribed = true;

    const interval = setInterval(async () => {
      let inv = await getInvoice(parseInt(chainID), smartInvoice);
      if (isSubscribed && !!inv) {
        console.log(`Invoice data received, ${inv}`);

        let balance = await balanceOf(provider, inv.token, inv.address);
        let newDepositValue = BigNumber.from(inv.released).add(balance);
        newDepositValue = utils.formatUnits(newDepositValue, 18);
        if (newDepositValue > utils.formatUnits(deposited, 18)) {
          isSubscribed = false;
          clearInterval(interval);
          console.log(newDepositValue, utils.formatUnits(deposited, 18));
          window.location.reload();
        }
      }
    }, 5000);
  };

  const deposit = async () => {
    if (!amount || !provider) return;
    try {
      setLoading(true);
      let tx;
      if (paymentType === 1) {
        tx = await provider
          .getSigner()
          .sendTransaction({ to: address, value: amount });
      } else {
        const abi = ['function transfer(address, uint256) public'];
        const tokenContract = new Contract(token, abi, provider.getSigner());
        tx = await tokenContract.transfer(address, amount);
      }
      setTransaction(tx);
      await tx.wait();

      await pollSubgraph();
    } catch (depositError) {
      setLoading(false);
      console.log(depositError);
    }
  };

  useEffect(() => {
    try {
      if (paymentType === 0) {
        balanceOf(provider, token, account).then(setBalance);
      } else {
        provider.getBalance(account).then(setBalance);
      }
    } catch (balanceError) {
      console.log(balanceError);
    }
  }, [paymentType, token, provider, account]);

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
        Pay Invoice
      </Heading>
      <Text textAlign='center' fontSize='sm' mb='1rem' fontFamily='jetbrains'>
        At a minimum, you’ll need to deposit enough to cover the{' '}
        {currentMilestone === '0' ? 'first' : 'next'} project payment.
      </Text>
      <Text textAlign='center' color='purpleLight' fontFamily='jetbrains'>
        How much will you be depositing today?
      </Text>
      <VStack spacing='0.5rem'>
        {amounts.map((a, i) => {
          return (
            <Checkbox
              minW='300px'
              key={i.toString()}
              isChecked={checked[i]}
              isDisabled={initialStatus[i]}
              onChange={(e) => {
                const newChecked = e.target.checked
                  ? checkedAtIndex(i, checked)
                  : checkedAtIndex(i - 1, checked);
                const totAmount = amounts.reduce(
                  (tot, cur, ind) => (newChecked[ind] ? tot.add(cur) : tot),
                  BigNumber.from(0)
                );
                const newAmount = totAmount.gte(deposited)
                  ? totAmount.sub(deposited)
                  : BigNumber.from(0);

                setChecked(newChecked);
                setAmount(newAmount);
                setAmountInput(utils.formatUnits(newAmount, 18));
              }}
              color='yellow'
              border='none'
              size='lg'
              fontSize='1rem'
              fontFamily='jetbrains'
            >
              Payment #{i + 1} &nbsp; &nbsp;
              {utils.formatUnits(a, 18)} {parseTokenAddress(chainID, token)}
            </Checkbox>
          );
        })}
      </VStack>

      <Text variant='textOne'>OR</Text>

      <VStack
        spacing='0.5rem'
        align='stretch'
        color='purpleLight'
        mb='1rem'
        fontFamily='jetbrains'
      >
        <Flex justify='space-between' w='100%'>
          <Text fontWeight='500'>Enter a Manual Deposit Amount</Text>
          {paymentType === 1 && (
            <Tooltip
              label={`Your ${NATIVE_TOKEN_SYMBOL} will be automagically wrapped to ${parseTokenAddress(
                chainID,
                token
              )} tokens`}
              placement='auto-start'
            >
              <QuestionIcon ml='1rem' boxSize='0.75rem' />
            </Tooltip>
          )}
        </Flex>
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
                setChecked(getCheckedStatus(deposited.add(newAmount), amounts));
              } else {
                setAmount(BigNumber.from(0));
                setChecked(initialStatus);
              }
            }}
            placeholder='Value..'
            pr={isWRAPPED ? '6rem' : '3.5rem'}
          />
          <InputRightElement w={isWRAPPED ? '6rem' : '3.5rem'}>
            {isWRAPPED ? (
              <Select
                onChange={(e) => setPaymentType(Number(e.target.value))}
                value={paymentType}
                bg='black'
                color='red'
                border='none'
              >
                <option value='0'>{parseTokenAddress(chainID, token)}</option>
                <option value='1'>{NATIVE_TOKEN_SYMBOL}</option>
              </Select>
            ) : (
              parseTokenAddress(chainID, token)
            )}
          </InputRightElement>
        </InputGroup>
        {amount.gt(due) && (
          <Alert bg='none'>
            <AlertIcon color='red.500' />
            <AlertTitle fontSize='sm'>
              Your deposit is greater than the due amount!
            </AlertTitle>
          </Alert>
        )}
      </VStack>
      <Flex
        color='white'
        justify='space-between'
        w='100%'
        fontSize='sm'
        fontFamily='jetbrains'
      >
        {deposited && (
          <VStack align='flex-start'>
            <Text fontWeight='bold'>Total Deposited</Text>
            <Text>{`${utils.formatUnits(deposited, 18)} ${parseTokenAddress(
              chainID,
              token
            )}`}</Text>
          </VStack>
        )}
        {due && (
          <VStack>
            <Text fontWeight='bold'>Total Due</Text>
            <Text>{`${utils.formatUnits(due, 18)} ${parseTokenAddress(
              chainID,
              token
            )}`}</Text>
          </VStack>
        )}
        {balance && (
          <VStack align='flex-end'>
            <Text fontWeight='bold'>Your Balance</Text>
            <Text>
              {`${utils.formatUnits(balance, 18)} ${
                paymentType === 0
                  ? parseTokenAddress(chainID, token)
                  : NATIVE_TOKEN_SYMBOL
              }`}
            </Text>
          </VStack>
        )}
      </Flex>
      {loading && <Loader />}

      {!loading && (
        <Button
          onClick={deposit}
          isDisabled={amount.lte(0)}
          textTransform='uppercase'
          variant='primary'
          w='100%'
        >
          Deposit
        </Button>
      )}
      {transaction && (
        <Text color='white' textAlign='center' fontSize='sm'>
          Follow your transaction{' '}
          <Link
            href={getTxLink(chainID, transaction.hash)}
            isExternal
            color='red'
            textDecoration='underline'
          >
            here
          </Link>
        </Text>
      )}
    </VStack>
  );
};
