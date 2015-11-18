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

var util = require('util');

var errors = {
    TemplateLoadingError: function(e) {
        this.name = 'TEMPLATE_LOADING_ERROR';
        this.message = 'There was an error loading the templates for OneM2M protocol: ' + e.message;
        this.code = 500;
    },
    BadInputError: function(msg) {
        this.name = 'BAD_INPUT_ERROR';
        this.message = 'The OneM2M client request was not well formed due to the following error' + msg;
        this.code = 400;
    },
    OneM2MUnknownError: function(code) {
        this.name = 'ONEM2M_UNKNOWN_ERROR';
        this.message = 'Unknown status code returned connecting with OneM2M';
        this.code = code;
    },
    WrongXmlPayload: function() {
        this.name = 'WRONG_XML_PAYLOAD';
        this.message = 'The system wasn\'t able to parse the given XML payload';
        this.code = 400;
    }
};

for (var errorFn in errors) {
    if (errors.hasOwnProperty(errorFn)) {
        util.inherits(errors[errorFn], Error);
    }
}

module.exports = errors;
