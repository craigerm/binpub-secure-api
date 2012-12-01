// This is a utility for adding routing capabilities to a node application.
// It was originally written to add basic routing support for using express 
// but this version has been simplified to work with RESTify.
var util = require('util')
  , Errors = require('../models/errors')
  , RecordNotFoundError = Errors.RecordNotFoundError;

var mappings = [
  { route: '/', action: 'index', verb: 'get' },
  { route: '/', action: 'create', verb: 'post' },
  { route: '/:id', action: 'show', verb: 'get' },
  { route: '/:id', action: 'update', verb: 'put' },
  { route: '/:id', action: 'destroy' ,verb :'del' }
];

// Some good info here about what error codes to return:
// http://stackoverflow.com/questions/2342579/http-status-code-for-update-and-delete
// TODO: Change this so we return 200 for PUT and DELETE when we return an
// object. For now we assume we are not returning any data, hence the 204.
var verbStatusCodes = {
  'get': 200,
  'post': 201,
  'put': 204, 
  'del': 204
};

module.exports = function(app, controllerPath) {
	controllerPath = controllerPath || (process.cwd() + '/controllers');

	function requireController(controllerName) {
		var controllerFile = controllerPath + '/' + controllerName + '-controller';
		return require(controllerFile);
	}

	function getRouteInfo(resource) {
		var routeInfo = resource.split('#');
		if (routeInfo.length != 2) {
			var msg = util.format('resource is invalid %s', resource);
			throw new Error(msg);
		}
		return {
			controller: routeInfo[0],
			action: routeInfo[1]
		};
	}

	function getInfoFromResource(resource) {
		var routeInfo = getRouteInfo(resource);
		var controller = requireController(routeInfo.controller);
		var action = controller[routeInfo.action];
		if (!action) {
			var msg = util.format('Could not find action for "%s".', resource);
			throw new Error(msg);
		}

		return {
			controllerName: routeInfo.controller,
			actionName: routeInfo.action,
			action: action,
		};
	}

  // This function wil wrap the call from RESTify to the controller method.
  // It's basic right now but we will expand it.
  function createRouteMethod(verb, controllerMethod){
    return function(req, res, next){
      var args = [];
      
      for(var p in req.params){
        if(req.params.hasOwnProperty(p)){
          args.push(req.params[p]);
        }
      }

      // We only expect an object. We will force it to JSON all the time for
      // now.
      // TODO: Error handling
      var nextMethod = function(data){        

        // Handle certain errors in a special way
        if(data instanceof RecordNotFoundError){
          res.send(404, { message: 'Not founad' });
          return next();
        }

        var code = verbStatusCodes[verb];
        if(data){
          res.send(code, data);
        } else {
          res.send(code);                 
        }
        return next();
      };
      args.push(req);
      args.push(res);
      args.push(nextMethod);

      // TODO: Add generic content negotiation here
      // Right now it looks like restify does everything in JSON by default, so
      // that's good.
      return controllerMethod.apply(controllerMethod, args);
    };
  };

  // Naive solution
  // If ends with an S remove it
  function singularize(name){
    if(name[name.length - 1] == 's'){
      return name.substring(0, name.length - 1);
    }
    return name;
  };

  // This adds the correct routing call to the app
  function addRoutingCall(app, verb, route, resource){
      var info = getInfoFromResource(resource);
      var route = '/' + route;
      var routeHandler = createRouteMethod(verb, info.action);
      app[verb].call(app, route, routeHandler);
  };

  // This is the routing map object that gets returned as the export.
  // User's work with this to define resources.
	var map = {

    // Namespacing nad nested routing is working, but the implementation can be
    // simplified and cleaned up.
    namespace: function(namespace, handler){
      var self = this;
      var mapStub = {
        resources: function(name, nestedHandler){
          self.resources(name, namespace);
          var parentRouteName = singularize(name) + 'id';
          var parentRoute = namespace + '/' + name + '/:' + parentRouteName;
          var nestedMap = {
            resources: function(nestedName){
              self.resources(nestedName, parentRoute);
            }
          };
          nestedHandler.call(nestedMap);
        }
      };
      handler.call(mapStub);
    },

		get: function(route, resource) {
      addRoutingCall(app, 'get', route, resource);
    },

		post: function(route, resource) {
      addRoutingCall(app, 'post', route, resource);        
		},

    put: function(route, resource) {
      addRoutingCall(app, 'put', route, resource);
    },

    del: function(route, resource){
      addRoutingCall(app, 'del', route, resource);
    },

		root: function(resource) {
      this.get('', resource);
		},

		resources: function(controllerName, prefix) {
			var file = process.cwd() + '/controllers/' + controllerName + '-controller';

			var controller = require(file);
			for (var i = 0; i < mappings.length; i++) {

				var mapping = mappings[i];
				var action = mapping.action;

        if (controller[action] !== undefined) {
					var routeName = prefix ? '/' + prefix : '';
          routeName += '/' + controllerName;
          var lastPartOfRoute = mapping.route || action;

          // If we have a prefix we should change it to the singular name to
          // avoid conflicts
          if(lastPartOfRoute == '/:id' && prefix){
            lastPartOfRoute = '/:' + singularize(controllerName) + 'id';
          }
          routeName += lastPartOfRoute[0] == '/' ? '' : '/';
          routeName += lastPartOfRoute === '/' ? '' : lastPartOfRoute;

          // This sets the method correctly on the app server
          var routeHandler = createRouteMethod(mapping.verb, controller[action]);

          console.log('registering %s:\t %s (%s => %s)', 
              mapping.verb.toUpperCase(), 
              routeName,
              controllerName,
              action
          );
          app[mapping.verb].call(app, routeName, routeHandler); 
				}
			}
		}
	};
	return map;
};

