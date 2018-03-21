import { ModelStore } from 'mobx-pouchdb';
import ToDoModel from './ToDoModel';
import ToDoService from '../_services/ToDoService';

export class ToDoModelStore extends ModelStore {
    constructor() {
        super('todos', ToDoModel, ToDoService.db);
    }
}

const toDoModelStore = new ToDoModelStore();
export default toDoModelStore;