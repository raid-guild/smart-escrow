import chakraTheme from '@chakra-ui/theme';

export const theme = {
  ...chakraTheme,
  initialColorMode: 'dark',
  useSystemColorMode: false,
  colors: {
    ...chakraTheme.colors,
    guildRed: '#ff3864',
    grey: '#A4A4A4',
    borderGrey: '#505050',
    greyText: '#ABABAB',
    purple: '#7f5af0',
    red50: 'rgba(255, 56, 100, 0.5)'
  },
  fonts: {
    ...chakraTheme.fonts,
    mono: `'Rubik Mono One', sans-serif`,
    heading: `'Rubik One', sans-serif`,
    jetbrains: `'JetBrains Mono', monospace`,
    texturina: `'Texturina', serif`,
    body: `'Roboto', sans-serif`
  }
};
