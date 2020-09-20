#!/usr/bin/env bash
git clone --depth 1 "$1" temp-linecount-repo &&
  printf "('temp-linecount-repo' will be deleted automatically)\n\n\n" &&
  cloc temp-linecount-repo &&
  rm -rf temp-linecount-repo

# install
# sudo apt install cloc

# to use
# ./cloc-git.sh <github_repo>

# source
# https://stackoverflow.com/a/29012789/8508220
