# Github

https://docs.github.com/en

## Setup

- Create account
- Set up SSH keys
  - [create ssh key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
  - [add ssh key to github](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)

## Cloning

```bash
# Clone repo
git clone <repo-url>
git clone https://github.com/tokio-rs/axum.git
```

## Creating a repo

- Method 1
  - Create new repo in github
  - Clone repo (github remote already set up)
  - make changes, commit, push
- Method 2
  - init repo locally
  - set up remote
  - make changes, commit
  - push

## Remotes

```bash
# Show remotes
git remote
git remote -v # With urls
# Add remote
git remote add <name> <url>
# Rename remote
git remote rename <old> <new>
# Remove remote
git remote remove <name>
```

## Pushing

https://git-scm.com/docs/git-push

```bash
git push # Defaults to branch.*.remote and push.default (current branch)
git push <remote> <branch>
git push -u <remote> <branch> # Set upstream
git push origin pancake:waffle # Push to different branch (local:remote)
```

## Getting from remote

- Remote tracking branch:
  - at last communication with remote, this is where _ branch was pointing
  - repr: `<remote>/<branch>`

- if local is ahead, push
- if remote is ahead, pull

```bash
# Get remote branch
git switch <existing-remote-branch>
# Pull changes (fetch & merge into current branch)
git pull # Defaults to origin, current branch
git pull origin main
# Fetch remote changes (for remote-tracking branches) without merging into working tree
git fetch # Defaults to origin, all remote-tracking branches
git fetch <remote> <branch>
```

## Access

- Private/Public
  - Settings > Options > Make repo private/public
- Add collaborators
  - Settings > Manage Access > Invite a collaborator

## Feature branch workflow

- [nvie: gitflow](https://nvie.com/posts/a-successful-git-branching-model/)
- [atlassian: feature branch](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow)
- [medium: feature branch](https://medium.com/medvine/gitflow-workflow-vs-feature-branch-workflow-8fb4c26571c5)
- [atlassian: gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [gitkraken: gitflow](https://www.gitkraken.com/learn/git/git-flow)

## PRs

TODO

## Protecting branches

- Settings > Branches > Branch protection rules > Add branch protection rule

## Rebasing

- [docs](https://git-scm.com/book/en/v2/Git-Branching-Rebasing)
- [rebase feature to develop](https://stackoverflow.com/a/50736599)
- [rebase feat to dev (with merge)](https://stackoverflow.com/a/67711529)
- [resolving rebase conflicts](https://www.udemy.com/course/git-and-github-bootcamp/learn/lecture/24869812#content)
