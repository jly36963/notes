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
