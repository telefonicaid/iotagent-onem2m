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

describe.skip('Lazy attribute processing', function() {
    var optionsProvision = {
            url: 'http://localhost:' + config.iota.server.port + '/iot/devices',
            method: 'POST',
            json: utils.readExampleFile('./test/unit/deviceProvisioningRequests/provisionNewDevice.json'),
            headers: {
                'fiware-service': 'smartGondor',
                'fiware-servicepath': '/gardens'
            }
        },
        lazyRequest = {
            uri: 'http://localhost:' + config.iota.server.port + '/v1/updateContext',
            method: 'POST',
            json: utils.readExampleFile('./test/unit/contextRequests/lazyRequest.json'),
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

        contextBrokerMock
            .post('/v1/updateContext')
            //utils.readExampleFile('./test/unit/contextRequests/updateNotificationValue.json'))
            .matchHeader('fiware-service', 'smartGondor')
            .matchHeader('fiware-servicepath', '/gardens')
            .reply(200, utils.readExampleFile('./test/unit/contextResponses/createProvisionedDeviceSuccess.json'));

        oneM2MMock = nock('http://mockedonem2m.com:4567')
            .get('/Mobius/AE-onem2mdevice')
            .reply(
            200,
            utils.readExampleFile('./test/unit/oneM2MResponses/AEGetSuccess.xml', true),
            {
                'X-M2M-RI': '123450e17f923-a5b0-436a-b7f2-4a17d0c1410b',
                'X-M2M-RSC': '2000'
            });

        oneM2MMock
            .post('/Mobius/AE-onem2mdevice')
            .matchHeader('X-M2M-RI', /^[a-f0-9\-]*$/)
            .matchHeader('X-M2M-Origin', 'Origin')
            .matchHeader('X-M2M-NM', 'luminance')
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
            .post('/Mobius/AE-onem2mdevice/container-luminance')
            .matchHeader('X-M2M-RI', /^[a-f0-9\-]*$/)
            .matchHeader('X-M2M-Origin', 'Origin')
            .matchHeader('X-M2M-NM', 'subs_luminance')
            .matchHeader('Content-Type', 'application/vnd.onem2m-res+xml;ty=23')
            .matchHeader('Accept', 'application/xml')
            .reply(
            200,
            utils.readExampleFile('./test/unit/oneM2MResponses/subscriptionCreationSuccess.xml', true),
            {
                'X-M2M-RI': '123450e17f923-a5b0-436a-b7f2-4a17d0c1410b',
                'X-M2M-RSC': '2001'
            });

        iota.start(config, function() {
            request(optionsProvision, done);
        });
    });
    afterEach(function(done) {
        iota.stop(function() {
            iotAgentLib.clearAll(done);
        });
    });

    describe('When a lazy attribute request comes to the IOTAgent', function(done) {
        beforeEach(function(done) {
            oneM2MMock = nock('http://mockedOneM2M.com:4567')
                .matchHeader('X-M2M-RI', /^[a-f0-9\-]*$/)
                .matchHeader('X-M2M-Origin', 'Origin')
                .matchHeader('X-M2M-NM', /luminance.*/)

                .matchHeader('Content-Type', 'application/vnd.onem2m-res+xml;ty=4')
                .matchHeader('Accept', 'application/xml')
                .post('/Mobius/AE-onem2mdevice/container-luminance',
                    utils.readExampleFile('./test/unit/oneM2MRequests/resourceCreation.xml', true))
                .reply(
                200,
                utils.readExampleFile('./test/unit/oneM2MResponses/resourceCreationSuccess.xml', true),
                {
                    'X-M2M-RI': '123450e17f923-a5b0-436a-b7f2-4a17d0c1410b',
                    'X-M2M-RSC': '2001'
                });

            done();
        });

        it('should return a valid response', function(done) {
            request(lazyRequest, function(error, response, body) {
                should.exist(body);
                body.should.deepEqual(
                    utils.readExampleFile('./test/unit/contextResponses/lazyRequestSuccess.json'));

                done();
            });
        });
        it('should create a content instance for the attribute with a randomize portion', function(done) {
            request(lazyRequest, function(error, response, body) {
                oneM2MMock.done();
                done();
            });
        });
    });
});
