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

function resourceCreationHandler(callback) {
    return function(error, response, result) {
        if (error) {
            callback(error);
        } else {
            extractBodyContainer(commons.mapHeaders(response.headers), result, callback);
        }
    };
}

function createResourceText(application, container, name, content, callback) {
    var parameters = {
            content: content
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
                'X-M2M-NM': name
            },
            method: 'POST',
            body: mustache.render(templates('resourceCreationTemplate'), parameters)
        };

    logger.debug(context, 'Creating Container [%s] for service [%s]', name, application);

    request(optionsCreateContainer, resourceCreationHandler(callback));}

function removeResource(application, container, name, callback) {
    callback();
}

function resourceGetHandler(callback) {
    return function(error, response, result) {
        if (error) {
            callback(error);
        } else {
            extractBodyContainer(commons.mapHeaders(response.headers), result, callback);
        }
    };
}

function getResource(application, container, name, callback) {
    var optionsGetContainer = {
        uri: oneM2MUris.GetResourceTemplate
            .replace('{{Host}}', config().oneM2M.host)
            .replace('{{Port}}', config().oneM2M.port)
            .replace('{{CSEBase}}', config().oneM2M.cseBase)
            .replace('{{AEName}}', application)
            .replace('{{ContName}}', container)
            .replace('{{ResName}}', name),
        headers: {
            'X-M2M-RI': uuid.v4(),
            'X-M2M-Origin': 'Origin'
        },
        method: 'GET'
    };

    logger.debug(context, 'Getting Resource [%s] in container [%s] for service [%s]', name, container, application);

    request(optionsGetContainer, resourceGetHandler(callback));
}

exports.createText = createResourceText;
exports.remove = removeResource;
exports.get = getResource;
