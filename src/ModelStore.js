import { action, extendObservable, decorate } from 'mobx';
 
export default class ModelStore {
    lists = [];

    constructor(propertyName, Model, db) {
        this.propertyName = propertyName;
        this.Model = Model;
        this.service = service;
        this.db = db;
        extendObservable(this, {
            [propertyName]: []
        });
        this.db.changes({
            since: 'now',
            live: true,
            include_docs: true
        }).on('change', this.handleChanges);
    }

    query(mapFunc, filterOptions) {
        const stringOptions = JSON.stringify(filterOptions);
        if(!!this.lists[mapFunc] && !!this.lists[mapFunc].queries[stringOptions]) {
            return this.lists[mapFunc].queries[stringOptions];
        }
        if (!this.lists[mapFunc]) {
            this.lists[mapFunc] = {
                mapFunc,
                queries: {}
            };
        }
        const queryResults = {
            filterOptions,
            mapFunc
        };
        extendObservable(queryResults, {
            [this.propertyName]: [],
            results: null
        });
        if (filterOptions.local_query) {
            queryResults.results = this.__localQuery(mapFunc, filterOptions);
            queryResults[this.propertyName] =  queryResults.results.rows.map(d => this.get(d.doc._id) || this.sideLoad(d.doc))
        }
        else {
            this.service.db.query(mapFunc, filterOptions).then((results) => {
                queryResults.results = results;
                queryResults[this.propertyName] =  queryResults.results.rows.map(d => this.get(d.doc._id) || this.sideLoad(d.doc))
            });
        }
        this.lists[mapFunc].queries[stringOptions] = queryResults;
        return queryResults;
    }

    removeQuery(mapFuncOrQueryResults, filterOptions) {
        let mapFunc = mapFuncOrQueryResults;
        if (!filterOptions) {
            mapFunc = mapFuncOrQueryResults.mapFunc;
            filterOptions = mapFuncOrQueryResults.filterOptions;
        }
        const stringOptions = JSON.stringify(filterOptions);
        if(!!this.lists[mapFunc] && !!this.lists[mapFunc].queries[stringOptions]) {
            if (Object.keys(this.lists[mapFunc].queries).length === 1) {
                delete this.lists[mapFunc];
            } else {
                delete this.lists[mapFunc].queries[stringOptions];
            }
        }
    }

    get(docId) {
        const docIndex = this[this.propertyName].findIndex((t) => {
            return t._id === docId
        });
        if (docIndex > -1) {
            return this[this.propertyName][docIndex];
        }
        return null;
    }
 
    load(docId, settings = {}) {
        let doc = this.get(docId);
        if (doc) {
            return doc;
        }
        return this.db.get(docId, settings).then((docObj) => {
            const docModel = new this.Model(docObj);
            this[this.propertyName].push(docModel);
            return docModel;
        });
    }

    sideLoad(doc) {
        const sideLoadedDoc = new this.Model(doc);
        this[this.propertyName].push(sideLoadedDoc);
        return sideLoadedDoc;
    }

    add(doc) {
        const jsDoc = (doc.toJS && doc.toJS()) || doc;
        return this.db.update(jsDoc).then((status) => {
            if (status.ok) {
                jsDoc._rev = status.rev;
            }
            else {
                throw new Error(status);
            }
            return this.sideLoad(jsDoc);
        });
    }

    loadAll(settings = { include_docs: true, decending: true }) {
        return this.db.getAll(settings).then((allDocs) => {
            this[this.propertyName] = allDocs.rows.map(doc => new this.Model(doc));
            allDocs.rows.forEach(doc => this.__queryDocOnChange(doc));
            return this[this.propertyName];
        });
    }
 
    handleChanges() {
        if (rev.deleted) {
            this.onDelete(rev.doc, rev);
        }
        else if (rev.changes) {
            this.onChange(rev.doc, rev);
        }
    }

    onChange(doc, rev) {
        const storeDoc = this[this.propertyName].filter(storeDoc => storeDoc._id === doc._id)[0];
        if (storeDoc) {
            Object.keys(doc).forEach(key => {
                storeDoc[key] = doc[key];
            });
        }
        this.__queryDocOnChange(doc);

    }

    onDelete(doc) {
        const storeDocIndex = this[this.propertyName].findIndex(storeDoc => storeDoc._id === doc._id);
        if (storeDocIndex > -1) {
            this[this.propertyName].splice(storeDocIndex, 1);
        }
        this.__queryDocOnChange(doc, true);
    }

    __queryDocOnDelete(doc) {
        const queryMaps = Object.keys(this.lists);
        queryMaps.forEach((map) => {
            const mapObj = this.lists[map];
            const queryKeys = Object.keys(mapObj.queries);
            queryKeys.forEach((queryKey) => {
                const query = mapObj.queries[queryKey];
                const docIndex = query[this.propertyName].findIndex(rdoc => rdoc._id === doc._id);
                if (docIndex > -1) {
                    query[this.propertyName].splice(docIndex, 1);
                }
            });
        });
    }

    __queryDocOnChange(doc) {
        const queryMaps = Object.keys(this.lists);
        queryMaps.forEach((map) => {
            if (!map.startsWith('function')) {
                throw new Error('Updating stored queries not yet supported');
            }
            const mapObj = this.lists[map];
            const queryKeys = Object.keys(mapObj.queries);
            queryKeys.forEach((queryKey) => {
                const query = mapObj.queries[queryKey];
                const docIndex = query[this.propertyName].findIndex(rdoc => rdoc._id === doc._id);
                if (this.__queryDocument(doc, mapObj.mapFunc, query.filterOptions)) {
                    if (docIndex === -1) {
                        query[this.propertyName].push(this.get(doc._id) || this.sideLoad(doc));
                    }
                }
                else {
                    if (docIndex > -1) {
                        query[this.propertyName].splice(docIndex, 1);
                    }
                }
            });

        });
    }

    __queryDocument(doc, mapFunc, filterOptions) {
        let keysEmitted = [];
        let key = filterOptions.key;
        const emit = key => keysEmitted.push(key);
        mapFunc(doc, emit);
        if (!keysEmitted.length) {
            return false;
        }
        return keysEmitted.includes(key);
    }
    
    __localQuery(mapFunc, filterOptions) {
        const docs = this[this.propertyName].filter(doc => this.__queryDocument(doc, mapFunc, filterOptions));
        return {
            total_rows: this[this.propertyName].length,
            offset: 0,
            rows: docs.map(doc => ({ id: doc._id, key: filterOptions.key, doc }))
        };
    }
}

decorate(ModelStore, {
    add: action,
    load: action,
    loadAll: action,
    sideLoad: action,
    onChange: action,
    onDelete: action,
    __queryDocOnChange: action,
    __queryDocOnDelete: action
});