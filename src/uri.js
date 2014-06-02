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
