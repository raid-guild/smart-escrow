import { Flex } from '@chakra-ui/react';

import { theme } from '../theme';

export const Container = ({ children, overlay, ...props }) => {
  return (
    <Flex
      justify='center'
      align='center'
      direction='column'
      w='calc(100% - 2rem)'
      h='100%'
      flex={1}
      m='1rem'
      border={`2px solid ${theme.colors.guildRed}`}
      {...props}
    >
      {children}
    </Flex>
  );
};
