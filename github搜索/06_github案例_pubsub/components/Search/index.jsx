import axios from 'axios';
import PubSub from 'pubsub-js';
import React, { Component } from 'react';

export default class Search extends Component {
  search = () => {
    console.log('Search组件发布消息了');
    // 获取用户输入(连续结构赋值+重命名)
    const {
      keywordElement: { value: keyWord },
    } = this;

    // 发送请求前通知List更新状态
    // Search 作为发送者，需要进行发布消息
    PubSub.publish('atguigu', { isFirst: false, isLoading: true });

    // 发送网络请求(1.url【给谁发】 2.method【用什么方式发】 3.params【带什么参数】)
    axios.get(` http://localhost:3000/api1/search/users?q=${keyWord}`).then(
      (response) => {
        // 请求成功后，通知List更新状态
        PubSub.publish('atguigu', {
          isLoading: false,
          users: response.data.items,
        });
      },
      (error) => {
        // 失败后，通知List更新状态
        PubSub.publish('atguigu', { isLoading: false, err: error.message });
      },
    );
  };
  render() {
    return (
      <section className="jumbotron">
        <h3 className="jumbotron-heading">搜索github用户</h3>
        <div>
          {/* 点击按钮，操作到表单：1.使用ref   2.使用受控表单/受控组件*/}
          <input
            ref={(c) => (this.keywordElement = c)}
            type="text"
            placeholder="输入关键词点击"
          />
          &nbsp;<button onClick={this.search}>搜索</button>
        </div>
      </section>
    );
  }
}
