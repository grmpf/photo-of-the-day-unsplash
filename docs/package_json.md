# Scripts

## Defaults

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "analyze": "ANALYZE=true next build",
    "start": "next start"
  }
}
```

## favicon.ico/.svg

Copies DEV/PRD favicons on postinstall/prebuild.  
This help to differentiate between browser tabs from DEV and PRD. Use colors (not gray) and/or text to make it obvious.

TODO: Move this to a script and add NODE_ENV check.

```json
{
  "scripts": {
    "cpFavDev": "cp ./src/assets/favicon/faviconDev/favicon.ico ./public/favicon.ico && cp ./src/assets/favicon/faviconDev/favicon.svg ./public/favicon.svg",
    "cpFavPrd": "cp ./src/assets/favicon/faviconPrd/favicon.ico ./public/favicon.ico && cp ./src/assets/favicon/faviconPrd/favicon.svg ./public/favicon.svg",
    "postinstall": "yarn cpFavDev",
    "prebuild": "yarn cpFavPrd"
  }
}
```

## Sitemap Ping

### With Vercel domain - `npm_package_name.vercel.app`

Built for Vercel w/o custom domain (IF the name is unique aka not used yet).  
Run `sitemapPing` ONCE when pushed to PRD.

TODO: Move this to a script.

```json5
{
  "scripts": {
    "sitemapPingGoogle": "curl -isSL -o /dev/null -w \"\\n%{http_code}\\n\" \"https://www.google.com/ping?sitemap=https%3A%2F%2F${npm_package_name}.vercel.app%2Fsitemap.xml\"; echo \"Exit code: $?\"; echo ''",
    //Bing-Ping doen't work anymore
    //"sitemapPingBing": "curl -isSL -o /dev/null -w \"\\n%{http_code}\\n\" \"https://www.bing.com/webmaster/ping.aspx?siteMap=https%3A%2F%2F${npm_package_name}.vercel.app%2Fsitemap.xml\"; echo \"Exit code: $?\"; echo ''",
    //"sitemapPing": "yarn sitemapPingGoogle; yarn sitemapPingBing"
    "sitemapPing": "yarn sitemapPingGoogle"
  }
}
```

### With custom domain - `www.example.com`

TODO: Move this to a script.

```json
{
  "scripts": {
    "sitemapPingGoogle": "curl -isSL -o /dev/null -w \"\\n%{http_code}\\n\" \"https://www.google.com/ping?sitemap=https%3A%2F%2Fwww.example.com%2Fsitemap.xml\"; echo \"Exit code: $?\"; echo ''",
    "sitemapPingBing": "curl -isSL -o /dev/null -w \"\\n%{http_code}\\n\" \"https://www.bing.com/webmaster/ping.aspx?siteMap=https%3A%2F%2Fwww.example.com%2Fsitemap.xml\"; echo \"Exit code: $?\"; echo ''",
    "sitemapPing": "yarn sitemapPingGoogle; yarn sitemapPingBing"
  }
}
```

## Debugging

```json5
{
  "scripts": {
    // lists all env-vars
    "check-env": "node -e 'console.log(process.env)'",
    // lists all npm env-vars
    "check-env-npm": "node -e 'console.log(process.env)' | grep npm",
    // echos the possible domain generated when deploying to vercel the first time (if not already in use). The actual domain is therefore unknown beforehand (unless a custom domain is used)
    "check-vercel-domain": "echo ${npm_package_name}.vercel.app",

    // show file meta data (recursively)
    "showMeta": "xattr -rs ./public",
    // remove all file meta data (recursively)
    "clearMeta": "xattr -crs ./public"
  }
}
```

