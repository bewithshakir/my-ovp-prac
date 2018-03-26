# Contributing to OVP #

## Committing code

### Coding standards

Most of the coding conventions are derived from Douglas Crockford's, A.K.A Yoda, Code Conventions for the JavaScript Programming Language. Please refer to this link [Code Conventions for the JavaScript Programming Language](http://javascript.crockford.com/code.html) anytime there is ambiguity or something is not explicit in this document.


```

### Workflow

Create a branch, make changes, push to `origin`.

```bash
# Checkout the `master` branch
$ git checkout master

# Create a new branch named `add-build-configuration`
$ git checkout -b add-build-configuration

# Create a new make file
$ touch makefile

# Check the status of your changes
$ git status

# Stage the modified files
$ git add makefile

# Commit your changes and add a *meaningful* commit message summarizing the changes
$ git commit -m "added a 'make' file for build config"

# Push your local branch up to the `origin` (your fork).
$ git push origin add-build-configuration
```

It is important that you periodically perform a `$ git push origin name-of-branch` as a backup.

The above command would push your `add-build-configuration` branch to your fork of the `splunk-js` repository.

### A note on Merge Requests

Please name your merge requests consistently and include `{jira story#}` in the title, along with a description of the issue being fixed. For example, **"TWCTV-8188: Implement new dropdown menu in DVR"**.

### Testing

Currently no automated tests are present, but feel free to add and augment the library. Testing can be done by invoking the API from another client.


