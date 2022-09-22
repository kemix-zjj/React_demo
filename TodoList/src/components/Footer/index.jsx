import React, { Component } from 'react';
import './index.css';
export default class Footer extends Component {
  // 全选checkbox的回调
  handleCheckAll = (event) => {
    this.props.checkAllTodo(event.target.checked);
  };
  // 清除所有已完成的回调
  handleClearAllDone = () => {
    this.props.clearAllDone();
  };

  render() {
    const { todos } = this.props;

    // reduce() 携带两个参数，第一个参数是回调函数；第二个参数是初始值。且在回调函数中有两个参数pre与current
    // 已完成的个数
    // const doneCount = todos.reduce((pre, todo) => {
    //   return pre + (todos.done ? 1 : 0);
    // }, 0);
    // 简写
    const doneCount = todos.reduce(
      (pre, todos) => pre + (todos.done ? 1 : 0),
      0,
    );
    // console.log('>>>:', doneCount);
    // 总数
    const total = todos.length;

    return (
      <div className="todo-footer">
        <label>
          {/* defaultChecked 只在第一次起效   */}
          {/* 但是使用checked必须要与onChange配合使用，不然checked会定死 */}
          <input
            type="checkbox"
            onChange={this.handleCheckAll}
            checked={doneCount === total && total !== 0 ? true : false}
          />
        </label>
        <span>
          <span>已完成{doneCount}</span> / 全部{total}
        </span>
        <button onClick={this.handleClearAllDone} className="btn btn-danger">
          清除已完成任务
        </button>
      </div>
    );
  }
}
