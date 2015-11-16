# iotagent-onem2m

IoT Agent for the OneM2M protocol

## Overview

### OneM2M Conventions
In order to implement the first version of the IoTA, some conventions were applied for the bridge between NGSI entities
and OneM2M Ones. Those conventions can be split in two categories: general conventions and operation specific conventions.

#### General conventions
This is a list of the general conventions that were considered for this first verison of the OneM2M IOTA:
- Each FIWARE service (or Tenant) will be mapped to a OneM2M AE (as a service represents a cloud application in the FIWARE
ecosystem.
- Each subservice will be represented in OneM2M as a subservice.
- Each device will be represented as a Resource Entity.

#### Protocol specific conventions
##### AE-related operations
The following tables show all the attributes in request and response contents in the OneM2M protocol, and how they are 
mapped from information in FIWARE systems (or default values). This mapping corresponds to the first version of the
OneM2M IOTA and may change in the future.

| Short Name           | Standard name          |  Operation   | Mapping in FIWARE                                     |
| -------------------- |:---------------------- |: ----------- |:----------------------------------------------------- |
| api       	         | App-ID                 | CREATE (Req) | Value of header `fiware-service`.                     |
| aei       	         | AE-ID                  | CREATE (Req) | Value of header `fiware-service`.                     |
| rr        	         | requestReachability    | CREATE (Req) | Always true.                                          |
| rty        	         | resourceType           | CREATE (Res) | Filled in by OneM2M. Ignored in IOTA.                 |
| ri        	         | resourceID             | CREATE (Res) | Filled in by OneM2M. Stored as internalId in IOTA.    |
| rn        	         | resourceName           | CREATE (Res) | Same as the `api`. Ignored in IOTA.                   |
| pi        	         | parentID               | CREATE (Res) | Ignored in IOTA.                                      |
| ct        	         | creationTime           | CREATE (Res) | Ignored in IOTA.                                      |
| lt        	         | lastModifiedTime       | CREATE (Res) | Ignored in IOTA.                                      |
| lbl        	         | labels                 | CREATE (Res) | Ignored in IOTA.                                      |
| acpi       	         | accessControlPolicyIDs | CREATE (Res) | Ignored in IOTA.                                      |
| at        	         | announcedAttribute     | CREATE (Res) | Ignored in IOTA.                                      |
| aa        	         | announcedAttribute     | CREATE (Res) | Ignored in IOTA.                                      |
| api       	         | App-ID                 | CREATE (Res) | Same values given in the request.                     |
| aei       	         | AE-ID                  | CREATE (Res) | Same values given in the request.                     |
| poa       	         | pointOfAccess          | CREATE (Res) | Address of the OneM2M IoTA.                           |

Along with the XML content of the request, some information must be passed along in headers. The following table shows
the mapping for the header values:

| Header name          | Standard name          |  Operation   | Mapping in FIWARE                                     |
| -------------------- |:---------------------- |: ----------- |:----------------------------------------------------- |
| X-M2M-RI             | App-ID                 | CREATE (Req) | Unique ID of a request. Generated with UUID.          |
| X-M2M-Origin         | From                   | CREATE (Req) | The string "Origin"                                   |
| X-M2M-NM   	         | Name                   | CREATE (Req) | Same value as the `api` attribute.                    |
| X-M2M-RI             | App-ID                 | CREATE (Res) | Unique ID of a request. Generated with UUID.          |
| X-M2M-RSC            | Response Status Code   | CREATE (Res) | Check for operation result or errors.                 |

## Development documentation
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

