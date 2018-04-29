import { action, observable } from 'mobx';
import ToDoModelStore from './ToDoModelStore';

export class SearchStore {
    @observable query = '';
    @observable queryResults = null;

    @action
    setQuery(query) {
        this.query = query;
    }

    @action
    async search() {
        // console.log('chchchhanges!!');
        if (this.queryResults) {
            ToDoModelStore.removeQuery(this.queryResults);
        }
        this.queryResults = await ToDoModelStore.query((doc, emit) => {
            (doc.title || '').toLowerCase().split(' ').map(key => emit(key));
        }, { key: this.query.toLowerCase(), include_docs: true, local_query: false, live: true });
    }

    @action
    clear() {
        this.query = '';
        if (this.queryResults) {
            ToDoModelStore.removeQuery(this.queryResults);
        }
        this.queryResults = null;
    }
}

export default new SearchStore();