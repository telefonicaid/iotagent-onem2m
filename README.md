# iotagent-onem2m

## Index

* [Overview](#overview)
* [Setup](#setup)
* [Test client](#testclient)
* [Development](#development)

## <a name="overview"/> Overview

### OneM2M Conventions
In order to implement the first version of the IoTA, some conventions were applied for the bridge between NGSI entities
and OneM2M Ones. Those conventions can be split in two categories: general conventions and operation specific conventions.

#### General conventions
This is a list of the general conventions that were considered for this first version of the OneM2M IOTA:

- Each Device will be mapped to a single OneM2M AE. The Device ID will be the AE name.
  
- Each attribute in the device will be represented as a Container, using the attribute name as the container name.

- Whenever an update context arrives to the IoT Agent with a lazy attribute value, a new content instance will be created
  under the corresponding device container.
  
- When a new device is provisioned, a subscription to the device container will be created for each active attribute in
  the device. Notifications to the IOTA will be mapped to active attributes. The name of the subscription will be the 
  attribute name prefixed with the 'subs_' string.

## <a name="setup"/> Setup
### Using RPM
The project contains a script for generating an RPM that can be installed in Red Hat 6.5 compatible Linux distributions. The
RPM depends on Node.js 0.10 version, so EPEL repositories are advisable. 

In order to create the RPM, execute the following scritp, inside the `/rpm` folder:
```
create-rpm.sh -v <versionNumber> -r <releaseNumber>
```

Once the RPM is generated, it can be installed using the followogin command:
```
yum localinstall --nogpg <nameOfTheRPM>.rpm
```

### Using GIT
In order to install the OneM2M IoT Agent, just clone the project and install the dependencies:
```
git clone https://github.com/telefonicaid/iotagent-onem2m.git
npm install
```
In order to start the IoT Agent, from the root folder of the project, type:
```
bin/iotagent-onem2m
```

## <a name="testclient"/> Test Client
The OneM2M IoT Agent provides a command line client for testing its integration with complete stacks. This client lets
the user send requests to a OneM2M as well as receive notifications from the OneM2M system. 

In order to use the client, execute the following command, from the root of the project:
```
./bin/onem2mClient.js
```
This will open a prompt where multiple commands can be issued. For an explanation and the syntax of all the supported
commands execute:
```
help
```

## <a name="development"/> Development documentation
### Project build
The project is managed using Grunt Task Runner.

For a list of available task, type
```bash
grunt --help
```

The following sections show the available options in detail.


### Testing
[Mocha](http://visionmedia.github.io/mocha/) Test Runner + [Chai](http://chaijs.com/) Assertion Library + [Sinon](http://sinonjs.org/) Spies, stubs.

The test environment is preconfigured to run [BDD](http://chaijs.com/api/bdd/) testing style with
`chai.expect` and `chai.should()` available globally while executing tests, as well as the [Sinon-Chai](http://chaijs.com/plugins/sinon-chai) plugin.

Module mocking during testing can be done with [proxyquire](https://github.com/thlorenz/proxyquire)

To run tests, type
```bash
grunt test
```

Tests reports can be used together with Jenkins to monitor project quality metrics by means of TAP or XUnit plugins.
To generate TAP report in `report/test/unit_tests.tap`, type
```bash
grunt test-report
```


### Coding guidelines
jshint, gjslint

Uses provided .jshintrc and .gjslintrc flag files. The latter requires Python and its use can be disabled
while creating the project skeleton with grunt-init.
To check source code style, type
```bash
grunt lint
```

Checkstyle reports can be used together with Jenkins to monitor project quality metrics by means of Checkstyle
and Violations plugins.
To generate Checkstyle and JSLint reports under `report/lint/`, type
```bash
grunt lint-report
```


### Continuous testing

Support for continuous testing by modifying a src file or a test.
For continuous testing, type
```bash
grunt watch
```


### Source Code documentation
dox-foundation

Generates HTML documentation under `site/doc/`. It can be used together with jenkins by means of DocLinks plugin.
For compiling source code documentation, type
```bash
grunt doc
```


### Code Coverage
Istanbul

Analizes the code coverage of your tests.

To generate an HTML coverage report under `site/coverage/` and to print out a summary, type
```bash
# Use git-bash on Windows
grunt coverage
```

To generate a Cobertura report in `report/coverage/cobertura-coverage.xml` that can be used together with Jenkins to
monitor project quality metrics by means of Cobertura plugin, type
```bash
# Use git-bash on Windows
grunt coverage-report
```


### Code complexity
Plato

Analizes code complexity using Plato and stores the report under `site/report/`. It can be used together with jenkins
by means of DocLinks plugin.
For complexity report, type
```bash
grunt complexity
```

### PLC

Update the contributors for the project
```bash
grunt contributors
```


### Development environment

Initialize your environment with git hooks.
```bash
grunt init-dev-env 
```

We strongly suggest you to make an automatic execution of this task for every developer simply by adding the following
lines to your `package.json`
```
{
  "scripts": {
     "postinstall": "grunt init-dev-env"
  }
}
``` 


### Site generation

There is a grunt task to generate the GitHub pages of the project, publishing also coverage, complexity and JSDocs pages.
In order to initialize the GitHub pages, use:

```bash
grunt init-pages
```

This will also create a site folder under the root of your repository. This site folder is detached from your repository's
history, and associated to the gh-pages branch, created for publishing. This initialization action should be done only
once in the project history. Once the site has been initialized, publish with the following command:

```bash
grunt site
```

This command will only work after the developer has executed init-dev-env (that's the goal that will create the detached site).

This command will also launch the coverage, doc and complexity task (see in the above sections).

