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

var aeMgmt = require('../../lib/services/oneM2M/containerService'),
    nock = require('nock'),
    should = require('should'),
    utils = require('../tools/utils'),
    config = require('./testConfig'),
    oneM2MMock;

describe('OneM2M module', function() {
    describe('When a user creates a container', function() {
        var expectedResult = {
            rty: '2',
            ri: 'AE00000000000000000048',
            rn: 'SmartGondor',
            pi: 'Mobius',
            ct: '2015-11-16T15:05:23+01:00',
            lt: '2015-11-16T15:05:23+01:00',
            api: 'SmartGondor',
            aei: 'S00000000000000000048',
            poa: '',
            rsc: '2001'
        };

        beforeEach(function(done) {
            nock.cleanAll();

            oneM2MMock = nock('http://mockedOneM2M.com:4567')
                .matchHeader('X-M2M-RI', /^[a-f0-9\-]*$/)
                .matchHeader('X-M2M-Origin', 'Origin')
                .matchHeader('X-M2M-NM', 'gardens')
                .post('/Mobius/AE-ae001',
                    utils.readExampleFile('./test/unit/oneM2MRequests/ContainerCreation.xml', true))
                .reply(
                    200,
                    utils.readExampleFile('./test/unit/oneM2MResponses/ContainerCreationSuccess.xml', true),
                    {
                        'X-M2M-RI': '123450e17f923-a5b0-436a-b7f2-4a17d0c1410b',
                        'X-M2M-RSC': '2001'
                    });

            aeMgmt.init(config, done);
        });

        it('should send an create content instance with type container to the OneM2M endpoint');
    });
    describe('When a user gets a container', function() {
        it('should return all the information from the container');
    });
    describe('When a user removes a container', function() {
        it('should send an remove content instance for the selected container to the OneM2M endpoint');
    });
});