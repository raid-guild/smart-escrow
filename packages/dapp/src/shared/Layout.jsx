import { Flex } from '@chakra-ui/react';

import { Header } from './Header';
import { Footer } from './Footer';

import BackgroundImage from '../assets/raid__cloud__castle.png';

export const Layout = ({ children }) => {
  return (
    <Flex
      position='relative'
      w='100%'
      direction='column'
      justify='center'
      align='center'
      bg='black'
      h='100%'
      minH='100vh'
      overflowX='hidden'
      bgImage={`url(${BackgroundImage})`}
      bgSize='cover'
      color='red.500'
    >
      <Header />
      {children}
      <Footer />
    </Flex>
  );
};
