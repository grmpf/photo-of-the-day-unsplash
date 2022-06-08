## Required Environment Variables

|Name|Example|Desc|
|---|---|---|
| `NEXT_PUBLIC_HOST` | `https://<reponame>.vercel.app` OR `https://<reponame>-<verceluser>.vercel.app`  | The domain of the application `https://subdomain.domain.tld` |
| `UNSPLASH_CLIENTID` |  | Key for using the Unsplash API.<br />**Requires**: [Unsplash-Account](https://unsplash.com/oauth/applications) + [-Application](https://unsplash.com/oauth/applications) |
| `NEXT_PUBLIC_UNSPLASH_APP_NAME` | `your_app_name` | Unsplash wants this added on backlinks (unclear for what because it's not unique) |
| `GH_REPO_SECRET_KEY` |  | Used for "On-Demand Incremental Static Regeneration" to work on PRD.<br />**Requires**: [API Endpoint](../src/pages/api/revalidate/potd/[[...nr]].ts) + [GitHub Repository Secret](https://github.com/grmpf/on-demand-isr/settings/secrets/actions) (Repo Settings > Secrets > Actions > Repository secrets) |

## Env File

For local developement copy/rename the file [`.env.local.example`](../.env.local.example) to [`.env.local`](../.env.local) and adjust it's content.

