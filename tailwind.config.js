const plugin = require('tailwindcss/plugin');
const { getSubModuleList } = require('./scripts/common/base');

// tShirtScale describes the sizes xs - 7xl
const tShirtScale = {
  xs: '80px',
  sm: '96px',
  md: '112px',
  lg: '128px',
  xl: '144px',
  '2xl': '168px',
  '3xl': '192px',
  '4xl': '224px',
  '5xl': '156px',
  '6xl': '288px',
  '7xl': '320px'
};

const wildcard = '/src/**/*.{html,jsx,tsx}';
const contentList = getSubModuleList().map((sub) => `./${sub}${wildcard}`);

module.exports = {
  content: [`.${wildcard}`, ...contentList],
  theme: {
    screens: {
      mobile: { max: '700px' },
      tablet: '700px',
      desktop: '1024px'
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      red: '#ED1B2D',
      /* text */
      't-1': 'var(--t-1)',
      't-2': 'var(--t-2)',
      't-3': 'var(--t-3)',
      't-disable': 'var(--t-disable)',
      't-highlight': 'var(--t-highlight)',
      't-reverse-1': 'var(--t-reverse-1)',
      't-reverse-88': 'var(--t-reverse-88)',
      't-orange-1': '#FF872E',
      /* backgroud */
      'b-1': 'var(--b-1)',
      'b-2': 'var(--b-2)',
      'b-5': 'var(--b-5)',
      'f-1': 'var(--f-1)',
      'f-1-03': 'var(--f-1-03)',
      'f-2': 'var(--f-2)',
      'f-3': 'var(--f-3)',
      'f-4': 'var(--f-4)',
      'f-5': 'var(--f-5)',
      'f-6': 'var(--f-6)',
      'f-7': 'var(--f-7)',
      'f-8': 'var(--f-8)',
      /* s */
      's-1': 'var(--s-1)',
      's-2': 'var(--s-2)',
      's-3': 'var(--s-3)',
      /* d */
      'd-1': 'var(--d-1)',
      'd-2': 'var(--d-2)',
      /* ov */
      'ov-dark-1': 'var(--ov-dark-1)',
      'ov-dark-88': 'var(--ov-dark-88)',
      'ov-dark-04': 'var(--ov-dark-04)',
      'ov-black-44': 'var(--ov-black-44)',
      'f-5-50': 'var(--f-5-50)',
      /* brand colors */
      'primary-1': 'var(--primary-1)',
      'primary-2': 'var(--primary-2)',
      'primary-3': 'var(--primary-3)',
      'primary-4': 'var(--primary-4)',
      'primary-5': 'var(--primary-5)',
      /* positive */
      'positive-1': 'var(--positive-1)',
      'positive-5': 'var(--positive-5)',
      /* negative */
      'negative-1': 'var(--negative-1)',
      'negative-5': 'var(--negative-5)',
      /* warning */
      'warning-1': 'var(--warning-1)',
      'warning-5': 'var(--warning-5)',
      /* de-yellow */
      'de-yellow-1': 'var(--de-yellow-1)',
      'de-yellow-5': 'var(--de-yellow-5)',
      /* de-orange */
      'de-orange-1': 'var(--de-orange-1)',
      'de-orange-1-03': 'var(--de-orange-1-03)',
      'de-orange-5': 'var(--de-orange-5)',
      /* de-green */
      'de-green-1': 'var(--de-green-1)',
      'de-green-1-03': 'var(--de-green-1-03)',
      'de-green-5': 'var(--de-green-5)',
      /* de-teal */
      'de-teal-1': 'var(--de-teal-1)',
      'de-teal-5': 'var(--de-teal-5)',
      /* de-sky */
      'de-sky-1': 'var(--de-sky-1)',
      'de-sky-5': 'var(--de-sky-5)',
      /* de-blue */
      'de-blue-1': 'var(--de-blue-1)',
      'de-blue-5': 'var(--de-blue-5)',
      /* de-purple */
      'de-purple-1': 'var(--de-purple-1)',
      'de-purple-5': 'var(--de-purple-5)',
      /* ch */
      'ch-1': 'var(--ch-1)',
      'ch-2': 'var(--ch-2)',
      'ch-3': 'var(--ch-3)',
      'ch-4': 'var(--ch-4)',
      'ch-5': 'var(--ch-5)',
      'ch-6': 'var(--ch-6)',
      'ch-7': 'var(--ch-7)',
      'ch-8': 'var(--ch-8)',
      'ov-black-64': 'var(--ov-black-64)',
      'de-red-1': 'var(--de-red-1)',
      'de-red-5': 'var(--de-red-5)',
      'f-reverse-1': 'var(--f-reverse-1)',
      'f-reverse-88': 'var(--f-reverse-88)',
      'f-reverse-24': 'var(--f-reverse-24)',
      'bu-primary-1': 'var(--bu-primary-1)',
      'bu-primary-2': 'var(--bu-primary-2)',
      'to-1': 'var(--to-1)',
      'tag-t-orange-1': 'var(--tag-t-orange-1)',
      'tag-bg-orange-1': 'var(--tag-bg-orange-1)'
    },
    spacing: {
      px: '1px',
      0: '0px',
      2: '2px',
      4: '4px',
      6: '6px',
      8: '8px',
      10: '10px',
      12: '12px',
      14: '14px',
      16: '16px',
      20: '20px',
      24: '24px',
      28: '28px',
      32: '32px'
    },
    boxShadow: {
      DEFAULT: '0px 8px 24px 0px rgba(0, 0, 0, 0.08)',
      upwards: '0px -8px 24px 0px rgba(0, 0, 0, 0.08)',
      sm: '0px 4px 16px 0px rgba(0, 0, 0, 0.04)',
      lg: '0px 12px 36px 0px rgba(0, 0, 0, 0.12)',
      none: 'none'
    },
    flexGrow: {
      0: 0,
      DEFAULT: 2,
      1: 1,
      '3/2': 1.5
    },
    zIndex: {
      first: 10000,
      second: 9999,
      third: 999,
      forth: 100
    }
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
};
