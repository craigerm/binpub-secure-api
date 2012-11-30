var server = require('../server')
  , request = require('supertest')
  , util = require('util');

describe('user routes', function(){
  describe('GET /users/:id', function(){
    it('should respond with 200', function(done){
      request(server)
        .get('/users/craigerm')
        .expect('Content-Type', /json/)
        .expect(200, done);
   });
  });

  describe('PUT /users/:id', function(){
    it('should respond with 204', function(done){
      request(server)
        .put('/users/craigerm')        
        .expect(204, done);
    });
  });

  describe('DELETE /users/:id', function(){
    it('should respond with 204', function(done){
      request(server)
        .del('/users/craigerm')
        .expect(204, done);
    });
  });
});
