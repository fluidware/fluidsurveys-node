/**
 * fluidsurveys
 *
 * FluidSurveys API wrapper
 *
 * @author Jason Mulligan <jmulligan@fluidsurveys.com>
 * @copyright 2014 Fluidware
 * @license MIT <https://raw.github.com/fluidware/fluidsurveys-node/master/LICENSE>
 * @link http://fluidsurveys.com
 * @version 0.1.0
 */
"use strict";

var util    = require( "keigai" ).util,
    iterate = util.iterate,
    request = util.request,
    btoa    = require( "btoa" );

/**
 * @namespace base
 * @private
 */
var base = {
	/**
	 * Base factory
	 *
	 * @memberOf base
	 * @method factory
	 * @return {Object} {@link Base}
	 */
	factory : function () {
		return new Base();
	}
};

/**
 * Base Object
 *
 * @constructor
 */
function Base () {}

/**
 * Setting constructor loop
 *
 * @method constructor
 * @memberOf Base
 * @type {Function}
 * @private
 */
Base.prototype.constructor = Base;

/**
 * Makes a DELETE request to the URI
 *
 * @method delete
 * @param  {String} uri     URI to make a request to
 * @param  {Object} headers [Optional] HTTP headers
 * @return {Object}         Deferred
 */
Base.prototype.del = function ( uri, headers ) {
	return request( uri, "DELETE", null, null, null, headers );	
};

/**
 * Makes a GET request to the URI
 *
 * @method get
 * @param  {String} uri     URI to make a request to
 * @param  {Object} headers [Optional] HTTP headers
 * @return {Object}         Deferred
 */
Base.prototype.get = function ( uri, headers ) {
	return request( uri, "GET", null, null, null, headers );
};

/**
 * Makes a POST request to the URI
 *
 * @method post
 * @param  {String} uri     URI to make a request to
 * @param  {Object} body    HTTP request body
 * @param  {Object} headers [Optional] HTTP headers
 * @return {Object}         Deferred
 */
Base.prototype.post = function ( uri, body, headers ) {
	return request( uri, "POST", null, null, body, headers );
};

/**
 * Makes a PUT request to the URI
 *
 * @method put
 * @param  {String} uri     URI to make a request to
 * @param  {Object} body    HTTP request body
 * @param  {Object} headers [Optional] HTTP headers
 * @return {Object}         Deferred
 */
Base.prototype.put = function ( uri, body, headers ) {
	return request( uri, "PUT", null, null, body, headers );
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
			result += "?" + key + "=" + value
		} );
	}

	return result.replace( /^\?/, "" );
}

/**
 * Routes by collection
 * @type {Object}
 */
var routes = {
    "template"     : {
    	"root" : "/api/v3/templates/"
    },
    "survey"       : {
    	"root"      : "/api/v3/surveys/",
        "structure" : "/api/v3/surveys/:id/structure/"
    },
    "collector"    : {
    	"root" : "/api/v3/collectors/"
    },
    "contact"      : {
    	"root" : "/api/v3/contacts/"
    },
    "embed"        : {
    	"root" : "/api/v3/embeds/"
    },
    "contact-list" : {
    	"root" : "/api/v3/contact-lists/"
    },
    "webhook"      : {
    	"root" : "/api/v3/webhooks/"
    }
};

/**
 * @namespace fluidsurveys
 * @type {Object}
 */
var fluidsurveys = {
	factory : function ( username, password, host ) {
		return new FluidSurveys ( username, password, host );
	},
};

/**
 * FluidSurveys API wrapper
 *
 * @constructor
 * @param  {String} username Username or API key
 * @param  {String} password Password
 * @param  {String} host     [Optional] API host"
 */
function FluidSurveys ( username, password, host ) {
	this.username = username;
	this.password = password;
	this.header   = "Basic " + btoa( username + ":" + password );
	this.host     = host.replace( /\/$/, "" ) || "https://fluidsurveys.com";
}

/**
 * Inheriting from Base
 * @type {Object}
 */
FluidSurveys.prototype = base.factory();

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
 * @param  {Function} fn   Callback
 * @return {Object}        {@link FluidSurveys}
 */
FluidSurveys.prototype.create = function ( type, data, fn ) {
	var self = this;

	if ( typeof type != "string" || !( data instanceof Object ) || data.structure === undefined || routes[type] === undefined ) {
		throw new Error( "Invalid arguments" );
	}

	this.post( this.host + routes[type].root, {"name": data.structure.name || data.structure.title}, {
		accept         : "application/json",
		authorization  : this.header,
		"content-type" : "application/json",
	} ).then( function ( arg ) {
		self.post( self.host + routes[type].structure.replace( ":id", arg.id ), data, {
			accept: "application/json",
			authorization: self.header
		} ).then( function ( arg ) {
			fn( null, arg );
		}, function ( e ) {
			fn( e, null );
		} );
	}, function ( e ) {
		fn( e, null );
	} );

	return this;
};

/**
 * Gets a list of `type`
 *
 * @method list
 * @param  {String}   type Type of instance to list
 * @param  {Number}   id   Instance identifier
 * @param  {Function} fn   Callback
 * @return {Object}        {@link FluidSurveys}
 */
FluidSurveys.prototype.delete = function ( type, id, fn ) {
	if ( typeof fn != "function" ) {
		throw new Error( "Invalid arguments" );
	}

	this.del( this.host + routes[type].root + id + "/", {
		accept: "application/json",
		authorization: this.header
	} ).then( function ( arg ) {
		fn( null, arg );
	}, function ( e ) {
		fn( e, null );
	} );

	return this;
};

/**
 * Gets the details of instance of `type`
 *
 * @method details
 * @param  {String}   type Type of instance to list
 * @param  {Number}   id   Instance identifier
 * @param  {Function} fn   Callback
 * @return {Object}        {@link FluidSurveys}
 */
FluidSurveys.prototype.details = function ( type, id, fn ) {
	if ( typeof fn != "function" ) {
		throw new Error( "Invalid arguments" );
	}

	this.get( this.host + routes[type].root + id + "/", {
		accept: "application/json",
		authorization: this.header
	} ).then( function ( arg ) {
		fn( null, arg );
	}, function ( e ) {
		fn( e, null );
	} );

	return this;
}

/**
 * Gets a list of `type`
 *
 * @method list
 * @param  {String} type Type of instance to list
 * @return {Object}      {@link FluidSurveys}
 */
FluidSurveys.prototype.list = function ( type, args, fn ) {
	var queryString;

	if ( typeof type != "string" || typeof fn != "function" || routes[type] === undefined ) {
		throw new Error( "Invalid arguments" );
	}

	queryString = "?" + serialize( args );

	this.get( this.host + routes[type].root + queryString, {
		accept: "application/json",
		authorization: this.header
	} ).then( function ( arg ) {
		fn( null, arg );
	}, function ( e ) {
		fn( e, null );
	} );
};

/**
 * Updates an instance of `type`
 *
 * @method update
 * @param  {String}   type Type of instance to list
 * @param  {Number}   id   Instance data
 * @param  {Object}   data [description]
 * @param  {Function} fn   Callback
 * @return {Object}        {@link FluidSurveys}
 */
FluidSurveys.prototype.update = function ( type, id, data, fn ) {
	if ( !( data instanceof Object ) || typeof fn != "function" ) {
		throw new Error( "Invalid arguments" );
	}

	this.put( this.host + routes[type].structure, data, {
		accept: "application/json",
		authorization: this.header,
		"content-type": "application/json"
	} ).then( function ( arg ) {
		fn( null, arg );
	}, function ( e ) {
		fn( e, null );
	} );

	return this;
}
module.exports = fluidsurveys.factory;
