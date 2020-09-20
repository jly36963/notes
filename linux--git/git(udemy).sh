# -----------
# git & github
# -----------
#
# -----------
# config
# -----------

# initial user config
git config --global user.name "Kakashi Hatake"
git config --global user.email "kakashi@gmail.com"

# editor
git config --global core.editor "code --wait"

# -----------
# initialize repo
# -----------

# initialize repo
    # creates a new repository. 
    # creates '.git' directory -- files/directories that Git will use to track everything
git init

# -----------
# status
# -----------

# current status
    # which files have changed
git status

# -----------
# diff
# -----------

git diff # show file changes
git diff <filename> # show changes for specific file
git diff <commit> <commit> [<filename>] # show changes between commits

# -----------
# log
# -----------

# log (full SHA, author, date)
git log
# condensed git log. (7-char SHA + message)  
git log --oneline
# git log + file changes (#)  
git log --stat
# git log + file changes (full info). add 7-char SHA to start at that commit.
   # old file, new file
   # start point, lines covered
   # changes made (- and +)
git log -p
# see all committed files being tracked by my git repo.  
git ls-tree --full-tree -r HEAD 

# -----------
# commit
# -----------

# adds all (not gitignored) files to staging index.
git add .
# commit changes
git commit -m "Commit message here."

# tag
git tag -a -m [message] [tagname] # will bypass the editor.  
git tag -d [tagname] # deletes a tag.  
git tag -a -m [message] [tagname] [SHA] # adds a tag to a past commit. 

# -----------
# remove files now in gitignore
# -----------

# docs
    # https://stackoverflow.com/questions/1274057/how-to-make-git-forget-about-a-file-that-was-tracked-but-is-now-in-gitignore

git rm -r --cached . 
git add .

# -----------
# remote
# -----------

# add remote
git remote add origin <url>
# push to remote
git push origin <branch>

# -----------
# pull
# -----------

# pull changes from remote (for current branch)
    # fetch + commit
git pull 

# -----------
# branch
# -----------

# checkout

# change branch
git checkout <branch>
# create / change to new branch
git checkout -b <branch>

# branch

# list branches
git branch
# create branch (but dont' checkout)
git branch <branch>
# delete branch (that has been pushed/merged)
git branch -d <branch>
# force delete branch
git branch -D <branch>

# -----------
# merge
# -----------

# checkout destination branch
git checkout <destination-branch>
# merge branch
git merge <branch-to-merge> <destination-branch>
# delete merged branch
git branch -d <merged-branch>

# -----------
# pull request
# -----------

# pull requests tell others about changes that have been pushed to a github repo.
    # interested parties can review the set of changes, discuss modificatoins, and follow up commits

# pull remote changes to current branch (make it up-to-date)
git pull
# create feature branch
git checkout -b <branch-name>
# make changes
nano <filename>
# push changes
git add .
git commit -m '*** commit message here ***'
git push origin <branch-name> # once complete, a link will be returned
# create pull request
    # get link returned from the push
    # follow link and complete form
        # choose head branch (branch to merge) and base branch (destination branch)
        # fill out appropriate details (title, description)
# merge pull request
    # once collaborators are satisfied with changes, merge head branch to base branch
    # use 'merge pull request' button at bottom of pull request page.

# -----------
# merge conflicts
# -----------

# explanation
    # https://www.atlassian.com/git/tutorials/using-branches/git-merge

# merge commmits -- merges where two parent commits are merged

# fast forward merge
    # base branch has no new commits and feature branch has commits.
    # fast forward base branch to catch up with feature branch.

# three way merge (recursive)
    # divergent branches. base and feature branches both have commits.
    # three commits to tie together the two tips and their common ancestor

# merge conflict
    # merge conflict emerges if both branches have conflicting changes in the same location.

# -----------
# clone
# -----------

# clone remote repo
    # get url from repo's gitub page
git clone <url>

# -----------
# github fork
# -----------

# fork
    # create a copy of a repository under my own account
    # the copied repo will be managed independently from the source

# to fork
    # go to a repo's page
    # click fork button

# -----------
# gitignore
# -----------

# create '/.gitignore' in project

<<GITIGNORE
# ignore directory (relative to '.gitignore' file)
backend/node_modules/
/backend/node_modules # leading slash makes no difference in .gitignore

# ignore a directory by name ('**' matches any number of directories) (any directory named node_modules)
**/node_modules

# ignore all files in directory ('**' matches any number of files)
backend/server/files/json/**

# ignore all json files
**/*.json

# re-include package.json (negates previous ignore) (can't negate a file inside an ignored directory)
**/!package.json
GITIGNORE

# -----------
#
# -----------



# -----------
#
# -----------



# -----------
#
# -----------



# -----------
#
# -----------



# -----------
#
# -----------



# -----------
#
# -----------


