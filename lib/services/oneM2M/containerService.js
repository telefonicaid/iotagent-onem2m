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
    errors = require('../../errors'),
    mustache = require('mustache'),
    uuid = require('node-uuid'),
    request = require('request'),
    oneM2MUris = require('./oneM2MUris.json'),
    context = {
        op: 'IoTAgentOneM2M.Client'
    },
    config = require('../configService').getConfig,
    templates = require('../configService').getTemplate,
    commons = require('./commonOneM2M'),
    extractBodyContainer = commons.generateBodyExtractor(
        ['RTY', 'RI', 'RN', 'PI', 'CT', 'LT', 'CR', 'CNI', 'CBS', 'ST', 'CONTAINERTYPE', 'HEARTBEATPERIOD']);

/**
 * Generates a function that handles the response of a creation container request from OneM2M
 *
 * @return {Function}          Request handler for creation container requests.
 */
function containerCreationHandler(callback) {
    return function(error, response, result) {
        if (error) {
            callback(error);
        } else {
            extractBodyContainer(commons.mapHeaders(response.headers), result, callback);
        }
    };
}

/**
 * Creates a new container under the specified AE.
 *
 * @param {String} application      Name of the AE that will hold the container.
 * @param {String} name             Name of the container to be created.
 */
function createContainer(application, name, callback) {
    var parameters = {
            serviceName: application
        },
        optionsCreateContainer = {
            uri: oneM2MUris.ContainerCreationTemplate
                .replace('{{Host}}', config().oneM2M.host)
                .replace('{{Port}}', config().oneM2M.port)
                .replace('{{CSEBase}}', config().oneM2M.cseBase)
                .replace('{{AEName}}', application),
            headers: {
                'X-M2M-RI': uuid.v4(),
                'X-M2M-Origin': 'Origin',
                'X-M2M-NM': name,
                'Content-Type': 'application/vnd.onem2m-res+xml;ty=3',
                'Accept': 'application/xml'
            },
            method: 'POST',
            body: mustache.render(templates('containerCreationTemplate'), parameters)
        };

    logger.debug(context, 'Creating Container [%s] for service [%s] with request:\n%s\n\n',
        name, application, JSON.stringify(optionsCreateContainer, null, 4));

    request(optionsCreateContainer, containerCreationHandler(callback));
}

/**
 * Generates a function that handles the response of a remove container request from OneM2M
 *
 * @return {Function}          Request handler for remove container requests.
 */
function containerRemovalHandler(callback) {
    return function(error, response, result) {
        if (error) {
            callback(error);
        } else {
            callback();
        }
    };
}

/**
 * Remove the selected container from the AE specified.
 *
 * @param {String} serviceName      Name of the AE holding the container.
 * @param {String} name             Name of the container to be removed.
 */
function removeContainer(serviceName, name, callback) {
    var optionsRemoveContainer = {
        uri: oneM2MUris.GetContainerTemplate
            .replace('{{Host}}', config().oneM2M.host)
            .replace('{{Port}}', config().oneM2M.port)
            .replace('{{CSEBase}}', config().oneM2M.cseBase)
            .replace('{{AEName}}', serviceName)
            .replace('{{ContName}}', name),
        headers: {
            'X-M2M-RI': uuid.v4(),
            'X-M2M-Origin': 'Origin',
            'Accept': 'application/xml'
        },
        method: 'DELETE'
    };

    logger.debug(context, 'Removing Container [%s] for service [%s] with request:\n%s\n\n',
        name, serviceName, JSON.stringify(optionsRemoveContainer, null, 4));

    request(optionsRemoveContainer, containerRemovalHandler(callback));
}

/**
 * Generates a function that handles the response of a get container request from OneM2M
 *
 * @return {Function}          Request handler for get container requests.
 */
function containerGetHandler(callback) {
    return function(error, response, result) {
        if (error) {
            callback(error);
        } else if (response.statusCode === 200) {
            extractBodyContainer(commons.mapHeaders(response.headers), result, callback);
        } else if (response.statusCode === 404) {
            callback(new errors.NotFound());
        } else {
            callback(new errors.OneM2MUnknownError(response.statusCode));
        }
    };
}

/**
 * Gets all the information about a container.
 *
 * @param {String} serviceName          Name of the AE holding the container.
 * @param {String} name                 Name of the container to get.
 */
function getContainer(serviceName, name, callback) {
    var optionsGetContainer = {
        uri: oneM2MUris.GetContainerTemplate
            .replace('{{Host}}', config().oneM2M.host)
            .replace('{{Port}}', config().oneM2M.port)
            .replace('{{CSEBase}}', config().oneM2M.cseBase)
            .replace('{{AEName}}', serviceName)
            .replace('{{ContName}}', name),
        headers: {
            'X-M2M-RI': uuid.v4(),
            'X-M2M-Origin': 'Origin',
            'Accept': 'application/xml'
        },
        method: 'GET'
    };

    logger.debug(context, 'Getting Container [%s] for service [%s] with request:\n%s\n\n',
        name, serviceName, JSON.stringify(optionsGetContainer, null, 4));

    request(optionsGetContainer, containerGetHandler(callback));
}

exports.create = createContainer;
exports.remove = removeContainer;
exports.get = getContainer;
