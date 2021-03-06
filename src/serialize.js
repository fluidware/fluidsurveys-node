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
			result += "&" + key + ( PREDS.test( value ) ? encodeURIComponent( value ) : "=" + encodeURIComponent( value ) );
		} );
	}

	return result.replace( /^\&/, "" );
}
