// 创建“外壳”组件App
import React, { Component } from 'react';
import Header from './components/Header';
import List from './components/List';
import Footer from './components/Footer';
import './App.css';

// 创建并暴露App
export default class App extends Component {
  /**
   * 状态在哪里，操作状态的函数就在哪里！
   */

  // 将todo的状态放在App当中
  // 初始化状态
  state = {
    todos: [
      { id: '001', name: '吃饭', done: true },
      { id: '002', name: '睡觉', done: true },
      { id: '003', name: '打代码', done: false },
    ],
  };

  // 父给子传递函数，子触发调用该函数，会实现子组件向父组件传递数据，父组件进行相应数据更新
  // addTodo用于添加一个todo，接收的参数是todo对象
  addTodo = (todoObj) => {
    //获取原todos
    const { todos } = this.state;
    //追加一个todo，且放在最开头的位置
    const newTodos = [todoObj, ...todos];
    // 更新状态
    this.setState({ todos: newTodos });
  };

  // 祖孙传递函数，一层一层传递，到达父组件的时候List的时候，不作为，直接传递给孙组件
  // updateTodo 用于更新一个 todo 对象
  updateTodo = (id, done) => {
    // 获取状态中的todos
    const { todos } = this.state;
    // 匹配处理数据
    const newTodos = todos.map((todoObj) => {
      if (todoObj.id === id) return { ...todoObj, done };
      else return todoObj;
    });
    this.setState({ todos: newTodos });
  };

  // 祖给孙传递函数 deleteTodo用于删除一个todo对象
  deleteTodo = (id) => {
    // 获取原来的todos
    const { todos } = this.state;
    // 删除指定id的todo对象
    const newTodos = todos.filter((todoObj) => {
      return todoObj.id !== id;
    });
    // 更新状态
    this.setState({ todos: newTodos });
  };

  //checkAllTodo 用于全选
  checkAllTodo = (done) => {
    // 获取原来的todos
    const { todos } = this.state;
    // 加工数据
    const newTodos = todos.map((todoObj) => {
      return { ...todoObj, done };
    });
    // 更新状态
    this.setState({ todos: newTodos });
  };

  // clearAllDone用于清除所有已完成的
  clearAllDone = () => {
    // 获取原来的todos
    const { todos } = this.state;
    // 过滤数据
    const newTodos = todos.filter((todoObj) => {
      return !todoObj.done;
    });
    // 更新数据
    this.setState({ todos: newTodos });
  };
  render() {
    const { todos } = this.state;
    return (
      <div>
        <div className="todo-container">
          <div className="todo-wrap">
            <Header addTodo={this.addTodo} />
            <List
              todos={todos}
              updateTodo={this.updateTodo}
              deleteTodo={this.deleteTodo}
            />
            <Footer
              todos={todos}
              checkAllTodo={this.checkAllTodo}
              clearAllDone={this.clearAllDone}
            />
          </div>
        </div>
      </div>
    );
  }
}
