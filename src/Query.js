import { action, extendObservable, decorate, runInAction } from 'mobx';

const scopedEmitFunctions = {};

export default class Query {
    mapFuncPromise = null;
    runPromise = null;

    _filterOptions;
    _mapFunc;
    propertyName;

    constructor(mapFunc, filterOptions, propertyName) {
        this._mapFunc = mapFunc;
        this._filterOptions = filterOptions;
        this.propertyName = propertyName;
        const stringOptions = JSON.stringify(filterOptions);

        extendObservable(this, {
            [propertyName]: [],
            results: null
        });

    }

    run(modelStore) {
        if(!this.runPromise || !this._filterOptions.live) {
            if ((this._filterOptions.live || this._filterOptions.local_query) && typeof this._mapFunc === 'string') {
                const parts = this._mapFunc.split('/');
                this.mapFuncPromise = modelStore.db.get('_design/' + parts[0]).then((mapRes) => {
                    return this.__scopeMapFunc(mapRes.views[parts[1]].map);
                });
            } else {
                this.mapFuncPromise = Promise.resolve(this.__scopeMapFunc(this._mapFunc))
            }

            this.runPromise = this.mapFuncPromise.then((mf) => {
                return new Promise((resolve, reject) => {
                    if (this._filterOptions.local_query) {                
                        resolve(this.__localQuery(modelStore, mf, this._filterOptions));
                    } else {
                        resolve(modelStore.db.query(this._mapFunc, this._filterOptions))
                    }
                }).then((results) => {
                    this.results = results;
                    this[this.propertyName] =  results.rows.map(d => modelStore.get(d.doc._id) || modelStore.__sideLoad(d.doc))
                    return this;
                });
            });
        }
        return this.runPromise;
    }

    onDelete(doc) {
        const docIndex = this[this.propertyName].findIndex(rdoc => rdoc._id === doc._id);
        if (docIndex > -1) {
            this[this.propertyName].splice(docIndex, 1);
        }
    }

    onChanges(modelStore, docArray) {
        docArray.forEach(doc => this.onChange(modelStore, doc));
    }

    onChange(modelStore, doc) {
        this.mapFuncPromise.then((mapFunc) => {
            const docIndex = this[this.propertyName].findIndex(rdoc => rdoc._id === doc._id);
            if (this.__queryDocument(doc, mapFunc, this._filterOptions)) {
                if (docIndex === -1) {
                    this[this.propertyName].push(modelStore.get(doc._id) || modelStore.__sideLoad(doc));
                }
            }
            else {
                if (docIndex > -1) {
                    this[this.propertyName].splice(docIndex, 1);
                }
            }
        });
    }

    __scopeMapFunc(mapFunc) {
        const mapFuncStr = mapFunc.toString();
        if (!scopedEmitFunctions[mapFuncStr]) {
            // couchdb puts emit in a global scope
            scopedEmitFunctions[mapFuncStr] = eval(`
                (function queryDocumentKeys(key, doc) {
                    var keys = [];
                    function emit(key) {
                        keys.push(key);
                    }
                    var x = ${mapFuncStr};
                    x(doc, emit);
                    return keys;
                })
            `);
        }
        return scopedEmitFunctions[mapFuncStr];
    }

    __queryDocument(doc, mapFunc, filterOptions) {
        let keysEmitted = mapFunc(filterOptions.key, doc);
        if (!keysEmitted.length) {
            return false;
        }
        return keysEmitted.includes(filterOptions.key);
    }
    
    __localQuery(modelStore, mapFunc, filterOptions) {
        const docs = modelStore[modelStore.propertyName].filter(doc => this.__queryDocument(doc, mapFunc, filterOptions));
        return {
            total_rows: this[this.propertyName].length,
            offset: 0,
            rows: docs.map(doc => ({ id: doc._id, key: filterOptions.key, doc }))
        };
    }
}

decorate(Query, {
    onChange: action,
    onDelete: action
});