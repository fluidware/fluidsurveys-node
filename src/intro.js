"use strict";

var util     = require( "keigai" ).util,
    array    = util.array,
    deferred = util.defer,
    iterate  = util.iterate,
    request  = util.request,
    when     = util.when,
    btoa     = require( "btoa" ),
    HOST     = "https://fluidsurveys.com",
    PREDS    = /^(<|>|=)/,
    NOTJSON  = ["collectors", "invite_codes", "reports", "contact-lists:contacts"];
