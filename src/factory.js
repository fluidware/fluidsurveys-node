/**
 * FluidSurveys API wrapper factory
 *
 * @method factory
 * @param  {String} username Username or API key
 * @param  {String} password Password
 * @param  {String} host     [Optional] API host, defaults to "https://fluidsurveys.com"
 * @return {Object}          {link @FluidSurveys}
 */
function factory ( username, password, host ) {
	if ( typeof username != "string" || username === "" || typeof password != "string" || password === "" ) {
		throw new Error( "Invalid arguments" );
	}

	return new FluidSurveys ( username, password, typeof host == "string" ? host.replace( /\/$/, "" ) : HOST );
}
