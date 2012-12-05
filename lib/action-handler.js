var _ = require('underscore');

var actionHandler = {
  isMiddlewareAttachedToAction: function(action, filter) {
    if(filter.only){
      if(typeof(filter.only) == 'string'){
        return filter.only === action;
      } else if(filter.only instanceof Array) {
        return filter.only.indexOf(action) != -1;
      }
    }
    if(filter.except) {
      if(typeof(filter.except) == 'string') {
        return filter.except != action;
      } else if(filter.except instanceof Array) {
        return filter.except.indexOf(action) == -1;
      }
    }
    return false;
  },
  getBeforeMiddleware: function(action, beforeEvents) {
    var middleware = [];
    for(var i=0; i < beforeEvents.length; i++) {
      var before = beforeEvents[i];
      if(this.isMiddlewareAttachedToAction(action, before.filter)) {
        middleware.push(before.method);
      }
    }
    return middleware;
  }
};

module.exports = actionHandler;
