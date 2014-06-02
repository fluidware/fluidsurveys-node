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
	return new FluidSurveys ( username, password, host );
}
