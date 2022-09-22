import React, { Component } from 'react';
import './index.css';
export default class Item extends Component {
  //标识鼠标移入、移出
  state = { mouse: false };

  //鼠标移入、移出的回调
  handleMouse = (flag) => {
    // 当onXxx事件的回调是一个函数的返回值时，其onXxx必须是一个高阶函数，即必须要有return
    return () => {
      // console.log(flag);
      this.setState({ mouse: flag });
    };
  };

  // 勾选、取消勾选某一个todo的回调
  handleCheck = (id) => {
    return (event) => {
      // console.log(id, event.target.checked);
      // 此时Item想影响着App状态数据的改变(祖孙) -->  一层一层传递，但是父组件List不用
      this.props.updateTodo(id, event.target.checked);
    };
  };

  //删除一个todo的回调
  handleDelete = (id) => {
    // console.log('通知App删除', id);
    if (window.confirm('确定删除吗？')) {
      this.props.deleteTodo(id);
    }
  };

  render() {
    // const { id, name, done } = this.props;
    // 什么时候用，什么时候调用即可
    const { name, done, id } = this.props;
    const { mouse } = this.state;
    return (
      <li
        style={{ backgroundColor: mouse ? '#ddd' : 'white' }}
        onMouseEnter={this.handleMouse(true)}
        onMouseLeave={this.handleMouse(false)}
      >
        <label>
          {/* defaultChecked默认勾选，以后想改则可以改 */}
          {/* 这里的onChange要使用高阶 */}
          <input
            type="checkbox"
            checked={done}
            onChange={this.handleCheck(id)}
          />
          <span>{name}</span>
        </label>
        {/* 此时发handleDelete不需要使用高阶即return */}
        <button
          onClick={() => this.handleDelete(id)}
          className="btn btn-danger"
          style={{ display: mouse ? 'block' : 'none' }}
        >
          删除
        </button>
      </li>
    );
  }
}
