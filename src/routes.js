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
