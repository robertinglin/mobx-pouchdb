# mobx-pouchdb

Links MobX observers with PouchDB, allowing simple rapid development and persistant state

## Classes

mobx-pouchdb has 2 classes. Model, and ModelStore

### Model

Basic model scaffolding. Exposes edit actions to modify doc state without changing the doc until saving.

#### Functions

- generateId - id generation - defaults to shortid
- save - writes any edits directly to the document
- toJS - converts the MobX model back to a JS object for PouchDB write. Also used to remove properties that shouldn't be written to Pouch
- setE - Sets an edited parameter in temporary storage
- getE - Gets the parameter from temporary storage or the base object if it isn't in temp
- clearE - clears all temporary parmeters, reverting state

#### Big E

Instead of using getE & setE, temp storage can be accessed directly through the E property. Just like getE, if the property hasn't been written to E before it will pull the value from the base model.


```javascript

const todo = new ToDoModel('Something to do');
console.log(todo.title, todo.E.title);
//  prints 'Something to do', 'Something to do'

todo.E.title = 'E temporary storage example'
console.log(todo.title, todo.E.title);
// prints 'Something to do', 'E temporary storage example'

todo.save();
console.log(todo.title, todo.E.title);
// prints 'E temporary storage example', 'E temporary storage example'

```


#### Saving to PouchDB

If using Big E for your edits you can set the following save function to only save to pouch when there's edits.

```javascript

save() {
    if (super.save()) {
        POUCH_DB_INSTANCE.put(this.toJS());
    }
}
```

### ModelStore

Workhorse of mobx-pouchdb, ModelStore links the Model class and the pouchdb instance

#### Functions

- load(documentId, pouchDbGetSettings) - takes a documentId and either returns the in memory stored doc or pulls the doc from PouchDb
- loadAll(pouchDbAllDocsSettings) - Queries PouchDB for all documents and stores them in memory
- get(documentId) - takes a documentId and either returns the in memory stored doc or null if not in memory
- add(Model) - writes a model to the store and then tracks that model in memory
- query(mapFunction, options) - takes a pouchdb query (currently only map function), as well as search parameters and returns the resulting query docs
- removeQuery - if the query is "live", it can be removed when it's done being used. That way it doesn't continue to be tracked on PouchDB changes
