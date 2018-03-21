import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { observer } from 'mobx-react';
import ToDo from './ToDo';
import reactlogo from './react.svg';
import mobxlogo from './mobx.svg';
import pouchdblogo from './pouchdb.svg';
import './App.css';


@observer
class App extends Component {
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
            </div>
        );
    }
}

export default hot(module)(App);
