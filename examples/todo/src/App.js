import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { observer } from 'mobx-react';
import ToDo from './ToDo';
import logo from './logo.svg';
import './App.css';


@observer
class App extends Component {
    componentDidMount() {
        
    }
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to ReMoUch (React, MobX, PouchDB)</h1>
                </header>
                <br/>
                <ToDo />
            </div>
        );
    }
}

export default hot(module)(App);
