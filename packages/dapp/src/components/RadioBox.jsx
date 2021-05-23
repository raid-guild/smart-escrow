import { Box, useRadio, useRadioGroup, HStack, VStack } from '@chakra-ui/react';

// 1. Create a component that consumes the `useRadio` hook
function RadioCard(props) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as='label'>
      <input {...input} />
      <Box
        {...checkbox}
        cursor='pointer'
        color='#7f5af0'
        boxShadow='md'
        border='1px solid #7f5af0'
        borderRadius='md'
        fontFamily="'JetBrains Mono', monospace"
        _checked={{
          bg: '#7f5af0',
          color: 'white',
          borderColor: 'teal.600'
        }}
        px={2}
        py={2}
      >
        {props.children}
      </Box>
    </Box>
  );
}

// Step 2: Use the `useRadioGroup` hook to control a group of custom radios.
export const RadioBox = (props) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: props.name,
    defaultValue: props.defaultValue,
    onChange: (e) => {
      props.updateRadio(e);
    }
  });

  const group = getRootProps();

  return props.stack === 'vertical' ? (
    <VStack {...group} style={{ alignItems: 'inherit' }}>
      {props.options.map((value) => {
        const radio = getRadioProps({ value });
        return (
          <RadioCard key={value} {...radio}>
            {value}
          </RadioCard>
        );
      })}
    </VStack>
  ) : (
    <HStack {...group}>
      {props.options.map((value) => {
        const radio = getRadioProps({ value });
        return (
          <RadioCard key={value} {...radio}>
            {value}
          </RadioCard>
        );
      })}
    </HStack>
  );
};
