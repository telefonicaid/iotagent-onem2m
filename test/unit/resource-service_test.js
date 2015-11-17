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

var resourceService = require('../../lib/services/oneM2M/resourceService'),
    configService = require('../../lib/services/configService'),
    nock = require('nock'),
    should = require('should'),
    utils = require('../tools/utils'),
    config = require('./testConfig'),
    oneM2MMock;

describe('OneM2M module: Content instances', function() {
    describe('When a user creates a resource', function() {
        var expectedResult = {
            rty: '4',
            ri: 'CI00000000000000000042',
            rn: 'testDevice',
            pi: 'CT00000000000000000048',
            ct: '2015-11-17T12:03:16+01:00',
            lt: '2015-11-17T12:03:16+01:00',
            st: '1',
            cr: 'AE00000000000000000052',
            cnf: 'text',
            cs: '3',
            con: '101',
            rsc: '2001'
        };

        beforeEach(function(done) {
            nock.cleanAll();

            oneM2MMock = nock('http://mockedOneM2M.com:4567')
                .matchHeader('X-M2M-RI', /^[a-f0-9\-]*$/)
                .matchHeader('X-M2M-Origin', 'Origin')
                .matchHeader('X-M2M-NM', 'testDevice')
                .post('/Mobius/AE-SmartGondor/container-gardens',
                utils.readExampleFile('./test/unit/oneM2MRequests/resourceCreation.xml', true))
                .reply(
                200,
                utils.readExampleFile('./test/unit/oneM2MResponses/resourceCreationSuccess.xml', true),
                {
                    'X-M2M-RI': '123450e17f923-a5b0-436a-b7f2-4a17d0c1410b',
                    'X-M2M-RSC': '2001'
                });

            configService.init(config, done);
        });

        it('should send a create content instance with type resource to the OneM2M endpoint', function(done) {
            resourceService.createText('SmartGondor', 'gardens', 'testDevice', '101', function(error, result) {
                should.not.exist(error);
                oneM2MMock.done();
                done();
            });
        });

        it('should return all the response fields', function(done) {
            resourceService.createText('SmartGondor', 'gardens', 'testDevice', '101', function(error, result) {
                should.exist(result);
                result.should.deepEqual(expectedResult);
                done();
            });
        });
    });
    describe('When a user gets a resource', function() {
        var expectedResult = {
            rty: '4',
            ri: 'CI00000000000000000042',
            rn: 'testDevice',
            pi: 'CT00000000000000000048',
            ct: '2015-11-17T12:03:16+01:00',
            lt: '2015-11-17T12:03:16+01:00',
            st: '1',
            cr: 'AE00000000000000000052',
            cnf: 'text',
            cs: '3',
            con: '101',
            rsc: '2000'
        };

        beforeEach(function(done) {
            nock.cleanAll();

            oneM2MMock = nock('http://mockedOneM2M.com:4567')
                .matchHeader('X-M2M-RI', /^[a-f0-9\-]*$/)
                .matchHeader('X-M2M-Origin', 'Origin')
                .get('/Mobius/AE-SmartGondor/container-gardens/contentInstance-testDevice')
                .reply(
                200,
                utils.readExampleFile('./test/unit/oneM2MResponses/resourceGetSuccess.xml', true),
                {
                    'X-M2M-RI': '123450e17f923-a5b0-436a-b7f2-4a17d0c1410b',
                    'X-M2M-RSC': '2000'
                });

            configService.init(config, done);
        });

        it('should return all the information from the resource', function(done) {
            resourceService.get('SmartGondor', 'gardens', 'testDevice', function(error, result) {
                should.not.exist(error);
                should.exist(result);
                result.should.deepEqual(expectedResult);
                done();
            });
        });
    });
    describe('When a user removes a resource', function() {
        beforeEach(function(done) {
            nock.cleanAll();

            oneM2MMock = nock('http://mockedOneM2M.com:4567')
                .matchHeader('X-M2M-RI', /^[a-f0-9\-]*$/)
                .matchHeader('X-M2M-Origin', 'Origin')['delete']('/Mobius/AE-SmartGondor/container-gardens' +
                    '/contentInstance-testDevice')
                .reply(
                200,
                {
                    'X-M2M-RI': '123450e17f923-a5b0-436a-b7f2-4a17d0c1410b',
                    'X-M2M-RSC': '2002'
                });

            configService.init(config, done);
        });

        it('should send a remove content instance for the selected resource to the OneM2M endpoint', function(done) {
            resourceService.remove('SmartGondor', 'gardens', 'testDevice', function(error, result) {
                should.not.exist(error);
                oneM2MMock.done();
                done();
            });
        });
    });
});
