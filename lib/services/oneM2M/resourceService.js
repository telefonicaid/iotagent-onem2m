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
        ['RTY', 'RI', 'RN', 'PI', 'CT', 'LT', 'CR', 'CNI', 'CBS', 'ST', 'CNF', 'CON', 'CS']);

/**
 * Generates a function that handles the response of a creation content instance request from OneM2M
 *
 * @return {Function}          Request handler for creation content instance requests.
 */
function resourceCreationHandler(callback) {
    return function(error, response, result) {
        if (error) {
            callback(error);
        } else {
            extractBodyContainer(commons.mapHeaders(response.headers), result, callback);
        }
    };
}

/**
 * Creates a content instance resource whose content type is a simple text.
 *
 * @param {String} application          Application holding the container where the instance will be created.
 * @param {String} container            Container that will be directly holding the instance.
 * @param {String} name                 Name of the content instance to be created.
 * @param {String} content              String content for the newly created content instance.
 * @param {String} type                 Type of content instance to declare in the body.
 */
function createResourceText(application, container, name, content, type, callback) {
    var parameters = {
            content: content,
            type: type
        },
        optionsCreateContainer = {
            uri: oneM2MUris.ResourceCreationTemplate
                .replace('{{Host}}', config().oneM2M.host)
                .replace('{{Port}}', config().oneM2M.port)
                .replace('{{CSEBase}}', config().oneM2M.cseBase)
                .replace('{{AEName}}', application)
                .replace('{{ContName}}', container),
            headers: {
                'X-M2M-RI': uuid.v4(),
                'X-M2M-Origin': 'Origin',
                'X-M2M-NM': name,
                'Accept': 'application/xml',
                'Content-Type': 'application/vnd.onem2m-res+xml;ty=4'
            },
            method: 'POST',
            body: mustache.render(templates('resourceCreationTemplate'), parameters)
        };

    logger.debug(context, 'Creating Container [%s] for service [%s] with request:\n%s\n\n',
        name, application, JSON.stringify(optionsCreateContainer, null, 4));

    request(optionsCreateContainer, resourceCreationHandler(callback));
}

/**
 * Generates a function that handles the response of a remove content instance request from OneM2M
 *
 * @return {Function}          Request handler for remove content instance requests.
 */
function resourceRemovalHandler(callback) {
    return function(error, response, result) {
        if (error) {
            callback(error);
        } else {
            callback();
        }
    };
}

/**
 * Removes a content instance resource from its container.
 *
 * @param {String} application          Application holding the container where the instance was created.
 * @param {String} container            Container directly holding the instance.
 * @param {String} name                 Name of the content instance to be removed.
 */
function removeResource(application, container, name, callback) {
    var optionsRemoveResource = {
        uri: oneM2MUris.GetResourceTemplate
            .replace('{{Host}}', config().oneM2M.host)
            .replace('{{Port}}', config().oneM2M.port)
            .replace('{{CSEBase}}', config().oneM2M.cseBase)
            .replace('{{AEName}}', application)
            .replace('{{ContName}}', container)
            .replace('{{ResName}}', name),
        headers: {
            'X-M2M-RI': uuid.v4(),
            'X-M2M-Origin': 'Origin',
            'Accept': 'application/xml'
        },
        method: 'DELETE'
    };

    logger.debug(context, 'Removing Resource [%s] from Container [%s] for service [%s] with request:\n%s\n\n',
        name, container, application, JSON.stringify(optionsRemoveResource, null, 4));

    request(optionsRemoveResource, resourceRemovalHandler(callback));
}

/**
 * Generates a function that handles the response of a get content instance resource request from OneM2M
 *
 * @return {Function}          Request handler for get content instance requests.
 */
function resourceGetHandler(callback) {
    return function(error, response, result) {
        if (error) {
            callback(error);
        } else {
            extractBodyContainer(commons.mapHeaders(response.headers), result, callback);
        }
    };
}

/**
 * Retrieves all the information about a content instance resource.
 *
 * @param {String} application          Application holding the container where the instance was created.
 * @param {String} container            Container directly holding the instance.
 * @param {String} name                 Name of the content instance to be created.
 */
function getResource(application, container, name, callback) {
    var optionsGetResource = {
        uri: oneM2MUris.GetResourceTemplate
            .replace('{{Host}}', config().oneM2M.host)
            .replace('{{Port}}', config().oneM2M.port)
            .replace('{{CSEBase}}', config().oneM2M.cseBase)
            .replace('{{AEName}}', application)
            .replace('{{ContName}}', container)
            .replace('{{ResName}}', name),
        headers: {
            'X-M2M-RI': uuid.v4(),
            'X-M2M-Origin': 'Origin',
            'Accept': 'application/xml'
        },
        method: 'GET'
    };

    logger.debug(context, 'Getting Resource [%s] in container [%s] for service [%s] with request:\n%s\n\n',
        name, container, application, JSON.stringify(optionsGetResource, null, 4));

    request(optionsGetResource, resourceGetHandler(callback));
}

exports.createText = createResourceText;
exports.remove = removeResource;
exports.get = getResource;
