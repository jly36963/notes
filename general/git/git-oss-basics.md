# Git and OSS

## Contributing

### About PRs

https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests

### Creating PRs

https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request

### PR from fork

https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork

### Syncing a fork

https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/syncing-a-fork

### Configuring a fork

https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/configuring-a-remote-for-a-fork

## Example (yargs)

```sh
# ---
# Fork
# ---

# Manual step: fork in github

# Clone locally
git clone git@github.com:jly36963/yargs.git
# Specify new remote upstream repo for sync
git remote add upstream https://github.com/yargs/yargs.git
# Check remotes
git remote -v

# ---
# Sync
# ---

# There is a 'fetch upstream' button on github, in the forked repo

# Fetch upstream branches
git fetch upstream
# Checkout fork's local default branch
git checkout master
# Merge from upstream default branch
git merge upstream/master
# Sync fork in github
git push

# ---
# PR from fork
# ---

# Go to upstream repo, click "Pull Request"
# On compare page, click "compare across forks"
# In "base branch" drop-down menu, select the branch of the upstream repo to merge into
# In "head fork" and "compare branch drop-down menus, select your fork and branch
# Add title & description to PR
# Create PR or draft
# Request review
```
