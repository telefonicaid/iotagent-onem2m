'use strict';

describe('OneM2M module', function() {
    describe('When a user creates a new Application Entity', function() {
        it('should send an XML creation request to the OneM2M endpoint');
    });
    describe('When a user removes an Application Entity', function() {
        it('should send an XML remove request to the OneM2M endpoint');
    });
    describe('When a user creates a container', function() {
        it('should send an create content instance with type container to the OneM2M endpoint');
    });
    describe('When a user removes a container', function() {
        it('should send an remove content instance for the selected container to the OneM2M endpoint');
    });
    describe('When a user creates a resource', function() {
        it('should send an create content instance with type resource to the OneM2M endpoint');
    });
    describe('When a user removes a resource', function() {
        it('should send an remove content instance for the selected resource to the OneM2M endpoint');
    });
});
