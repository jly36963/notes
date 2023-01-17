# Git

- VCS: version control system
- git is a free and open-source distributed version control system

## Docs

https://git-scm.com/doc

### Cheat Sheets

- https://education.github.com/git-cheat-sheet-education.pdf
- https://www.atlassian.com/git/tutorials/atlassian-git-cheatsheet

## Setup

```bash
# Set name (so that your changes can be identified)
git config --global user.name <first-and-last-name>
# Set email
git config --global user.email <email-addr>
```

## Initialize a repository

```bash
# Initialize git repo (git-related files in .git subdir)
git init
```

## History

```bash
# Log commits
git log --oneline # Condensed git logs. (7-char SHA + message)
git log --stat # Git log with file change counts
git log -p # Git log with diffs

# Show all tracked files
git ls-tree --full-tree -r HEAD
```

## Committing current changes

```bash
# Check
git status # Show status (changes/staged/not tracked/etc)
git diff # Show unstaged changes
git diff --staged # Show staged changes
git diff HEAD # staged & unstaged
git diff <branch1>..<branch2> # Compare branches (b2 against b1)
git diff <commit1>..<commit2> # Compare commits (b2 against b1)

# Add files to staging index
git add . # All files in directory (recursively)
git add <filenames..> # Add specific file(s)

# Remove from staging index
git rm <filenames..> # Add specific file(s)

# Commit
git commit -m "Commit message here."

# Amend commit (Add staged changes to last commit)
git commit --amend -m [message] # Overwrite commit message
git commit --amend --no-edit # Amend using prev msg

# Undo commit(s)
git reset --soft HEAD~1 # Last commit
git reset --soft <sha> # Undo every commit since specified sha
```

## Stashing

```bash
# Stash current changes (put changes on stack)
git stash
git stash push
# Pop last stash on stack (bring changes back)
git stash pop
# List stash entries
git stash list
# Remove a stash entry
git stash drop <stash>
# Clear stash
git stash clear
```

### Untrack files now in .gitignore

```bash
git rm -r --cached .
git add .
```

## Tagging

```bash
git tag -a -m [message] [tagname] # will bypass the editor.
git tag -d [tag] # deletes a tag.
git tag -a -m [message] [tagname] [SHA] # adds a tag to a past commit.
```

## Branches

```bash
# List branches
git branch
# Create and switch to branch
git checkout -b <new-branch-name>
# Create branch
git branch <name>
# Switch active branch
git switch <branch-name>
git checkout <branch-name>
git checkout - # Switch to previous branch
# Will create a new branch at the given SHA.
git branch <new-branch-name> <SHA>
# Rename
git branch -m <new-name>
# Deletes a branch (to force deletion, use `-D` instead.)
git branch -d <branch-name>
```

## Merging

```bash
# Merge specified branch into current branch
git merge [branchname]
# Undoes a merge (NOTE: be careful with this)
git reset --hard HEAD^
```

### Commit revision

```bash
# amend commit (if files have been edited/saved/staged prior to the amend, git will update the files in the commit as well.)
git commit --amend -m [message]
# undoes changes in named commit. (added content will be deleted, deleted content will be re-added, and replaced content will be un-replaced.)
git revert [SHA]
# git reset will move the head and current branch back to the chosen ancestor. where the recent commits go depends on the flag.
  # `--soft` moves recent commits to staging index.
  # `--mixed` moves recent commits to working directory. (default)
  # `--hard` deletes recent commits.
git reset [flag] [reference]

# referring to a parent:
  # `HEAD^`, `HEAD~`, or `HEAD~1`.
# referring to a grandparent:
  # `HEAD^^` or `HEAD~2`
  # after merge, `^` means first parent, `^2` means second parent
  # `HEAD~6` 6 generations back on the same branch. (ignore divergent branches.)
```

## Ignoring files

TODO: .gitignore patterns

```bash
# File
.DS_Store
# Direct subdirectory
/node_modules
# Any matching subdirectory
**/node_modules
# Matching file extension
*.whl
# Character permutations
[Bb]uild
```

## Advice

- Keep commits atomic
- commit messages
  - use imperative mood
    - eg: "fix async bug"
    - follow established pattern in repo
  - some CI/CD scripts/actions rely on semantic commit messages
    - eg: "fix: properly catch async error"
