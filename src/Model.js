import { observable, action, decorate } from 'mobx';
import shortid from 'shortid';

export default class Model {
    _id;
    __edit = new Map();

    constructor() {
        this.generateId();
    }

    generateId() {
        this._id = shortid();
    }

    save() {
        let editCount = 0;
        this.edit.toJS().forEach((val, key) => {
            this[key] = val;
            ++editCount;
        });
        this.clearE();
        return !!editCount;
    }
 
    toJS() {
        const {__edit, ...doc } = this;
        Object.keys(doc).forEach(key => {
            if (doc[key] && !!doc[key].toJS) {
                doc[key] = doc[key].toJS();
                if (Array.isArray(doc[key])) {
                    doc[key] = doc[key].map((val) => {
                        if (val && !!val.toJS) {
                            return val.toJS();
                        }
                        return val;
                    })
                }
            }
        });
        return doc;
    }

    clearE() {
        this.__edit = new Map();
    }
 
    setE(propertyName, property) {
        this.__edit.set(propertyName, property);
    }

    getE(property) {
        if (this.__edit.get(property) !== undefined) {
            return this.__edit.get(property);
        }
        return this[property];
    }
}

decorate(Model, {
    _id: observable,
    __edit: observable,
    clearE: action,
    setE: action,
    save: action,
    generateId: action
});