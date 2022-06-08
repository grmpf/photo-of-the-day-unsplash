
<div align="center">

  ## <a href="#readme"><img valign="bottom" width="32px" height="32px" src="/src/assets/favicon/faviconPrd/favicon.svg?raw=true&sanitize=true" /></a>&nbsp; Photo of the Day [POTD]
**With [API](https://unsplash.com/documentation) and [Photos](https://unsplash.com/collections/1459961) by [Unsplash](https://unsplash.com)**
<!--
  [![GitHub last commit](https://img.shields.io/github/last-commit/grmpf/photo-of-the-day-unsplash?styleXY=for-the-badge&labelColorXY=000000&label=Last%20commit)](https://github.com/grmpf/photo-of-the-day-unsplash/commits/master)
-->
  [![GitHub Workflow Status](https://img.shields.io/github/workflow/status/grmpf/photo-of-the-day-unsplash/cron-6am-daily?label=Revalidation%20Cron%20@%206am&logo=github&labelColorXY=000000)](https://github.com/grmpf/photo-of-the-day-unsplash/actions/workflows/cron-6am.yaml)

</div>


> ℹ️ Actually, "Photo of Yesterday" or "Photo of the Day before" would be accurate.
> The photo collection used as source is an archive of POTD images and therefore always one day behind.
>
> To keep things simple, this app uses the most recent image (**from yesterday**) as the current POTD ~~but shows the date it was POTD on unsplash.com~~.
> **Assuming** a new photo is added to their collection every single day 🤞

> ⚠️ In the current state, this project goes against the [Unsplash usage guidelines](https://help.unsplash.com/en/articles/2511245-unsplash-api-guidelines) and is only meant for testing and demonstration purposes.
> Which is why this project stays in "demo mode" with an API rate-limited of 50 requests per hour (which should never be reached when (re)generating statically).


<table>
<tr>
  <th width="50%">

  Current Metrics

  </th>
  <th width="50%">

  [Social Share Image](docs/share-imgs.md) (demo)

  </th>
</tr>

<tr>
  <td>

[![Metrics](https://metrics.lecoq.io/grmpf?template=classic&base.header=0&base.activity=0&base.community=0&base.repositories=0&base.metadata=1&pagespeed=1&pagespeed.url=https%3A%2F%2Fphoto-of-the-day-unsplash.vercel.app&pagespeed.detailed=false&pagespeed.screenshot=true&config.timezone=Europe%2FZurich&config.animations=false)](#)

  </td>
  <td>

[![Share Image](src/assets/share-demo/photo-1617396900799-f4ec2b43c7ae-og.jpg)](#)  

  </td>
</tr>
</table>


## Contains

- [Next.js](https://nextjs.org) setup with [TailwindCss](https://tailwindcss.com/) + [SCSS](https://sass-lang.com)
- Best Practice:
  - [x] SEO, Meta Tags, JsonLD, OpenGraph  
  + [ ] Icons, SVG (soon)
- Improved `next/image` handling (still simple but with predictable behaviour... W.I.P.)
- Some testing/debugging comments - free of charge :)

## TODOs / Further Improvements

- [ ] Dark-Mode toggle (light switch?) + styles
- [ ] Change url slugs to e.g. /2nd and /3rd (something more meaningful than /1 /2).
- [ ] Version with multiple images on the wall and loading more images when "walking" along (as a single page app).
- [ ] Cleanup/refactor meta tags, JsonLD, OpenGraph implementation.
- [ ] [Known Issue #1+2](#known-issues): Revalidate (at most once a day) after a new photo has been added to the collection.
- [ ] [Known Issue #3](#known-issues): Should be resolved after some more [research](https://github.com/grmpf/vanilla-icontest-pwa/) on the matter.
- [ ] Upgrade to React v18
- [ ] Finish next/image research of all possible combinations and pitfalls (will be resolved with another project).
- [ ] Compare/replace `@ctrl/tinycolor` with `colord`
- [ ] ...

## Known issues

1. It's unknown at what time a new photo will be added (manually?) to the POTD archive collection.  
   This could be improved by periodically checking the API for a new image.
1. It's unknown on which dates those photos where added to said collection.
1. Currently, there are some icon display problems (padding) on android home screens.

-----

## Setup

1. Create an Unsplash Account and create a new [Unsplash Application](https://unsplash.com/oauth/applications)
   1. Provide an application name and description
   1. Add generated "Access Key" to `.env.local` as `UNSPLASH_CLIENTID`.
1. Create a new [GitHub Repository Secret](https://github.com/YOUR_USER/YOUR_REPO/settings/secrets/actions "Link needs to be adapted") (Repo Settings > Secrets > Actions > Repository secrets)
   1. Use the name `GH_REPO_SECRET_KEY` and add the value to `.env.local` as `GH_REPO_SECRET_KEY`.  
   **P.S.** You have to generate or type in a custom key (avoid `$` if possible or escape it [`\$`] in `.env.local`). 

## Installation

- ```bash
  yarn install
  ```
  With `sharp` to optimize images (squoosh is used otherwise which is enough and default for Next.js on DEV; `sharp` is installed by default on **Vercel** servers)

- ```bash
  yarn install --ignore-optional
  ```
  Without `sharp`



## Run locally

```bash
yarn dev
```

## Deploy your own

[![Deploy to Vercel](https://img.shields.io/badge/Deploy_to-Vercel-1966D2?&logo=vercel&style=for-the-badge)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fgrmpf%2Fphoto-of-the-day-unsplash&env=UNSPLASH_CLIENTID,GH_REPO_SECRET_KEY,NEXT_PUBLIC_HOST,NEXT_PUBLIC_UNSPLASH_APP_NAME&envDescription=Check%20link%20for%20details%20-%3E&envLink=https%3A%2F%2Fgithub.com%2Fgrmpf%2Fphoto-of-the-day-unsplash%2Fblob%2Fmaster%2Fdocs%2Fenv-vars.md&project-name=photo-of-the-day-unsplash&repo-name=photo-of-the-day-unsplash&demo-title=Photo%20of%20the%20Day&demo-description=A%20statically%20generated%20site%20showing%20the%20last%203%20images%20(by%20Unsplash).&demo-url=https%3A%2F%2Fphoto-of-the-day-unsplash.vercel.app&demo-image=https%3A%2F%2Fraw.githubusercontent.com%2Fgrmpf%2Fphoto-of-the-day-unsplash%2Fmaster%2Fpublic%2Fassets%2Fscreenshots%2Fscreenshot-1.jpg)

-----

## Docs / Links

- [/docs/...](docs#readme)
- [Unsplash API](https://unsplash.com/documentation)
  - [imgix API](https://docs.imgix.com/apis/rendering) which the Unsplash API is based on.
- Revalidation / Regeneration
  - [Incremental Static Regeneration](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration#on-demand-revalidation-beta)
  - [Demo Repo](https://github.com/leerob/on-demand-isr)
- [CronJob with Auth](https://vercel.com/docs/concepts/solutions/cron-jobs)
- [GitHub Workflows](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Open Graph](https://ogp.me/)
- [Twitter Cards 1](https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started)
  / [Twitter Cards 2](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary-card-with-large-image)
- [JsonLD](https://schema.org/)


