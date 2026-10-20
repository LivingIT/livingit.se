# Deployment

The site runs as Cloudflare Workers, deployed only by
[the deploy workflow](../../.github/workflows/deploy.yml). Never deploy with
`wrangler deploy` from a checkout.

## Environments

| Branch    | Environment | URL                                        | Worker        | API                       |
| --------- | ----------- | ------------------------------------------ | ------------- | ------------------------- |
| `develop` | Staging     | [devingit.se](https://devingit.se)         | `devingit-se` | `https://api.devingit.se` |
| `main`    | Production  | [livingit.se](https://livingit.se)         | `livingit-se` | `https://api.livingit.se` |

A push to either branch builds the site, patches the generated
`dist/server/wrangler.json` with that environment's Worker name and API URL,
and deploys it. Staging tells search engines not to index it. There are no
pull request previews.

## Promoting to production

A maintainer opens a pull request from `develop` to `main` once staging has
been checked, and merges it; the merge deploys production.

Dependabot pull requests to `develop` are built and merged automatically by
[their workflow](../../.github/workflows/dependabot-auto-merge.yml).

## Secrets

`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` and
`PUBLIC_TURNSTILE_SITE_KEY` are GitHub Actions secrets. `API_SECRET_KEY` and
`TURNSTILE_SECRET_KEY` are Worker secrets, set with `wrangler secret put` by
someone with access to the Cloudflare account.
