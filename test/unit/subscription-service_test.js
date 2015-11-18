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

var subscriptionService = require('../../lib/services/oneM2M/subscriptionService'),
    configService = require('../../lib/services/configService'),
    logger = require('logops'),
    nock = require('nock'),
    should = require('should'),
    utils = require('../tools/utils'),
    request = require('request'),
    config = require('./testConfig'),
    oneM2MMock;

describe('OneM2M module: Subscriptions', function() {
    beforeEach(function(done) {
        configService.init(config, done);
    });

    describe('When a user creates a subscription', function() {
        var expectedResult = {
            rty: '23',
            ri: 'SS00000000000000000017',
            rn: 'subscription_1',
            pi: 'CT00000000000000000048',
            ct: '2015-11-17T16:22:26+01:00',
            lt: '2015-11-17T16:22:26+01:00',
            rss: '1',
            nu: 'http://localhost:7654/notification',
            pn: '1',
            nct: '2',
            rsc: '2001'
        };

        beforeEach(function(done) {
            nock.cleanAll();

            logger.setLevel('FATAL');

            oneM2MMock = nock('http://mockedOneM2M.com:4567')
                .matchHeader('X-M2M-RI', /^[a-f0-9\-]*$/)
                .matchHeader('X-M2M-Origin', 'Origin')
                .matchHeader('X-M2M-NM', 'subscription_1')
                .matchHeader('Content-Type', 'application/vnd.onem2m-res+xml;ty=23')
                .matchHeader('Accept', 'application/xml')
                .post('/Mobius/AE-SmartGondor/container-gardens',
                    utils.readExampleFile('./test/unit/oneM2MRequests/subscriptionCreation.xml', true))
                .reply(
                    200,
                    utils.readExampleFile('./test/unit/oneM2MResponses/subscriptionCreationSuccess.xml', true),
                    {
                        'X-M2M-RI': '123450e17f923-a5b0-436a-b7f2-4a17d0c1410b',
                        'X-M2M-RSC': '2001'
                    });

            done();
        });

        it('should send a create subscription request to the OneM2M endpoint', function(done) {
            subscriptionService.create('SmartGondor', 'gardens', 'subscription_1', function(error, result) {
                should.not.exist(error);
                oneM2MMock.done();
                done();
            });
        });

        it('should return all the response fields', function(done) {
            subscriptionService.create('SmartGondor', 'gardens', 'subscription_1', function(error, result) {
                should.exist(result);
                result.should.deepEqual(expectedResult);
                done();
            });
        });
    });
    describe('When a user retrieves a subscription', function() {
        var expectedResult = {
            rty: '23',
            ri: 'SS00000000000000000017',
            rn: 'subscription_1',
            pi: 'CT00000000000000000048',
            ct: '2015-11-17T16:22:26+01:00',
            lt: '2015-11-17T16:22:26+01:00',
            rss: '1',
            nu: 'http://localhost:7654/notification',
            pn: '1',
            nct: '2',
            rsc: '2000'
        };

        beforeEach(function(done) {
            nock.cleanAll();

            oneM2MMock = nock('http://mockedOneM2M.com:4567')
                .matchHeader('X-M2M-RI', /^[a-f0-9\-]*$/)
                .matchHeader('X-M2M-Origin', 'Origin')
                .matchHeader('Accept', 'application/xml')
                .get('/Mobius/AE-SmartGondor/container-gardens/subscription-subscription_1')
                .reply(
                200,
                utils.readExampleFile('./test/unit/oneM2MResponses/subscriptionGetSuccess.xml', true),
                {
                    'X-M2M-RI': '123450e17f923-a5b0-436a-b7f2-4a17d0c1410b',
                    'X-M2M-RSC': '2000'
                });

            configService.init(config, done);
        });

        it('should send a get subscription request to the OneM2M endpoint', function(done) {
            subscriptionService.get('SmartGondor', 'gardens', 'subscription_1', function(error, result) {
                should.not.exist(error);
                should.exist(result);
                result.should.deepEqual(expectedResult);
                done();
            });
        });
    });
    describe('When a user removes a subscription', function() {
        beforeEach(function(done) {
            nock.cleanAll();

            oneM2MMock = nock('http://mockedOneM2M.com:4567')
                .matchHeader('X-M2M-RI', /^[a-f0-9\-]*$/)
                .matchHeader('Accept', 'application/xml')
                .matchHeader('X-M2M-Origin', 'Origin')['delete']('/Mobius/AE-SmartGondor/container-gardens' +
                    '/subscription-subscription_1')
                .reply(
                200,
                {
                    'X-M2M-RI': '123450e17f923-a5b0-436a-b7f2-4a17d0c1410b',
                    'X-M2M-RSC': '2002'
                });

            configService.init(config, done);
        });

        it('should send a remove subscription request to the OneM2M endpoint', function(done) {
            subscriptionService.remove('SmartGondor', 'gardens', 'subscription_1', function(error, result) {
                should.not.exist(error);
                oneM2MMock.done();
                done();
            });
        });
    });
    describe('When a notification arrives to the notification endpoint', function() {
        var expectedResult = {
            rty: '4',
            ri: 'CI00000000000000000047',
            rn: 'contentInstance1',
            pi: 'CT00000000000000000055',
            ct: '2015-11-18T16:38:41+01:00',
            lt: '2015-11-18T16:38:41+01:00',
            st: '4',
            cr: 'AE00000000000000000060',
            cnf: 'text',
            cs: '3',
            con: '101'
        };

        var notificationRequest = {
                uri: 'http://localhost:7654/notifications',
                method: 'POST',
                body: utils.readExampleFile('./test/unit/oneM2MResponses/oneM2MNotification.xml', true)
            };

        beforeEach(function(done) {
            subscriptionService.start(done);
        });

        afterEach(function(done) {
            subscriptionService.stop(done);
        });

        it('should return a 200 OK', function(done) {
            function testHandler(result, callback) {
                callback(null, '');
            }

            subscriptionService.setNotificationHandler(testHandler);

            request(notificationRequest, function(error, result, body) {
                should.not.exist(error);
                result.statusCode.should.equal(200);
                done();
            });
        });

        it('should execute the notification handler', function(done) {
            var notificationRequest = {
                    uri: 'http://localhost:7654/notifications',
                    method: 'POST',
                    body: utils.readExampleFile('./test/unit/oneM2MResponses/oneM2MNotification.xml', true)
                },
                capturedResult;

            function testHandler(result, callback) {
                capturedResult = result;
                callback(null, '');
            }

            subscriptionService.setNotificationHandler(testHandler);

            request(notificationRequest, function(error, result, body) {
                should.exist(capturedResult);
                capturedResult.should.deepEqual(expectedResult);
                done();
            });
        });
    });
});

