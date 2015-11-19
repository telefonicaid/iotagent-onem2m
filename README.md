# iotagent-onem2m

IoT Agent for the OneM2M protocol

## Overview

### OneM2M Conventions
In order to implement the first version of the IoTA, some conventions were applied for the bridge between NGSI entities
and OneM2M Ones. Those conventions can be split in two categories: general conventions and operation specific conventions.

#### General conventions
This is a list of the general conventions that were considered for this first version of the OneM2M IOTA:

- Each FIWARE service (or Tenant), along with its subservice (or service path) will be mapped to a single OneM2M AE (as 
  a service represents a cloud application in the FIWARE ecosystem).
  
- Each device will be represented as a Container, using the device ID as the container name.

- Whenever an update context arrives to the IoT Agent with a command value, a new content instance will be created under
  the device container.
  
- When a new device is provisioned, a subscription to the device container will be created. Notifications to the IOTA 
  will be mapped to active attributes. The name of the subscription will be the device ID prefixed with the 'subs_' string.

#### Protocol specific conventions
The following tables show all the attributes in request and response contents in the OneM2M protocol, and how they are 
mapped from information in FIWARE systems (or default values). This mapping corresponds to the first version of the
OneM2M IOTA and may change in the future.

##### AE-related operations

| Short Name           | Standard name          | Operation    | Mapping in FIWARE                                     |
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

##### Container-related operations

| Short Name           | Standard name          |  Operation   | Mapping in FIWARE                                     |
| -------------------- |:---------------------- |: ----------- |:----------------------------------------------------- |
| containerType        | containerType          | CREATE (Req) | Unclear. Currently the fixed string "heartbeat"       |
| heartbeatPeriod      | heartbeatPeriod        | CREATE (Req) | Unclear. Currently the fixed value 300                |
| rty        	         | resourceType           | CREATE (Res) | Filled in by OneM2M. Ignored in IOTA.                 |
| ri        	         | resourceID             | CREATE (Res) | Filled in by OneM2M. Stored as internalId in IOTA.    |
| rn        	         | resourceName           | CREATE (Res) | Same as the `Name` header. Ignored in IOTA.           |
| pi        	         | parentID               | CREATE (Res) | Ignored in IOTA.                                      |
| ct        	         | creationTime           | CREATE (Res) | Ignored in IOTA.                                      |
| lt        	         | lastModifiedTime       | CREATE (Res) | Ignored in IOTA.                                      |
| lbl        	         | labels                 | CREATE (Res) | Ignored in IOTA.                                      |
| at        	         | announcedAttribute     | CREATE (Res) | Ignored in IOTA.                                      |
| aa        	         | announcedAttribute     | CREATE (Res) | Ignored in IOTA.                                      |
| st        	         | stateTag               | CREATE (Res) | Ignored in IOTA.                                      |
| cr        	         | creator                | CREATE (Res) | Same as parent.                                       |
| cni        	         | currentNrOfInstances   | CREATE (Res) | Number of childs in the container.                    |
| cbs        	         | currentByteSize        | CREATE (Res) | Total size of the container in bytes.                 |
| containerType        | containerType          | CREATE (Res) | Unclear. Currently the fixed string "heartbeat"       |
| heartbeatPeriod      | heartbeatPeriod        | CREATE (Res) | Unclear. Currently the fixed value 300                |

##### Resource-related operations
| Short Name           | Standard name          |  Operation   | Mapping in FIWARE                                     |
| -------------------- |:---------------------- |: ----------- |:----------------------------------------------------- |
| cnf        	         | contentInfo            | CREATE (Both)| Type of resource stored in content.                   |
| con        	         | content                | CREATE (Both)| Data content for the content instance resource.       |
| rty        	         | resourceType           | CREATE (Res) | Filled in by OneM2M. Ignored in IOTA.                 |
| ri        	         | resourceID             | CREATE (Res) | Filled in by OneM2M. Stored as internalId in IOTA.    |
| rn        	         | resourceName           | CREATE (Res) | Same as the `Name` header. Ignored in IOTA.           |
| pi        	         | parentID               | CREATE (Res) | Ignored in IOTA.                                      |
| ct        	         | creationTime           | CREATE (Res) | Ignored in IOTA.                                      |
| lt        	         | lastModifiedTime       | CREATE (Res) | Ignored in IOTA.                                      |
| st        	         | stateTag               | CREATE (Res) | Ignored in IOTA.                                      |
| cr        	         | creator                | CREATE (Res) | Same as parent.                                       |
| cs        	         | contentSize            | CREATE (Res) | Same as parent.                                       |

##### Subscription-related operations
| Short Name           | Standard name          |  Operation   | Mapping in FIWARE                                     |
| -------------------- |:---------------------- |: ----------- |:----------------------------------------------------- |
| enc        	         | eventNotificationCriteria | CREATE (Req) | Holds the notification criteria (rss)             |
| rss        	         | resourceStatus         | CREATE (Req) | Indicates the condition is child created (1).        |
| nu        	         | notificationURI        | CREATE (Req) | Public URI of the IoT Agent.                          |
| pn        	         | pendingNotification    | CREATE (Req) | Unclear. Currently, the fixed string 1.               |
| nct        	         | notificationContentType | CREATE (Req) | Unclear. Currently, the fixed string 2.              |


#### Operation headers

Along with the XML content of the request, some information must be passed along in headers. The following table shows
the mapping for the header values:

| Header name          | Standard name          |  Operation   | Mapping in FIWARE                                     |
| -------------------- |:---------------------- |: ----------- |:----------------------------------------------------- |
| X-M2M-RI             | App-ID                 | ALL (Req)    | Unique ID of a request. Generated with UUID.          |
| X-M2M-Origin         | From                   | ALL (Req)    | The string "Origin"                                   |
| X-M2M-NM   	         | Name                   | CREATE (Req) | Name of the container to create.                      |
| X-M2M-RI             | App-ID                 | ALL (Res)    | Unique ID of a request. Generated with UUID.          |
| X-M2M-RSC            | Response Status Code   | ALL (Res)    | Check for operation result or errors.                 |

## Test Client
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

