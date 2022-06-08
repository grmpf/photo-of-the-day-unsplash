
## favicon.ico / favicon.svg

- `favicon.ico`: The still valid and required fallback for e.g. serving images (when in the root folder).
- `favicon.svg`: The new and nice way (when added the right way as `<link>`). Does NOT work as fallback (yet).

### Source files + package.json

- Folder `faviconDev`: contains the favicon files for the non-PRD environments.  
  The `postinstall` script will copy the DEV files _after_ each time `yarn install` has run.
  > ⚠️ Run `yarn postinstall` or `yarn install` to manually cleanup things for `yarn dev` (after running `yarn build` locally).


- Folder `faviconPrd`: contains the favicon files for the PRD environment.  
  The `prebuild` script will copy the PRD files _before_ each time `yarn build` runs.


#### package.json
```json5
{
  "name": "...",
  //...
  "scripts": {
    "cpFavDev": "cp ./src/assets/favicon/faviconDev/favicon.ico ./public/favicon.ico && cp ./src/assets/favicon/faviconDev/favicon.svg ./public/favicon.svg",
    "cpFavPrd": "cp ./src/assets/favicon/faviconPrd/favicon.ico ./public/favicon.ico && cp ./src/assets/favicon/faviconPrd/favicon.svg ./public/favicon.svg",
    "postinstall": "yarn cpFavDev",
    "prebuild": "yarn cpFavPrd",
    //...
  }
}
```

### .gitignore

> ⚠️ Make sure `./public/favicon.ico` + `./public/favicon.svg` are ignored in `.gitignore`

```gitignore
## SPECIAL HANDLING for DEV and PRD version of favicon.ico/favicon.svg
## Files will be copied on POSTINSTALL and PREBUILD
public/favicon.ico
public/favicon.svg
```
