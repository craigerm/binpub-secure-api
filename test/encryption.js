var encryption = require('../auth/encryption');

describe('encryption', function(){

  describe('createHash()', function(){
    it('should not return plain password', function(){    
      var hash = encryption.hash('test123');
      hash.should !== 'test123';
      hash.length.should > 'test123'.length;
    });

    it('should generate different hashes', function(){
      var hash1 = encryption.hash('test123');
      var hash2 = encryption.hash('password');
      hash1.should != hash2;
    });

    it('should genereate same hash for same password', function(){
      var hash1 = encryption.hash('test123');
      var hash2 = encryption.hash('test123');
      hash1.should === hash2;
    });
  });

  describe('validate()', function(){
    var hash = encryption.hash('test123');
    var wrongHash = encryption.hash('asddsa');
      
    it('should not allow different hash', function(){
      var result = encryption.validate(wrongHash, 'test123');
      result.should === false;
    });

    it('should return true for correct hash and password', function(){
      var result = encryption.validate(hash, 'test123');
      result.should === true;
    });
  });
});
