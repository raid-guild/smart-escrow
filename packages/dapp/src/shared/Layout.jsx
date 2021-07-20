import { Flex } from '@chakra-ui/react';

import { Header } from './Header';
import { Footer } from './Footer';

import BackgroundImage from '../assets/raid__cloud__castle.png';

export const Layout = ({ children }) => {
  return (
    <Flex
      position='relative'
      w='100%'
      h='100%'
      minH='100vh'
      direction='column'
      justify='center'
      align='center'
      bg='black'
      overflowX='hidden'
      bgImage={`url(${BackgroundImage})`}
      bgSize='cover'
      color='red'
      p='1rem'
    >
      <Flex
        w='100%'
        h='100%'
        minH='100vh'
        direction='column'
        alignItems='center'
        justifyContent='space-between'
        style={{ backdropFilter: 'blur(.5rem)' }}
        border='2px solid'
        borderColor='red'
      >
        <Header />
        {children}
        <br />
        <Footer />
      </Flex>
    </Flex>
  );
};
