# Living IT - Homepage

## Contributing

Create a feature branch (i.e. `feature/my-cool-feature`). When done, push your feature branch to Github and open a pull request. Wait for any required tests (if any) to go through, and either merge yourself or request the approval from a team member.

## Deployment

### Deploy to development

Dev URL is https://dev.livingit.se. Commits and merges to `master` will automatically be deployed here.

### Deploy to production

In order to deploy to production, you must publish a [release via Github](https://github.com/LivingIT/livingit.se/releases). We have an automatic workflow that pulls the titles of merged PR:s into a draft release note. Edit this note and add any manual notes if needed and then publish the release. This will trigger the workflow that pushes to production.
