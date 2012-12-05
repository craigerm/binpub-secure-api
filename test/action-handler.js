var actionHandler = require('../lib/action-handler');

describe('actionHandler', function(){

  var noop = function() {};

  describe('isMiddlewareSpecifiedForAction()', function(){

    it('should return false if action in only string', function() {
      var filter = { only: 'create' };
      var result = actionHandler.isMiddlewareAttachedToAction('show', filter);
      result.should.be.false;
    });

    it('should be true if action exists in only string', function() {
      var filter = { only: 'show' };
      var result = actionHandler.isMiddlewareAttachedToAction('show', filter);
      result.should.be.true;
    });

    it('should be true if action exists in only array', function() {
      var filter = { only: ['index','show','create'] };
      var result = actionHandler.isMiddlewareAttachedToAction('show', filter);
      result.should.be.true;
    });

    it('should be false if action exists in except string', function() {
      var filter = { except: 'index' };
      var result = actionHandler.isMiddlewareAttachedToAction('index', filter);
      result.should.be.false;
    });

    it('should be false if action exists in except array', function() {
      var filter = { except: ['index','show'] };
      var result = actionHandler.isMiddlewareAttachedToAction('index', filter);
      result.should.be.false;
    });

    it('should be true if action not in except string', function() {
      var filter = { except: 'index' };
      var result = actionHandler.isMiddlewareAttachedToAction('show', filter);
      result.should.be.true;
    });

    it('should be true if action not in except array', function() {
      var filter = { except: ['index','list'] };
      var result = actionHandler.isMiddlewareAttachedToAction('show', filter);
      result.should.be.true;
    });
  });

  describe('getBeforeMiddleware()', function(){
    it('should return no middleware', function(){
      var middleware = actionHandler.getBeforeMiddleware('index', []);
      middleware.length.should.equal(0);
    });

    it('should return 1 when show action has middleware', function() {
      var before = [{ method: noop, filter: {only: 'show'} }];      
      var middleware = actionHandler.getBeforeMiddleware('show', before);
      middleware.length.should.equal(1);
    });

    it('should return 2 when for multiple conditions are true', function() {
      var before = [
        { method: noop, filter: {only: 'index'} },
        { method: noop, filter: {except: 'show'} }
      ];
      var middleware = actionHandler.getBeforeMiddleware('index', before);
      middleware.length.should.equal(2);
    });
  });
});
