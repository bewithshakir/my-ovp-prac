# Contributing to OVP #

## Committing code

### Coding standards
We utilize several linting tools to automatically catch _most_ formatting errors in JavaScript and CSS.
However, please read and follow the standards, since not every guideline can be automatically enforced for you.
* [JavaScript](CONTRIBUTING.md#javascript-source-code)
* [HTML/CSS/SASS](https://github.webapps.rr.com/pages/ux/code-guides/)

### General workflow

We use gitlab as the source code repository for OVP.  [Read about git branches and pull requests before getting started](https://www.atlassian.com/git/tutorials/comparing-workflows).  We use pull requests to provide a place to share and review code, as well as protect the integrity of the base repository.  Once your familiar with the concepts, create a branch off of the develop branch in the ovp repository after you've checked out the code with `git branch -b yourBranchName`.  After you make some changes you can push your branch to gitlab with `git push origin yourBranchName`.

Generally, we create feature branches where the branch name is a jira ticket number or, if that's not applicable, a different descriptive name, off of the develop branch.  Please also review some docs about branching [here](http://nvie.com/posts/a-successful-git-branching-model/) to get an idea of how this works.  Typically your branch will be from the develop branch, but for bug fixes for an open release or a hotfix for production it may be a release/* or hotfix/*.

### A note on Pull Requests

When creating a pull request, you'll assign *one person* to review the story. While anyone is welcome to review your changes and leave comments, that person is ultimately the one responsible for making sure that your code gets reviewed and moved forward. If someone is well suited to review your merge request (for example, if it's in a part of the code they are very familiar with) you can choose them specifically. If not you can choose a developer at random. A chrome plugin for aiding in random assignment can be found here: https://gitlab.spectrumxg.com/ntower/randAssign

Please name your pull requests consistently and include `TWCTV-{jira story#}` in the title, along with a description of the issue being fixed. For example, **"TWCTV-8188: Implement new dropdown menu in DVR"**.

When opening the PR, please use the provided [boilerplate](https://github.webapps.rr.com/ovp/ovp2/blob/develop/pr-template.md) as a starting point and fill out all appropriate sections. After opening your pull request, use the github interface to comment on any areas you'd like to call attention.  Add comments and mention specific developers by using the `@user` symbol.

### Working with origins

To verify your list of remotes, type the following:
```bash
$ git remote -v
origin	git@gitlab.spectrumxg.com:portals/ovp.git (fetch)
origin	git@gitlab.spectrumxg.com:portals/ovp.git (push)
```

If your remotes are incorrect, below is how to manually set up the correct remotes.

```bash
$ git remote rm origin
$ git remote add origin git@gitlab.spectrumxg.com:portals/ovp.git
```

### Workflow

Create a branch, make changes, push to `origin`.

```bash
# Checkout the `develop` branch
$ git checkout develop

# Create a new branch named `add-build-configuration`
$ git checkout -b add-build-configuration

# Check the status of your changes
$ git status

# Add you staged changes and commit them creating a *meaningful* commit message summarizing the changes
$ git commit -am "added a 'make' file for build config"

# Push your local branch up to the `origin` (your fork).
$ git push origin add-build-configuration
```

It is important that you periodically perform a `$ git push origin name-of-branch` as a backup.

```
http://github.webapps.rr.com/{$USERNAME}/ovp2/tree/add-build-configuration
```

### Testing

Prior to submitting a Pull Request, developers should run several `gulp` tasks to remove any lint and run various automated testings. For details on when it is advisable to run `gulp test-css`, see the [documentation](TESTING.md).

```bash
# Run linting (also available in a standalone `gulp lint` task) and run automated unit tests
$ gulp test
# Run visual design regression testing
$ gulp test-css
```

### Submit a Pull Request

The following outlines how to submit a Pull Request which will start the code review process:

* After pushing your branch to your fork, browse to your fork and select your branch from the branch dropdown near the top
* Click "Pull Request" below and to the right of the branch dropdown
* After the pull request preview is generated, click "edit" at the top right
* Change the base fork and base branch to the destination you'd like to merge to (usually will be "ovp2" and "develop" for most work)
* The [`pr_template.md`](https://github.webapps.rr.com/ovp/ovp2/blob/develop/pr-template.md) file in the project root should be used as a boilerplate when opening a new Pull Request, just copy+paste the contents of that markdown file into the Pull Request description.
* The boilerplate contains areas for tagging specific reviewers as well as task lists that should be completed for every PR. Add the relevant information and comments to the boilerplate and submit the Pull Request:
* Click "Send Pull Request"
* Add any inline comments you'd like to review or call out by their code line

An email regarding the Pull Request will be sent to all core contributors (anyone that has push privileges to our repository) and anyone you specifically @mention in the boilerplate. Contributors can review the code and write comments either in-context (on a line-number basis) or in general. Those comments will be emailed to the person that made the pull request. Communication can continue until the pull request is either rejected or merged.

Once a pull-request has been merged, you are free to merge the upstream develop branch into your local develop branch. It is also common practice to delete the local and remote topic branch; however, this is optional.

### Collaboration: Retrieving a branch from another user's fork

There will be times you'll want to work on something with another developer.  To do this, you have two options.  Creating a branch on the upstream ovp2 repository and submitting pull requests to that; or...

#### Working off another developer's fork

You can work off of another developer's fork by:

* Adding a remote referencing the other developer's fork
* Fetching and checking out their branch
* Submitting pull requests against their fork/branch

To work with the other developer's fork/branch locally, you can create a new local branch which "tracks" the remote branch in a single step. To add the user's repository as a remote (where {$USERNAME} is the user name of the other developer):

```bash
$ git remote add {$USERNAME} https://github.webapps.rr.com/{$USERNAME}/ovp2.git
$ git fetch --all --prune
```

NOTE: There is nothing stopping you from being more creative with the name of the remote.

* Finally, you can track the remote branch locally.

```bash
$ git checkout -b collaboration-branch {$USERNAME}/collaboration-branch
```

### Syncing with `upstream`

When changes are merged into the [upstream repository](https://github.webapps.rr.com/ovp/ovp2), those changes do not automatically propagate into your fork. This is done by "fetching" the `upstream` remote and "pulling" the changes into your local repo, then "pushing" those changes up to your fork (`origin`). It is good to periodically do this, we recommend it at least once-a-day. Also, before submitting any PR, it is a good idea to sync with upstream to make sure there are no conflicts.

```bash
# Get the latest code from all forks and branches, and prune dead references
$ git fetch --all --prune
# Checkout local `develop` branch
$ git checkout develop
# Pull changes from `upstream/develop` branch into your `local/develop` branch
$ git pull upstream develop
# Push your `local/develop` (which is now the exact same as `upstream/develop`) to your `origin/develop`
$ git push origin develop
```

The above commands effectively:

* Merge the "upstream" develop branch into your your local develop
* Push your updated local develop to "origin" (Your Fork's) develop
* This means `local/develop`, `origin/develop` and `upstream/develop` will all be sync'd and have the exact same code

After syncing with `upstream`, if you are working in a feature branch on your fork, it is best to sync it directly with the local `develop`, then push those changes up to your `origin`. You can get into problems if you do the above in your develop and then rebase it into your topic branch and push your branch as a remote branch to your fork.

```bash
# Checkout the feature branch
$ git checkout add-build-configuration
# Merge in the latest changes from `develop` into your feature branch
$ git merge develop
# Push the feature branch up to your fork
$ git push origin add-build-configuration
```

## Javascript Source Code

Most of OVP's coding conventions are derived from Douglas Crockford's, A.K.A Yoda, Code Conventions for the JavaScript Programming Language. Please refer to this link [Code Conventions for the JavaScript Programming Language](http://javascript.crockford.com/code.html) anytime there is ambiguity or something is not explicit in this document.

### Files

* Use .js file extension
* First character should be alpha (non-numeric, no special characters)
* Casing - scripts that:
 * return a constructor function and are intended to be used with the "new" keyword should be pascal case like this: OohView.js
 * are libraries of functions, objects, or initialization scripts that are not intended to be used with the "new" keyword should use lower camelCase, like this: onDemandApp.js
* Acronyms should be treated like words and capitalized as such, like this: "OohView.js" not "OOHView.js"
* External Libraries
 * When indicating version number, use a hyphen following by dot-separated version number, like this: jquery-1.7.2.js
 * jQuery plugins already have a commonly accepted naming convention: jquery.pluginname.js

### Directories

* All lower case
* Alphanumeric, No special characters

### Code

If you run jshint and jscodesniffer on your code and it passes then the code should match 
the standards.

A description of what those tools verify is below.

* Indentation should be 4 spaces
* Max 80 characters per line
* Variables
 * One variable declaration per line, comma separated
 * Constructor functions should be CamelCase
 * Everything else should be camelCase
 * No special characters (unless utilizing an external library).
 * Avoid use of global variables
 * Every statement that isn't a code block with {} (but not object literals) should end with a semicolon
 * Note: about camelCasing 'ID' abbreviation in variables, it should be i.e. sampleId and not sampleID
* Functions
 * Named functions
  * One space between "function" and name
  * Open parens immediately follows name, with no space
 * Function literals
  * One space between "function" and open parens
 * Parameters
  * Comma separated, with space between comma and next param
  * no space after open parens or before close parens
  * Consider using a single object param as a key/value hash for many or complex parameters
* Object Literals
 * Multiple members = one line per member
 * Include space between opening { and first member name and last member value and }
* Whitespace
 * Blank lines improve readability by setting off sections of code that are logically related.
 * Blank spaces should be used in the following circumstances:
  * A keyword followed by ( (left parenthesis) should be separated by a space.
 * A blank space should not be used between a function value and its ( (left parenthesis). This helps to distinguish between keywords and function invocations.
 * All binary operators except . (period) and ( (left parenthesis) and [ (left bracket) should be separated from their operands by a space.
 * No space should separate a unary operator and its operand except when the operator is a word such as typeof.
 * Each ; (semicolon) in the control part of a for statement should be followed with a space.
 * Whitespace should follow every , (comma).
* === and !== Operators.
 * Always use === or !== operators.
* Multiline statements, chaining, lengthy parameter lists
 * Multiple statements = one line per statement
 * Anything breaking line rule gets one item per line

#### Sample code matching standard

```js
// Use the following sample for spacing for named functions, function literals, and invoking functions 
// (note use of parentheses and {}:
function outer(c, d) {
    var e = c * d;
 
    return (function (a, b) {
        return (e * a) + b;
    }(0, 1));
}

// Object Literals example
{
    key: "key",
    value: "value"
}

if (condition) {
    statements
}
     
if (condition) {
    statements
} else {
    statements
}
     
if (condition) {
    statements
} else if (condition) {
    statements
} else {
    statements
}
 
for (initialization; condition; update) {
    statements
}
 
for (variable in object) {
    if (filter) {
        statements
    }
}
 
for (variable in object) {
    if (object.hasOwnProperty(variable)) {
        statements
    }
}
 
while (condition) {
    statements
}
 
do {
    statements
} while (condition);
 
switch (expression) {
case expression:
    statements
default:
    statements
}
 
try {
    statements
} catch (variable) {
    statements
} finally {
    statements
}
```

### Multiline statements, chaining, lengthy parameter lists example:

```js
$('#selector').find('selector').css({}).hide().appendTo()
```
is ok, but even better is,
```js
$('#selector')
    .find('selector')
    .css({})
    .hide()
    .appendTo();
```

It's ok to list several simple parameters all on one line, but when more params or nesting of objects, or functions, better on separate line. Compare (hard to read):

```js
new View('name', { key: 'isOoh', value: false }, function () { return false; });
```

to (easier to read):
```js
new View(
    'name',
    {
        key: 'isOoh',
        value: false
    },
    function () {
        var doSomething = 1;
        return false;
    });
```

Consider the design of View to accept a single constructor object instead of several when complex:

```js
new View({
    name: 'name',
    defaults: {
        key: 'isOoh',
        value: false
    },
    callback: function () {
        var doSomething = 1;
        return false;
    });
```
