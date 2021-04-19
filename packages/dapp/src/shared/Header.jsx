import { useContext, useEffect, useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Image,
  Text,
  Tag,
  Link as ChakraLink
} from '@chakra-ui/react';
import styled from '@emotion/styled';

import { AppContext } from '../context/AppContext';

import { Footer } from '../shared/Footer';
import { HamburgerIcon } from '../icons/HamburgerIcon';

import { getNetworkLabel, getAccountString } from '../utils/helpers';
import { getProfile } from '../utils/3box';
import { theme } from '../theme';

import Logo from '../assets/raidguild__logo.png';
import LogoText from '../assets/logo.svg';

const StyledButton = styled(Button)`
  &::after {
    box-sizing: inherit;
    transition: all ease-in-out 0.2s;
    background: none repeat scroll 0 0 ${theme.colors.red[500]};
    content: '';
    display: block;
    height: 2px;
    width: 0;
    position: absolute;
    bottom: 0;
    left: 0;
    font-family: ${theme.fonts.mono};
  }
  &:hover {
    text-decoration: none;
    ::after {
      width: 100%;
    }
  }
`;

export const NavButton = ({ onClick, children }) => (
  <StyledButton
    onClick={onClick}
    transition='all 0.5s ease 0.4s'
    my='1rem'
    variant='link'
    color='red.500'
    fontWeight='normal'
    fontSize='1.5rem'
  >
    {children}
  </StyledButton>
);

export const Header = () => {
  const { address, chainID } = useContext(AppContext);
  const [isOpen, onOpen] = useState(false);
  const history = useHistory();

  const [profile, setProfile] = useState();

  useEffect(() => {
    if (address) {
      getProfile(address).then((p) => setProfile(p));
    }
  }, [address]);

  return (
    <Flex
      w='100%'
      h='8rem'
      color='white'
      fontFamily='mono'
      position='absolute'
      top={0}
      left={0}
      justify='space-between'
      align='center'
    >
      <Box zIndex={5}>
        <RouterLink to='/'>
          <Flex align='center' p='1rem' m='1rem'>
            <Image
              src={Logo}
              alt='Raid Guild'
              w={{ base: '3rem', sm: '4rem', md: '5rem' }}
            />
            <Image
              src={LogoText}
              alt='Smart Invoice'
              h={{ base: '2rem', sm: '3rem', md: 'auto' }}
            />
          </Flex>
        </RouterLink>
      </Box>
      <Flex
        mx={{ base: '2rem', sm: '3rem' }}
        align='center'
        height='8rem'
        transition='width 1s ease-out'
      >
        {address && (
          <>
            <Flex
              borderRadius='50%'
              w='2.5rem'
              h='2.5rem'
              overflow='hidden'
              justify='center'
              align='center'
              bgColor='black'
              bgImage={profile && `url(${profile.imageUrl})`}
              border={`1px solid ${theme.colors.white20}`}
              bgSize='cover'
              bgRepeat='no-repeat'
              bgPosition='center center'
            />
            <Text
              px={2}
              display={{ base: 'none', md: 'flex' }}
              fontFamily="'Roboto Mono', monospace;"
              color='red.500'
            >
              {profile && profile.name
                ? profile.name
                : getAccountString(address)}
            </Text>
            <Tag
              colorScheme='red'
              display={{ base: 'none', md: 'flex' }}
              size='sm'
            >
              {getNetworkLabel(chainID)}
            </Tag>
          </>
        )}
        <Button
          onClick={() => onOpen((o) => !o)}
          variant='link'
          ml={{ base: '0.5rem', sm: '1rem' }}
          zIndex={7}
        >
          <HamburgerIcon
            boxSize={{ base: '2rem', sm: '2.75rem' }}
            transition='all 1s ease-out'
            _hover={{
              transition: 'all 1s ease-out',
              transform: 'rotateZ(90deg)'
            }}
            color='red.500'
          />
        </Button>
      </Flex>
      <Flex
        zIndex={6}
        position='fixed'
        left='0'
        top='0'
        bg='black'
        h='100%'
        w='100%'
        direction='column'
        justify='center'
        align='center'
        transition='all 2s ease-out'
        pointerEvents={isOpen ? 'all' : 'none'}
        css={{
          clipPath: isOpen
            ? 'circle(calc(100vw + 100vh) at 90% -10%)'
            : 'circle(100px at 90% -20%)'
        }}
      >
        <StyledButton
          onClick={() => {
            history.push('/');
            onOpen(false);
          }}
          transition='all 0.5s ease 0.4s'
          my='1rem'
          variant='link'
          color='red.500'
          fontWeight='normal'
          fontSize='1.5rem'
          fontFamily='mono'
        >
          HOME
        </StyledButton>
        <ChakraLink
          href='https://discord.gg/CanD2WcK7W'
          isExternal
          _hover={{}}
        ></ChakraLink>
        <Footer center />
      </Flex>
    </Flex>
  );
};
