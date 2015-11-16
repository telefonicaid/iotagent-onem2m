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
    errors = require('../errors'),
    uuid = require('node-uuid'),
    request = require('request'),
    async = require('async'),
    fs = require('fs'),
    path = require('path'),
    oneM2MUris = require('./oneM2MUris.json'),
    _ = require('underscore'),
    context = {
        op: 'IoTAgentOneM2M.Client'
    },
    config,
    templates = {};

function extractHeadersAE(response) {
    var values = {};

    return values;
}

function extractBodyAE(response) {
    var values = {};

    return values;
}

function AECreationHandler(callback) {
    return function(error, response, result) {
        if (error) {
            callback(error);
        } else {
            var headerInfo = extractHeadersAE(response),
                bodyInfo = extractBodyAE(response);

            callback(null, _.extendOwn(headerInfo, bodyInfo));
        }
    }
}

function createAE(serviceName, callback) {
    var parameters = {
            serviceName: serviceName
        },
        optionsCreateAE = {
            uri: oneM2MUris['AECreationTemplate']
                .replace('{{Host}}', config.oneM2M.host)
                .replace('{{Port}}', config.oneM2M.port)
                .replace('{{CSEBase}}', config.oneM2M.cseBase),
            headers: {
                'X-M2M-RI': uuid.v4(),
                'X-M2M-Origin': 'Origin',
                'X-M2M-NM': serviceName
            },
            method: 'POST',
            body: mustache.render(templates['AECreationTemplate'], parameters)
        };

    request(optionsCreateAE, AECreationHandler(callback));
}

function loadTemplates(callback) {
    logger.debug('Loading OneM2M Protocol Templates');

    async.series([
        async.apply(fs.readFile, path.join(__dirname, '../templates/AECreation.xml'), 'utf8'),
    ], function templateLoaded(error, results) {
        if (error) {
            logger.fatal('[VALIDATION-FATAL-001] Validation Request templates not found');
            callback(errors.TemplateLoadingError(error));
        } else {
            templates['AECreationTemplate'] = results[0];
            callback();
        }
    });
}

function init(newConfig, callback) {
    config = newConfig;

    loadTemplates(callback);
}

exports.init = init;
exports.createAE = createAE;
