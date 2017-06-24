#!/bin/sh

##### RELEASE:BEFORE #####
# save any uncommited changes in the stash
git add -A
git stash

# update develop and master branches with their latest state from origin
git checkout develop
git pull origin develop
git checkout master
git pull origin master

# bring master up to date with latest develop branch
git merge --no-ff --no-edit develop


# TODO run tests


##### RELEASE:DO #####
# 1. bump the version in package.json (based on commit history)
# 2. use conventional-changelog to update CHANGELOG.md
# 3. commit package.json (et al.) and CHANGELOG.md
# 4. tag a new release
node_modules/standard-version/bin/cli.js -- --standard-version


##### RELEASE:AFTER #####
# fix gitlab links to be http instead of https to be Omnixell webserver compatible
sed -i "s/https:\/\/gitlab\.omnixell\.com/http:\/\/gitlab\.omnixell\.com/g" CHANGELOG.md

# store latest git tag and message and remove automatically created git tag
COMMIT_TAG="$(git describe --abbrev=0 --tags)"
COMMIT_MESSAGE="$(echo `git log -1 --pretty=%B`)" 
git tag -d $COMMIT_TAG

# amend last automated commit with the fixed gitlab links
git add CHANGELOG.md
git commit --amend --no-edit
git tag -a $COMMIT_TAG -m "$COMMIT_MESSAGE"