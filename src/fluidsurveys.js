/**
 * FluidSurveys API wrapper
 *
 * @constructor
 * @param  {String} username Username or API key
 * @param  {String} password Password
 * @param  {String} host     [Optional] API host
 */
function FluidSurveys ( username, password, host ) {
	this.username = username;
	this.password = password;
	this.header   = "Basic " + btoa( username + ":" + password );
	this.host     = host.replace( /\/$/, "" ) || HOST;
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
 * @param  {Function} fn   Callback
 * @return {Object}        {@link FluidSurveys}
 */
FluidSurveys.prototype.create = function ( type, data, fn ) {
	var self = this,
	    args, headers, url;

	if ( typeof type != "string" || !( data instanceof Object ) || routes.collections[type] === undefined ) {
		throw new Error( "Invalid arguments" );
	}

	headers = {
		accept: "application/json",
		authorization: this.header,
		"content-type": "application/json"
	};

	url = uri( this.host, type );

	if ( type === "surveys" ) {
		this.request( "post", url, {"name": data.structure.name || data.structure.title}, headers ).then( function ( arg ) {
			self.request( "put", uri( self.host, type, arg.id, "structure" ), data, {
				accept: "application/json",
				authorization: self.header,
				"content-type" : "application/json"
			} ).then( function ( arg ) {
				fn( null, arg );
			}, function ( e ) {
				fn( e, null );
			} );
		}, function ( e ) {
			fn( e, null );
		} );
	}
	else {
		if ( type === "collectors" ) {
			args = serialize(data);
			delete headers["content-type"];
		}
		else {
			args = data;
		}

		this.request( "post", url, args, headers ).then( function ( arg ) {
			fn( null, arg );
		}, function ( e ) {
			fn( e, null );
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
 * @param  {Function} fn   Callback
 * @return {Object}        {@link FluidSurveys}
 */
FluidSurveys.prototype.createChild = function ( parentType, parentId, childType, data, fn ) {
	var args, url;

	if ( typeof parentType != "string" || !( data instanceof Object ) || routes.collections[parentType] === undefined || routes.collections[parentType].indexOf( childType ) == -1 ) {
		throw new Error( "Invalid arguments" );
	}

	url = uri( this.host, parentType, parentId, childType );

	if ( childType === "collectors" ) {
		args  = null;
		url  += "?name=" + encodeURIComponent( data.name );
	}
	else {
		args = data;
	}

	this.request( "post", url, args, {
		accept         : "application/json",
		authorization  : this.header,
		"content-type" : "application/json"
	} ).then( function ( arg ) {
		fn( null, arg );
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
FluidSurveys.prototype["delete"] = function ( type, id, fn ) {
	if ( typeof fn != "function" ) {
		throw new Error( "Invalid arguments" );
	}

	this.request( "delete", uri( this.host, type, id ), null, {
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
 * @param  {String}   type Type of instance
 * @param  {Number}   id   Instance identifier
 * @param  {Function} fn   Callback
 * @return {Object}        {@link FluidSurveys}
 */
FluidSurveys.prototype.get = function ( type, id, fn ) {
	if ( typeof fn != "function" ) {
		throw new Error( "Invalid arguments" );
	}

	this.request( "get", uri( this.host, type, id ), null, {
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
 * Gets the details of a child instance of `type`
 *
 * @method getChild
 * @param  {String}   parentType Type of instance
 * @param  {Number}   parentId   Instance identifier
 * @param  {String}   childType  Type of instance
 * @param  {Number}   childId    Instance identifier
 * @param  {Function} fn         Callback
 * @return {Object}              {@link FluidSurveys}
 */
FluidSurveys.prototype.getChild = function ( parentType, parentId, childType, childId, fn ) {
	if ( typeof parentType != "string" || typeof fn != "function" || routes.collections[parentType] === undefined || routes.collections[parentType].indexOf( childType ) == -1 ) {
		throw new Error( "Invalid arguments" );
	}

	this.request( "get", uri( this.host, parentType, parentId, childType, childId ), null, {
		accept: "application/json",
		authorization: this.header
	} ).then( function ( arg ) {
		fn( null, arg );
	}, function ( e ) {
		fn( e, null );
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
FluidSurveys.prototype.list = function ( type, args, fn ) {
	var queryString = "";

	if ( typeof type != "string" || typeof fn != "function" || routes.collections[type] === undefined ) {
		throw new Error( "Invalid arguments" );
	}

	if ( args instanceof Object ) {
		queryString = "?" + serialize( args );
	}

	this.request( "get", uri( this.host, type ) + queryString, null, {
		accept: "application/json",
		authorization: this.header
	} ).then( function ( arg ) {
		fn( null, arg );
	}, function ( e ) {
		fn( e, null );
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
 * @param  {Function} fn         Callback
 * @return {Object}              {@link FluidSurveys}
 */
FluidSurveys.prototype.listChildren = function ( parentType, parentId, childType, args, fn ) {
	var queryString = "";

	if ( typeof parentType != "string" || typeof fn != "function" || routes.collections[parentType] === undefined || routes.collections[parentType].indexOf( childType ) == -1 ) {
		throw new Error( "Invalid arguments" );
	}

	if ( args instanceof Object ) {
		queryString = "?" + serialize( args );
	}

	this.request( "get", uri( this.host, parentType, parentId, childType ) + queryString, null, {
		accept: "application/json",
		authorization: this.header
	} ).then( function ( arg ) {
		fn( null, arg );
	}, function ( e ) {
		fn( e, null );
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
 * @param  {Function} fn   Callback
 * @return {Object}        {@link FluidSurveys}
 */
FluidSurveys.prototype.update = function ( type, id, data, fn ) {
	var headers, args, url;

	if ( !( data instanceof Object ) || typeof fn != "function" ) {
		throw new Error( "Invalid arguments" );
	}

	headers = {
		accept: "application/json",
		authorization: this.header,
		"content-type": "application/json"
	};

	url = uri( this.host, type, id );

	if ( type === "collectors" ) {
		args = "name=" + encodeURIComponent( data.name );
		delete headers["content-type"];
	}
	else {
		args = data;
	}

	this.request( "put", url, args, headers ).then( function ( arg ) {
		fn( null, arg );
	}, function ( e ) {
		fn( e, null );
	} );

	return this;
};
