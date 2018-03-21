import React, { Component } from 'react';
import { observer } from 'mobx-react';
import ToDoItem from './Item';
import './styles/List.css';

@observer
export default class ToDoList extends Component {
    render() {
        return (
            <ul className="todolist">
                {this.props.list.todos.map(todo => <ToDoItem todo={todo} key={todo._id} />)}
            </ul>
        );
    }
}