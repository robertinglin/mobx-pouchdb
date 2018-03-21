import React, { Component } from 'react';
import { observer } from 'mobx-react';
import ToDoModelStore from '../_stores/ToDoModelStore'; 
import SearchStore from '../_stores/SearchStore'; 
import List from './List'; 
import Add from './Add';
import Search from './Search';

ToDoModelStore.loadAll();

@observer
export default class ToDoAdd extends Component {

    render() {
        let list = ToDoModelStore;
        if (SearchStore.queryResults) {
            list = SearchStore.queryResults;
        }
        return (
            <div>
                <Search />
                {SearchStore.queryResults && <div>Results: {SearchStore.queryResults.todos.length}</div>}
                <List list={list} />
                <Add />
            </div> 
        );
    }
}