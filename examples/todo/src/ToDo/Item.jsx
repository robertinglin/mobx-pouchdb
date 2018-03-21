import React, { Component } from 'react';
import { observer } from 'mobx-react';
import './styles/Item.css';

@observer
export default class ToDoItem extends Component {
    state = {
        isEditing: false
    }

    render() {
        const { todo } = this.props;
        return (
            <li className="todoitem">
                <input type="checkbox" checked={todo.isComplete} onChange={() => todo.toggleComplete()} />
                {this.state.isEditing ?
                    <input
                        autoFocus
                        type="text"
                        value={todo.title}
                        onBlur={() => {todo.save();this.setState({isEditing: false})}}
                        onChange={({ target: { value }}) => todo.setTitle(value)}
                    />
                    :
                    <span onDoubleClick={() => this.setState({isEditing: true}) }>{this.props.todo.title}</span>
                }
                <button tabIndex="-1" onClick={() => todo.remove()}>Remove</button>
            </li>  
        );
    }
}