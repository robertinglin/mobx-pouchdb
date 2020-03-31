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
                this.mapFuncPromise;
                if (modelStore._design && modelStore._design[parts[0]]) {
                    const doc = modelStore._design[parts[0]].views[parts[1]];
                    this.mapFuncPromise = Promise.resolve({ ...doc, map: this.__scopeMapFunc(doc.map) });
                } else {
                    this.mapFuncPromise = modelStore.db.get('_design/' + parts[0]).then((mapRes) => {
                        modelStore._design = modelStore._design || {};
                        modelStore._design[parts[0]] = mapRes;
                        const doc = mapRes.views[parts[1]];
                        return { ...doc, map: this.__scopeMapFunc(doc.map) };
                    });
                }
            } else {
                this.mapFuncPromise = Promise.resolve({ map: this.__scopeMapFunc(this._mapFunc) })
            }

            this.runPromise = this.mapFuncPromise.then((designDoc) => {
                return new Promise((resolve, reject) => {
                    if (this._filterOptions.local_query) {
                        resolve(this.__localQuery(modelStore, designDoc, this._filterOptions));
                    } else {
                        resolve(modelStore.db.query(this._mapFunc, this._filterOptions))
                    }
                }).then((results) => {
                    this.results = results;
                    if (results.total_rows !== undefined) {
                        this[this.propertyName] =  results.rows.map(d => modelStore.get(d.doc._id) || modelStore.__sideLoad(d.doc))
                    }
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
            if (mapFunc.reduce) {
                return;
            }
            const docIndex = this[this.propertyName].findIndex(rdoc => rdoc._id === doc._id);
            if (this.__queryDocument(doc, mapFunc.map, this._filterOptions).doc) {
                if (docIndex === -1) {
                    runInAction(() => {this[this.propertyName].push(modelStore.get(doc._id) || modelStore.__sideLoad(doc));});
                }
            }
            else {
                if (docIndex > -1) {
                    runInAction(() => {this[this.propertyName] = this[this.propertyName].filter((_doc, ind) => ind !== docIndex)});
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
                    var keyValues = {};
                    function emit(key, value) {
                        if (!keyValues[key]) {
                            keyValues[key] = [];
                        }
                        keyValues[key].push(value || null);
                    }
                    var x = ${mapFuncStr};
                    x(doc, emit);
                    return keyValues;
                })
            `);
        }
        return scopedEmitFunctions[mapFuncStr];
    }

    __queryDocument(doc, mapFunc, filterOptions) {
        let keyValues = mapFunc(filterOptions.key, doc);
        if (filterOptions.startkey && filterOptions.endkey) {
            const docKeys = Object.keys(keyValues);
            let [ firstMatchingKey = undefined ] = docKeys.filter((docKey) => docKey >= filterOptions.startkey && docKey <= filterOptions.endkey);
            return { value: keyValues[firstMatchingKey], doc: keyValues[firstMatchingKey] && doc }
        } else {
            return { value: keyValues[filterOptions.key], doc: keyValues[filterOptions.key] && doc };
        }
    }

    __localQuery(modelStore, designDoc, filterOptions) {
        const docs = modelStore[modelStore.propertyName].map(doc => this.__queryDocument(doc, designDoc.map, filterOptions)).filter(valueDoc => valueDoc.doc);
        if (designDoc.reduce) {
            let rows = [];
            const values = docs.map(valueDoc => valueDoc.value)
            const valueArray = Array.prototype.concat(...values);

            if (designDoc.reduce === '_sum') {
                rows.push({
                    value: valueArray.reduce((prev, current) => prev + current * 1, 0),
                    key: null
                });
            } else if (designDoc.reduce === '_count') {
                rows.push({
                    value: valueArray.length,
                    key: null
                });
            }
            return {
                rows
            };
        } else {
            return {
                total_rows: this[this.propertyName].length,
                offset: 0,
                rows: docs.map(valueDoc => ({ id: valueDoc.doc._id, key: filterOptions.key, doc: valueDoc.doc }))
            };
        }
    }
}

decorate(Query, {
    onChange: action,
    onDelete: action
});