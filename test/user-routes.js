var server = require('../server')
  , request = require('supertest')
  , util = require('util');

describe('user routes', function(){
  describe('GET /users/craigerm', function(){
    it('should respond with OK', function(done){
      request(server)
        .get('/users/craigerm')
        .expect('Content-Type', /json/)
        .expect(200, done);
   });
  });
});
