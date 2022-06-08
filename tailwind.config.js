const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

module.exports = {
  darkMode: 'class', // 'media' (default) or 'class'
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      //fontFamily: { // not used at the moment
      //  //sans: ['Raleway', ...defaultTheme.fontFamily.sans],
      //  sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      //},

      maxWidth: {
        '1/2': '50%',
        '6/10': '60%',
        '7/10': '70%',
      },
      backdropBlur: {
        xs: '2px',
      },

      fontSize: {
        0: ['0', { // text-0 => font-size:0; line-height: 0;
          lineHeight: '0',
        }],
      },
      width: {

        //useful
        '1/8': '12.5%',
        '2/8': '25%',
        '3/8': '37.5%',
        '4/8': '50%',
        '5/8': '62.5%',
        '6/8': '75%',
        '7/8': '87.5%',

        //for testing
        '1/9': '11.111111%',
        '2/9': '22.222222%',
        '3/9': '33.333333%',
        '4/9': '44.444444%',
        '5/9': '55.555556%',
        '6/9': '66.666667%',
        '7/9': '77.777778%',
        '8/9': '88.888889%',

        //useful
        '1/10': '10%',
        '2/10': '20%',
        '3/10': '30%',
        '4/10': '40%',
        '5/10': '50%',
        '6/10': '60%',
        '7/10': '70%',
        '8/10': '80%',
        '9/10': '90%',


        //for testing
        '1/16': '6.25%',
        '1/18': '5.555556%',
        '1/20': '5%',
      },
      screens: { // for a "square" behaviour make sure those values match the min-width values (in this case from next.js)
        'sm-y': { 'raw': '(min-height: 640px)' },
        // => @media (min-height: 640px) { ... }

        'md-y': { 'raw': '(min-height: 768px)' },
        // => @media (min-height: 768px) { ... }

        'lg-y': { 'raw': '(min-height: 1024px)' },
        // => @media (min-height: 1024px) { ... }

        'xl-y': { 'raw': '(min-height: 1280px)' },
        // => @media (min-height: 1280px) { ... }

        '2xl-y': { 'raw': '(min-height: 1536px)' },
        // => @media (min-height: 1536px) { ... }


        'xl-y-max': { 'raw': '(max-height: 1535px)' },
        'lg-y-max': { 'raw': '(max-height: 1279px)' },
        'md-y-max': { 'raw': '(max-height: 1023px)' },
        'sm-y-max': { 'raw': '(max-height: 767px)' },
        'xs-y-max': { 'raw': '(max-height: 639px)' },
        // => @media (max-height: 639px) { ... }

        '2xs-y-max': { 'raw': '(max-height: 479px)' },
        // => @media (max-height: 479px) { ... }
        '3xs-y-max': { 'raw': '(max-height: 280px)' },


        'xs': {'max': '639px'}, //default works with min-width but as an exception (even though mobile-first) this works just fine
        // => @media (max-width: 639px) { ... }
        '2xs': {'max': '479px'}, //default works with min-width but as an exception (even though mobile-first) this works just fine
        // => @media (max-width: 479px) { ... }


        'aspect-min-3/2': { 'raw': '(min-aspect-ratio: 3/2)' },
        'aspect-min-16/9': { 'raw': '(min-aspect-ratio: 16/9)' },
        'aspect-min-16/10': { 'raw': '(min-aspect-ratio: 16/10)' },
        'aspect-min-9/16': { 'raw': '(max-aspect-ratio: 9/16)' }, //not a typo... it just behaves that way when w<h
        'aspect-min-4/3': { 'raw': '(min-aspect-ratio: 4/3)' },
        'aspect-min-3/4': { 'raw': '(max-aspect-ratio: 3/4)' }, //not a typo... it just behaves that way when w<h
        'aspect-max-3/2': { 'raw': '(max-aspect-ratio: 3/2)' },
      },

      aspectRatio: {
        golden: '1.618034',  // usage (1.618/1): aspect-w-golden aspect-h-1  || (1/1.618): aspect-w-1 aspect-h-golden
        //golden2: '0.618034', // same result as 'golden' - usage (1/0.618): aspect-w-1 aspect-h-golden2 || (0.618/1): aspect-w-golden2 aspect-h-1
      },

      padding: {
        //full: '100%', // just use pb-[100%] instead to not make things confusing ('full' looks too much like a default)
        golden: '161.8034%',
        golden2: '61.8034%',
      }


    },

    // when you want to use both approaches all (used) values have to be set again
    //aspectRatio: {
    //  auto: 'auto',
    //  square: '1',
    //  video: '16 / 9',
    //  golden: '1.618034',
    //  goldenB: '0.618034',
    //  golden2: '377 / 233', // fibonacci (NOT golden ratio but close enough)
    //  golden2B: '233 / 377', // fibonacci (NOT golden ratio but close enough)
    //  //1: '1',
    //  //2: '2',
    //  3: '3',
    //  4: '4',
    //  //5: '5',
    //  //6: '6',
    //  //7: '7',
    //  //8: '8',
    //  9: '9',
    //  10: '10',
    //  //11: '11',
    //  //12: '12',
    //  //13: '13',
    //  //14: '14',
    //  //15: '15',
    //  16: '16',
    //},


  },
  variants: {
    extend: {},
  },
  corePlugins: {
    aspectRatio: false, // disabled to avoid conflicts with the native "aspect-ratio" from tailwind v3 in favour of the @tailwindcss/aspect-ratio plugin
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'), // generates "base" (form elements are styled globally) + "class" (form-* classes must be added manually)
    //require('@tailwindcss/forms')({
    //  //strategy: 'base', // only generate global styles
    //  strategy: 'class', // only generate classes
    //})

    // or use https://github.com/SamGoody/tailwind-children when out of alpha
    plugin(function({ addVariant }) {
      // dangerously works on unknown children (like next/image)
      addVariant('children', '& > *');
      addVariant('children-hover', '& > *:hover');

      // adding styles to parent adds them to the .child (which could be nested)
      // TODO rename this somehow
      addVariant('parent', '& .child');
      addVariant('parent-hover', '& .child:hover');
      addVariant('parent-child-hover', '&:hover .child'); // like group (parent) and group:hover (on all children)
    }),
  ],
}
