#!/usr/bin/env node

/*
 * Copyright 2014 Telefonica Investigación y Desarrollo, S.A.U
 *
 * This file is part of fiware-iotagent-lib
 *
 * fiware-iotagent-lib is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * fiware-iotagent-lib is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with fiware-iotagent-lib.
 * If not, seehttp://www.gnu.org/licenses/.
 *
 * For those usages not covered by the GNU Affero General Public License
 * please contact with::[contacto@tid.es]
 */
'use strict';

var config = require('../lib/services/configService'),
    aeService = require('../lib/services/oneM2M/aeService'),
    containerService = require('../lib/services/oneM2M/containerService'),
    resourceService = require('../lib/services/oneM2M/resourceService'),
    subscriptionService = require('../lib/services/oneM2M/subscriptionService'),
    clUtils = require('command-node');

function exitAgent(command) {
    process.exit(0);
}

function createNamedHandler(name, operation) {
    return function(error, result) {
        if (error) {
            console.log('Error in ' + operation + ' ' + name +' operation ' + ': %s', error);
        } else {
            console.log('AE successfully ' + operation + ' operation');

            if (result) {
                console.log('\nResult:\n %s\n\n', JSON.stringify(result, null, 4));
            }
        }

        clUtils.prompt();
    };
}

function aeCreate(command) {
    aeService.createAE(command[0], createNamedHandler('AE', 'create'));
}

function aeRemove(command) {
    aeService.removeAE(command[0], createNamedHandler('AE', 'remove'));
}

function containerGet(command) {
    containerService.get(command[0], command[1], createNamedHandler('Container', 'get'));
}

function containerCreate(command) {
    containerService.create(command[0], command[1], createNamedHandler('Container', 'create'));
}

function containerRemove(command) {
    containerService.remove(command[0], command[1], createNamedHandler('Container', 'remove'));
}

function contentGet(command) {
    resourceService.get(command[0], command[1], command[2], createNamedHandler('Content', 'get'));
}

function contentCreateText(command) {
    resourceService.createText(command[0], command[1], command[2], command[3], createNamedHandler('Content', 'create'));
}

function contentRemove(command) {
    resourceService.remove(command[0], command[1], command[2], createNamedHandler('Content', 'remove'));
}

function subscriptionGet(command) {
    subscriptionService.get(command[0], command[1], command[2], createNamedHandler('Subscription', 'get'));
}

function subscriptionCreate(command) {
    subscriptionService.create(command[0], command[1], command[2], createNamedHandler('Subscription', 'create'));
}

function subscriptionRemove(command) {
    subscriptionService.remove(command[0], command[1], command[2], createNamedHandler('Subscription', 'remove'));
}

function getConfig(command) {
    console.log('Current configuration:\n\n%s\n\n', JSON.stringify(config.getConfig().oneM2M, null, 4));

    clUtils.prompt();
}

function setConfig(command) {
    config.getConfig().oneM2M.host = command[0];
    config.getConfig().oneM2M.port = command[1];
    config.getConfig().oneM2M.cseBase = command[2];

    console.log('New configuration saved');

    clUtils.prompt();
}

var commands = {
    'AECreate': {
        parameters: ['name'],
        description: '\tCreate a new AE with the given name',
        handler: aeCreate
    },
    'AERemove': {
        parameters: ['name'],
        description: '\tRemove the selected AE',
        handler: aeRemove
    },
    'containerGet': {
        parameters: ['ae', 'name'],
        description: '\tGet all the information about the selected container in the AE',
        handler: containerGet
    },
    'containerCreate': {
        parameters: ['ae', 'name'],
        description: '\tCreate a new container with the given name in the selected AE',
        handler: containerCreate
    },
    'containerRemove': {
        parameters: ['ae', 'name'],
        description: '\tRemove the selected container from the given AE',
        handler: containerRemove
    },
    'contentGet': {
        parameters: ['ae', 'container', 'name'],
        description: '\tGet all the information about the content instance in the given container and AE',
        handler: contentGet
    },
    'contentCreateText': {
        parameters: ['ae', 'container', 'name', 'content'],
        description: '\tCreate a new content instance under the selected container and AE, with the string passed\n' +
            '\tin the argument as content',
        handler: contentCreateText
    },
    'contentRemove': {
        parameters: ['ae', 'container', 'name'],
        description: '\tRemove the selected content instance from the container and AE',
        handler: contentRemove
    },
    'subscriptionGet': {
        parameters: ['ae', 'container', 'name'],
        description: '\tGet all the information about the subscription in the given container and AE',
        handler: subscriptionGet
    },
    'subscriptionCreate': {
        parameters: ['ae', 'container', 'name'],
        description: '\tCreate a new subscription under the selected container and AE, with the string passed\n' +
        '\tin the argument as content',
        handler: subscriptionCreate
    },
    'subscriptionRemove': {
        parameters: ['ae', 'container', 'name'],
        description: '\tRemove the selected subscription from the container and AE',
        handler: subscriptionRemove
    },
    'getConfig': {
        parameters: [],
        description: '\tShow the current OneM2M config',
        handler: getConfig
    },
    'setConfig': {
        parameters: ['host', 'port', 'cseBase'],
        description: '\tChange the current config',
        handler: setConfig
    },
    'exit': {
        parameters: [],
        description: '\tExit the process\n',
        handler: exitAgent
    }
};

function notificationHandler(result, callback) {
    console.log('Notification received:\n\n%s\n\n', result);
    clUtils.prompt();

    callback(null, '');
}

config.init(require('../config'), function() {
    subscriptionService.start(function() {
        subscriptionService.setNotificationHandler(notificationHandler);
        clUtils.initialize(commands, 'OneM2M client> ');
    });
});