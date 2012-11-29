var encryption = require('../auth/encryption');

describe('createHash()', function(){
  it('should not be password', function(){    
    var hash = encryption.hash('test123');
    hash.should !== 'test123';
    hash.length.should > 'test123'.length;
  });
});
