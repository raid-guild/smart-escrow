import { HStack, Text } from '@chakra-ui/react';

import { AccountLink } from '../shared/AccountLink';

export const InvoiceMetaDetails = ({ invoice }) => {
  return (
    <>
      <HStack mb='.5rem' mt='2rem' justifyContent='space-between' fontSize='sm'>
        <Text fontWeight='bold' fontFamily='jetbrains'>
          Safety Valve Date:
        </Text>
        <Text>{new Date(invoice.terminationTime * 1000).toDateString()}</Text>
      </HStack>
      <HStack mb='.5rem' justifyContent='space-between' fontSize='sm'>
        <Text fontWeight='bold' fontFamily='jetbrains'>
          Client Address:
        </Text>
        <AccountLink address={invoice.client} />
      </HStack>
      <HStack mb='.5rem' justifyContent='space-between' fontSize='sm'>
        <Text fontWeight='bold' fontFamily='jetbrains'>
          Provider Address:
        </Text>
        <AccountLink address={invoice.provider} />
      </HStack>
      <HStack mb='.5rem' justifyContent='space-between' fontSize='sm'>
        <Text fontWeight='bold' fontFamily='jetbrains'>
          Arbitration Provider:
        </Text>
        <AccountLink address={invoice.resolver} />
      </HStack>
    </>
  );
};
