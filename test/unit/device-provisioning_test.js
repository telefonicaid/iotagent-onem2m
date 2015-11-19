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

var iota = require('../../lib/iotagent-onem2m'),
    iotAgentLib = require('iotagent-node-lib'),
    request = require('request'),
    nock = require('nock'),
    should = require('should'),
    utils = require('../tools/utils'),
    config = require('./testConfig'),
    contextBrokerMock,
    oneM2MMock;

describe('Device provisioning', function() {
    var optionsProvision = {
        url: 'http://localhost:' + config.iota.server.port + '/iot/devices',
        method: 'POST',
        json: utils.readExampleFile('./test/unit/deviceProvisioningRequests/provisionNewDevice.json'),
        headers: {
            'fiware-service': 'smartGondor',
            'fiware-servicepath': '/gardens'
        }
    };

    beforeEach(function(done) {
        nock.cleanAll();

        contextBrokerMock = nock('http://10.11.128.16:1026')
            .matchHeader('fiware-service', 'smartGondor')
            .matchHeader('fiware-servicepath', '/gardens')
            .post('/NGSI9/registerContext')
            .reply(200,
            utils.readExampleFile(
                './test/unit/contextAvailabilityResponses/registerProvisionedDeviceSuccess.json'));

        contextBrokerMock
            .matchHeader('fiware-service', 'smartGondor')
            .matchHeader('fiware-servicepath', '/gardens')
            .post('/v1/updateContext')
            .reply(200,
            utils.readExampleFile(
                './test/unit/contextResponses/createProvisionedDeviceSuccess.json'));

        iota.start(config, done);
    });
    afterEach(function(done) {
        iota.stop(function() {
            iotAgentLib.clearAll(done);
        });
    });
    describe('When a new device is provisioned for an unexistent AE', function() {
        beforeEach(function() {
            oneM2MMock = nock('http://mockedonem2m.com:4567')
                .get('/Mobius/AE-smartGondor_gardens')
                .reply(
                    404,
                    utils.readExampleFile('./test/unit/oneM2MResponses/AEGetSuccess.xml', true),
                    {
                        'X-M2M-RI': '123450e17f923-a5b0-436a-b7f2-4a17d0c1410b',
                        'X-M2M-RSC': '2000'
                    });

            oneM2MMock
                .post('/Mobius')
                .matchHeader('X-M2M-NM', 'smartGondor_gardens')
                .reply(
                    201,
                    utils.readExampleFile('./test/unit/oneM2MResponses/AECreationSuccess.xml', true),
                    {
                        'X-M2M-RI': '123450e17f923-a5b0-436a-b7f2-4a17d0c1410b',
                        'X-M2M-RSC': '2001'
                    });

            oneM2MMock
                .post('/Mobius/AE-smartGondor_gardens')
                .matchHeader('X-M2M-RI', /^[a-f0-9\-]*$/)
                .matchHeader('X-M2M-Origin', 'Origin')
                .matchHeader('X-M2M-NM', 'onem2mdevice')
                .matchHeader('Content-Type', 'application/vnd.onem2m-res+xml;ty=3')
                .matchHeader('Accept', 'application/xml')
                .reply(
                201,
                utils.readExampleFile('./test/unit/oneM2MResponses/ContainerCreationSuccess.xml', true),
                {
                    'X-M2M-RI': '123450e17f923-a5b0-436a-b7f2-4a17d0c1410b',
                    'X-M2M-RSC': '2001'
                });

            oneM2MMock
                .post('/Mobius/AE-smartGondor_gardens/container-onem2mdevice')
                .matchHeader('X-M2M-RI', /^[a-f0-9\-]*$/)
                .matchHeader('X-M2M-Origin', 'Origin')
                .matchHeader('X-M2M-NM', 'subs_onem2mdevice')
                .matchHeader('Content-Type', 'application/vnd.onem2m-res+xml;ty=23')
                .matchHeader('Accept', 'application/xml')
                .reply(
                    200,
                    utils.readExampleFile('./test/unit/oneM2MResponses/subscriptionCreationSuccess.xml', true),
                    {
                        'X-M2M-RI': '123450e17f923-a5b0-436a-b7f2-4a17d0c1410b',
                        'X-M2M-RSC': '2001'
                    });
        });

        it('should return without error', function(done) {
            request(optionsProvision, function(error, response, body) {
                should.not.exist(error);
                response.statusCode.should.equal(201);
                contextBrokerMock.done();
                done();
            });
        });
        it('should create the AE and the container and subscribe to its events', function(done) {
            request(optionsProvision, function(error, response, body) {
                oneM2MMock.done();
                done();
            });
        });
    });
    describe('When a new device is provisioned for an existent AE', function() {
        beforeEach(function() {
            oneM2MMock = nock('http://mockedonem2m.com:4567')
                .get('/Mobius/AE-smartGondor_gardens')
                .reply(
                200,
                utils.readExampleFile('./test/unit/oneM2MResponses/AEGetSuccess.xml', true),
                {
                    'X-M2M-RI': '123450e17f923-a5b0-436a-b7f2-4a17d0c1410b',
                    'X-M2M-RSC': '2000'
                });

            oneM2MMock
                .post('/Mobius/AE-smartGondor_gardens')
                .matchHeader('X-M2M-RI', /^[a-f0-9\-]*$/)
                .matchHeader('X-M2M-Origin', 'Origin')
                .matchHeader('X-M2M-NM', 'onem2mdevice')
                .matchHeader('Content-Type', 'application/vnd.onem2m-res+xml;ty=3')
                .matchHeader('Accept', 'application/xml')
                .reply(
                201,
                utils.readExampleFile('./test/unit/oneM2MResponses/ContainerCreationSuccess.xml', true),
                {
                    'X-M2M-RI': '123450e17f923-a5b0-436a-b7f2-4a17d0c1410b',
                    'X-M2M-RSC': '2001'
                });

            oneM2MMock
                .post('/Mobius/AE-smartGondor_gardens/container-onem2mdevice')
                .matchHeader('X-M2M-RI', /^[a-f0-9\-]*$/)
                .matchHeader('X-M2M-Origin', 'Origin')
                .matchHeader('X-M2M-NM', 'subs_onem2mdevice')
                .matchHeader('Content-Type', 'application/vnd.onem2m-res+xml;ty=23')
                .matchHeader('Accept', 'application/xml')
                .reply(
                200,
                utils.readExampleFile('./test/unit/oneM2MResponses/subscriptionCreationSuccess.xml', true),
                {
                    'X-M2M-RI': '123450e17f923-a5b0-436a-b7f2-4a17d0c1410b',
                    'X-M2M-RSC': '2001'
                });
        });

        it('should not create the AE', function(done) {
            request(optionsProvision, function(error, response, body) {
                should.not.exist(error);
                response.statusCode.should.equal(201);
                contextBrokerMock.done();
                done();
            });
        });
    });
});
