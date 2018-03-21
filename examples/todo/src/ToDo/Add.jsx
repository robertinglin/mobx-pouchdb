import React, { Component } from 'react';
import bind from 'bind-decorator';
import ToDoModelStore from '../_stores/ToDoModelStore'; 
import ToDoModel from '../_stores/ToDoModel'; 
import './styles/Add.css';

export default class ToDoAdd extends Component {
    state = {
        title: ''
    };

    @bind
    async add() {
        await ToDoModelStore.add(new ToDoModel(this.state.title));
        this.setState({ title: '' });
    }

    render() {
        return (
            <form className="todoadd" onSubmit={(e) => {e.preventDefault();this.add()}} >
                <input type="text" value={this.state.title} onChange={({ target: { value: title } }) => this.setState({ title })} />
                <input type="submit" disabled={!this.state.title} value="Add" />
            </form>  
        );
    }
}