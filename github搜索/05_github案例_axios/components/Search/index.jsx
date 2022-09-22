import axios from 'axios';
import React, { Component } from 'react';

export default class Search extends Component {
  search = () => {
    // 获取用户的输入

    // console.log(this.keywordElement.value);
    // 1. 常规解构赋值
    // const { value } = this.keywordElement;
    // console.log(value);
    // 2. 连续结构赋值+重命名
    const {
      keywordElement: { value: keyWord },
    } = this;
    console.log(keyWord);
    // console.log(keywordElement); //未定义
    // 发送请求前通知App更新状态
    this.props.updateAppState({ isFirst: false, isLoading: true });

    // 3. 连续结构赋值+重命名
    // let obj2 = { a: { b: 1 } };
    // const {
    //   a: { b: data },
    // } = obj2;
    // console.log(data); //给b重命名为data

    // 发送网络请求(1.url【给谁发】 2.method【用什么方式发】 3.params【带什么参数】)
    // axios.get(` https://api.github.com/search/users?q=${keyWord}`).then(   //可能会遇到不让多次访问github地址的问题
    axios.get(` http://localhost:3000/api1/search/users?q=${keyWord}`).then(
      (response) => {
        // console.log('成功了', response.data);
        // 请求成功后，通知App更新状态
        this.props.updateAppState({
          isLoading: false,
          users: response.data.items,
        });
      },
      (error) => {
        // console.log('失败了', error);
        // 失败后，通知App更新状态
        this.props.updateAppState({ isLoading: false, err: error.message });
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
