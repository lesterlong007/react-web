const plugin = require('tailwindcss/plugin');

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

module.exports = {
  content: ['./src/**/*.{html,jsx,tsx}'],
  theme: {
    screens: {
      tablet: '700px',
      desktop: '1024px'
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
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
      0.5: '5px',
      1: '4px',
      1.5: '1.5px',
      2: '2px',
      2.5: '2.5px',
      3: '3px',
      3.5: '3.5px',
      4: '4px',
      5: '5px',
      6: '6px',
      7: '7px',
      8: '8px',
      9: '9px',
      10: '10px',
      11: '11px',
      12: '12px',
      14: '14px',
      16: '16px',
      20: '20px',
      24: '24px',
      28: '28px',
      32: '32px',
      36: '36px',
      40: '40px',
      44: '44px',
      48: '48px',
      52: '52px',
      56: '56px',
      60: '60px',
      64: '64px',
      72: '72px',
      80: '80px',
      96: '96px'
    },
    borderRadius: {
      DEFAULT: '1px',
      none: '0px',
      sm: '0.5px',
      md: '1.5px',
      lg: '2px',
      xl: '3px',
      '2xl': '4px',
      '3xl': '6px',
      large: '12px',
      full: '9999px',
      half: '50%',
      1: '100%'
    },
    fontSize: {
      xs: ['3px', { lineHeight: '4px' }],
      sm: ['3.5px', { lineHeight: '5px' }],
      base: ['4px', { lineHeight: '6px' }],
      lg: ['4.5px', { lineHeight: '7px' }],
      xl: ['5px', { lineHeight: '7px' }],
      '2xl': ['6px', { lineHeight: '8px' }],
      '3xl': ['7.5px', { lineHeight: '9px' }],
      '4xl': ['9px', { lineHeight: '9px' }],
      '5xl': ['12px', { lineHeight: '18px' }],
      '6xl': ['14px', { lineHeight: '20px' }],
      '7xl': ['15px', { lineHeight: '24px' }],
      '8xl': ['16px', { lineHeight: '24px' }],
      '9xl': ['17px', { lineHeight: '28px' }],
      '10xl': ['10px', { lineHeight: '15px' }],
      '12xl': ['12px', { lineHeight: '18px' }],
      '14xl': ['14px', { lineHeight: '21px' }],
      '15xl': ['15px', { lineHeight: '23px' }],
      '18xl': ['18px', { lineHeight: '27px' }],
      '20xl': ['20px', { lineHeight: '30px' }],
      '24xl': ['24px', { lineHeight: '36px' }],
      '28xl': ['28px', { lineHeight: '42px' }]
    },
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
      3: '3px',
      4: '4px',
      5: '5px',
      6: '6px',
      7: '7px',
      8: '8px',
      9: '9px',
      10: '10px'
    },
    textIndent: {
      DEFAULT: '6px',
      xs: '2px',
      sm: '4px',
      md: '6px',
      lg: '8px',
      xl: '10px',
      '2xl': '12px',
      '3xl': '16px'
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
    },
    extend: {
      screens: {
        md: '768PX'
      },
      columns: {
        ...tShirtScale,
        '3xs': '64px',
        '2xs': '72px'
      },
      height: {
        ...tShirtScale,
        fiftyFive: '55%'
      },
      maxHeight: {
        ...tShirtScale
      },
      width: {
        ...tShirtScale,
        fourtyEight: '48%',
        thirtyTwo: '32%',
        half: '50%',
        third: '33.33%'
      },
      maxWidth: {
        ...tShirtScale
      },
      perspective: {
        ...tShirtScale
      },
      spacing: {
        thirtyFive: '35%',
        fourtyEight: '48%',
        half: '50%',
        sixty: '60%',
        oneand2: '102%',
        '16PX': '16PX',
        '32PX': '32PX'
      },
      top: {
        fiftyFive: '55%'
      },
      borderRadius: {
        '8PX': '8PX',
        '10PX': '10PX',
        '12PX': '12PX',
        '16PX': '16PX',
        '20PX': '20PX',
        '60PX': '60PX'
      },
      transitionProperty: {
        height: 'height',
        'max-height': 'max-height'
      },
      fontWeight: {
        semi: 600
      },
      fontSize: {
        '11xl': ['11px', { lineHeight: '17px' }],
        '44xl': ['44px', { lineHeight: '66px' }],
        '36xl': ['36px', { lineHeight: '54px' }]
      }
    }
  },
  shortcuts: {
    'pre-28bold': 'text-28px leading-42px font-bold',
    'pre-24bold': 'text-24px leading-36px font-bold',
    'pre-20bold': 'text-20px leading-30px font-bold',
    'pre-18bold': 'text-18px leading-27px font-bold',
    'pre-15bold': 'text-15px leading-23px font-bold',
    'pre-15semi': 'text-15px leading-23px font-semibold',
    'pre-15med': 'text-15px leading-23px font-medium',
    'pre-15reg': 'text-15px leading-23px font-normal',
    'pre-14bold': 'text-14px leading-21px font-bold',
    'pre-14semi': 'text-14px leading-21px font-semibold',
    'pre-14med': 'text-14px leading-21px font-medium',
    'pre-14reg': 'text-14px leading-21px font-normal',
    'pre-12reg': 'text-12px leading-18px font-normal',
    'pre-12bold': 'text-12px leading-18px font-bold',
    'pre-12semi': 'text-12px leading-18px font-semibold',
    'pre-12med': 'text-12px leading-18px font-medium',
    'pre-11semi': 'text-11px leading-17px font-semibold',
    'pre-10bold': 'text-10px leading-15px font-bold',
    'pre-10semi': 'text-10px leading-15px font-semibold',
    'pre-10med': 'text-10px leading-15px font-medium',
    'pre-10reg': 'text-10px leading-15px font-normal'
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.pre-28bold': 'text-28px leading-42px font-bold',
        '.pre-20bold': 'text-20px leading-30px font-bold'
      });
    })
  ]
};

// tailwind 包含于windi
// react route 6.0 路由跳转仅支持hooks的方式，在非hooks中使用history库跳转，url虽然改变了，但是页面不render
// dot env只支持键值对方式，若值要设为对象，用webpack原生的DefinePlugin即可
