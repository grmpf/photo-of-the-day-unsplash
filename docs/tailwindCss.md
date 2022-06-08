## `global.scss`

### Ways to add the basics

```scss
//// Updated version v1 - still works (~ maps to node_modules but should not be used anymore)
@use '~tailwindcss/base';
@use '~tailwindcss/components';
@use '~tailwindcss/utilities';

//// Updated version v2 - future proof version - works but WebStorm gets in trouble finding things
// @use 'tailwindcss/base';
// @use 'tailwindcss/components';
// @use 'tailwindcss/utilities';

//// Updated version v1.1 - also works in WebStorm
//@use 'node_modules/tailwindcss/base.css';
//@use 'node_modules/tailwindcss/components.css';
//@use 'node_modules/tailwindcss/utilities.css';

//// Tailwind alternative
// @import "tailwindcss/base"; // @IMPORT should be on top; actually same as "@tailwind base" but intended to manually sort imports
// @import "tailwindcss/components";
// @import "tailwindcss/utilities";

//// Tailwind default (when no imports need to be above)
// @tailwind base;
// @tailwind components;
// @tailwind utilities;
```

### Info

- The use of tailwindCss with `@use` is not really official (it's not in theirs docs yet).
- `@layer` cannot be used in `*.module.scss`.
  ```
  @layer base { ...your styles... }
  @layer components { ...your styles... }
  @layer utilities { ...your styles... }
  ```

### Usage

- Add new styles to e.g. `@tailwind base`
  - Use `@layer base { ...your styles... }` in the same file.
  - OR: Use `@import _typography.scss` below `@tailwind base`.
- There is no `@layer` available in `*.module.scss`

### Plugins

- `postcss.config.js`
  - `@styled-jsx/plugin-sass`  
    Plugin to add Sass support to styled-jsx
  - `styled-jsx-plugin-postcss`  
    Plugin to add PostCSS support to styled-jsx.
- `.babelrc`
  - `postcss-import`
  - `tailwindcss`
  - `autoprefixer`

### Some links

- https://tailwindcss.com/docs/using-with-preprocessors#build-time-imports
- https://tailwindcss.com/docs/adding-custom-styles#using-css-and-layer

