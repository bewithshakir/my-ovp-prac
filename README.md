twctv.com _or_ OVP (Online Video Portal)
=========================

## Dependencies
* [NodeJS](#nodejs)
* [Git](#git)

## Setting up development environment
This guide is biased towards Mac, and will walk you through installing all of the dependencies above.  We recommend developing on Mac OS X Yosemite+, but any environment may be used at the developer's discretion.

### [Git](https://git-scm.com/)
The easiest way to install git on a Mac is to run `git` from a bash shell. Mac will prompt you for installation. Otherwise, you can download it from the git [website](https://git-scm.com/).

### [NodeJS](https://nodejs.org/)

We recommend that you manage your NodeJS installations with [nvm](https://github.com/creationix/nvm). Visit [nvm's github page](https://github.com/creationix/nvm) for installation instructions

## Setting up the codebase

GitHub has great Help files on [setting up Git](https://help.github.com/articles/set-up-git/). We recommend cloning with HTTPS and caching your GitHub password as recommended on the set up page.

Now you are ready to [clone the source code](https://docs.gitlab.com/ee/gitlab-basics/command-line-commands.html) to your development box.  Something like `git clone git@gitlab.spectrumxg.com:portals/ovp.git`

### Install development dependencies
Once you have cloned the repo, you need to install various packages to aide in development, such as linting and automated tests. These packages generally take the form of `node_modules`, installed via `npm`. Or, a ruby `gem`, which we recommend installing with [Bundler](http://bundler.io/).

#### Access to internal gitlab project(s)
You'll need to request access to the 'kite-group' gitlab group in order to 'npm install'
Please click on [this link](https://gitlab.spectrumxg.com/kite-group) and click 'request access'.  Without this access npm install will fail.

#### NPM packages
Now, open a terminal and go to root directory of the OVP project (where the `package.json` file is located) and install the node packages needed for OVP.

```bash
$ cd path/to/ovp/
$ npm install
```

#### (Charter Only) If npm install fails with 403 error

If you are on the Charter network, and npm install fails with a series of errors, including the following:

```
npm "ERR!" git clone --template=... --mirror https://github.webapps.rr.com/hnav/vpns-client.git
/Users/...:
Cloning into bare repository '/Users/<userId>/.npm/_git-remotes/https-github-webapps-rr-com-hnav-vpns-client-git-3b17642f'...
fatal: unable to access 'https://github.webapps.rr.com/hnav/vpns-client.git/
```

You lack access to the legacy TWC GitHub site because you are not a legacy TWC Cable employee. The simplest way to bypass this error is to edit the package.json file and delete the following line:

```"vpns": "git+https://github.webapps.rr.com/hnav/vpns-client.git",```

Then retry the npm install.

#### [Optional] Bower
OVP makes use of [Bower](http://bower.io/) to manage front-end packages, like [Twitter Bootstrap](http://getbootstrap.com).
We currently include all the bower packages in the repository to ensure that we don't run into issues when the packages are
updated. You can use bower to install, remove or update packages.

```bash
# Install bower
$ npm install bower -g
# Install new dependency
$ cd path/to/ovp2/
$ bower install *packagename*
```

#### [Optional] Bundler/Ruby Gems
To develop for OVP, you'll need to install several Ruby gems on your environment. This is most easily done with [Bundler](http://bundler.io/) and a `Gemfile`. __This is only required to run the `scsslint` command currently__

On OSX El Capitan, you may have issues if gem is trying to install into /usr/bin. If so do the following first:

```bash
echo "gem: -n/usr/local/bin" >> ~/.gemrc
```

```bash
# Install bundler
$ gem install bundler
# Install OVP's dependencies
$ cd path/to/ovp2
$ bundle install
```

## Notes for Mac

#### Permissions

Mac seems to override the permissions of directories to be owned by root, even
if these files are located in ~/. This can cause permission errors when attempting
to run grails or npm. If you run into these situations you can run the following command
to change the ownership of these folders back to your user.

```bash
sudo chown -R `whoami` ~/.npm
sudo chown -R `whoami` ~/.grails
```

## Running OVP
After all development dependencies have been setup, you are ready to run OVP. Note: all commands here are run from project root directory.

### Setup a local host/URL for OVP
Edit your `hosts` file (found in `/etc` directory for Mac or `%WinDir%\System32\Drivers\Etc` directory for Windows) and add the following new line. You'll need to do this rather than trying to run on http://localhost or http://127.0.0.1 because of CORS policy.

```
127.0.0.1  ovp.timewarnercable.com
```

### Running OVP locally
```bash
$ npm start

# ... which just runs
$ gulp

# Add --env=staging|production|lab to set the current environment
$ gulp --env=staging
```

Also, note that you'll want to make sure that nothing else is bound to port `80` or `443`. You can do this by running the following:

```bash
$ netstat -an | grep LISTEN
```
If something is running on `80` or `443`, you'll need to shut it down. The most likely culprit will be Apache. On Macs, you may need to [turn off web sharing](http://support.apple.com/kb/HT3323).

### Import the Root Authority Certificate

In order to run ovp as a trusted site locally, you can install the `rootCA.cer` file located in the `certs` folder. After
installing the rootCA the ssl cert into your OS Keychain, browsers will allow the site to show up as signed at https://local.watch.spectrum.net instead of the untrusted Certificate error.

See the following for help with installing the root certificate.
* This is a great guide that covers all OSes https://www.bounca.org/tutorials/install_root_certificate.html
* Apple: https://support.apple.com/kb/PH18677?locale=en_US
* Windows: https://technet.microsoft.com/en-us/library/cc754841(v=ws.11).aspx

## Opening OVP

Once the development server is up and running, you can browse to your local OVP host you set up in your `hosts` file at https://ovp.timewarnercable.com.

## Reset Port Forwarding

Running multiple environments with Port Forwarding can disrupt existing port addresses. To undo this:

```bash
$ sudo pfctl -F all
```


### Gulp Options:

* `gulp -D someSetting=10 -D oauth.token='/alternative/token/uri'` - Use the -D option, to override hard coded config playerParameters
* `gulp build-zip -D hideDevTools=true` Will disable the dev tools/environment-dropdown for this build
* `gulp build` Will build/combine all the files and leave them in '/build/web/', depending on the env parameter will controll if they are minified, etc.
* `gulp build-zip` Will build all the files and zip the `/build/web` folder and leave the file in `build/target` ready to be deployed to an apache (or other) webserver.
* `gulp webserver` Will run the webserver out of the `/build/tmp` folder, this does not force a build or watch files, it simply creates a static file server
* `gulp lint` - Lint all the js and css files
* `gulp test` - Run the karma/jasmine tests. This does not run protractor e2e tests
* `gulp autotest` - Run unit tests and re-run when files change
* `gulp protractor` - Run the protractor tests
* `gulp protractor-install` - May be required before the first run of `gulp protractor`
