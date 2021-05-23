import chakraTheme from '@chakra-ui/theme';
import { css } from '@emotion/react';

import Calendar from './assets/calendar.svg';
import CalendarRed from './assets/calendar-red.svg';

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

export const globalStyles = css`
  /*
    This will hide the focus indicator if the element receives focus via the mouse,
    but it will still show up on keyboard focus.
  */
  input[type='date']::-webkit-calendar-picker-indicator {
    opacity: 1;
    display: block;
    background: url(${Calendar}) no-repeat;
    background-size: contain !important;
    width: 14px;
    height: 14px;
    border-width: thin;
    cursor: pointer;
    transition: background 0.25s;
    &:hover {
      background: url(${CalendarRed}) no-repeat;
      background-size: contain;
    }
    &:hover,
    &:focus,
    &:active {
      background-size: contain;
      outline: none;
    }
  }
`;
