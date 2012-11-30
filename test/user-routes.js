var server = require('../server')
  , request = require('supertest')
  , util = require('util');

describe('user routes', function(){
  describe('GET /v1/users/:id', function(){
    it('should respond with 200', function(done){
      request(server)
        .get('/v1/users/craigerm')
        .expect('Content-Type', /json/)
        .expect(200, done);
   });
  });

  describe('PUT /v1/users/:id', function(){
    it('should respond with 204', function(done){
      request(server)
        .put('/v1/users/craigerm')        
        .expect(204, done);
    });
  });

  describe('DELETE /v1/users/:id', function(){
    it('should respond with 204', function(done){
      request(server)
        .del('/v1/users/craigerm')
        .expect(204, done);
    });
  });
});
