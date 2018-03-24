import React, { Component } from 'react';
import ToDo from './ToDo';
import reactlogo from './react.svg';
import mobxlogo from './mobx.svg';
import pouchdblogo from './pouchdb.svg';
import './App.css';

export default class App extends Component {
    componentDidMount() {
        
    }
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={reactlogo} className="App-logo" alt="react logo" />
                    <img src={mobxlogo} className="App-logo" alt="mobx logo" />
                    <img src={pouchdblogo} className="App-logo" alt="pouchdb logo" />
                    <h1 className="App-title">Welcome to the React MobX-PouchDB ToDo app!</h1>
                </header>
                <br/>
                <ToDo />
                <p>Try adding a todo!</p>
                <p>Search queries are live and will automatically update<br/>if you add a todo matching your search</p>
                <p>Refreshing the page will persist your todo data.</p>
            </div>
        );
    }
}
