// This is a utility for adding routing capabilities to a node application.
// It was originally written to add basic routing support for using express 
// but this version has been simplified to work with RESTify.
var util = require('util');

var mappings = [
  { route: '/', action: 'index', verb: 'get' },
  { route: '/', action: 'create', verb: 'post' },
  { route: '/:id', action: 'show', verb: 'get' },
  { route: '/:id', action: 'update', verb: 'put' },
  { route: '/:id', action: 'destroy' ,verb :'delete' }
];

// Some good info here about what error codes to return:
// http://stackoverflow.com/questions/2342579/http-status-code-for-update-and-delete
var verbStatusCodes = {
  'get': 200,
  'post': 201,
  'put': 204, 
  'delete': 204
};

module.exports = function(app, controllerPath) {
	controllerPath = controllerPath || (process.cwd() + '/app/controllers');

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

  var controllerParamsProcessed = {};

  function addParamsForController(controllerName, controller){

    //if(controllerParamsProcessed[controllerName] == undefined){
    //  for(var i=0; i < controller._params.length; i++){
    //    var param = controller._params[i];
    //    console.log('Setting param %s for controller %s', param.name, controllerName);
    //    app.param(param.name, param.fn);
    //  }
    //  controllerParamsProcessed[controllerName] = true;
    //}
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
        if(data){
          var code = verbStatusCodes[verb];
          res.send(code, data);
        } else {
          res.send(201, '');
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

	var map = {

		get: function(route, resource) {
			var info = getInfoFromResource(resource);
			var route = '/' + route;
    //  app.get(route, info.middleware, info.action);
		},

		post: function(route, resource) {
			var info = getInfoFromResource(resource);
			var route = '/' + route;
			//app.post(route, info.action);
		},

		root: function(resource) {
      this.get('', resource);
		},

		resources: function(controllerName) {
      console.log('Creating resource for %s', controllerName);
			var file = process.cwd() + '/controllers/' + controllerName + '-controller';

			var controller = require(file);
			for (var i = 0; i < mappings.length; i++) {

				var mapping = mappings[i];
				var action = mapping.action;
        if(controller[action] === undefined){
          console.log('Skipping %s/%s', controllerName, action);
        }
				if (controller[action] !== undefined) {
					var routeName = '/' + controllerName;
          var lastPartOfRoute = mapping.route || action;
          routeName += lastPartOfRoute[0] == '/' ? '' : '/';
          routeName += lastPartOfRoute === '/' ? '' : lastPartOfRoute;

          // This sets the method correctly on the app server
          var routeHandler = createRouteMethod(mapping.verb, controller[action]);
          app[mapping.verb].call(app, routeName, routeHandler); 
         // addParamsForController(controllerName, controller); 
				}
			}
		}
	};
	return map;
};

