import ToDoService from '../_services/ToDoService';
import { Model } from 'mobx-pouchdb';
import { observable, action } from 'mobx';

export default class ToDoModel extends Model {
    @observable title;
    @observable isComplete = false;
    
    constructor(docOrTitle) {
        super();
        if (typeof docOrTitle === 'string') {
            this.title = docOrTitle;
        }
        else {
            const doc = docOrTitle;
            Object.keys(docOrTitle).forEach(key => this[key] = doc[key]);
        }
    }

    @action
    setTitle(title) {
        this.E.title = title;
    }

    @action
    toggleComplete() {
        this.E.isComplete = !this.isComplete;
        this.save();
    }

    save() {
        if (super.save()) {
            ToDoService.db.put(this.toJS());
        }
    }

    remove() {
        ToDoService.db.remove(this.toJS());
    }
}
