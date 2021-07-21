import { extendTheme } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';

import { Heading } from './components/Heading';
import { Text } from './components/Text';
import { Button } from './components/Button';

// import { logos, illustrations } from '../utils/constants';

import Calendar from '../assets/calendar.svg';
import CalendarRed from '../assets/calendar-red.svg';

const breakpoints = createBreakpoints({
  base: '320px',
  md: '580px',
  lg: '1026px'
});

export const theme = extendTheme({
  colors: {
    transparent: 'transparent',
    blackDark: 'rgba(10, 10, 10, 0.960784)',
    blackLight: '#2b2c34',
    blackLighter: '#16161a',
    greyLight: '#a7a9be',
    greyDark: '#4a4a4a',
    white: '#fffffe',
    purple: '#822EA6',
    purpleLight: '#B66AD6',
    red: '#ff3864',
    yellow: '#F2E857',
    yellowDark: '#DCCF11'
  },
  fonts: {
    texturina: `'Texturina', serif`,
    jetbrains: `'JetBrains Mono', monospace`,
    rubik: `'Rubik Mono One', sans-serif`,
    uncial: `'Uncial Antiqua', cursive`,
    spaceMono: `'Space Mono', monospace;`
  },
  components: {
    Heading,
    Text,
    Button
  },
  // images: {
  //   metachilli: logos.meta_chilli,
  //   daohaus: logos.daohaus,
  //   moloch: logos.moloch,
  //   raidguild: logos.raidguild,
  //   swords: logos.swords,
  //   smartinvoice: logos.smart_invoice,
  //   wrapeth: logos.wrapeth,
  //   raidBanner: illustrations.raid_banner,
  //   raidFantasy: illustrations.raid_fantasy,
  //   clouds: illustrations.clouds,
  //   steps: illustrations.steps
  // },
  breakpoints
});

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
