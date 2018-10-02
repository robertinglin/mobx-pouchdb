import { observable, action, decorate, runInAction } from 'mobx';
import shortid from 'shortid';

export default class Model {
    _id;
    __edit = new Map();
    E = new Proxy({}, {
        get: (obj, prop) => {
            if (this.__edit.get(prop) !== undefined) {
                return this.__edit.get(prop);
            }
            return this[prop];
        },
        set: (obj, prop, val) => {
            runInAction(() => this.__edit.set(prop, val));
            return true;
        }
    });
    constructor(doc) {
        this.generateId();
        this.updateFromDoc(doc);
    }

    generateId() {
        this._id = shortid();
    }

    save() {
        let editCount = 0;
        this.__edit.forEach((val, key) => {
            this[key] = val;
            ++editCount;
        });
        this.clearE();
        return !!editCount;
    }

    updateFromDoc(doc) {
        if (doc) {
            if (!!doc.toJS) {
                doc = doc.toJS();
            }
            const keys = [...new Set(Object.keys(doc).concat(Object.keys(this.toJS())))];
            keys.forEach((key) => {
                if (!doc[key] && key === '_id') {
                    return;
                } else if (!!this[key] && !!this[key].updateFromDoc) {
                    this[key].updateFromDoc(doc[key]);
                } else {
                    this[key] = doc[key] === undefined ? '' : doc[key];
                }
            });
        }
    }
 
    toJS() {
        const {__edit, E, ...doc } = this;
        Object.keys(doc).forEach(key => {
            if (doc[key] && !!doc[key].toJS) {
                doc[key] = doc[key].toJS();
            }
            if (Array.isArray(doc[key])) {
                doc[key] = doc[key].map((val) => {
                    if (val && !!val.toJS) {
                        return val.toJS();
                    }
                    return val;
                })
            }
        });
        return doc;
    }

    clearE() {
        this.__edit = new Map();
    }
 
    setE(propertyName, property) {
        this.E[propertyName] = property;
    }

    getE(property) {
        return this.E[property];
    }
}

decorate(Model, {
    _id: observable,
    __edit: observable,
    clearE: action,
    setE: action,
    save: action,
    generateId: action,
    updateFromDoc: action
});