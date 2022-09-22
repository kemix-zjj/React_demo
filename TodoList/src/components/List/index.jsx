import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Item from '../Item';
import './index.css';
export default class List extends Component {
  // 对接收额props进行：类型、必要性的限制
  static propTypes = {
    todos: PropTypes.array.isRequired,
    updateTodo: PropTypes.func.isRequired,
    deleteTodo: PropTypes.func.isRequired,
  };
  render() {
    // 这里的updateTodo和deleteTodo,List反手就交给了其子组件Item
    const { todos, updateTodo, deleteTodo } = this.props;
    return (
      <ul className="todo-main">
        {todos.map((todo) => {
          return (
            // <Item
            //   key={todo.id}
            //   id={todo.id}
            //   name={todo.name}
            //   done={this.done}
            // />
            //   优化
            <Item
              key={todo.id}
              {...todo}
              updateTodo={updateTodo}
              deleteTodo={deleteTodo}
            />
          );
        })}
      </ul>
    );
  }
}
