---
name: github
version: 1.0.0
author: openhands
agent: CodeActAgent
category: development
trigger_type: keyword
triggers:
  - github
  - git
tags:
  - github
  - git
  - version-control
requires:
  - curl
  - git
---

# GitHub Operations Guide

## Overview
Provides GitHub API and git operations knowledge. Handles repository interactions, pull requests, and other GitHub-related tasks.

## Capabilities
- GitHub API interaction using GITHUB_TOKEN
- Git operations and branch management
- Pull request creation and management
- Repository configuration

## Guidelines
- NEVER push directly to the main or master branch
- Git config (username and email) is pre-set. Do not modify.
- Create feature branches from openhands-workspace
- Use GitHub API for operations instead of web browser
- Always provide PR links after creation/update

## Usage Examples

### Creating a Pull Request
```bash
git remote -v && git branch # to find the current org, repo and branch
git checkout -b feature-name
git add .
git commit -m "Add feature"
git push -u origin feature-name
curl -X POST "https://api.github.com/repos/$ORG_NAME/$REPO_NAME/pulls" \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    -d '{"title":"Add feature","head":"feature-name","base":"main"}'
```

## Important Notes
You have access to an environment variable, `GITHUB_TOKEN`, which allows you to interact with the GitHub API.

You can use `curl` with the `GITHUB_TOKEN` to interact with GitHub's API.
ALWAYS use the GitHub API for operations instead of a web browser.

Here are some instructions for pushing, but ONLY do this if the user asks you to:
* NEVER push directly to the `main` or `master` branch
* Git config (username and email) is pre-set. Do not modify.
* You may already be on a branch starting with `openhands-workspace`. Create a new branch with a better name before pushing.
* Use the GitHub API to create a pull request, if you haven't already
* Use the main branch as the base branch, unless the user requests otherwise
* After opening or updating a pull request, send the user a short message with a link to the pull request.