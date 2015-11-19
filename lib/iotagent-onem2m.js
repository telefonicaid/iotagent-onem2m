/*
 * Copyright 2015 Telefonica Investigación y Desarrollo, S.A.U
 *
 * This file is part of iotagent-onem2m
 *
 * iotagent-onem2m is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * iotagent-onem2m is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with iotagent-onem2m.
 * If not, seehttp://www.gnu.org/licenses/.
 *
 * For those usages not covered by the GNU Affero General Public License
 * please contact with::[contacto@tid.es]
 */

'use strict';

var iotAgentLib = require('iotagent-node-lib'),
    aeService = require('./services/oneM2M/aeService'),
    containerService = require('./services/oneM2M/containerService'),
    subscriptionService = require('./services/oneM2M/subscriptionService'),
    configService = require('./services/configService'),
    logger = require('logops'),
    async = require('async'),
    apply = async.apply,
    context = {
        op: 'IoTAgentOneM2M.Agent'
    },
    config;

/**
 * Creates the Application Entity name based on the service and subservice of the device.
 *
 * @param {String} service      Service of the device.
 * @param {String} subservice   Subservice of the device.
 * @returns {string}            Name of the AE based on the given parameters.
 */
function getAEName(service, subservice) {
    return service + '_' + subservice.replace(/\//g, '');
}

/**
 * Check if a AE with the given name exists, and, if it doesn't creates a new one.
 *
 * @param {String} aeName       Name of the AE to be checked (or create).
 */
function checkAndCreateAE(aeName, callback) {
    aeService.get(aeName, function(error, result) {
        if (error) {
            aeService.createAE(aeName, callback);
        } else {
            callback();
        }
    });
}

/**
 * Handles the incoming device provisioning requests. For each device, the existance of its correspondent AE es tested,
 * and a new container for the AE with the name of the Device ID is created, along with a subscription for the contents
 * of this device.
 *
 * @param {Object} device           Information stored in the IoTA about the device.
 */
function provisioningHandler(device, callback) {
    var aeName = getAEName(device.service, device.subservice);

    async.series([
        apply(checkAndCreateAE, aeName),
        apply(containerService.create, aeName, device.id),
        apply(subscriptionService.create, aeName, device.id, 'subs_' + device.id)
    ], function(error, results) {
        callback(error, device);
    });
}

/**
 * Starts the IOTA with the given configuration.
 *
 * @param {Object} newConfig        New configuration object.
 */

function start(newConfig, callback) {
    logger.setLevel(newConfig.iota.logLevel);

    logger.info(context, 'Starting OneM2M IoT Agent');
    config = newConfig;

    iotAgentLib.setProvisioningHandler(provisioningHandler);

    async.series([
        apply(configService.init, config),
        apply(iotAgentLib.activate, config.iota)
    ], callback);
}

/**
 * Stops the IoT Agent.
 */
function stop(callback) {
    logger.info(context, 'Stopping OneM2M IoT Agent');

    iotAgentLib.deactivate(callback);
}

exports.start = start;
exports.stop = stop;
