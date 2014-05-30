# FluidSurveys API wrapper
***node.js wrapper for the FluidSurveys API***

## Introduction
This library provides a pure node.js interface for the [FluidSurveys API](https://docs.fluidsurveys.com). It requires node.js 0.8.x and newer.

## Documentation
View the lastest release API documentation [FluidSurveys API](https://docs.fluidsurveys.com).

## Example
```javascript
var fluidsurveys = require("fluidsurveys"),
    api          = fluidsurveys("71863c900237428b8a1712fed1429d4d", "keepThisSecret");

api.list("survey", {group: "testing"}, function(err, arg) {
	if (err) {
		// Handle the error
	}
	else {
		// `arg` is a list of surveys in the "testing" group
	}
})
```

## License
Copyright (c) 2014 Fluidware
Licensed under the MIT license.
