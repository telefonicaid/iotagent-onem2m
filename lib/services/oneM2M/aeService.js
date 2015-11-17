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

var logger = require('logops'),
    mustache = require('mustache'),
    errors = require('../../errors'),
    sax = require('sax'),
    uuid = require('node-uuid'),
    request = require('request'),
    oneM2MUris = require('./oneM2MUris.json'),
    context = {
        op: 'IoTAgentOneM2M.Client'
    },
    config = require('../configService').getConfig,
    templates = require('../configService').getTemplate,
    commons = require('./commonOneM2M'),
    extractBodyAE = commons.generateBodyExtractor(['RTY', 'RI', 'RN', 'PI', 'CT', 'LT', 'API', 'AEI', 'POA']);

/**
 * Generates a handler for the HTTP call used in creating new AEs.
 *
 * @return {Function}          Handler for a HTTP AE creation request.
 */
function aeCreationHandler(callback) {
    return function(error, response, result) {
        if (error) {
            callback(error);
        } else {
            extractBodyAE(commons.mapHeaders(response.headers), result, callback);
        }
    };
}

/**
 * Creates a new AE in the configured OneM2M access point, using the service name as the AE name.
 *
 * @param {String} serviceName          Name of the service to create as an AE.
 */
function createAE(serviceName, callback) {
    var parameters = {
            serviceName: serviceName
        },
        optionsCreateAE = {
            uri: oneM2MUris.AECreationTemplate
                .replace('{{Host}}', config().oneM2M.host)
                .replace('{{Port}}', config().oneM2M.port)
                .replace('{{CSEBase}}', config().oneM2M.cseBase),
            headers: {
                'X-M2M-RI': uuid.v4(),
                'X-M2M-Origin': 'Origin',
                'X-M2M-NM': serviceName
            },
            method: 'POST',
            body: mustache.render(templates('AECreationTemplate'), parameters)
        };

    logger.debug(context, 'Creating AE for service [%s]', serviceName);

    request(optionsCreateAE, aeCreationHandler(callback));
}

/**
 * Generates a handler for the HTTP call used for removing AEs.
 *
 * @return {Function}          Handler for a HTTP AE removal request.
 */
function aeRemovalHandler(callback) {
    return function(error, response, result) {
        if (error) {
            callback(error);
        } else {
            callback();
        }
    };
}

/**
 * Removes an AE from the configured OneM2M endpoint.
 *
 * @param {String} serviceName      Name of the service to be removed.
 */
function removeAE(serviceName, callback) {
    var optionsRemovalAE = {
            uri: oneM2MUris.AERemovalTemplate
                .replace('{{Host}}', config().oneM2M.host)
                .replace('{{Port}}', config().oneM2M.port)
                .replace('{{CSEBase}}', config().oneM2M.cseBase)
                .replace('{{AEName}}', serviceName),
            headers: {
                'X-M2M-RI': uuid.v4(),
                'X-M2M-Origin': 'Origin'
            },
            method: 'DELETE'
        };

    logger.debug(context, 'Removing AE for service [%s]', serviceName);

    request(optionsRemovalAE, aeRemovalHandler(callback));
}

exports.createAE = createAE;
exports.removeAE = removeAE;
