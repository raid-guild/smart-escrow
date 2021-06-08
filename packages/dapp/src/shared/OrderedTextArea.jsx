import { VStack, Flex, Text, Tooltip, Textarea } from '@chakra-ui/react';
import { QuestionIcon } from '../icons/QuestionIcon';

export const OrderedTextarea = ({
  label,
  value,
  setValue,
  infoText,
  tooltip,
  placeholder,
  maxLength,
  isDisabled = false,
  type = 'text'
}) => {
  return (
    <VStack w='100%' spacing='0.5rem' justify='space-between' color='red.500'>
      <Flex justify='space-between' w='100%'>
        <Text fontFamily='jetbrains' fontWeight='700' color='red'>
          {label}
        </Text>
        <Flex>
          {infoText && <Text fontSize='xs'>{infoText}</Text>}
          {tooltip && (
            <Tooltip label={tooltip} placement='auto-start'>
              <QuestionIcon ml='1rem' boxSize='0.75rem' color='red' />
            </Tooltip>
          )}
        </Flex>
      </Flex>
      <Textarea
        bg='black'
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        color='white'
        border='none'
        isDisabled={isDisabled}
        h='4rem'
        resize='none'
        maxLength={maxLength}
      />
    </VStack>
  );
};
