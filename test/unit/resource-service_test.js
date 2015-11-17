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

var aeMgmt = require('../../lib/services/oneM2M/aeService'),
    nock = require('nock'),
    should = require('should'),
    utils = require('../tools/utils'),
    config = require('./testConfig'),
    oneM2MMock;

describe('OneM2M module', function() {
    describe('When a user creates a resource', function() {
        it('should send an create content instance with type resource to the OneM2M endpoint');
    });
    describe('When a user gets a resource', function() {
        it('should return all the service information');
    });
    describe('When a user removes a resource', function() {
        it('should send an remove content instance for the selected resource to the OneM2M endpoint');
    });
});
