# Living IT - Homepage

## Contributing 🛠

Create a feature branch (i.e. `feature/my-cool-feature`). When done, push your feature branch to Github and open a pull request. Wait for any required tests (if any) to go through, and either merge yourself or request the approval from a team member.

## Branches 🌱

There only two base branches in this repo that are protected (i.e. you shall not delete them):

* **`master`** – Any commits merged to this branch will be deployed automatically to our dev enviroment
* **`gh-pages`** – Special branch that Github Actions automatically deploys to in order for Github Pages to serve the website. _Do not touch this branch in any way. Do not clone it or try to push to it._

## Deployment 🚀

### Deploy to development

Merges to `master` will automatically be deployed to our development environment on Github Pages. The URL for dev is https://dev.livingit.se.

### Deploy to production

In order to deploy to production, you must publish a [release via Github](https://github.com/LivingIT/livingit.se/releases). We have an automatic workflow that pulls the titles of merged PR:s into a draft release note. Edit this note and add any manual notes if needed and then publish the release. This will trigger the action that pushes to production.

### Something is not working as I expected it to

First, check the [Actions](https://github.com/LivingIT/livingit.se/actions) tab to see if any of the workflows have run into an error. All jobs have a log output that you can use to debug.
