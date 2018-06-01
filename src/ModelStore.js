import { action, extendObservable, decorate, runInAction } from 'mobx';
import Query from './Query';
 
export default class ModelStore {
    queries = {};

    constructor(propertyName, Model, db, mobPouchSettings = {}) {
        this.propertyName = propertyName;
        this.Model = Model;
        this.db = db;
        this.__mobPouchSettings = mobPouchSettings;
        extendObservable(this, {
            [propertyName]: []
        });
        this.db.changes({
            since: 'now',
            live: true,
            include_docs: true
        }).on('change', this.__handleChanges.bind(this));
    }

    query(mapFunc, filterOptions) {
        let query;
        if (filterOptions.live) {
            const mapFuncStr = mapFunc.toString();
            const filterOptionsStr = JSON.stringify(filterOptions);
            const queryList = this.queries[mapFuncStr] || {};
            if (queryList[filterOptionsStr]) {
                return query.run(this);
            } else {
                query = new Query(mapFunc, filterOptions, this.propertyName);
                queryList[filterOptionsStr] = query;
                this.queries[mapFuncStr] = queryList;
            }
        } else {
            query = new Query(mapFunc, filterOptions, this.propertyName);
        }
        return query.run(this);
    }

    removeQuery(mapFuncOrQueryResults, filterOptions) {
        let mapFunc = mapFuncOrQueryResults;
        if (!filterOptions) {
            mapFunc = mapFuncOrQueryResults._mapFunc;
            filterOptions = mapFuncOrQueryResults._filterOptions;
        }
        const filterOptionsStr = JSON.stringify(filterOptions);
        const mapFuncStr = mapFunc.toString();
        if(!!this.queries[mapFuncStr] && !!this.queries[mapFuncStr][filterOptionsStr]) {
            if (Object.keys(this.queries[mapFuncStr]).length === 1) {
                delete this.queries[mapFuncStr];
            } else {
                delete this.queries[mapFuncStr][filterOptionsStr];
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
            const docModel = this.__generateModel(docObj);
            runInAction(() => this[this.propertyName].push(docModel));
            this.__allQueries().forEach(q => q.onChange(this, docObj));
            return docModel;
        });
    }

    add(doc) {
        const jsDoc = (doc.toJS && doc.toJS()) || doc;
        return this.db.put(jsDoc).then((status) => {
            if (status.ok) {
                jsDoc._rev = status.rev;
            }
            else {
                throw new Error(status);
            }
            return this.__sideLoad(jsDoc);
        });
    }

    loadAll(settings = { include_docs: true, decending: true }, mobPouchSettings = { live: true }) {
        this.__mobPouchSettings = { ...this.__mobPouchSettings, ...mobPouchSettings };
        return this.db.allDocs(settings).then((allDocs) => {
            const rows = allDocs.rows.filter((doc) => {
                if (doc.id.indexOf('_design') === 0) {
                    this._design = this._design || {};
                    this._design[doc.id.substr(8)] = doc.doc;
                    return false;
                }
                return true;
            })
            runInAction(() =>this[this.propertyName] = rows.map(doc => this.__generateModel(doc.doc)));
            this.__allQueries().forEach(q => q.onChanges(this, rows));
            return this[this.propertyName];
        });
    }

    __generateModel(doc) {
        if (this.__mobPouchSettings.typed) {
            let docType = doc.type || 'default';
            if (!this.Model[docType]) {
                throw new Error(`Model type:${docType} not found`);
            }
            return new this.Model[docType](doc); 
        } else {
            return new this.Model(doc);
        }
    }

    __sideLoad(doc) {
        const sideLoadedDoc = this.__generateModel(doc);
        this[this.propertyName].push(sideLoadedDoc);
        return sideLoadedDoc;
    }
 
    __handleChanges(rev) {
        if (rev.deleted) {
            this.__onDelete(rev.doc, rev);
        }
        else if (rev.changes) {
            this.__onChange(rev.doc, rev);
        }
    }

    __onChange(doc, rev) {
        const storeDoc = this[this.propertyName].filter(storeDoc => storeDoc._id === doc._id)[0];
        if (storeDoc) {
            storeDoc.updateFromDoc(doc);
        } else if (this.__mobPouchSettings.live) {
            this.__sideLoad(doc);
        }
        this.__allQueries().forEach(q => q.onChange(this, doc));
    }

    __onDelete(doc) {
        const storeDocIndex = this[this.propertyName].findIndex(storeDoc => storeDoc._id === doc._id);
        if (storeDocIndex > -1) {
            this[this.propertyName].splice(storeDocIndex, 1);
        }
        this.__allQueries().forEach(q => q.onDelete(doc));
    }

    __allQueries() {
        const queries = [].concat(...Object.values(this.queries).map(q => Object.values(q)));
        return queries;
    }

}

decorate(ModelStore, {
    add: action,
    load: action,
    loadAll: action,
    __sideLoad: action,
    __onChange: action,
    __onDelete: action
});