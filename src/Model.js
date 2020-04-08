import { observable, action, decorate, runInAction, toJS } from 'mobx';
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
        const entries = Array.from(this.__edit);
        for (let i = 0; i < entries.length; ++i) {
            const key = entries[i][0];
            const val = entries[i][1]; 
            this[key] = val;
            ++editCount;
        }
        this.clearE();
        return !!editCount;
    }

    updateFromDoc(doc) {
        if (doc) {
            if (!!doc.toJS) {
                doc = doc.toJS();
            }
            const keys = [...new Set(Object.keys(doc).concat(Object.keys(this.toJS())))];
            const selfProto = Object.getPrototypeOf(this);
            
            keys.forEach((key) => {
                // If the key doesn't exist but it's getter exists 
                // then it's computed and it can't be overridden
                try {
                    const thisDescriptor = Object.getOwnPropertyDescriptor(this, key);
                    const protoDescriptor = Object.getOwnPropertyDescriptor(selfProto, key);
                    const isComputed = (!thisDescriptor || !thisDescriptor.configurable) && protoDescriptor;
                
                    if (isComputed || (!doc[key] && key === '_id')) {
                        return;
                    } else if (!!this[key] && !!this[key].updateFromDoc) {
                        this[key].updateFromDoc(doc[key]);
                    } else {
                        this[key] = doc[key] === undefined ? '' : doc[key];
                    }
                } catch (e) {
                    console.warn('Failed to update field', key, e);
                }
            });
        }
    }
 
    toJS() {
        const {__edit, E, ...doc } = this;
        Object.keys(doc).forEach(key => {
            if (doc[key] && !!doc[key].toJS) {
                doc[key] = doc[key].toJS();
            } else if (doc[key] && !!doc[key].$mobx) {
                doc[key] = toJS(doc[key]);
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
        this.__edit.clear();
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