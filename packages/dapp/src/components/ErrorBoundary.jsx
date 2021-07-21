import { Component } from 'react';
import { Flex, Text } from '@chakra-ui/react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    if (error) {
      return { hasError: true };
    }
    return { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      return (
        <Flex
          justify='center'
          align='center'
          direction='column'
          w='100%'
          minH='100vh'
          background='black'
          color='red.500'
        >
          <Text fontSize='lg'> Something went wrong </Text>
          <Text> Please check console for errors </Text>
        </Flex>
      );
    }
    return children;
  }
}
