import PouchDB from 'pouchdb';

export class ToDoService {
    constructor() {
        this.db = new PouchDB('todos');
    }
}
export default new ToDoService();
