### 1. axios 发送请求

github 本身提供了一个已解决跨域问题（利用cors响应头）的测试地址，供我们去搜索测试（ <https://api.github.com/search/users?q=xxxxxx>） xxxxxx代表的是关键字/参数。

因为频繁访问 github 地址，会造成请求失败，会被默认是非法访问。因此在此案例中，我们采用代理进行间接访问。

提供了如下服务器，其中已配置了可以访问 github 地址的接口及相关配置。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9bc87c623b384edd9d5af71f41502c97~tplv-k3u1fbpfcp-watermark.image?)

此时我们需要在我们的代码中进行配置可以访问上述代理服务器的地址。

整个接口访问是：本地3000端口 --> 代理5000端口 --> github真实数据

注意：3000端口是脚手架的默认端口

src/component/Search/index.jsx

```js
 // axios.get(` https://api.github.com/search/users?q=${keyWord}`).then(   //可能会遇到不让多次访问github地址的问题
 axios.get(` http://localhost:3000/api1/search/users?q=${keyWord}`).then(
   (response) => {
     console.log('成功了', response.data);
   },
   (error) => {
     console.log('失败了', error);
   },
 );
```

src/setupProxy.js

```js
const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api1', {
      //语句/api1前缀的请求，就会触发代理配置
      target: 'http://localhost:5000', //请求转发给谁
      changeOrigin: true, //控制器收到的响应头中的Host字段的值（Host字段的值是标识本次请求从哪发出的）
      pathRewrite: { '^/api1': '' }, //重写请求路径（必选项）
    }),
  );
};
```

### 2. 静态组件拆分

父组件：App组件

子组件：Search 组件和 List 组件

- 父组件存储状态数据
- Search 子组件通过父组件传来的 updateAppState 函数进行修改状态数据
- List 组件通过父组件传来的 state 状态数据进行相应的展示（{...this.state}）

### 3. 展示数据

Search 组件获取用户输入，将所获取的数据进行传递到父组件 App 中

List组件要展示四个页面：

- 用户信息
- 第一次展示列表（没有用户信息，欢迎词）
- 用户信息加载过程中（loading）
- 错误信息（error)

即App组件要进行存储四个状态。统一封装成 updateAppState 对象 

1. App 组件

   ```js
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
   ```

2. Search 组件

   ```js
   import axios from 'axios';
   import React, { Component } from 'react';
   
   export default class Search extends Component {
     search = () => {
       // 获取用户的输入
       // 连续结构赋值+重命名
       const {
         keywordElement: { value: keyWord },
       } = this;
       console.log(keyWord);
       // 发送请求前通知App更新状态
       this.props.updateAppState({ isFirst: false, isLoading: true });
   
       // 发送网络请求(1.url【给谁发】 2.method【用什么方式发】 3.params【带什么参数】)
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
             {/*tips: 点击按钮，操作到表单：1.使用ref   2.使用受控表单/受控组件*/}
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
   ```

3. List 组件

   ```js
   import React, { Component } from 'react';
   import './index.css';
   export default class List extends Component {
     render() {
       const { users, isFirst, isLoading, err } = this.props;
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
   ```

   ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0925636636b4480d9e77305e878f9516~tplv-k3u1fbpfcp-watermark.image?)

### 4. 消息订阅-发布机制

1. 工具库: PubSubJS
2. 下载: npm install pubsub-js --save
3. 使用: 
   - import PubSub from 'pubsub-js' //引入
   - PubSub.subscribe('delete', function(data){ }); //订阅
   - PubSub.publish('delete', data) //发布消息

—— 兄弟组件通信（实际上适用于任何组件之间的通信）

github 搜索案例的优化。List 和 Search 兄弟组件之间的通信。取消了之前的将数据状态全部存储到 App 中，再通过 props 进行父子组件之间的通信。

List 组件作为消息的接受者，需要进行订阅消息

```js
// 初始化状态
state = {
  users: [], //users初始值为数组
  isFirst: true, //是否为第一次打开页面
  isLoading: false, //标识是否处于加载中
  err: '', //存储请求错误的相关信息
};
//组件挂载完毕 进行订阅消息
componentDidMount() {
  // List作为接受者，则需要进行订阅消息 _下划线进行占位
  this.token = PubSub.subscribe('atguigu', (_, stateObj) => {
    // console.log('List组件收到数据了', stateObj);
    this.setState(stateObj);
  });
}
// 组件将要卸载  进行取消订阅
componentWillUnmount() {
  PubSub.unsubscribe(this.token);
}
render(){
    //...
}
```

Search 组件作为消息的发布者，需要进行发布消息

```js
search = () => {
  //...
  // 发送请求前通知List更新状态
  // 1. Search 作为发送者，需要进行发布消息
  PubSub.publish('atguigu', { isFirst: false, isLoading: true });
  // 发送网络请求(1.url【给谁发】 2.method【用什么方式发】 3.params【带什么参数】)
  axios.get(` http://localhost:3000/api1/search/users?q=${keyWord}`).then(
    (response) => {
      // 2. 请求成功后，通知List更新状态
      PubSub.publish('atguigu', {
        isLoading: false,
        users: response.data.items,
      });
    },
    (error) => {
      // 3. 失败后，通知List更新状态
      PubSub.publish('atguigu', { isLoading: false, err: error.message });
    },
  );
};
```

### 5. fetch

xhr与fetch同级。

jQuery与axios是基于xhr下对其进行的补充优化的，jQuery存在地域回调，axios是目前最火的

**特点**

1. fetch: 原生函数，不再使用XmlHttpRequest对象提交ajax请求
2. 老版本浏览器可能不支持

【fetch了解即可】

[使用 fetch 发送请求实现 github 案例]()

### 6. 总结

github搜索案例相关知识点

1. 设计状态时要考虑全面，例如带有网络请求的组件，要考虑请求失败怎么办。

2. ES6小知识点：解构赋值+重命名

   let obj = {a:{b:1}}
   			const {a} = obj; //传统解构赋值
   			const {a:{b}} = obj; //连续解构赋值
   			const {a:{b:value}} = obj; //连续解构赋值+重命名

3. 消息订阅与发布机制

   1.先订阅，再发布（理解：有一种隔空对话的感觉）
   			2.适用于任意组件间通信
   			3.要在组件的componentWillUnmount中取消订阅

4. fetch发送请求（关注分离的设计思想）

   try {
   				const response= await fetch(`/api1/search/users2?q=${keyWord}`)
   				const data = await response.json()
   				console.log(data);
   			} catch (error) {
   				console.log('请求出错',error);
   			}