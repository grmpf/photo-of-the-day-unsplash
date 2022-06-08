/** TESTING import SVG as component and when used in CSS
 *
 * FOR PRD, set:
 * - indent: 0
 * - pretty: false
 * - removeDoctype: true
 */


module.exports = {
  multipass: true, // boolean. false by default
  datauri: 'enc', // 'base64' (default), 'enc' or 'unenc'.
  js2svg: {
    indent: 2, // string with spaces or number of spaces. 4 by default
    pretty: true, // boolean, false by default
  },
  plugins: [
    // set of built-in plugins enabled by default
    {
      name: 'preset-default',
      params: {
        overrides: {
          // customize default plugin options
          inlineStyles: {
            onlyMatchedOnce: true,
          },

          // or disable plugins
          removeDoctype: false,
          removeTitle: true, // default: enabled
          removeDesc: true, // default: enabled
        },
      },
    },

    // enable built-in plugins by name
    //'prefixIds',

    // or by expanded notation which allows to configure plugin
    {
      name: 'sortAttrs',
      params: {
        xmlnsOrder: 'alphabetical',
      },
    },
  ],
};
