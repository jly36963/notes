# Git

## Repo

```sh
# creates a new repository. it sets up all the files/directories that Git will use to keep track of everything. (they will all be stored in a directory `.git`. this is the repository.)  
git init
# current status
git status
#  condensed git log. (7-char SHA + message)  
git log --oneline
#  git log + file changes (#)  
git log --stat
# git log + file changes (full info). add 7-char SHA to start at that commit.
   # old file, new file
   # start point, lines covered
   # changes made (- and +)
git log -p
# see all committed files being tracked by my git repo.  
git ls-tree --full-tree -r HEAD
```

## Commit

```sh
# adds all files in current directory. (staging index)
git add .
# commit  
git commit -m "Commit message here."
# remove files now in gitignore
    # https://stackoverflow.com/questions/1274057/how-to-make-git-forget-about-a-file-that-was-tracked-but-is-now-in-gitignore
git rm -r --cached . 
git add .
# tag
git tag -a -m [message] [tagname] # will bypass the editor.  
git tag -d [tag] # deletes a tag.  
git tag -a -m [message] [tagname] [SHA] # adds a tag to a past commit.
```

## Branch

```sh
# list branches  
git branch 
# create and switch to branch 
git checkout -b [branchname] 
# add branch
git branch [name] 
# switch active branch 
git checkout [branchname] 
# will create a new branch at the given SHA.  
git branch [branchname] [SHA] 
# deletes a branch. (cannot delete current branch, or a branch with unique commits. to force deletion, use `-D` instead.)  
git branch -d [branchname] 
# displays all branches.  
git log --oneline --graph --all
```

## Merge

```sh
# merges changes from the named branch into the current branch, and creates a new commit.
git merge [branchname] 
# undoes a merge.
git reset --hard HEAD^
```

### Commit revision

```sh
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
