/**
 * fluidsurveys
 *
 * FluidSurveys API wrapper
 *
 * @author Jason Mulligan <jmulligan@fluidware.com>
 * @copyright 2014 Fluidware
 * @license MIT <https://raw.github.com/fluidware/fluidsurveys-node/master/LICENSE>
 * @link http://fluidsurveys.com
 * @version 0.1.3
 */
"use strict";

var util    = require( "keigai" ).util,
    array   = util.array,
    iterate = util.iterate,
    request = util.request,
    when    = util.when,
    btoa    = require( "btoa" ),
    HOST    = "https://fluidsurveys.com",
    NOTJSON = ["collectors", "invite_codes", "reports", "contact-lists:contacts"];

/**
 * Routes by collection
 * @type {Object}
 */
var routes = {
	root  : "/api/v3",
	types : {
		root    : "/:type/",
		details : "/:type/:id/"
	},
	collections : {
		templates       : [],
		surveys         : ["collectors", "invites", "responses", "structure", "invite_codes", "groups", "reports", "csv"],
		collectors      : [],
		contacts        : [],
		embed           : [],
		"contact-lists" : ["contacts"],
		webhooks        : []
	}
};

/**
 * Serializes an Object to a String
 *
 * @method serialize
 * @param  {Object} arg Object to serialize
 * @return {String}     String representing Object
 */
function serialize ( arg ) {
	var result = "";

	if ( arg !== undefined ) {
		iterate( arg, function ( value, key ) {
			result += "&" + key + "=" + encodeURIComponent(value);
		} );
	}

	return result.replace( /^\&/, "" );
}

/**
 * Builds an API URI
 *
 * @method uri
 * @return {String} URI
 */
function uri () {
	var args   = array.cast( arguments ),
	    host   = args.shift(),
	    result = "";

	array.each( array.chunk( args, 2 ), function ( i ) {
		result += i.length === 1 ? routes.types.root.replace( ":type", i[0] ) : routes.types.details.replace( ":type", i[0] ).replace( ":id", i[1] );
	} );

	return host + routes.root + result.replace( /\/\//g, "/" );
}

/**
 * FluidSurveys API wrapper
 *
 * @constructor
 * @param  {String} username Username or API key
 * @param  {String} password Password
 * @param  {String} host     [Optional] API host
 */
function FluidSurveys ( username, password, host ) {
	this.header = "Basic " + btoa( username + ":" + password );
	this.host   = host;
}

/**
 * Setting constructor loop
 * @type {Object}
 */
FluidSurveys.prototype.constructor = FluidSurveys;

/**
 * Creates an instance of `type` with the shape of `data`
 *
 * @method create
 * @param  {String}   type Type of instance to create
 * @param  {Object}   data Instance data
 * @param  {Function} cb   Callback
 * @return {Object}        {@link FluidSurveys}
 */
FluidSurveys.prototype.create = function ( type, data, cb ) {
	var self = this,
	    args, headers, url;

	if ( typeof cb != "function" ) {
		throw new Error( "Invalid arguments" );
	}
	else if ( typeof type != "string" || routes.collections[type] === undefined || !( data instanceof Object ) ) {
		process.nextTick( function () {
			cb( new Error( "Invalid arguments" ), null );
		} );

		return this;
	}

	headers = {
		accept: "application/json",
		authorization: this.header,
		"content-type": "application/json"
	};

	url = uri( this.host, type );

	if ( type === "surveys" ) {
		this.request( "post", url, {"name": data.structure.name || data.structure.title}, headers ).then( function ( arg ) {
			self.request( "put", uri( self.host, type, arg.id, "structure" ), data, headers ).then( function ( arg ) {
				cb( null, arg );
			}, function ( e ) {
				cb( e, null );
			} );
		}, function ( e ) {
			cb( e, null );
		} );
	}
	else {
		if ( array.contains( NOTJSON, type ) ) {
			args = serialize(data);
			headers["content-type"] = "application/x-www-form-urlencoded";
		}
		else {
			args = data;
		}

		this.request( "post", url, args, headers ).then( function ( arg ) {
			cb( null, arg );
		}, function ( e ) {
			cb( e, null );
		} );
	}

	return this;
};

/**
 * Creates an instance of `childType` with the shape of `data`, under parent of `parentType`
 *
 * @method createChild
 * @param  {String}   type Type of instance to create
 * @param  {Object}   data Instance data
 * @param  {Function} cb   Callback
 * @return {Object}        {@link FluidSurveys}
 */
FluidSurveys.prototype.createChild = function ( parentType, parentId, childType, data, cb ) {
	var args, headers, url;

	if ( typeof cb != "function" ) {
		throw new Error( "Invalid arguments" );
	}
	else if ( typeof parentType != "string" || typeof parentId != "number" || parentId <= 0 || typeof childType != "string" || routes.collections[parentType] === undefined || !array.contains( routes.collections[parentType], childType ) || !( data instanceof Object ) ) {
		process.nextTick( function () {
			cb( new Error( "Invalid arguments" ), null );
		} );

		return this;
	}

	headers = {
		accept         : "application/json",
		authorization  : this.header,
		"content-type" : "application/json"
	};

	url = uri( this.host, parentType, parentId, childType );

	if ( array.contains( NOTJSON, childType ) || array.contains( NOTJSON, parentType + ":" + childType ) ) {
		args  = serialize( data );
		headers["content-type"] = "application/x-www-form-urlencoded";
	}
	else {
		args = data;

		if ( !( args instanceof Object ) ) {
			delete headers["content-type"];
		}
	}

	this.request( "post", url, args, headers ).then( function ( arg ) {
		cb( null, arg );
	}, function ( e ) {
		cb( e, null );
	} );

	return this;
};

/**
 * Deletes an entity of `type`
 *
 * @method delete
 * @param  {String}   type Type of instance to list
 * @param  {Number}   id   Instance identifier
 * @param  {Function} cb   Callback
 * @return {Object}        {@link FluidSurveys}
 */
FluidSurveys.prototype["delete"] = function ( type, id, cb ) {
	if ( typeof cb != "function" ) {
		throw new Error( "Invalid arguments" );
	}
	else if ( typeof type != "string" || routes.collections[type] === undefined || typeof id != "number" || id <= 0 ) {
		process.nextTick( function () {
			cb( new Error( "Invalid arguments" ), null );
		} );

		return this;
	}

	this.request( "delete", uri( this.host, type, id ), null, {
		accept: "application/json",
		authorization: this.header
	} ).then( function ( arg ) {
		cb( null, arg );
	}, function ( e ) {
		cb( e, null );
	} );

	return this;
};

/**
 * Gets the details of instance of `type`
 *
 * @method get
 * @param  {String}   type Type of instance
 * @param  {Number}   id   Instance identifier
 * @param  {Function} cb   Callback
 * @return {Object}        {@link FluidSurveys}
 */
FluidSurveys.prototype.get = function ( type, id, cb ) {
	var deferreds = [],
	    headers, url;

	if ( typeof cb != "function" ) {
		throw new Error( "Invalid arguments" );
	}
	else if ( typeof type != "string" || routes.collections[type] === undefined || typeof id != "number" || id <= 0 ) {
		process.nextTick( function () {
			cb( new Error( "Invalid arguments" ), null );
		} );

		return this;
	}

	headers = {
		accept: "application/json",
		authorization: this.header
	};

	url = uri( this.host, type, id );

	deferreds.push( this.request( "get", url, null, headers ) );

	// Retrieving the structure as well
	if ( type === "surveys" ) {
		deferreds.push( this.request( "get", uri( this.host, type, id, "structure" ), null, headers ) );
	}

	when( deferreds ).then( function ( arg ) {
		cb( null, arg );
	}, function ( e ) {
		cb( e, null );
	} );

	return this;
};

/**
 * Gets the details of a child instance of `type`
 *
 * @method getChild
 * @param  {String}   parentType Type of instance
 * @param  {Number}   parentId   Instance identifier
 * @param  {String}   childType  Type of instance
 * @param  {Number}   childId    Instance identifier
 * @param  {Function} cb         Callback
 * @return {Object}              {@link FluidSurveys}
 */
FluidSurveys.prototype.getChild = function ( parentType, parentId, childType, childId, cb ) {
	if ( typeof cb != "function" ) {
		throw new Error( "Invalid arguments" );
	}
	else if ( typeof parentType != "string" || typeof parentId != "number" || parentId <= 0 || typeof childType != "string" || typeof childId != "number" || childId <= 0 || routes.collections[parentType] === undefined || !array.contains( routes.collections[parentType], childType ) ) {
		process.nextTick( function () {
			cb( new Error( "Invalid arguments" ), null );
		} );

		return this;
	}

	this.request( "get", uri( this.host, parentType, parentId, childType, childId ), null, {
		accept: "application/json",
		authorization: this.header
	} ).then( function ( arg ) {
		cb( null, arg );
	}, function ( e ) {
		cb( e, null );
	} );
};

/**
 * Gets a list of `type`
 *
 * @method list
 * @param  {String} type Type of instance
 * @param  {Object} args Query string filters
 * @return {Object}      {@link FluidSurveys}
 */
FluidSurveys.prototype.list = function ( type, args, cb ) {
	var queryString = "";

	if ( typeof cb != "function" ) {
		throw new Error( "Invalid arguments" );
	}
	else if ( typeof type != "string" || routes.collections[type] === undefined ) {
		process.nextTick( function () {
			cb( new Error( "Invalid arguments" ), null );
		} );

		return this;
	}

	if ( args instanceof Object && Object.keys( args ).length > 0 ) {
		queryString = "?" + serialize( args );
	}

	this.request( "get", uri( this.host, type ) + queryString, null, {
		accept: "application/json",
		authorization: this.header
	} ).then( function ( arg ) {
		cb( null, arg );
	}, function ( e ) {
		cb( e, null );
	} );
};

/**
 * Gets a list of `childType` from an instance of `type`
 *
 * @method listChildren
 * @param  {String}   parentType Type of instance
 * @param  {Number}   parentId   Instance identifier
 * @param  {String}   childType  Type of instance
 * @param  {Number}   args       Query string filters
 * @param  {Function} cb         Callback
 * @return {Object}              {@link FluidSurveys}
 */
FluidSurveys.prototype.listChildren = function ( parentType, parentId, childType, args, cb ) {
	var queryString = "";

	if ( typeof cb != "function" ) {
		throw new Error( "Invalid arguments" );
	}
	else if ( typeof parentType != "string" || typeof parentId != "number" || parentId <= 0 || typeof childType != "string" || routes.collections[parentType] === undefined || !array.contains( routes.collections[parentType], childType ) ) {
		process.nextTick( function () {
			cb( new Error( "Invalid arguments" ), null );
		} );

		return this;
	}

	if ( args instanceof Object && Object.keys( args ).length > 0 ) {
		queryString = "?" + serialize( args );
	}

	this.request( "get", uri( this.host, parentType, parentId, childType ) + queryString, null, {
		accept: "application/json",
		authorization: this.header
	} ).then( function ( arg ) {
		cb( null, arg );
	}, function ( e ) {
		cb( e, null );
	} );
};

/**
 * Makes an API request
 *
 * @method request
 * @param  {String} type    HTTP request type
 * @param  {String} uri     URI to request
 * @param  {Object} body    [Optional] HTTP request body
 * @param  {Object} headers [Optional] HTTP request headers
 * @return {Object}         Deferred/Promise
 */
FluidSurveys.prototype.request = function ( type, uri, body, headers ) {
	switch ( type ) {
		case "delete":
		case "get":
			return request( uri, type.toUpperCase(), null, null, null, headers );
		case "post":
		case "put":
			return request( uri, type.toUpperCase(), null, null, body, headers );
		default:
			throw new Error( "Invalid arguments" );
	}
};

/**
 * Updates an instance of `type`
 *
 * @method update
 * @param  {String}   type Type of instance
 * @param  {Number}   id   Instance data
 * @param  {Object}   data HTTP request body
 * @param  {Function} cb   Callback
 * @return {Object}        {@link FluidSurveys}
 */
FluidSurveys.prototype.update = function ( type, id, data, cb ) {
	var survey    = type === "surveys",
	    deferreds = [],
	    headers, args, url;

	if ( typeof cb != "function" ) {
		throw new Error( "Invalid arguments" );
	}
	else if ( typeof type != "string" || typeof id != "number" || id <= 0 || routes.collections[type] === undefined || !( data instanceof Object ) ) {
		process.nextTick( function () {
			cb( new Error( "Invalid arguments" ), null );
		} );

		return this;
	}

	headers = {
		accept: "application/json",
		authorization: this.header,
		"content-type": "application/json"
	};

	url = survey ? uri( this.host, type, id, "structure" ) : uri( this.host, type, id );

	if ( !survey && array.contains( NOTJSON, type ) ) {
		args = serialize( data );
		headers["content-type"] = "application/x-www-form-urlencoded";
	}
	else {
		args = data;
	}
	
	// Handles renaming a survey
	if ( survey && args.name !== undefined ) {
		deferreds.push( this.request( "put", uri( this.host, type, id ), {name: args.name}, headers ) );
	}

	// Handles changing a survey structure, or a generic `update`
	if ( !survey || args.structure ) {
		deferreds.push( this.request( "put", url, args, headers ) );
	}

	when( deferreds ).then( function ( arg ) {
		cb( null, arg );
	}, function ( e ) {
		cb( e, null );
	} );

	return this;
};

/**
 * FluidSurveys API wrapper factory
 *
 * @method factory
 * @param  {String} username Username or API key
 * @param  {String} password Password
 * @param  {String} host     [Optional] API host
 * @return {Object}          {link @FluidSurveys}
 */
function factory ( username, password, host ) {
	if ( typeof username != "string" || username === "" || typeof password != "string" || password === "" ) {
		throw new Error( "Invalid arguments" );
	}

	return new FluidSurveys ( username, password, typeof host == "string" ? host.replace( /\/$/, "" ) : HOST );
}

module.exports = factory;
