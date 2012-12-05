var server = require('../server')
  , request = require('supertest')
  , util = require('util');

describe('user routes', function(){
  describe('GET /v1/users/:username', function(){

    it('should respond with 200 if user found', function(done){
      request(server)
        .get('/v1/users/craigerm')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    it('should respond with 404 if user not found', function(done) {
      request(server)
        .get('/v1/users/vcbvcbvbvcb')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });

  });

  describe('PUT /v1/users/:id', function(){
    it('should be unauthorized if no access token', function(done){
      request(server)
        .put('/v1/users/craigerm')        
        .expect(401, done);
    });
  });

  describe('DELETE /v1/users/:id', function(){
    it('should be unauthroized if no access token', function(done){
      request(server)
        .del('/v1/users/craigerm')
        .expect(401, done);
    });
  });
});
