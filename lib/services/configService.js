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

var errors = require('../errors'),
    fs = require('fs'),
    async = require('async'),
    path = require('path'),
    logger = require('logops'),
    config,
    templates = {};

/**
 * Load all the OneM2M Templates. This function should be invoked just once at the beginnning of the IOTA lifecycle.
 */
function loadTemplates(callback) {
    logger.debug('Loading OneM2M Protocol Templates');

    async.series([
        async.apply(fs.readFile, path.join(__dirname, '../templates/AECreation.xml'), 'utf8'),
        async.apply(fs.readFile, path.join(__dirname, '../templates/containerCreation.xml'), 'utf8')
    ], function templateLoaded(error, results) {
        if (error) {
            logger.fatal('[VALIDATION-FATAL-001] Validation Request templates not found');
            callback(errors.TemplateLoadingError(error));
        } else {
            templates.AECreationTemplate = results[0];
            templates.containerCreationTemplate = results[1];
            callback();
        }
    });
}

function init(newConfig, callback) {
    config = newConfig;

    loadTemplates(callback);
}

function getConfig() {
    return config;
}

function getTemplate(name) {
    return templates[name];
}

exports.init = init;
exports.getConfig = getConfig;
exports.getTemplate = getTemplate;