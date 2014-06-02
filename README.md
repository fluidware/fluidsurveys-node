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

api.list("surveys", {group: "testing"}, function(err, arg) {
	if (err) {
		// Handle the error
	}
	else {
		// `arg` is a list of surveys in the "testing" group
	}
});
```

## API
Entity types are puralized to match collections, e.g. `surveys`.

### create( type, data, fn )
Creates a new entity, such as `surveys`.

### createChild ( parentType, parentId, childType, data, fn )
Creates a child entity under a parent, such as `collectors` under `surveys`.

### delete ( type, id, fn )
Deletes an entity.

### get ( type, id, fn )
Gets an entity.

### getChild ( parentType, parentId, childType, childId, fn )
Gets a child entity under a parent, such as `collectors` under `surveys`.

### list ( type, args, fn )
Gets a paginated list of entities.

### listChildren ( parentType, parentId, childType, args, fn )
Gets a paginated list of children under a parent.

### request ( type, uri, body, headers )
Abstracts HTTP request/response handling, returns a Deferred (Promise).

### update ( type, id, data, fn )
Updates an entity.

## License
Copyright (c) 2014 Fluidware
Licensed under the MIT license.
