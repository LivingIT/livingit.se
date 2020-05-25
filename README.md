# Living IT - Homepage

## Deploy to development

Dev URL is https://dev.livingit.se. Commits and merges to `master` will automatically be deployed here.

## Deploy to production

In order to deploy to production, you must publish a [release via Github](https://github.com/LivingIT/livingit.se/releases). We have an automatic workflow that pulls the titles of merged PR:s into a draft release note. Edit this note and add any manual notes if needed and then publish the release. This will trigger the workflow that pushes to production.
