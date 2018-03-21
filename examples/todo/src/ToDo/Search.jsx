import React, { Component } from 'react';
import { observer } from 'mobx-react';
import bind from 'bind-decorator';
import SearchStore from '../_stores/SearchStore'; 
import debounce from '../_utils/debounce';
import './styles/Add.css';

const debouncedSearch = debounce(() => SearchStore.search(), 150);

@observer
export default class ToDoAdd extends Component {
    search() {
        SearchStore.search();
    }

    clear() {
        SearchStore.clear();
    }

    @bind
    change({ target: { value: query } }) {
        SearchStore.setQuery(query);
        if (!query && this.debounce) {
            this.debounce.cancel();
            SearchStore.clear();
        }
        else {
            this.debounce = debouncedSearch();
        }
    }

    render() {
        return (
            <div>
                <form className="todoadd" onSubmit={(e) => {e.preventDefault();this.search()}} >
                    <input type="text" value={SearchStore.query} onChange={this.change} />
                    <input type="submit" disabled={!SearchStore.query} value="Search" />
                </form>
                <button onClick={this.clear}>Clear</button>
            </div>
        );
    }
}