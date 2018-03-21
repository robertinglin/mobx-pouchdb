# mobx-pouchdb

Links MobX observers with PouchDB, allowing simple rapid development and persistant state

## Classes

mobx-pouchdb has 2 classes. Model, and ModelStore

### Model

Basic model scaffolding. Exposes edit actions to modify doc state without changing the doc until saving.

#### Functions

- generateId - id generation - defaults to shortid
- save - writes any edits directly to the document should be extended to write to db
- toJS - converts the MobX model back to a JS object for PouchDB write. Also used to remove properties that shouldn't be written to Pouch
- setE - Sets an edited parameter in temporary storage
- getE - Gets the parameter from temporary storage or the base object if it isn't in temp
- clearE - clears all temporary parmeters, reverting state

### ModelStore

Workhorse of mobx-pouchdb, ModelStore links the Model class and the pouchdb instance

#### Functions

- load(documentId, pouchDbGetSettings) - takes a documentId and either returns the in memory stored doc or pulls the doc from PouchDb
- loadAll(pouchDbAllDocsSettings) - Queries PouchDB for all documents and stores them in memory
- get(documentId) - takes a documentId and either returns the in memory stored doc or null if not in memory
- add(Model) - writes a model to the store and then tracks that model in memory
- query(mapFunction, options) - takes a pouchdb query (currently only map function), as well as search parameters and returns the resulting query docs
- removeQuery - if the query is "live", it can be removed when it's done being used. That way it doesn't continue to be tracked on PouchDB changes