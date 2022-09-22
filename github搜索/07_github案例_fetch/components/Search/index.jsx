import axios from 'axios';
import PubSub from 'pubsub-js';
import React, { Component } from 'react';

export default class Search extends Component {
  search = async () => {
    console.log('Search组件发布消息了');
    // 获取用户输入(连续结构赋值+重命名)
    const {
      keywordElement: { value: keyWord },
    } = this;

    // 发送请求前通知List更新状态
    // Search 作为发送者，需要进行发布消息
    PubSub.publish('atguigu', { isFirst: false, isLoading: true });

    //#region
    // 发送网络请求 ---- 使用axios
    // axios.get(` http://localhost:3000/api1/search/users2?q=${keyWord}`).then(
    //   (response) => {
    //     // 请求成功后，通知List更新状态
    //     PubSub.publish('atguigu', {
    //       isLoading: false,
    //       users: response.data.items,
    //     });
    //   },
    //   (error) => {
    //     // 失败后，通知List更新状态
    //     PubSub.publish('atguigu', { isLoading: false, err: error.message });
    //   },
    // );
    //#endregion

    //#region
    // 发送网络请求 ---- 使用fetch(未优化)  response.json是一个promise实例，里面存储的是我们所需要的真实数据
    // fetch(`/api1/search/users2?q=${keyWord}`)
    //   .then(
    //     (response) => {
    //       console.log('联系服务器成功了');
    //       return response.json();
    //     },
    //     (error) => {
    //       console.log('联系服务器失败了', error);
    //       return new Promise(() => {});
    //     },
    //   )
    //   .then(
    //     (response) => {
    //       console.log('获取数据成功了', response);
    //     },
    //     (error) => {
    //       console.log('获取数据失败了', error);
    //     },
    //   );
    //#endregion

    //#region
    // 发送网络请求 ---- 使用fetch(优化-catch统一捕获错误)
    // fetch(`/api1/search/users2?q=${keyWord}`)
    //   .then((response) => {
    //     console.log('联系服务器成功了');
    //     return response.json();
    //   })
    //   .then((response) => {
    //     console.log('获取数据成功了', response);
    //   })
    //   .catch((error) => console.log('请求出错',error));
    //#endregion

    // 发送网络请求 ---- 使用fetch(优化 - await后携带promise对象 与 aysnc )  最优化高级！
    try {
      const response = await fetch(`/api1/search/users2?q=${keyWord}`);
      const data = await response.json();
      PubSub.publish('atguigu', { isLoading: false, users: data.items });
    } catch (error) {
      console.log('请求出错', error);
      PubSub.publish('atguigu', { isLoading: false, err: error.message });
    }
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
