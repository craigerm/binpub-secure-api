var server = require('../server')
  , request = require('supertest');

describe('error routes', function(){
  describe('route not found', function(){
    it('should return 404 status', function(done){
      request(server)
        .get('/asdsasadasdsa')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });
  });
});
