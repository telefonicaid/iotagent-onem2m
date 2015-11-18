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
    extractBodySubscription = commons.generateBodyExtractor(
        ['RTY', 'RI', 'RN', 'PI', 'CT', 'LT', 'RSS', 'NU', 'PN', 'NCT']);

function getNotificationUri() {
    return 'http://' + config().oneM2M.notifications.publicHost + ':' + config().oneM2M.notifications.port +
        config().oneM2M.notifications.path;
}

function subscriptionCreationHandler(callback) {
    return function(error, response, result) {
        if (error) {
            callback(error);
        } else {
            extractBodySubscription(commons.mapHeaders(response.headers), result, callback);
        }
    };
}

function createSubscription(application, container, name, callback) {
    var parameters = {
            uri: getNotificationUri()
        },
        optionsCreateContainer = {
            uri: oneM2MUris.SubscriptionCreationTemplate
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
            body: mustache.render(templates('subscriptionCreationTemplate'), parameters)
        };

    logger.debug(context, 'Creating Subscription [%s] to Container [%s] for service [%s]',
        name, container, application);

    request(optionsCreateContainer, subscriptionCreationHandler(callback));
}

function removeSubscription(application, container, name, callback) {
    callback();
}

function subscriptionGetHandler(callback) {
    return function(error, response, result) {
        if (error) {
            callback(error);
        } else {
            extractBodySubscription(commons.mapHeaders(response.headers), result, callback);
        }
    };
}

function getSubscription(application, container, name, callback) {
    var optionsGetSubscription = {
        uri: oneM2MUris.GetSubscriptionTemplate
            .replace('{{Host}}', config().oneM2M.host)
            .replace('{{Port}}', config().oneM2M.port)
            .replace('{{CSEBase}}', config().oneM2M.cseBase)
            .replace('{{AEName}}', application)
            .replace('{{ContName}}', container)
            .replace('{{SubsName}}', name),
        headers: {
            'X-M2M-RI': uuid.v4(),
            'X-M2M-Origin': 'Origin'
        },
        method: 'GET'
    };

    logger.debug(context, 'Getting Subscription [%s] in container [%s] for service [%s]', name, container, application);

    request(optionsGetSubscription, subscriptionGetHandler(callback));}

exports.create = createSubscription;
exports.remove = removeSubscription;
exports.get = getSubscription;
