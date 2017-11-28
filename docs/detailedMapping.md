## Detailed Protocol mapping (to be updated)

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
