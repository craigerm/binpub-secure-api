// This is a utility for adding routing capabilities to a node application.
// It was originally written to add basic routing support for using express 
// but this version has been simplified to work with RESTify.
var util = require('util')
  , _ = require('underscore')
  , Errors = require('../models/errors')
  , MongooseError = require('mongoose').Error
  , actionHandler = require('./action-handler')
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

// Mongoose validation messages are no good. We'll use this for now until we
// find out a better way
var validationErrorMsg = {
  required: 'can\'t be blank'
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

  function getMiddleware(action, controller) {
    var beforeEvents = controller.before || [];
    var middleware = actionHandler.getBeforeMiddleware(action, beforeEvents);
    return middleware;
  }

	function getInfoFromResource(resource) {
		var routeInfo = getRouteInfo(resource);
		var controller = requireController(routeInfo.controller);
		var action = controller[routeInfo.action];
    var middleware = getMiddleware(routeInfo.action, controller);

		if (!action) {
			var msg = util.format('Could not find action for "%s".', resource);
			throw new Error(msg);
		}

		return {
      middleware: middleware, 
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
      
      // We only expect an object. We will force it to JSON all the time for
      // now.
      // TODO: Error handling
      var nextMethod = function(err, data){        

        // Handle certain errors in a special way
        if(err) {
          if(err instanceof RecordNotFoundError){
            res.send(404, { message: 'Not Found' });
            return next();
          }

          // Conver the mongoos validation error into
          // a friendlier format for API consumption
          if(err instanceof MongooseError) {
            if(err.name == 'ValidationError' && err.errors) {
              var errors = {};
              for(var field in err.errors) {
                var errorData = err.errors[field];
                var fieldErrors = [];
                fieldErrors.push(validationErrorMsg[errorData.type]);
                errors[field] = fieldErrors;
              }
              res.send(422, errors);
              return next();
            }
          };

          // For debuggin purposes
          if(err instanceof Error){
            console.log(err.stack);
            throw data;
          }
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

  // This is used for namespacing routes and for handling nested
  // resources.
  var routeStack = [];

  //TODO: Change addRoutingCall() to use routeStack instead of map object using
  //it.

  // This adds the correct routing call to the app
  function addRoutingCall(app, verb, route, resource){
      var info = getInfoFromResource(resource);
      var route = '/' + route;
      var routeHandler = createRouteMethod(verb, info.action);

      var serverArgs = [];
      serverArgs.push(route);

      _.each(info.middleware, function(item) {
        serverArgs.push(item);
      });

      serverArgs.push(routeHandler);
      // Example: 
      //   app.get('/home', handler)
      //   app.get('/home', authenticate, log, handler);
      app[verb].apply(app, serverArgs);
  };

  // This is the routing map object that gets returned as the export.
  // User's work with this to define resources.
	var map = {

    // We can turn on debugging to display the routes to the console 
    debug: false,

    namespace: function(namespace, handler){
      routeStack.push(namespace);
      handler.call(map);
      routeStack.pop();
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

		resources: function(controllerName, options, nestedHandler) {
      if(typeof(options) == 'function') {
        nestedHandler = options;
      }
      
      options = options || {};

			var file = process.cwd() + '/controllers/' + controllerName + '-controller';
      var namespace = routeStack.join('/');
			var controller = require(file);
      var idSuffix = options.id ? ':' + options.id : (':' + singularize(controllerName) + 'id');

			for (var i = 0; i < mappings.length; i++) {

				var mapping = mappings[i];
				var action = mapping.action;

        if (controller[action] !== undefined) {
					var routeName = namespace ? '/' + namespace : '';
          routeName += '/' + controllerName;
          var lastPartOfRoute = mapping.route || action;

          if(lastPartOfRoute == '/:id') {
            lastPartOfRoute = idSuffix;
          }

          routeName += lastPartOfRoute[0] == '/' ? '' : '/';
          routeName += lastPartOfRoute === '/' ? '' : lastPartOfRoute;

          // This sets the method correctly on the app server
          var routeHandler = createRouteMethod(mapping.verb, controller[action]);

          // Display the routes we are registing if debug mode
          if(this.debug) {
            console.log('registering %s:\t %s (%s => %s)', 
                mapping.verb.toUpperCase(), 
                routeName,
                controllerName,
                action
            );
          }
          app[mapping.verb].call(app, routeName, routeHandler); 
				}
      }

      if(nestedHandler) {
        var newNamespace = controllerName + '/' + idSuffix;
        routeStack.push(newNamespace);
        nestedHandler.call(map);
        routeStack.pop();
      }
		}
	};
	return map;
};

