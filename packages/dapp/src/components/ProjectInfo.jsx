import { Flex, Heading, Box, Link, Text } from '@chakra-ui/react';

import { theme } from '../theme/theme';

export const ProjectInfo = ({ context }) => {
  return (
    <Flex direction='column' alignItems='flex-start'>
      <Heading size='md' fontFamily='jetbrains' color='red'>
        {context.client_name}
      </Heading>

      <Heading
        size='lg'
        fontFamily='rubik'
        color='white'
        maxWidth='300px'
        isTruncated
      >
        {context.project_name}
      </Heading>

      <Box marginTop='15px' marginBottom='.7rem' fontFamily='jetbrains'>
        <Text color='#a7a9be'>Start: {context.start_date.split('T')[0]}</Text>
        <Text color='#a7a9be'>Planned End: {context.end_date}</Text>
      </Box>

      <Link
        href={context.link_to_details}
        target='_blank'
        rel='noopener noreferrer'
        color={`${theme.colors.purpleLight}`}
        textDecoration='underline'
        fontFamily='jetbrains'
        marginBottom='.5rem'
      >
        Link to project doc provided
      </Link>
    </Flex>
  );
};
