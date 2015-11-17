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

var sax = require('sax');

/**
 * Extract the attributes from the XML response body of a Create AE operation, adding them to the object passed in the
 * 'initialValue' parameter.
 *
 * @param {Object} initialValue         Initial object where the found  attributes will be added.
 * @param {String} body                 String representation of the operation response.
 */
function generateBodyExtractor(fields) {
    return function bodyExtractor(initialValue, body, callback) {
        var parser = sax.parser(true),
            attributeNames = fields,
            currentAttribute,
            values = initialValue;

        parser.onerror = function(e) {
            var error = new errors.WrongXmlPayload();

            error.moreInfo = e;
            callback(error);
        };

        parser.ontext = function(t) {
            if (currentAttribute) {
                values[currentAttribute] += t.trim();
            }
        };

        parser.onopentag = function(node) {
            if (attributeNames.indexOf(node.name.toUpperCase()) >= 0) {
                currentAttribute = node.name;
                values[currentAttribute] = '';
            }
        };

        parser.onend = function() {
            callback(null, values);
        };

        parser.write(body).close();    };
}

/**
 * Read the headers of the operation and map them into an object with the OneM2M short names of the selected attributes.
 *
 * @param {Object} headers      Map containing the response headers.
 * @return {Object}            Map containing the headers with its names translated to OneM2M short names.
 */
function mapHeaders(headers) {
    var newHeaders = {};

    newHeaders.rsc = headers['x-m2m-rsc'];

    return newHeaders;
}

exports.generateBodyExtractor = generateBodyExtractor;
exports.mapHeaders = mapHeaders;