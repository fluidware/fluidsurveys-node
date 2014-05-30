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
