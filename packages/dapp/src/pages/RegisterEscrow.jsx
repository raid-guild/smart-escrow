import React, { useContext, useEffect, useState } from 'react';
import { Flex, Box, useToast } from '@chakra-ui/react';

import { useHistory } from 'react-router-dom';

import { Container } from '../shared/Container';

import { AppContext } from '../context/AppContext';

import { PaymentDetailsForm } from '../components/PaymentDetailsForm';
import { PaymentsChunkForm } from '../components/PaymentsChunkForm';
import { EscrowConfirmation } from '../components/EscrowConfirmation';
import { EscrowCreated } from '../components/EscrowCreated';
import { ProjectInfo } from '../components/ProjectInfo';

export const RegisterEscrow = (props) => {
  const context = useContext(AppContext);

  const [client, setClient] = useState('');
  const [serviceProvider, setServiceProvider] = useState('');
  const [tokenType, setTokenType] = useState('WXDAI');
  const [paymentDue, setPaymentDue] = useState('');
  const [milestones, setMilestones] = useState(2);
  const [selectedDay, setSelectedDay] = useState('');

  const [payments, setPayments] = useState(
    Array.from(Array(Number(milestones)))
  );

  const [step, updateStep] = useState(1);
  const [isLoading, setLoading] = useState(false);

  const history = useHistory();
  const toast = useToast();

  const sendToast = (msg) => {
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
          {msg}
        </Box>
      )
    });
  };

  useEffect(() => {
    if (context.address === '') return history.push('/');
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

        {step === 1 && (
          <PaymentDetailsForm
            context={context}
            client={client}
            serviceProvider={serviceProvider}
            tokenType={tokenType}
            paymentDue={paymentDue}
            milestones={milestones}
            selectedDay={selectedDay}
            setClient={setClient}
            setServiceProvider={setServiceProvider}
            setTokenType={setTokenType}
            setPaymentDue={setPaymentDue}
            setMilestones={setMilestones}
            setSelectedDay={setSelectedDay}
            sendToast={sendToast}
            updateStep={updateStep}
          />
        )}

        {step === 2 && (
          <PaymentsChunkForm
            tokenType={tokenType}
            paymentDue={paymentDue}
            milestones={milestones}
            payments={payments}
            setPayments={setPayments}
            sendToast={sendToast}
            updateStep={updateStep}
          />
        )}

        {step === 3 && (
          <EscrowConfirmation
            context={context}
            client={client}
            serviceProvider={serviceProvider}
            tokenType={tokenType}
            paymentDue={paymentDue}
            milestones={milestones}
            payments={payments}
            isLoading={isLoading}
            setLoading={setLoading}
            sendToast={sendToast}
            updateStep={updateStep}
          />
        )}

        {step === 4 && <EscrowCreated history={history} />}
      </Flex>
    </Container>
  );
};
