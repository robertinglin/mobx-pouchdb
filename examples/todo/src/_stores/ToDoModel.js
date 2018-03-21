import ToDoService from '../_services/ToDoService';
import { Model } from 'mobx-pouchdb';
import { observable, action } from 'mobx';

export default class ToDoModel extends Model {
    @observable title;
    @observable isComplete = false;
    
    constructor(docOrTitle) {
        super();
        if (typeof docOrTitle === 'string') {
            const title = docOrTitle;
            this.setTitle(title);
        }
        else {
            const doc = docOrTitle;
            Object.keys(docOrTitle).forEach(key => this[key] = doc[key]);
        }
    }

    @action
    setTitle(title) {
        this.title = title;
    }

    @action
    toggleComplete() {
        this.isComplete = !this.isComplete;
        this.save();
    }

    async save() {
        super.save();
        ToDoService.update(this.toJS());
    }
    remove() {
        ToDoService.remove(this.toJS());
    }
}
