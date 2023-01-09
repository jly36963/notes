# Update feature branch with new changes

## Method 1

```bash
# Squash last 5 commits (adjust as necessary)
git rebase -i HEAD~5

# Squash all but one, pick that one

# Checkout develop and git pull

# Switch back to feature branch

# Rebase develop
git rebase -i develop

# Force push
git push --force
```

## Method 2

```bash
# Undo commits back to (and including) id
git reset --soft <id>
# Get off feature branch
git checkout develop
# Delete feature branch
git branch -D <feature-branch>
# Re-create feature branch
git branch <feature-branch>
# Re-commit
git add .
git commit -m <commit-message>
# Force push
git push --force
```
