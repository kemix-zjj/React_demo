import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import './index.css';
export default class List extends Component {
  // 初始化状态
  state = {
    users: [], //users初始值为数组
    isFirst: true, //是否为第一次打开页面
    isLoading: false, //标识是否处于加载中
    err: '', //存储请求错误的相关信息
  };

  //组件挂载完毕 进行订阅消息
  componentDidMount() {
    // List作为接受者，则需要进行订阅消息 _下划线进行占位,该参数不用管。占位即可
    this.token = PubSub.subscribe('atguigu', (_, stateObj) => {
      // console.log('List组件收到数据了', stateObj);
      this.setState(stateObj);
    });
  }
  // 组件将要卸载  进行取消订阅
  componentWillUnmount() {
    PubSub.unsubscribe(this.token);
  }

  render() {
    const { users, isFirst, isLoading, err } = this.state;
    return (
      <div className="row">
        {
          // 三元表达式连续写
          isFirst ? (
            <h2>欢迎使用，请输入关键字，随后点击搜索</h2>
          ) : isLoading ? (
            <h2>Loading ......</h2>
          ) : err ? (
            <h2 style={{ color: 'red' }}>{err}</h2>
          ) : (
            users.map((userObj) => {
              return (
                <div key={userObj.id} className="card">
                  <a rel="noreferrer" href={userObj.html_url} target="_blank">
                    <img
                      alt="head_portrait"
                      src={userObj.avatar_url}
                      style={{ width: '100px' }}
                    />
                  </a>
                  <p className="card-text">{userObj.login}</p>
                </div>
              );
            })
          )
        }
      </div>
    );
  }
}
