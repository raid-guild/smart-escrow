import { HStack, Text, Tooltip } from '@chakra-ui/react';
import { QuestionIcon } from '../icons/QuestionIcon';

import { AccountLink } from '../shared/AccountLink';

export const InvoiceMetaDetails = ({ invoice, raidParty }) => {
  return (
    <>
      <HStack mb='.5rem' mt='2rem' justifyContent='space-between' fontSize='sm'>
        <Text fontWeight='bold' fontFamily='jetbrains'>
          Safety Valve Date:
        </Text>
        <HStack>
          <Text>{new Date(invoice.terminationTime * 1000).toDateString()}</Text>
          <Tooltip
            label='The funds can be withdrawn by the client after 00:00:00 GMT on this date'
            placement='auto-start'
          >
            <QuestionIcon boxSize='0.85rem' />
          </Tooltip>
        </HStack>
      </HStack>
      <HStack mb='.5rem' justifyContent='space-between' fontSize='sm'>
        <Text fontWeight='bold' fontFamily='jetbrains'>
          Client:
        </Text>
        <AccountLink address={invoice.client} />
      </HStack>
      <HStack mb='.5rem' justifyContent='space-between' fontSize='sm'>
        <Text fontWeight='bold' fontFamily='jetbrains'>
          Raid Party:
        </Text>
        <AccountLink address={raidParty} />
      </HStack>
      <HStack mb='.5rem' justifyContent='space-between' fontSize='sm'>
        <Text fontWeight='bold' fontFamily='jetbrains'>
          Resolver:
        </Text>
        <AccountLink address={invoice.resolver} />
      </HStack>
    </>
  );
};
