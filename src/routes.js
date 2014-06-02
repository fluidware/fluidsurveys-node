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
		"contact-lists" : [],
		webhooks        : []
	}
};
