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