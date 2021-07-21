import { Flex, Link, Text } from '@chakra-ui/react';
import { utils } from 'ethers';
import React, { useContext, useEffect, useState } from 'react';

import { AppContext } from '../context/AppContext';

import { theme } from '../theme/theme';
import { getProfile } from '../utils/3box';

import { getAddressLink } from '../utils/helpers';

export const AccountLink = ({
  address: inputAddress,
  chainId: inputChainId
}) => {
  const context = useContext(AppContext);

  const address =
    typeof inputAddress === 'string' ? inputAddress.toLowerCase() : '';
  const [profile, setProfile] = useState();
  const chainId = inputChainId || context.chainID;

  useEffect(() => {
    let isSubscribed = true;
    if (utils.isAddress(address)) {
      getProfile(address).then((p) =>
        isSubscribed ? setProfile(p) : undefined
      );
    }
    return () => {
      isSubscribed = false;
    };
  }, [address]);

  let displayString = address;

  let imageUrl;

  if (profile) {
    if (profile.name) {
      displayString = profile.name;
    }
    if (profile.imageUrl) {
      imageUrl = profile.imageUrl;
    }
  }

  return (
    <Link
      href={getAddressLink(chainId, address)}
      isExternal
      display='inline-flex'
      textAlign='right'
      bgColor='black'
      px='0.25rem'
      _hover={{
        textDecor: 'none',
        bgColor: 'blackLight'
      }}
      borderRadius='5px'
      alignItems='center'
      fontWeight='bold'
    >
      <Flex
        as='span'
        borderRadius='50%'
        w='1.1rem'
        h='1.1rem'
        overflow='hidden'
        justify='center'
        align='center'
        bgColor='black'
        bgImage={imageUrl && `url(${imageUrl})`}
        border={`1px solid ${theme.colors.white20}`}
        bgSize='cover'
        bgRepeat='no-repeat'
        bgPosition='center center'
      />
      <Text
        as='span'
        pl='0.25rem'
        fontSize='sm'
        maxW='12rem'
        color='white'
        isTruncated
      >
        {displayString}
      </Text>
    </Link>
  );
};
