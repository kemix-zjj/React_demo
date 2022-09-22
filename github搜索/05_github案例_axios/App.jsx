import React, { Component } from 'react';
import Search from './components/Search';
import List from './components/List';

export default class App extends Component {
  // 初始化状态
  state = {
    users: [], //users初始值为数组
    isFirst: true, //是否为第一次打开页面
    isLoading: false, //标识是否处于加载中
    err: '', //存储请求错误的相关信息
  };

  // 状态在哪，操作状态的方法在哪
  // 存储用户数据的方法
  // saveUsers = (users) => {
  //   this.setState({ users });
  // };
  // changeisFirst = (isFirst) => {
  //   this.setState({ isFirst });
  // };
  // changeisLoading = (isLoading) => {
  //   this.setState({ isLoading });
  // };
  // saveerr = (err) => {
  //   this.setState({ err });
  // };

  // 简化
  // 更新App的state
  updateAppState = (stateObj) => {
    this.setState(stateObj);
  };

  render() {
    return (
      <div className="container">
        <Search updateAppState={this.updateAppState} />
        <List {...this.state} />
      </div>
    );
  }
}
