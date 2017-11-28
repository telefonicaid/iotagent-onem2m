# OneM2M IoT Agent Step by Step Guide

## Index

* [Overview](#overview)
* [Setup](#setup)
* [Device Provisioning](#provisioning)
* [Sending a command](#command)
* [Receiving measures](#measures)

## <a name="overview"/> Overview
This step by step guide will lead you through all the steps needed in order to:

- Deploy and configure a OneM2M IoT Agent.
- Provision a new device to the OneM2M IoT Agent.
- Send a command to the created device.
- Receive some measures from the cereated device.

This guide assume you have access to an Orion Context Broker whose endpoint is accessible from the IoT Agent host, and
to a OneM2M system. In both cases, access won't be protected by any security measures.

This guide is not a comprehesive documentation of any of the mentioned component and does not contain general information
about FIWARE or the IoT Agent frameworks. You can find more information in the [FIWARE Developer Page](https://www.fiware.org/tour-guide/) or in the repository
of the [Node.js IoT Agent Library](https://github.com/telefonicaid/iotagent-node-lib).

The `/docs` folder contains the JSON payload for the device provisioning requests used along this tutorial. 

Most of the interactions with the IoT Agent northbound interface, as well as with the Context Broker can be dealt with
using the command line [IoT Agent tester](https://github.com/telefonicaid/iotagent-node-lib#-iot-library-testing) in the Node.js IoT Agent Library.

## <a name="setup"/> Setup

### Requirements
The OneM2M IoT Agent machine must contain the following software and versions:
- Git (1.7.1+).
- Node (0.10.x).
- NPM (1.3.x).

The IoT Agent has been tested to work properly in CentOS 6.5 and has been developed in a MacOSX 10.10.5 environment, but
any Linux distribution meeting the requirements (or any MacOSX SO) should be appropriate to execute it.

### Installation
There are multiple ways to install an IoT Agent in a host, but, to keep it simple (just for demo purposes) we will 
install from the [Git repository](https://github.com/telefonicaid/iotagent-onem2m). 

In order to install a new OneM2M IoT Agent, execute the following lines:
```
cd /opt
git clone https://github.com/telefonicaid/iotagent-onem2m.git
cd iotagent-onem2m
npm install
```
This lines will download and install the source and dependencies of the IoT Agent.

If you have a CentOS 6 environment and prefer to install using RPMs, follow the guidelines in the [Readme.md](../README.md). 

### Configuration
There are two pieces of data to configure before executing the IoT Agent: the OneM2M address and the Context Broker host.
Both can be configured in the `config.js` file in the root folder of the project.

Edit the `config.js` file and, change:
- In the `config.oneM2M` object: the `host`, `port` and `cseBase` (root path) with the information about the OneM2M host. 
If you plan to use the notifications, change also the `publicHost` attribute to the public IP or Domain Name of the machine
hosting the IoT Agent.
- In the `config.iota` object: the `host` and `port` attributes of the `contextBroker` object, to the host and port of
your Context Broker. 

This is the basic configuration you will need in order for the IoT Agent to work. With this configuration, the IoTA will
behave as a stateless component, so any information provisioned in the IoT Agent will be considered transient and will
be lost when the IoT Agent restarts. This is the suggested setup for demo purposes. If you prefer to configure the IoTA 
to be stateful, a MongoDB connection can be configured. To do so, in the same file, change the `deviceRegistry` object
to the following:
```
        deviceRegistry: {
            type: 'mongodb',
            host: 'localhost',
            port: '27017',
            db: 'iotagent'
        },

```

### Execute
You can execute the IoT Agent from the command line with the following commands:
```
cd /opt/iotagent-onem2m
nohup bin/iotagent-onem2m &> /var/log/iotagentM2M&
```
This will execute the process in the background. If you installed the IoTAgent using RPMs, a Linux Service will be used
instead.

## <a name="provisioning"/> Device Provisioning
In order to use a Device with our recently deployed IoT Agent, we have to register it first. To do so, send a POST
request to the URL `/iot/devices` with the following headers:
- `fiware-service` : name of the service where the device will be provisioned
- `fiware-servicepath` : with the name of the FIWARE Subservice where the device data will be stored. 
- `content-type`: `application/json`.

and the following payload:
```json
{
    "devices": [
        {
            "device_id": "barrier1",
            "protocol": "ONEM2M",
            "entity_name": "sensors:Barrier1",
            "entity_type": "Barrier",
            "timezone": "America/Santiago",
            "lazy": [
                {
                    "name": "Barrier",
                    "type": "text"
                }
            ]
        }
    ]
}
```
This will provision a simple device with a single lazy attribute (that will be used as a command for the OneM2M platform). 
The attribute will be mapped to the `barrier1` AE and `Barrier` Container.

## <a name="command"/> Sending a command
In order to send a command to the device we have just provisioned, an updateContext request has to bee send to the 
Context Broker.

All updateContext requests are HTTP POST requests to the `/updateContext` path of the IoT Agent administration port
(4048 in the default config file). The same headers that were used to provisioned the device should be used in all
the queries.

The following is an example payload of a request to update the `Barrier` attribute to the value `on`:
```json
{
    "contextElements": [
        {
            "type": "Barrier",
            "isPattern": "false",
            "id": "sensors:Barrier1",
            "attributes": [
                {
                    "name": "Barrier",
                    "type": "text",
                    "value": "on"
                }
            ]
        }
    ],
    "updateAction": "UPDATE"
}
```
## <a name="measures"/> Receiving measures (experimental)
The IoT Agent also has the ability to subscribe to the modifications in active attributes in the device side. To use this
feature, provision a device with declared active attributes, like the following:
```json
{
  "devices": [
    {
      "device_id": "weatherStation1",
      "protocol": "ONEM2M",
      "entity_name": "sensors:weatherStation1",
      "entity_type": "WeatherStation",
      "timezone": "America/Santiago",
      "active": [
        {
          "name": "temperature",
          "type": "text"
        }
      ]
    }
  ]
}
```
Once the device is provisioned, whenever a content instance is created in the device container, the corresponding value
will be updated in the Context Broker.
