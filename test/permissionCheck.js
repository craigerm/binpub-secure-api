var check = require('../auth/permissionCheck')
  , should = require('should');

describe('permissionCheck()', function() {

  it('should be allowed for GET requests', function(done) {
    check({method: 'GET'}, null, function(err){
      should.not.exist(err);
      done();
    });
  });

  it('should be not authorized if access code is missing', function() {

  });
});
