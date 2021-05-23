import { Flex, Link, Text } from '@chakra-ui/react';
import { utils } from 'ethers';
import React, { useContext, useEffect, useState } from 'react';

import { AppContext } from '../context/AppContext';

import { theme } from '../theme';
import { getProfile } from '../utils/3box';

import { explorerUrls } from '../utils/constants';

const getExplorerUrl = (chainId) => explorerUrls[chainId] || explorerUrls[4];
const getAddressLink = (chainId, hash) =>
  `${getExplorerUrl(chainId)}/address/${hash}`;

export const AccountLink = ({
  address: inputAddress,
  chainId: inputChainId
}) => {
  const context = useContext(AppContext);

  const address = inputAddress.toLowerCase();
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
      bgColor='black30'
      px='0.25rem'
      _hover={{
        textDecor: 'none',
        bgColor: 'white20'
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
      <Text as='span' pl='0.25rem' fontSize='sm' maxW='15rem' isTruncated>
        {displayString}
      </Text>
    </Link>
  );
};
